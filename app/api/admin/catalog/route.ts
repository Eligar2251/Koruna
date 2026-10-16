import { attachSession, hasSiteHeader, openAdmin } from '../../../../lib/auth'
import { fail, json } from '../../../../lib/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  try {
    return attachSession(json(await opened.session.store.adminList()), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}
