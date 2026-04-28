import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { AccountSettingsView } from '@/features/settings/components/account-settings-view'
export const metadata: Metadata = { title: 'Account · StemmQ' }
export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)
  return <AccountSettingsView email={user.email ?? ''} createdAt={user.created_at} />
}
