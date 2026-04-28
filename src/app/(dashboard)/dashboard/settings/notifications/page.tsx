import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/constants'
import { NotificationPrefsForm } from '@/features/settings/components/notification-prefs-form'
export const metadata: Metadata = { title: 'Notifications · StemmQ' }
export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)
  const { data: prefs } = await supabase.from('notification_preferences').select('*').eq('user_id', user.id).maybeSingle()
  return <NotificationPrefsForm prefs={prefs ?? null} userId={user.id} />
}
