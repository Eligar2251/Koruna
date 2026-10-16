import { fail, json, readJson, requireAdmin, validId } from '../../../../../lib/http'
import { applyImageFields, getStore, saveImage } from '../../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: Promise<{ id: string }> }

function missing() {
  return json({ error: 'Не найдено' }, 404)
}

export async function PUT(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req)
  if (denied) return denied
  const { id } = await ctx.params
  if (!validId(id)) return missing()
  try {
    const body = await readJson(req)
    const imageUrl = body.image_base64 ? await saveImage(body) : undefined
    applyImageFields(body, imageUrl)
    return json(await (await getStore()).saveProduct(body, id))
  } catch (err) {
    return fail(err)
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const denied = requireAdmin(req)
  if (denied) return denied
  const { id } = await ctx.params
  if (!validId(id)) return missing()
  try {
    return json(await (await getStore()).deleteProduct(id))
  } catch (err) {
    return fail(err)
  }
}
