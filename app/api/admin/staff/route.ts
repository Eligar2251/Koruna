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
    const body = await readJson(req,16384)
    const email = String(body.email || '').trim().toLowerCase()
    const name = String(body.name || '').trim()
    const password = String(body.password || '')
    const role = body.role || 'admin'
    if (!['admin','owner'].includes(String(role))) return json({error:'Некорректная роль'},400)
    if (role === 'owner' && opened.session.role !== 'owner') return json({error:'Только владелец может назначить владельца'},403)
    if (password.length < 12 || password.length > 200 || name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({error:'Укажите имя, почту и пароль от 12 символов'},400)
    if (!opened.session.client) {
      const created = await accountBook().create({ email, name, password, role })
      return attachSession(json(created), opened.session, req)
    }
    const anon = supabaseClient()
    if (!anon) return json({ error: 'Задайте SUPABASE_URL и SUPABASE_ANON_KEY' }, 503)
    const signed = await anon.auth.signUp({ email, password, options: { data: { name } } })
    const user = signed.data.user
    if (signed.error || !user || !user.identities?.length) return json({ error: 'Не удалось создать администратора' }, 400)
    const key = await passwordKey(password)
    const granted = await opened.session.client.rpc('grant_staff', {
      new_user_id: user.id,
      new_email: email,
      new_name: name,
      new_password_key: key,
      new_role: role,
    })
    if (granted.error) return json({ error: 'Не удалось назначить администратора' }, 400)
    return attachSession(json({ id: user.id, email, name, role, emailConfirmationRequired: !signed.data.session }), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}

export async function PATCH(req: Request) {
  if (!hasSiteHeader(req)) return json({error:'Запрос отклонён'},403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  if (opened.session.role !== 'owner') return json({error:'Только владелец может изменять роли'},403)
  try {
    const body = await readJson(req,16384)
    const id = String(body.id || ''), role = String(body.role || '')
    if (!['admin','owner'].includes(role)) return json({error:'Некорректная роль'},400)
    if (!opened.session.client) return attachSession(json(await accountBook().setRole(id,role)), opened.session, req)
    const changed = await opened.session.client.rpc('set_staff_role',{p_user_id:id,p_role:role})
    if (changed.error) return json({error:'Не удалось изменить роль. Нельзя убрать последнего владельца.'},400)
    return attachSession(json({ok:true}),opened.session,req)
  } catch(err) {return attachSession(fail(err),opened.session,req)}
}
