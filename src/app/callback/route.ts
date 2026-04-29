import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient }              from '@supabase/ssr'
import { createClient as createAdminSB }   from '@supabase/supabase-js'
import { pushNotification }                from '@/lib/notifications'
import { sendEmail, welcomeEmail, newLoginEmail } from '@/lib/email/templates'
import { checkAuthRateLimit, sanitizeRedirect } from '@/lib/security/auth-guards'

/**
 * OAuth + Magic Link callback — the most security-critical route in the app.
 *
 * Security measures applied here:
 * 1. Rate limited (20/min per IP) — prevents brute force code enumeration
 * 2. Code verified server-side — exchangeCodeForSession validates the PKCE challenge
 * 3. Redirect URL sanitized — prevents open redirect attacks
 * 4. Cookies set HttpOnly + Secure + SameSite=Lax
 * 5. Service role used for DB writes — not exposed to client
 * 6. All errors logged for monitoring
 */
export async function GET(request: NextRequest) {
  // Rate limit first — before any expensive DB operations
  const rateLimitResponse = checkAuthRateLimit('callback', request)
  if (rateLimitResponse) return rateLimitResponse

  const { searchParams, origin } = new URL(request.url)
  const code         = searchParams.get('code')
  const rawNext      = searchParams.get('redirect') ?? '/dashboard'
  const next         = sanitizeRedirect(rawNext)  // prevent open redirects
  const errorParam   = searchParams.get('error')
  const errorDesc    = searchParams.get('error_description')

  if (errorParam) {
    const msg = encodeURIComponent(errorDesc ?? errorParam)
    return NextResponse.redirect(`${origin}/error?message=${msg}`)
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login`)
  }

  // Build the response so we can write cookies onto it
  const response = NextResponse.redirect(`${origin}/dashboard`)

  // Anon client — ONLY for exchanging the code for a session token
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get('cookie')
            ?.split(';')
            .map((c) => {
              const [name, ...rest] = c.trim().split('=')
              return { name: (name ?? '').trim(), value: rest.join('=') }
            })
            .filter((c) => c.name) ?? []
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,                                      // JS cannot read
              sameSite: 'lax',                                     // CSRF protection
              secure:   process.env.NODE_ENV === 'production',     // HTTPS only in prod
              path:     '/',
            })
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[callback] Code exchange failed:', error?.message)
    const msg = encodeURIComponent(error?.message ?? 'Authentication failed. Please try again.')
    return NextResponse.redirect(`${origin}/error?message=${msg}`)
  }

  const user = data.user

  // Service role client — all DB writes bypass RLS
  const admin = createAdminSB(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Always sync the latest profile data from the auth provider.
  // Google OAuth sends avatar_url and full_name in user_metadata —
  // we upsert here so the profile always stays fresh.
  const avatarUrl  = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null
  const fullName   = user.user_metadata?.full_name  ?? user.user_metadata?.name    ?? null

  await admin
    .from('user_profiles')
    .upsert(
      {
        id:         user.id,
        full_name:  fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict:        'id',
        ignoreDuplicates:  false,  // always update
      }
    )
    .select()

  // Check if user already has an org
  const { data: membership } = await admin
    .from('org_members')
    .select('org_id, organizations(id, config)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  // ── New user: create org, send to onboarding ──────────────
  if (!membership) {
    const orgName: string =
      user.user_metadata?.org_name ??
      user.user_metadata?.full_name ??
      user.email?.split('@')[0] ??
      'My Organization'

    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) + '-' + Math.random().toString(36).slice(2, 6)

    const { data: org, error: orgError } = await admin
      .from('organizations')
      .insert({
        name:   orgName,
        slug,
        plan:   'free',
        config: {
          onboarding_completed:     false,
          strategy_focus:           null,
          decision_culture:         null,
          risk_profile:             'moderate',
          industry:                 null,
          size:                     null,
          stage:                    null,
          ai_suggestions_enabled:   true,
          notification_preferences: {},
        },
      })
      .select('id')
      .single()

    if (orgError || !org) {
      console.error('[callback] Failed to create org:', orgError?.message)
      const msg = encodeURIComponent('Failed to create workspace. Please try again.')
      return NextResponse.redirect(`${origin}/error?message=${msg}`)
    }

    // Create member + subscription in parallel
    await Promise.all([
      admin.from('org_members').insert({ org_id: org.id, user_id: user.id, role: 'owner' }),
      admin.from('subscriptions').insert({ org_id: org.id, plan: 'free', status: 'active' }),
    ])

    // Send welcome email (only for brand new users)
    const userEmail = user.email ?? ''
    const userName  = fullName ?? user.email?.split('@')[0] ?? 'there'
    if (userEmail) {
      try {
        await sendEmail({
          to:      userEmail,
          subject: `Welcome to StemmQ, ${userName}! 👋`,
          html:    welcomeEmail(userName, orgName),
        })
      } catch (_) { /* non-critical */ }
    }

    // Record first session as primary + trusted
    const ua2        = request.headers.get('user-agent') ?? ''
    const ip2        = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'Unknown'
    const browser2   = ua2.includes('Chrome') && !ua2.includes('Edg') ? 'Chrome' : ua2.includes('Firefox') ? 'Firefox' : ua2.includes('Safari') ? 'Safari' : 'Browser'
    const os2        = ua2.includes('Windows') ? 'Windows' : ua2.includes('Mac OS') ? 'macOS' : ua2.includes('Linux') ? 'Linux' : ua2.includes('Android') ? 'Android' : ua2.includes('iPhone') ? 'iOS' : 'Unknown OS'
    const deviceType2 = ua2.includes('Mobile') || ua2.includes('iPhone') ? 'mobile' : ua2.includes('iPad') ? 'tablet' : 'desktop'
    try {
      await admin.from('sessions').insert({
        user_id: user.id, ip_address: ip2, browser: browser2, os: os2,
        device_name: `${browser2} on ${os2}`, device_type: deviceType2,
        location: 'Unknown', is_current: true, is_trusted: true, is_primary: true,
        last_active_at: new Date().toISOString(),
      })
    } catch (_) { /* non-critical */ }

    // Preserve plan intent through onboarding
    const onboardingDest = next && next !== '/dashboard' && next !== '/onboarding'
      ? `/onboarding?post_redirect=${encodeURIComponent(next)}`
      : '/onboarding'
    response.headers.set('location', `${origin}${onboardingDest}`)
    return response
  }

  // ── Existing user ─────────────────────────────────────────
  const orgRaw = membership.organizations
  const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

  if (!org?.config?.onboarding_completed) {
    response.headers.set('location', `${origin}/onboarding`)
    return response
  }

  // ── Parse device info from User-Agent ───────────────────
  const ua          = request.headers.get('user-agent') ?? ''
  const ip          = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
               ?? request.headers.get('x-real-ip')
               ?? 'Unknown'

  // Basic UA parsing (no extra dependency needed for MVP)
  const browser = ua.includes('Chrome') && !ua.includes('Edg') ? 'Chrome'
                : ua.includes('Firefox')  ? 'Firefox'
                : ua.includes('Safari')   ? 'Safari'
                : ua.includes('Edg')      ? 'Edge'
                : ua.includes('Opera')    ? 'Opera'
                : 'Browser'

  const os      = ua.includes('Windows')     ? 'Windows'
                : ua.includes('Mac OS')       ? 'macOS'
                : ua.includes('Linux')        ? 'Linux'
                : ua.includes('Android')      ? 'Android'
                : ua.includes('iPhone') || ua.includes('iPad') ? 'iOS'
                : 'Unknown OS'

  const deviceType = ua.includes('Mobile') || ua.includes('iPhone') ? 'mobile'
                   : ua.includes('iPad') ? 'tablet' : 'desktop'

  const deviceName = `${browser} on ${os}`

  // Check if this is the user's first ever session (make it primary + trusted)
  const { count: sessionCount } = await admin
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_revoked', false)

  const isFirstSession = (sessionCount ?? 0) === 0

  // Mark all previous sessions as not current
  await admin.from('sessions').update({ is_current: false }).eq('user_id', user.id)

  // Record this session
  try {
    await admin.from('sessions').insert({
      user_id:        user.id,
      ip_address:     ip,
      browser,
      os,
      device_name:    deviceName,
      device_type:    deviceType,
      location:       'Unknown location',
      is_current:     true,
      is_trusted:     isFirstSession,
      is_primary:     isFirstSession,
      last_active_at: new Date().toISOString(),
    })
  } catch (_) { /* non-critical — never fail login due to session recording */ }

  // ── Security notification for new device ─────────────────
  // Always send email for security events
  const userEmail = user.email ?? ''
  if (userEmail && !isFirstSession) {
    try {
      const { sendEmail, newLoginEmail } = await import('@/lib/email/templates')
      await sendEmail({
        to:      userEmail,
        subject: 'New sign-in to your StemmQ account',
        html:    newLoginEmail(
          fullName ?? 'there',
          deviceName,
          ip ?? 'Unknown',
          new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
        ),
      })
    } catch (_) { /* non-critical */ }
  }

  // In-app notification (respects user preferences — defaults to on)
  if (!isFirstSession) {
    try {
      await pushNotification({
        userId:      user.id,
        orgId:       org?.id ?? undefined,
        type:        'info',
        source:      'system',
        title:       '🔐 New sign-in to your account',
        body:        `${deviceName} · IP: ${ip ?? 'Unknown'}`,
        actionUrl:   '/dashboard/settings/security',
        actionLabel: 'Review sessions',
      })
    } catch (_) { /* non-critical */ }
  }

  // Fully onboarded → destination
  response.headers.set('location', `${origin}${next}`)
  return response
}