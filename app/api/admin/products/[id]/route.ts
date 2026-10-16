import { attachSession, hasSiteHeader, openAdmin } from '../../../../../lib/auth'
import { fail, json, readJson, validId } from '../../../../../lib/http'
import { applyImageFields, saveImage } from '../../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

function missing() {
  return json({ error: 'Не найдено' }, 404)
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  const { id } = await ctx.params
  if (!validId(id)) return missing()
  try {
    const body = await readJson(req)
    const imageUrl = body.image_base64 ? await saveImage(body, opened.session.client) : undefined
    applyImageFields(body, imageUrl)
    return attachSession(json(await opened.session.store.saveProduct(body, id)), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  if (!hasSiteHeader(req)) return json({ error: 'Запрос отклонён' }, 403)
  const opened = await openAdmin(req)
  if ('response' in opened) return opened.response
  const { id } = await ctx.params
  if (!validId(id)) return missing()
  try {
    return attachSession(json(await opened.session.store.deleteProduct(id)), opened.session, req)
  } catch (err) {
    return attachSession(fail(err), opened.session, req)
  }
}
