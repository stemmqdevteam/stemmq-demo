import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OnboardingWizard } from '@/features/onboarding/components/onboarding-wizard'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Setup your workspace · StemmQ' }

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ post_redirect?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const params       = await searchParams
  const postRedirect = params.post_redirect ?? ROUTES.dashboard

  const { data: membership } = await supabase
    .from('org_members')
    .select('org_id, organizations(id, name, config)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  // No org yet — show a simple "setting up" state
  // (callback creates the org; if it failed this is a recovery state)
  if (!membership) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-surface-50 dark:bg-[#0a0908]">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-6 text-3xl">
            ⚙️
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Setting up your workspace…</h1>
          <p className="text-surface-500 text-sm mb-8">
            This usually takes just a moment. If this persists, please sign out and sign in again.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
          >
            Back to login
          </a>
        </div>
      </div>
    )
  }

  const orgRaw = membership.organizations
  const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

  // Already completed onboarding → dashboard (or post_redirect destination)
  if (org?.config?.onboarding_completed === true) {
    redirect(postRedirect.startsWith('/') ? postRedirect : ROUTES.dashboard)
  }

  // Show the onboarding wizard
  return <OnboardingWizard defaultOrgName={org?.name ?? ''} postRedirect={postRedirect} />
}
