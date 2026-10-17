import { hasAdminGate, clearSession, hasSiteHeader, revokeSession } from '../../../../lib/auth'
import { json } from '../../../../lib/http'
import { readCookie } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!await hasAdminGate(req)) return json({error:'Не найдено'},404)
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  await revokeSession(readCookie(req, 'csb_access'))
  return clearSession(json({ ok: true }), req)
}
