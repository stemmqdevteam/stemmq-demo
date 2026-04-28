import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { GeneralSettingsForm } from '@/features/settings/components/general-settings-form'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'General Settings · StemmQ' }
export const dynamic = 'force-dynamic'

export default async function GeneralPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, avatar_url, job_title, display_name, bio, appearance')
    .eq('id', user.id)
    .single()

  return (
    <GeneralSettingsForm
      userId={user.id}
      profile={profile ?? null}
      email={user.email ?? ''}
    />
  )
}