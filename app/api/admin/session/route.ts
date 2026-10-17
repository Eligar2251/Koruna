import { attachSession, configuredSupabase, openAdmin } from '../../../../lib/auth'
import { fail, json } from '../../../../lib/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
  const opened = await openAdmin(req)
  const mode = configuredSupabase() ? 'supabase' : 'file'
  if ('response' in opened) return json({ ok: false, mode })
  return attachSession(json({ ok: true, mode: opened.session.mode }), opened.session, req)
  } catch (err) { return fail(err) }
}
