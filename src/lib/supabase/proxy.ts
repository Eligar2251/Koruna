import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseEnv } from './env'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const env = getSupabaseEnv()
  if (!env) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return new NextResponse('Сервис временно недоступен', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '600' },
      })
    }
    return response
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const path = request.nextUrl.pathname
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return response
}
