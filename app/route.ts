import { serveSite } from '../lib/files'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export function GET() {
  return serveSite('/')
}

export function HEAD() {
  return serveSite('/')
}
