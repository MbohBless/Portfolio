import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value
          // console.log(`📝 Getting cookie ${name}:`, cookie ? 'exists' : 'missing')
          return cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          // console.log(`📝 Setting cookie ${name}`)
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log(`📝 Removing cookie ${name}`)
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - this also ensures cookies are set
  await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  // console.log('🔒 Middleware check:', {
  //   path: request.nextUrl.pathname,
  //   hasSession: !!session,
  //   userId: session?.user?.id
  // })

  // Protect /admin routes (except login and signup pages)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAuthPage =
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname === '/admin/signup'

    if (!session && !isAuthPage) {
      // Redirect unauthenticated users to login
      // console.log('❌ No session, redirecting to login')
      const redirectUrl = new URL('/admin/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (session && isAuthPage) {
      // Redirect authenticated users away from auth pages
      // console.log('✅ Has session, redirecting to admin dashboard')
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
