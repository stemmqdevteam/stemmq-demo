import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { SessionProvider } from '@/components/providers/session-provider'
import { ROUTES } from '@/constants'
import './globals.css'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const [profileResult, membershipResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('org_members')
      .select('org_id, role, organizations(*)')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle(),
  ])
  
  if (!membershipResult.data) redirect(ROUTES.login)

  const orgRaw = membershipResult.data.organizations
  const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

  const { data: subscription } = org
    ? await supabase.from('subscriptions').select('*').eq('org_id', org.id).maybeSingle()
    : { data: null }

  const serverProfile = profileResult.data
    ? {
        full_name:  profileResult.data.full_name,
        avatar_url: profileResult.data.avatar_url,
        is_admin:   profileResult.data.is_admin ?? false,
        plan:       (subscription?.plan ?? org?.plan ?? 'free') as string,
      }
    : null

  return (
    <SessionProvider
      profile={profileResult.data ?? null}
      org={org ?? null}
      subscription={subscription ?? null}
    >
      {/*
        Root layout shell — full-screen flex row.

        Desktop (lg+):
          <Sidebar /> renders as a normal flex child in the row.
          It is always visible; CSS width transition makes it narrow/wide.

        Mobile (< lg):
          <Sidebar /> renders the mobile top bar (fixed, z-20) + the
          slide-in drawer (fixed, z-40) inside it. The sidebar does NOT
          occupy any space in this flex row on mobile.
          The <main> gets pt-14 to clear the fixed mobile top bar.
      */}
      <div className="flex h-dvh bg-(--background) overflow-hidden">
        {/* Desktop: always-visible sidebar | Mobile: nothing here (drawer is fixed-positioned) */}
        <Sidebar serverProfile={serverProfile} />

        {/* Content column */}
        <main className="flex-1 min-w-0 overflow-y-auto overscroll-contain pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
