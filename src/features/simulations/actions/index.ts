'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { pushNotification } from '@/lib/notifications'
import { ROUTES } from '@/constants'
import type { ActionResult, SimulationType, SimulationVariable, SimulationResult } from '@/types'

// ── Create simulation ─────────────────────────────────────

export async function createSimulation(
  data: {
    decisionId:  string | null
    title:       string
    description: string
    type:        SimulationType
    variables:   SimulationVariable[]
    orgId:       string
  }
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: sim, error } = await supabase
    .from('simulations')
    .insert({
      org_id:      data.orgId,
      created_by:  user.id,
      decision_id: data.decisionId,
      title:       data.title,
      description: data.description || null,
      type:        data.type,
      status:      'pending',
      variables:   data.variables,
      result:      null,
    })
    .select('id')
    .single()

  if (error || !sim) return { success: false, error: error?.message ?? 'Failed to create simulation' }

  revalidatePath(ROUTES.simulations)
  return { success: true, data: { id: sim.id } }
}

// ── Save simulation result ────────────────────────────────

export async function saveSimulationResult(
  simulationId: string,
  result:        SimulationResult
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: sim } = await supabase
    .from('simulations')
    .select('title, org_id')
    .eq('id', simulationId)
    .single()

  const { error } = await supabase
    .from('simulations')
    .update({
      status:       'completed',
      result,
      completed_at: new Date().toISOString(),
    })
    .eq('id', simulationId)

  if (error) return { success: false, error: error.message }

  // Notify on completion
  if (sim) {
    const emoji = result.impact_score > 20 ? '📈' : result.impact_score < -20 ? '⚠️' : '📊'
    await pushNotification({
      userId:      user.id,
      orgId:       sim.org_id,
      type:        result.impact_score > 20 ? 'success' : result.impact_score < -20 ? 'warning' : 'info',
      source:      'decision',
      title:       `${emoji} Simulation complete: "${sim.title}"`,
      body:        `Impact score: ${result.impact_score > 0 ? '+' : ''}${result.impact_score} · Confidence: ${result.confidence}%`,
      actionUrl:   ROUTES.simulations,
      actionLabel: 'View results',
    })
  }

  revalidatePath(ROUTES.simulations)
  return { success: true }
}

// ── Delete simulation ─────────────────────────────────────

export async function deleteSimulation(simulationId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('simulations').delete().eq('id', simulationId)

  if (error) return { success: false, error: error.message }

  revalidatePath(ROUTES.simulations)
  return { success: true }
}
