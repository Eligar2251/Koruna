import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb)
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const queues = new Map()
let cachedSecret = ''

function secret() {
  if (cachedSecret) return cachedSecret
  const env = process.env.JWT_SECRET || ''
  if (env.length >= 16) {
    cachedSecret = env
    return cachedSecret
  }
  const file = path.join(process.cwd(), 'data', 'jwt.secret')
  try {
    const saved = readFileSync(file, 'utf8').trim()
    if (saved.length >= 16) {
      cachedSecret = saved
      return cachedSecret
    }
  } catch {
    // файла ещё нет
  }
  const value = randomBytes(32).toString('base64url')
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, value, { mode: 0o600 })
  cachedSecret = value
  return cachedSecret
}

function b64url(value) {
  return Buffer.from(value).toString('base64url')
}

export function signJwt(payload, ttlSeconds) {
  const now = Math.floor(Date.now() / 1000)
  const head = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const mid = b64url(JSON.stringify({ ...payload, iat: now, exp: now + ttlSeconds }))
  const sig = createHmac('sha256', secret()).update(`${head}.${mid}`).digest('base64url')
  return `${head}.${mid}.${sig}`
}

export function verifyJwt(token) {
  const parts = String(token || '').split('.')
  if (parts.length !== 3) return null
  const expected = createHmac('sha256', secret()).update(`${parts[0]}.${parts[1]}`).digest('base64url')
  const left = Buffer.from(parts[2])
  const right = Buffer.from(expected)
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null
  let payload
  try {
    payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!payload || typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

export async function passwordKey(password) {
  const salt = randomBytes(16).toString('base64url')
  const hash = Buffer.from(await scrypt(password, salt, 32)).toString('base64url')
  return signJwt({ typ: 'pwd', v: 1, s: salt, h: hash }, 60 * 60 * 24 * 365 * 10)
}

export async function passwordMatches(password, key) {
  const payload = verifyJwt(key)
  if (!payload || payload.typ !== 'pwd' || typeof payload.s !== 'string' || typeof payload.h !== 'string') return false
  const next = Buffer.from(await scrypt(password, payload.s, 32))
  const prev = Buffer.from(payload.h, 'base64url')
  if (next.length !== prev.length) return false
  return timingSafeEqual(next, prev)
}

export function signAccess(account) {
  return signJwt({ typ: 'access', role: account.role || 'admin', sub: account.id, email: account.email }, 12 * 60 * 60)
}

export function readAccess(token) {
  const payload = verifyJwt(token)
  if (!payload || payload.typ !== 'access' || !['admin','owner'].includes(payload.role) || typeof payload.sub !== 'string') return null
  return payload
}

function cleanAccount(body) {
  const email = String(body.email || '').trim().toLowerCase()
  const name = String(body.name || '').trim()
  const password = String(body.password || '')
  if (!EMAIL.test(email) || email.length > 200) throw new Error('Укажите почту')
  if (name.length < 2 || name.length > 120) throw new Error('Укажите имя')
  if (password.length < 8 || password.length > 200) throw new Error('Укажите пароль от 8 символов')
  const role = body.role
  if (role !== undefined && !['admin','owner'].includes(role)) throw new Error('Некорректная роль')
  return { email, name, password, role }
}

export function createAccountBook(file) {


  async function read() {
    try {
      const data = JSON.parse(await readFile(file, 'utf8'))
      data.admins ??= []
      // Migrate existing local accounts without taking access away from their first owner.
      data.admins = data.admins.map((row,index)=>({...row, role: row.role || (index===0 ? 'owner' : 'admin')}))
      return data
    } catch (err) {
      if (err.code === 'ENOENT') return { admins: [] }
      throw err
    }
  }

  function update(mutator) {
    const run = (queues.get(file) || Promise.resolve()).then(async () => {
      const data = await read()
      const result = await mutator(data)
      await mkdir(path.dirname(file), { recursive: true })
      const tmp = `${file}.tmp`
      await writeFile(tmp, JSON.stringify(data, null, 2))
      await rename(tmp, file)
      return result
    })
    queues.set(file, run.then(() => undefined, () => undefined))
    return run
  }

  return {
    async list() {
      const data = await read()
      return data.admins.map(({ id, email, name, role, created_at }) => ({ id, email, name, role, created_at }))
    },
    async byId(id) {
      const data = await read()
      return data.admins.find((item) => item.id === id) || null
    },
    create(body) {
      const input = cleanAccount(body)
      return update(async (data) => {
        if (data.admins.some((item) => item.email === input.email)) throw new Error('Такая почта уже есть')
        const row = {
          id: randomBytes(16).toString('hex'),
          email: input.email,
          name: input.name,
          role: input.role || (data.admins.length ? 'admin' : 'owner'),
          password_key: await passwordKey(input.password),
          created_at: new Date().toISOString(),
        }
        data.admins.push(row)
        return { id: row.id, email: row.email, name: row.name, role: row.role, created_at: row.created_at }
      })
    },
    setRole(id, role) {
      if (!['admin','owner'].includes(role)) throw new Error('Некорректная роль')
      return update(data => {
        const row = data.admins.find(account => account.id === id)
        if (!row) throw new Error('Администратор не найден')
        if (row.role === 'owner' && role !== 'owner' && data.admins.filter(account => account.role === 'owner').length < 2) throw new Error('Нельзя убрать последнего владельца')
        row.role = role
        return {id:row.id, email:row.email, name:row.name, role:row.role}
      })
    },
    resetPassword(email, password) {
      const input = cleanAccount({ email, password, name: 'Администратор' })
      return update(async (data) => {
        const row = data.admins.find((item) => item.email === input.email)
        if (!row) throw new Error('Администратор не найден')
        row.password_key = await passwordKey(input.password)
        return { id: row.id, email: row.email, name: row.name, role: row.role }
      })
    },
    async authenticate(email, password) {
      const data = await read()
      const row = data.admins.find((item) => item.email === String(email || '').trim().toLowerCase())
      if (!row) return null
      const ok = await passwordMatches(String(password || ''), row.password_key)
      if (!ok) return null
      return { id: row.id, email: row.email, name: row.name, role: row.role }
    },
  }
}
