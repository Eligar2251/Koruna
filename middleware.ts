import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.endsWith('.html')) return NextResponse.next()
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/index.html' ? '/' : pathname.slice(0, -5) || '/'
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
