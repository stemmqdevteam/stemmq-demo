import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const STATIC  = ['/_next', '/fonts', '/images', '/favicon', '/icons', '/robots.txt', '/sitemap.xml']
const BYPASS  = ['/callback', '/error', '/signout', '/api/']
const AUTH    = ['/login', '/signup', '/verify']
const PRIVATE = ['/dashboard', '/onboarding', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip — never touch these
  if (STATIC.some((p) => pathname.startsWith(p)) || BYPASS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()              => request.cookies.getAll(),
        setAll: (cookiesToSet)  => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Validate JWT server-side — never trust getSession() alone
  const { data: { user } } = await supabase.auth.getUser()
  const authed = !!user

  // ── 1. Unauthenticated → private route → login ────────────
  if (!authed && PRIVATE.some((p) => pathname.startsWith(p))) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // ── 2. Authenticated → auth page → redirect by role ──────
  if (authed && AUTH.some((p) => pathname.startsWith(p))) {
    // Check is_admin to send admin users to /admin, not /dashboard
    const { data: profile } = await supabase
      .from('user_profiles').select('is_admin').eq('id', user.id).single()
    return NextResponse.redirect(
      new URL(profile?.is_admin ? '/admin' : '/dashboard', request.url)
    )
  }

  // ── 3. Authenticated → root / → redirect by role ─────────
  if (authed && pathname === '/') {
    const { data: profile } = await supabase
      .from('user_profiles').select('is_admin').eq('id', user.id).single()
    return NextResponse.redirect(
      new URL(profile?.is_admin ? '/admin' : '/dashboard', request.url)
    )
  }

  // ── 4. Dashboard → enforce onboarding ────────────────────
  if (authed && pathname.startsWith('/dashboard')) {
    const { data: m } = await supabase
      .from('org_members')
      .select('organizations(config)')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    const orgRaw = m?.organizations
    const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

    if (!org || org?.config?.onboarding_completed !== true) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // ── 5. /admin is guarded by the page server component ────
  // (service role calls cannot run in Edge Runtime)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)'],
}
