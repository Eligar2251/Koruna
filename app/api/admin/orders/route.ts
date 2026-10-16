import path from 'node:path'
import { attachSession, openAdmin } from '../../../../lib/auth'
import { fail, json } from '../../../../lib/http'
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
