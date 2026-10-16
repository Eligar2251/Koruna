import { randomBytes } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { createAccountBook, readAccess, signAccess } from '../server/accounts.mjs'

type AccountBook = ReturnType<typeof createAccountBook>

export { signAccess }
import { createFileStore, createSupabaseStore } from '../server/store.mjs'

type CatalogStore = ReturnType<typeof createFileStore> | ReturnType<typeof createSupabaseStore>
import { json } from './http'
import { readCookie } from './server'

const accountsFile = path.join(process.cwd(), 'data', 'admins.json')

const ACCESS = 'csb_access'
const REFRESH = 'csb_refresh'
const attempts = new Map<string, { count: number; reset: number }>()

export type AdminContext = {
  store: CatalogStore
  client: SupabaseClient | null
  access: string
  refresh: string
  refreshed: boolean
  mode: 'file' | 'supabase'
}

export function configuredSupabase() {
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_ANON_KEY || ''
  if (!url || !key) return null
  if (/YOUR_|your-anon-key|your-service-role-key|service_role/i.test(`${url} ${key}`)) return null
  if (jwtRole(key) === 'service_role') return null
  return { url: url.replace(/\/+$/, ''), key }
}

function jwtRole(key: string) {
  const part = key.split('.')[1]
  if (!part) return ''
  try {
    const json = JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as { role?: string }
    return json.role || ''
  } catch {
    return ''
  }
}

export function supabaseClient(accessToken?: string) {
  const remote = configuredSupabase()
  if (!remote) return null
  return createClient(remote.url, remote.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  })
}

export function isSecureRequest(req: Request) {
  const forwarded = req.headers.get('x-forwarded-proto')
  if (forwarded) return forwarded.split(',')[0].trim() === 'https'
  return new URL(req.url).protocol === 'https:'
}

export function hasSiteHeader(req: Request) {
  return req.headers.get('x-csb-request') === '1'
}

export function loginAllowed(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim() || 'local'
  const now = Date.now()
  const current = attempts.get(ip)
  if (!current || current.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 })
    return true
  }
  current.count += 1
  return current.count <= 8
}

function cookie(name: string, value: string, maxAge: number, secure: boolean) {
  return `${name}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}

export function attachSession(response: NextResponse, session: AdminContext | null, req: Request) {
  if (!session?.refreshed) return response
  const secure = isSecureRequest(req)
  response.headers.append('set-cookie', cookie(ACCESS, session.access, 12 * 60 * 60, secure))
  response.headers.append('set-cookie', cookie(REFRESH, session.refresh, 12 * 60 * 60, secure))
  return response
}

export function setSession(response: NextResponse, access: string, refresh: string, req: Request) {
  const secure = isSecureRequest(req)
  response.headers.append('set-cookie', cookie(ACCESS, access, 12 * 60 * 60, secure))
  response.headers.append('set-cookie', cookie(REFRESH, refresh, 12 * 60 * 60, secure))
  return response
}

export function clearSession(response: NextResponse, req: Request) {
  const secure = isSecureRequest(req)
  response.headers.append('set-cookie', cookie(ACCESS, '', 0, secure))
  response.headers.append('set-cookie', cookie(REFRESH, '', 0, secure))
  return response
}

async function userFromToken(client: SupabaseClient, access: string) {
  const result = await client.auth.getUser(access)
  if (result.error || !result.data.user) return null
  return result.data.user
}

export function accountBook() {
  return createAccountBook(accountsFile)
}

export async function ensureLocalAdmin(book: AccountBook = accountBook()) {
  const current = await book.list()
  if (current.length) return book
  const email = (process.env.ADMIN_EMAIL || 'admin@csb.local').trim().toLowerCase()
  const given = process.env.ADMIN_PASSWORD || ''
  const password = given.length >= 8 && given !== 'replace-me' ? given : randomBytes(9).toString('base64url')
  await book.create({ email, name: 'Администратор', password })
  if (password !== given) {
    await mkdir(path.dirname(accountsFile), { recursive: true })
    await writeFile(path.join(path.dirname(accountsFile), 'admin-password.txt'), `${email}\n${password}\n`, { mode: 0o600 })
  }
  return book
}

export async function openAdmin(req: Request): Promise<{ session: AdminContext } | { response: NextResponse }> {
  const remote = configuredSupabase()
  if (!remote) {
    const access = readCookie(req, ACCESS)
    const payload = readAccess(access)
    if (!payload) return { response: json({ error: 'Нужен вход' }, 401) }
    const account = await accountBook().byId(payload.sub)
    if (!account) return { response: json({ error: 'Нужен вход' }, 401) }
    return {
      session: {
        store: createFileStore(path.join(process.cwd(), 'data', 'catalog.json')),
        client: null,
        access,
        refresh: access,
        refreshed: false,
        mode: 'file',
      },
    }
  }
  const client = supabaseClient()
  if (!client) return { response: json({ error: 'Задайте SUPABASE_URL и SUPABASE_ANON_KEY' }, 503) }

  let access = readCookie(req, ACCESS)
  let refresh = readCookie(req, REFRESH)
  let refreshed = false
  let user = access ? await userFromToken(client, access) : null
  if (!user && refresh) {
    const renewed = await client.auth.refreshSession({ refresh_token: refresh })
    const next = renewed.data.session
    if (next) {
      access = next.access_token
      refresh = next.refresh_token
      refreshed = true
      user = await userFromToken(client, access)
    }
  }
  if (!user || !access || !refresh) return { response: json({ error: 'Нужен вход' }, 401) }

  const userClient = supabaseClient(access)
  if (!userClient) return { response: json({ error: 'Нужен вход' }, 401) }
  const admin = await userClient.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
  if (admin.error || !admin.data) return { response: json({ error: 'Нужен вход' }, 401) }

  return {
    session: {
      store: createSupabaseStore(userClient),
      client: userClient,
      access,
      refresh,
      refreshed,
      mode: 'supabase',
    },
  }
}

export async function revokeSession(access: string) {
  const remote = configuredSupabase()
  if (!remote || !access) return
  await fetch(`${remote.url}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      apikey: remote.key,
      authorization: `Bearer ${access}`,
      'content-type': 'application/json',
    },
  }).catch(() => undefined)
}
