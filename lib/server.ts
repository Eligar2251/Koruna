import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createFileStore, createSupabaseStore, type CatalogStore } from '../server/store.mjs'

const dataFile = path.join(process.cwd(), 'data', 'catalog.json')
const uploadsDir = path.join(process.cwd(), 'uploads')
const sessions = new Map<string, { expires: number }>()
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
const MAX_IMAGE = 5 * 1024 * 1024

export type { CatalogStore }

export function configuredSupabase() {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !key) return null
  if (/YOUR_|your-service-role-key|your-anon-key/i.test(`${url} ${key}`)) return null
  return { url: url.replace(/\/+$/, ''), key }
}

let storePromise: Promise<CatalogStore> | null = null

export function getStore() {
  if (!storePromise) storePromise = openStore()
  return storePromise
}

async function openStore() {
  const remote = configuredSupabase()
  if (!remote) return createFileStore(dataFile)
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(remote.url, remote.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return createSupabaseStore(client)
}

export function passwordsMatch(input: string, expected: string) {
  const left = createHash('sha256').update(String(input)).digest()
  const right = createHash('sha256').update(String(expected)).digest()
  return timingSafeEqual(left, right)
}

export function readCookie(req: Request, name: string) {
  const header = req.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

export function isAdmin(req: Request) {
  const token = readCookie(req, 'koruna_admin')
  const session = sessions.get(token)
  if (!session || session.expires < Date.now()) {
    if (token) sessions.delete(token)
    return false
  }
  return true
}

export function openSession() {
  const token = randomBytes(24).toString('hex')
  sessions.set(token, { expires: Date.now() + 12 * 60 * 60 * 1000 })
  return token
}

export function closeSession(req: Request) {
  sessions.delete(readCookie(req, 'koruna_admin'))
}

export async function saveImage(body: Record<string, unknown>) {
  const type = String(body.image_type || '')
  const ext = IMAGE_TYPES[type]
  if (!ext) throw new Error('Фото: только JPG, PNG или WebP')
  const buffer = Buffer.from(String(body.image_base64 || ''), 'base64')
  if (!buffer.length || buffer.length > MAX_IMAGE) throw new Error('Фото не больше 5 МБ')
  const name = `${randomBytes(16).toString('hex')}.${ext}`
  const store = await getStore()
  const remote = configuredSupabase()
  if (remote && store.mode === 'supabase') {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(remote.url, remote.key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
    const uploaded = await client.storage.from('product-images').upload(name, buffer, {
      contentType: type,
      cacheControl: '3600',
      upsert: false,
    })
    if (uploaded.error) throw new Error(uploaded.error.message || 'Не удалось загрузить фото')
    return client.storage.from('product-images').getPublicUrl(name).data.publicUrl
  }
  await mkdir(uploadsDir, { recursive: true })
  await writeFile(path.join(uploadsDir, name), buffer)
  return `/uploads/${name}`
}

export function applyImageFields(body: Record<string, unknown>, imageUrl?: string) {
  if (body.image_base64) body.image_url = imageUrl
  else if (body.clear_image) body.image_url = null
  else delete body.image_url
}
