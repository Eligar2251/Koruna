import { serveUpload } from '../../../lib/files'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: Promise<{ name: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { name } = await ctx.params
  return serveUpload(name)
}
