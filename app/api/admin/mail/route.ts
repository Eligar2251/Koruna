import { randomUUID } from 'node:crypto'
import { attachSession,hasSiteHeader,openAdmin } from '../../../../lib/auth'
import { json,fail } from '../../../../lib/http'
import { readSettings } from '../../../../lib/settings'
import { mailConfiguration,sendRequestEmail } from '../../../../server/mail.mjs'
import { requestAllowed } from '../../../../server/requests.mjs'
export const runtime='nodejs'
export const dynamic='force-dynamic'
export async function GET(req:Request) {
 const opened=await openAdmin(req);if('response' in opened)return opened.response
 try {
  const settings=await readSettings(opened.session.client),config=mailConfiguration(settings.fields)
  return attachSession(json({configured:!!config,recipient:config?.to || process.env.REQUESTS_EMAIL || settings.fields.email,privacyReady:settings.privacyReady}),opened.session,req)
 } catch(err){return attachSession(fail(err),opened.session,req)}
}
export async function POST(req:Request) {
 if(!hasSiteHeader(req))return json({error:'Запрос отклонён'},403)
 const opened=await openAdmin(req);if('response' in opened)return opened.response
 if(!requestAllowed(req))return json({error:'Слишком много запросов'},429)
 try {
  const settings=await readSettings(opened.session.client)
  const status=await sendRequestEmail({id:randomUUID(),request_kind:'test',customer_name:'Проверка подключения',phone:'—',comment:'Тестовое уведомление из админки ЦСБ. Реальная заявка не создаётся.',items:[]},settings.fields)
  return attachSession(json({status}),opened.session,req)
 }catch(err){return attachSession(fail(err),opened.session,req)}
}
