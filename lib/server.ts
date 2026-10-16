import { randomBytes } from 'node:crypto'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { SupabaseClient } from '@supabase/supabase-js'
import { seedFileStore } from '../server/seed.mjs'
import { createFileStore, createSupabaseStore, type CatalogStore } from '../server/store.mjs'
import { configuredSupabase, supabaseClient } from './auth'

const dataFile = path.join(process.cwd(), 'data', 'catalog.json')
const seedMarker = path.join(process.cwd(), 'data', 'catalog.seeded')
const uploadsDir = path.join(process.cwd(), 'uploads')
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
const MAX_IMAGE = 5 * 1024 * 1024

export type { CatalogStore }

let storePromise: Promise<CatalogStore> | null = null

export function getStore() {
  if (!storePromise) {
    storePromise = openStore().catch((err) => {
      storePromise = null
      throw err
    })
  }
  return storePromise
}

async function openStore() {
  const client = supabaseClient()
  if (client) return createSupabaseStore(client)
  const store = createFileStore(dataFile)
  try {
    await access(seedMarker)
  } catch {
    const list = await store.adminList()
    if (!list.products.length) await seedFileStore(store)
    await mkdir(path.dirname(seedMarker), { recursive: true })
    await writeFile(seedMarker, '1')
  }
  return store
}

export function readCookie(req: Request, name: string) {
  const header = req.headers.get('cookie') || ''
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return ''
}

export async function saveImage(body: Record<string, unknown>, client?: SupabaseClient | null) {
  const type = String(body.image_type || '')
  const ext = IMAGE_TYPES[type]
  if (!ext) throw new Error('Фото: только JPG, PNG или WebP')
  const buffer = Buffer.from(String(body.image_base64 || ''), 'base64')
  if (!buffer.length || buffer.length > MAX_IMAGE) throw new Error('Фото не больше 5 МБ')
  const name = `${randomBytes(16).toString('hex')}.${ext}`
  if (client) {
    const uploaded = await client.storage.from('product-images').upload(name, buffer, {
      contentType: type,
      cacheControl: '3600',
      upsert: false,
    })
    if (uploaded.error) throw new Error('Не удалось загрузить фото')
    const remote = configuredSupabase()
    return `${remote?.url}/storage/v1/object/public/product-images/${name}`
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
