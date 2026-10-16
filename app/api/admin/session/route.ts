import { attachSession, openAdmin } from '../../../../lib/auth'
import { json } from '../../../../lib/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const opened = await openAdmin(req)
  if ('response' in opened) return json({ ok: false, mode: 'supabase' })
  return attachSession(json({ ok: true, mode: 'supabase' }), opened.session, req)
}
