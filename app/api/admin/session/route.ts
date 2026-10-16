import { json } from '../../../../lib/http'
import { getStore, isAdmin } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: Request) {
  const store = await getStore()
  return json({ ok: isAdmin(req), mode: store.mode })
}
