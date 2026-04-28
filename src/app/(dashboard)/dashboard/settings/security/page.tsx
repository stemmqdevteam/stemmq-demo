import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SecurityView } from '@/features/auth/components/security-view'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Security · StemmQ' }
export const dynamic = 'force-dynamic'

export default async function SecurityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const [{ data: sessions }, { data: loginHistory }] = await Promise.all([
    supabase.from('sessions').select('*').eq('user_id', user.id).eq('is_revoked', false).order('last_active_at', { ascending: false }),
    supabase.from('notifications').select('id, title, body, created_at').eq('user_id', user.id).or('source.eq.system,title.ilike.%sign-in%').order('created_at', { ascending: false }).limit(20),
  ])

  return (
    <SecurityView
      user={{ id: user.id, email: user.email ?? '', created_at: user.created_at }}
      sessions={sessions ?? []}
      loginHistory={loginHistory ?? []}
    />
  )
}
