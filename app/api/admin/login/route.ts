import { configuredSupabase, ensureLocalAdmin, hasSiteHeader, loginAllowed, setSession, signAccess, supabaseClient } from '../../../../lib/auth'
import { fail, json, readJson } from '../../../../lib/http'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  if (!loginAllowed(req)) return json({ error: 'Слишком много попыток. Подождите' }, 429)
  try {
    const body = await readJson(req)
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    if (!email || !password || email.length > 200 || password.length > 200) {
      return json({ error: 'Неверная почта или пароль' }, 401)
    }
    const remote = configuredSupabase()
    if (!remote) {
      const book = await ensureLocalAdmin()
      const account = await book.authenticate(email, password)
      if (!account) return json({ error: 'Неверная почта или пароль' }, 401)
      const access = signAccess(account)
      return setSession(json({ ok: true, mode: 'file' }), access, access, req)
    }
    const client = supabaseClient()
    if (!client) return json({ error: 'Задайте SUPABASE_URL и SUPABASE_ANON_KEY' }, 503)
    const signed = await client.auth.signInWithPassword({ email, password })
    const session = signed.data.session
    const user = signed.data.user
    if (signed.error || !session || !user) return json({ error: 'Неверная почта или пароль' }, 401)
    const userClient = supabaseClient(session.access_token)
    const admin = await userClient?.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle()
    if (!admin?.data) {
      await fetch(`${remote.url}/auth/v1/logout`, {
        method: 'POST',
        headers: { apikey: remote.key, authorization: `Bearer ${session.access_token}` },
      }).catch(() => undefined)
      return json({ error: 'Неверная почта или пароль' }, 401)
    }
    return setSession(json({ ok: true, mode: 'supabase' }), session.access_token, session.refresh_token, req)
  } catch (err) {
    return fail(err)
  }
}
