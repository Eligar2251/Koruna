import { serveSite } from '../../lib/files'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

type Ctx = { params: Promise<{ slug: string[] }> }

async function respond(ctx: Ctx) {
  const { slug } = await ctx.params
  return serveSite(`/${slug.join('/')}`)
}

export function GET(_req: Request, ctx: Ctx) {
  return respond(ctx)
}

export function HEAD(_req: Request, ctx: Ctx) {
  return respond(ctx)
}
