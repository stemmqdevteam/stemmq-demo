'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createDecisionSchema, updateDecisionSchema } from '@/lib/validations/decision'
import { pushNotification, pushToOrg } from '@/lib/notifications'
import { ROUTES } from '@/constants'
import type { ActionResult, DecisionStatus } from '@/types'

async function getOrgId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from('org_members').select('org_id').eq('user_id', userId).limit(1).maybeSingle()
  return data?.org_id ?? null
}

async function recalcDQS(
  supabase: Awaited<ReturnType<typeof createClient>>,
  decisionId: string
) {
  const { data: score } = await supabase.rpc('calculate_dqs', { decision_uuid: decisionId })
  if (score !== null) {
    await supabase.from('decisions').update({ quality_score: score }).eq('id', decisionId)
  }
}

function parseJson<T>(raw: FormDataEntryValue | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw as string) as T } catch { return fallback }
}

// ── Create Decision ───────────────────────────────────────

export async function createDecision(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const orgId = await getOrgId(supabase, user.id)
  if (!orgId) return { success: false, error: 'No organization found' }

  // Free plan limit
  const { data: sub } = await supabase
    .from('subscriptions').select('plan').eq('org_id', orgId).single()
  if (sub?.plan === 'free') {
    const { count } = await supabase
      .from('decisions').select('*', { count: 'exact', head: true }).eq('org_id', orgId)
    if ((count ?? 0) >= 10) {
      return { success: false, error: 'Free plan limit reached (10 decisions). Upgrade to Pro for unlimited decisions.' }
    }
  }

  const tagsStr = (formData.get('tags') as string) ?? ''
  const raw = {
    title:             (formData.get('title') as string)?.trim(),
    description:       (formData.get('description') as string) || undefined,
    intent:            formData.get('intent') as string,
    category:          (formData.get('category') as string) || undefined,
    reasoning:         (formData.get('reasoning') as string) || undefined,
    time_horizon:      (formData.get('time_horizon') as string) || undefined,
    reversibility:     (formData.get('reversibility') as string) || undefined,
    financial_exposure: formData.get('financial_exposure')
      ? Number(formData.get('financial_exposure')) : null,
    tags:              tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [],
    stakeholders:      parseJson<string[]>(formData.get('stakeholders'), []),
    expected_outcomes: parseJson<object[]>(formData.get('expected_outcomes'), []),
    assumptions:       parseJson<string[]>(formData.get('assumptions'), []),
  }

  const parsed = createDecisionSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { assumptions, ...decisionData } = parsed.data

  const { data: decision, error: decErr } = await supabase
    .from('decisions')
    .insert({ ...decisionData, org_id: orgId, created_by: user.id, status: 'active' })
    .select('id')
    .single()

  if (decErr || !decision) return { success: false, error: decErr?.message ?? 'Failed to create decision' }

  if (assumptions.length > 0) {
    await supabase.from('assumptions').insert(
      assumptions.map((content, i) => ({
        decision_id: decision.id,
        org_id:      orgId,
        created_by:  user.id,
        content,
        sort_order:  i,
      }))
    )
  }

  await recalcDQS(supabase, decision.id)

  await supabase.from('audit_logs').insert({
    org_id: orgId, user_id: user.id, action: 'created',
    resource_type: 'decision', resource_id: decision.id,
    after_state: { title: decisionData.title, intent: decisionData.intent },
  })

  // 🔔 Notify creator
  await pushNotification({
    userId:      user.id,
    orgId,
    type:        'success',
    source:      'decision',
    title:       `✅ Decision created: "${decisionData.title}"`,
    body:        `${assumptions.length} assumption${assumptions.length !== 1 ? 's' : ''} documented. Track them as reality unfolds.`,
    actionUrl:   `${ROUTES.decisions}/${decision.id}`,
    actionLabel: 'View decision',
  })

  // 🔔 Notify other org members
  await pushToOrg({
    orgId,
    excludeUserId: user.id,
    type:        'info',
    source:      'decision',
    title:       `New decision: "${decisionData.title}"`,
    body:        `A new decision was created in your workspace.`,
    actionUrl:   `${ROUTES.decisions}/${decision.id}`,
    actionLabel: 'View decision',
  })

  revalidatePath(ROUTES.decisions)
  revalidatePath(ROUTES.dashboard)
  redirect(`${ROUTES.decisions}/${decision.id}`)
}

