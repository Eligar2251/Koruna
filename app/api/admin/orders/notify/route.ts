import { attachSession, hasSiteHeader, openAdmin } from '../../../../../lib/auth'
import { json, fail, readJson, validId } from '../../../../../lib/http'
import { retryRequestEmail } from '../../../../../lib/requests'
import { readSettings } from '../../../../../lib/settings'
export const runtime='nodejs'
export async function POST(req:Request) {
 if(!hasSiteHeader(req)) return json({error:'Запрос отклонён'},403)
 const opened=await openAdmin(req);if('response' in opened)return opened.response
 try {
  const body=await readJson(req),id=String(body.id || '')
  if(!validId(id))return json({error:'Некорректная заявка'},400)
  return attachSession(json(await retryRequestEmail(id,opened.session,await readSettings(opened.session.client))),opened.session,req)
 } catch(err){return attachSession(fail(err),opened.session,req)}
}
