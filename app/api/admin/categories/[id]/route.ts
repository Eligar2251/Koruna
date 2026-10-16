import { fail, json, readJson, requireAdmin, validId } from '../../../../../lib/http'
import { getStore } from '../../../../../lib/server'

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
    return json(await (await getStore()).saveCategory(await readJson(req), id))
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
    return json(await (await getStore()).deleteCategory(id))
  } catch (err) {
    return fail(err)
  }
}
