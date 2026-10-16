import { accountBook, attachSession, hasSiteHeader, openAdmin, supabaseClient } from '../../../../lib/auth'
import { fail, json, readJson } from '../../../../lib/http'
import { passwordKey } from '../../../../server/accounts.mjs'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  try {
    if (!opened.session.client) {
      return attachSession(json({ staff: await accountBook().list() }), opened.session, req)
    }
    const listed = await opened.session.client.rpc('list_staff')
    if (listed.error) return attachSession(json({ error: 'Список администраторов недоступен' }, 503), opened.session, req)
    return attachSession(json({ staff: listed.data || [] }), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}

export async function POST(req: Request) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  try {
    const body = await readJson(req)
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const password = String(body.password || '')
    if (!opened.session.client) {
      const created = await accountBook().create({ email, name, password })
      return attachSession(json(created), opened.session, req)
    }
    const anon = supabaseClient()
    if (!anon) return json({ error: 'Задайте SUPABASE_URL и SUPABASE_ANON_KEY' }, 503)
    const signed = await anon.auth.signUp({ email, password, options: { data: { name } } })
    const user = signed.data.user
    if (signed.error || !user) return json({ error: 'Не удалось создать администратора' }, 400)
    const key = await passwordKey(password)
    const granted = await opened.session.client.rpc('grant_admin', {
      new_user_id: user.id,
      new_email: email,
      new_name: name,
      new_password_key: key,
    })
    if (granted.error) return json({ error: 'Не удалось назначить администратора' }, 400)
    return attachSession(json({ id: user.id, email, name }), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}
