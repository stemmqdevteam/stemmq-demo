import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getNotifications } from '@/lib/supabase/queries'
import { NotificationsView } from '@/features/notifications/components/notifications-view'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Notifications · StemmQ' }

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: notifications } = await getNotifications(supabase, user.id)

  return <NotificationsView notifications={notifications ?? []} />
}