import { fail, json, readJson, sessionCookie } from '../../../../lib/http'
import { openSession, passwordsMatch } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await readJson(req)
    const password = process.env.ADMIN_PASSWORD || ''
    if (!password || /choose-a-long-password|YOUR_PASSWORD/i.test(password)) {
      return json({ error: 'Задайте ADMIN_PASSWORD в .env' }, 503)
    }
    if (!passwordsMatch(String(body.password || ''), password)) {
      return json({ error: 'Неверный пароль' }, 401)
    }
    return sessionCookie(openSession(), 43200)
  } catch (err) {
    return fail(err)
  }
}
