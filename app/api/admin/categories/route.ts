import { fail, json, readJson, requireAdmin } from '../../../../lib/http'
import { getStore } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const denied = requireAdmin(req)
  if (denied) return denied
  try {
    return json(await (await getStore()).saveCategory(await readJson(req)))
  } catch (err) {
    return fail(err)
  }
}
