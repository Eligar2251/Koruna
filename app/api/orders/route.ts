import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { hasSiteHeader, supabaseClient } from '../../../lib/auth'
import { fail, json, readJson } from '../../../lib/http'
import { getStore } from '../../../lib/server'
import { buildOrder, createOrderBook } from '../../../server/orders.mjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const attempts = new Map<string, { count: number; reset: number }>()

function allowed(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim() || 'local'
  const now = Date.now()
  const current = attempts.get(ip)
  if (!current || current.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 })
    return true
  }
  current.count += 1
  return current.count <= 12
}

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  if (!allowed(req)) return json({ error: 'Слишком много заказов. Подождите' }, 429)
  try {
    const body = await readJson(req)
    const store = await getStore()
    const order = buildOrder(body, await store.catalog())
    const remote = supabaseClient()
    if (remote && store.mode === 'supabase') {
      const id = randomUUID()
      const inserted = await remote.from('orders').insert({ ...order, id })
      if (inserted.error) return json({ error: 'Не удалось сохранить заказ' }, 503)
      return json({ id })
    }
    const saved = await createOrderBook(path.join(process.cwd(), 'data', 'orders.json')).add(order)
    return json({ id: saved.id })
  } catch (err) {
    return fail(err)
  }
}
