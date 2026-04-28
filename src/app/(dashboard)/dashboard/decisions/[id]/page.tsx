import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getDecisionById } from '@/lib/supabase/queries'
import { DecisionDetail } from '@/features/decisions/components/decision-detail'
import { ROUTES } from '@/constants'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data } = await supabase
      .from('decisions').select('title').eq('id', id).maybeSingle()
    return { title: data?.title ? `${data.title} · StemmQ` : 'Decision · StemmQ' }
  } catch {
    return { title: 'Decision · StemmQ' }
  }
}

export default async function DecisionDetailPage({ params }: Props) {
  const { id } = await params

  // Validate UUID format to prevent pointless DB calls
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members')
    .select('org_id, role')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) redirect(ROUTES.login)

  const { data: decision, error } = await getDecisionById(supabase, id, membership.org_id)

  if (error) {
    console.error('[DecisionDetailPage] error:', error.message, 'id:', id)
    notFound()
  }

  if (!decision) notFound()

  const canEdit = ['owner', 'admin', 'member'].includes(membership.role)

  return (
    <DecisionDetail
      decision={decision}
      orgId={membership.org_id}
      canEdit={canEdit}
    />
  )
}
