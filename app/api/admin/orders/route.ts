import { orderStatus } from '../../../../server/inventory.mjs'
import path from 'node:path'
import { attachSession, hasSiteHeader, openAdmin } from '../../../../lib/auth'
import { fail, json, readJson, validId } from '../../../../lib/http'
import { createOrderBook } from '../../../../server/orders.mjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  try {
    if (!opened.session.client) {
      const orders = await createOrderBook(path.join(process.cwd(), 'data', 'orders.json')).list()
      return attachSession(json({ orders }), opened.session, req)
    }
    const listed = await opened.session.client.from('orders').select('id,customer_name,phone,email,address,comment,items,total,status,created_at').order('created_at', { ascending: false })
    if (listed.error) return attachSession(json({ error: 'Заказы недоступны' }, 503), opened.session, req)
    return attachSession(json({ orders: listed.data || [] }), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}

export async function PATCH(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  try {
    const body = await readJson(req)
    const id = String(body.id || '')
    if (!validId(id)) return json({ error: 'Заказ не найден' }, 404)
    const status = orderStatus(body.status)
    if (!opened.session.client) {
      const order = await createOrderBook(path.join(process.cwd(), 'data', 'orders.json')).setStatus(id, status)
      return attachSession(json(order), opened.session, req)
    }
    const result = await opened.session.client.from('orders').update({ status }).eq('id', id).select('id,status').single()
    if (result.error) return attachSession(json({ error: 'Не удалось обновить заказ' }, 400), opened.session, req)
    return attachSession(json(result.data), opened.session, req)
  } catch (err) { return attachSession(fail(err), opened.session, req) }
}
