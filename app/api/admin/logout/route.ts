import { sessionCookie } from '../../../../lib/http'
import { closeSession } from '../../../../lib/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export function POST(req: Request) {
  closeSession(req)
  return sessionCookie('', 0)
}
