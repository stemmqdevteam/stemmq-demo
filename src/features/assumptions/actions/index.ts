'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAssumptionSchema, resolveAssumptionSchema } from '@/lib/validations/decision'
import { pushNotification } from '@/lib/notifications'
import { ROUTES } from '@/constants'
import type { ActionResult } from '@/types'

async function recalcDQS(
  supabase: Awaited<ReturnType<typeof createClient>>,
  decisionId: string
) {
  const { data: score } = await supabase.rpc('calculate_dqs', { decision_uuid: decisionId })
  if (score !== null) {
    await supabase.from('decisions').update({ quality_score: score }).eq('id', decisionId)
  }
}

// ── Create assumption ─────────────────────────────────────

export async function createAssumption(
  decisionId: string,
  orgId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = createAssumptionSchema.safeParse({
    content:    (formData.get('content') as string)?.trim(),
    rationale:  (formData.get('rationale') as string) || undefined,
    confidence: formData.get('confidence') ? Number(formData.get('confidence')) : undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.content?.[0] ?? 'Invalid assumption',
    }
  }

  const { data: last } = await supabase
    .from('assumptions').select('sort_order').eq('decision_id', decisionId)
    .order('sort_order', { ascending: false }).limit(1).maybeSingle()

  const { data, error } = await supabase
    .from('assumptions')
    .insert({
      decision_id: decisionId,
      org_id:      orgId,
      created_by:  user.id,
      content:     parsed.data.content,
      rationale:   parsed.data.rationale ?? null,
      confidence:  parsed.data.confidence ?? null,
      sort_order:  (last?.sort_order ?? -1) + 1,
    })
    .select('id')
    .single()

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to create' }

  await recalcDQS(supabase, decisionId)
  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  return { success: true, data: { id: data.id } }
}

// ── Resolve assumption ────────────────────────────────────

export async function resolveAssumption(
  assumptionId: string,
  decisionId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = resolveAssumptionSchema.safeParse({
    status:          formData.get('status'),
    resolution_note: (formData.get('resolution_note') as string) || undefined,
  })

  if (!parsed.success) return { success: false, error: 'Invalid status' }

  // Get assumption content for the notification
  const { data: assumption } = await supabase
    .from('assumptions')
    .select('content, org_id, decisions(title)')
    .eq('id', assumptionId)
    .single()

  const { error } = await supabase
    .from('assumptions')
    .update({
      status:          parsed.data.status,
      resolution_note: parsed.data.resolution_note ?? null,
      resolved_at:     new Date().toISOString(),
      resolved_by:     user.id,
    })
    .eq('id', assumptionId)

  if (error) return { success: false, error: error.message }

  await supabase.from('audit_logs').insert({
    user_id: user.id, action: 'assumption_resolved',
    resource_type: 'assumption', resource_id: assumptionId,
    after_state: { status: parsed.data.status },
  })

  // 🔔 Notify on resolve
  if (assumption) {
    const decTitle = Array.isArray(assumption.decisions)
      ? (assumption.decisions[0] as { title: string })?.title
      : (assumption.decisions as { title: string } | null)?.title

    const statusEmoji = parsed.data.status === 'correct' ? '✅'
      : parsed.data.status === 'incorrect' ? '❌' : '⚠️'
    const statusLabel = parsed.data.status === 'correct' ? 'correct'
      : parsed.data.status === 'incorrect' ? 'incorrect' : 'partially correct'

    await pushNotification({
      userId:      user.id,
      orgId:       assumption.org_id,
      type:        parsed.data.status === 'correct' ? 'success' : parsed.data.status === 'incorrect' ? 'warning' : 'info',
      source:      'assumption',
      title:       `${statusEmoji} Assumption marked ${statusLabel}`,
      body:        `"${assumption.content.slice(0, 80)}${assumption.content.length > 80 ? '…' : ''}"${decTitle ? ` on "${decTitle}"` : ''}`,
      actionUrl:   `${ROUTES.decisions}/${decisionId}`,
      actionLabel: 'View decision',
    })
  }

  await recalcDQS(supabase, decisionId)
  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  return { success: true }
}

// ── Unresolve assumption ──────────────────────────────────

export async function unresolveAssumption(
  assumptionId: string,
  decisionId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('assumptions')
    .update({ status: 'unknown', resolution_note: null, resolved_at: null, resolved_by: null })
    .eq('id', assumptionId)

  if (error) return { success: false, error: error.message }

  await recalcDQS(supabase, decisionId)
  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  return { success: true }
}

// ── Delete assumption ─────────────────────────────────────

export async function deleteAssumption(
  assumptionId: string,
  decisionId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase.from('assumptions').delete().eq('id', assumptionId)
  if (error) return { success: false, error: error.message }

  await recalcDQS(supabase, decisionId)
  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  return { success: true }
}

// ── Create outcome ────────────────────────────────────────

export async function createOutcome(
  decisionId: string,
  orgId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const title = (formData.get('title') as string)?.trim()
  if (!title) return { success: false, error: 'Title is required' }

  const expectedValue = (formData.get('expected_value') as string) || null
  const actualValue   = (formData.get('actual_value') as string) || null

  let deviationPct: number | null = null
  if (expectedValue && actualValue) {
    const exp = parseFloat(expectedValue)
    const act = parseFloat(actualValue)
    if (!isNaN(exp) && !isNaN(act) && exp !== 0) {
      deviationPct = Math.round(((act - exp) / Math.abs(exp)) * 100 * 10) / 10
    }
  }

  const { error } = await supabase.from('outcomes').insert({
    decision_id:    decisionId,
    org_id:         orgId,
    created_by:     user.id,
    title,
    description:    (formData.get('description') as string) || null,
    expected_value: expectedValue,
    actual_value:   actualValue,
    metric_type:    (formData.get('metric_type') as string) || null,
    deviation_pct:  deviationPct,
    measured_at:    (formData.get('measured_at') as string) || null,
    notes:          (formData.get('notes') as string) || null,
  })

  if (error) return { success: false, error: error.message }

  // 🔔 Notify on outcome recording
  if (deviationPct !== null) {
    const abs = Math.abs(deviationPct)
    const emoji = abs <= 5 ? '🎯' : abs <= 20 ? '📊' : '⚠️'
    const label = deviationPct >= 0 ? `+${deviationPct}%` : `${deviationPct}%`

    await pushNotification({
      userId:      user.id,
      orgId,
      type:        abs <= 5 ? 'success' : abs <= 20 ? 'info' : 'warning',
      source:      'decision',
      title:       `${emoji} Outcome recorded: ${label} deviation`,
      body:        `"${title}" — expected ${expectedValue}, got ${actualValue}`,
      actionUrl:   `${ROUTES.decisions}/${decisionId}`,
      actionLabel: 'View outcomes',
    })
  } else {
    await pushNotification({
      userId:      user.id,
      orgId,
      type:        'info',
      source:      'decision',
      title:       `📋 Outcome recorded: "${title}"`,
      actionUrl:   `${ROUTES.decisions}/${decisionId}`,
      actionLabel: 'View decision',
    })
  }

  await recalcDQS(supabase, decisionId)
  revalidatePath(`${ROUTES.decisions}/${decisionId}`)
  return { success: true }
}
