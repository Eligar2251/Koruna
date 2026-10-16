import { fail, json, requireAdmin } from '../../../../lib/http'
import { getStore } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const denied = requireAdmin(req)
  if (denied) return denied
  try {
    return json(await (await getStore()).adminList())
  } catch (err) {
    return fail(err)
  }
}
