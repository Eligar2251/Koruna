import { fail, json } from '../../../lib/http'
import { getStore } from '../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const store = await getStore()
    return json({ mode: store.mode, ...(await store.catalog()) })
  } catch (err) {
    return fail(err)
  }
}
