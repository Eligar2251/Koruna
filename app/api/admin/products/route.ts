import { fail, json, readJson, requireAdmin } from '../../../../lib/http'
import { applyImageFields, getStore, saveImage } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const denied = requireAdmin(req)
  if (denied) return denied
  try {
    const body = await readJson(req)
    const imageUrl = body.image_base64 ? await saveImage(body) : undefined
    applyImageFields(body, imageUrl)
    return json(await (await getStore()).saveProduct(body))
  } catch (err) {
    return fail(err)
  }
}