// ── Update Decision ───────────────────────────────────────

export async function updateDecision(
  decisionId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const tagsStr = (formData.get('tags') as string) ?? ''
  const raw = {
    title:             (formData.get('title') as string)?.trim(),
    description:       (formData.get('description') as string) || undefined,
    intent:            formData.get('intent') as string,
    category:          (formData.get('category') as string) || undefined,
    reasoning:         (formData.get('reasoning') as string) || undefined,
    time_horizon:      (formData.get('time_horizon') as string) || undefined,
    reversibility:     (formData.get('reversibility') as string) || undefined,
    financial_exposure: formData.get('financial_exposure')
      ? Number(formData.get('financial_exposure')) : null,
    tags:              tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : [],
    stakeholders:      parseJson<string[]>(formData.get('stakeholders'), []),
    expected_outcomes: parseJson<object[]>(formData.get('expected_outcomes'), []),
    assumptions:       ['placeholder'],
  }

  const parsed = updateDecisionSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { assumptions: _, ...updateData } = parsed.data

  const { error } = await supabase.from('decisions').update(updateData).eq('id', decisionId)
  if (error) return { success: false, error: error.message }

  await recalcDQS(supabase, decisionId)

  await supabase.from('audit_logs').insert({
    user_id: user.id, action: 'updated',
    resource_type: 'decision', resource_id: decisionId,
  })

  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  revalidatePath(ROUTES.decisions)
  revalidatePath(ROUTES.dashboard)
  redirect(`${ROUTES.decisions}/${decisionId}`)
}

// ── Change Status ─────────────────────────────────────────

export async function changeDecisionStatus(
  decisionId: string,
  status: DecisionStatus,
  resolutionNotes?: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const update: Record<string, unknown> = { status }
  if (status === 'resolved') {
    update.resolved_at = new Date().toISOString()
    if (resolutionNotes) update.resolution_notes = resolutionNotes
  }
  if (status === 'active' || status === 'draft') {
    update.resolved_at = null
    update.resolution_notes = null
  }

  const { data: decision } = await supabase
    .from('decisions').select('title, org_id').eq('id', decisionId).single()

  const { error } = await supabase.from('decisions').update(update).eq('id', decisionId)
  if (error) return { success: false, error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id, action: 'status_changed',
    resource_type: 'decision', resource_id: decisionId,
    after_state: { status },
  })

  // 🔔 Status-specific notifications
  if (decision) {
    const orgId = decision.org_id

    if (status === 'resolved') {
      await pushNotification({
        userId: user.id, orgId,
        type: 'success', source: 'decision',
        title: `🏆 Decision resolved: "${decision.title}"`,
        body: resolutionNotes ? `Outcome: ${resolutionNotes.slice(0, 100)}` : 'Decision closed. Review assumption accuracy.',
        actionUrl: `${ROUTES.decisions}/${decisionId}`,
        actionLabel: 'View outcomes',
      })
      await pushToOrg({
        orgId, excludeUserId: user.id,
        type: 'info', source: 'decision',
        title: `Decision resolved: "${decision.title}"`,
        body: 'A decision in your workspace was marked as resolved.',
        actionUrl: `${ROUTES.decisions}/${decisionId}`,
        actionLabel: 'View decision',
      })
    } else if (status === 'archived') {
      await pushNotification({
        userId: user.id, orgId,
        type: 'info', source: 'decision',
        title: `Decision archived: "${decision.title}"`,
        actionUrl: `${ROUTES.decisions}/${decisionId}`,
        actionLabel: 'View decision',
      })
    }
  }

  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  revalidatePath(ROUTES.decisions)
  revalidatePath(ROUTES.dashboard)
  return { success: true }
}

// ── Delete Decision ───────────────────────────────────────

export async function deleteDecision(decisionId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('decisions').delete().eq('id', decisionId)
  if (error) return { success: false, error: error.message }

  revalidatePath(ROUTES.decisions)
  revalidatePath(ROUTES.dashboard)
  redirect(ROUTES.decisions)
}
