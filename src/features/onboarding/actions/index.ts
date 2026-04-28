'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { onboardingSchema } from '@/lib/validations/organization'
import { generateOrgSlug } from '@/utils'
import { ROUTES } from '@/constants'
import type { ActionResult } from '@/types'

export async function saveOnboardingStep(
  _step: number,
  _data: Record<string, unknown>
): Promise<ActionResult> {
  return { success: true }
}

export async function completeOnboarding(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const raw = {
    org_name:         formData.get('org_name') as string,
    industry:         formData.get('industry') as string || undefined,
    size:             formData.get('size') as string || undefined,
    stage:            formData.get('stage') as string || undefined,
    strategy_focus:   formData.get('strategy_focus') as string || undefined,
    decision_culture: formData.get('decision_culture') as string || undefined,
    risk_profile:     (formData.get('risk_profile') as string) || 'moderate',
  }

  const parsed = onboardingSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const values = parsed.data

  const { data: existing } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  let orgId: string

  if (existing?.org_id) {
    orgId = existing.org_id
    const { error } = await supabase
      .from('organizations')
      .update({
        name: values.org_name,
        config: {
          onboarding_completed: true,
          strategy_focus:       values.strategy_focus ?? null,
          decision_culture:     values.decision_culture ?? null,
          risk_profile:         values.risk_profile,
          industry:             values.industry ?? null,
          size:                 values.size ?? null,
          stage:                values.stage ?? null,
          ai_suggestions_enabled: true,
          notification_preferences: {},
        },
      })
      .eq('id', orgId)
    if (error) return { success: false, error: error.message }
  } else {
    const slug = generateOrgSlug(values.org_name)
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .insert({
        name:  values.org_name,
        slug,
        plan:  'free',
        config: {
          onboarding_completed: true,
          strategy_focus:       values.strategy_focus ?? null,
          decision_culture:     values.decision_culture ?? null,
          risk_profile:         values.risk_profile,
          industry:             values.industry ?? null,
          size:                 values.size ?? null,
          stage:                values.stage ?? null,
          ai_suggestions_enabled: true,
          notification_preferences: {},
        },
      })
      .select('id')
      .single()

    if (orgErr || !org) return { success: false, error: orgErr?.message ?? 'Failed to create workspace' }
    orgId = org.id

    await Promise.all([
      supabase.from('org_members').insert({ org_id: orgId, user_id: user.id, role: 'owner' }),
      supabase.from('subscriptions').insert({ org_id: orgId, plan: 'free', status: 'active' }),
    ])
  }

  revalidatePath('/dashboard')

  const postRedirect = formData.get('post_redirect') as string | null
  const destination  = postRedirect && postRedirect.startsWith('/') ? postRedirect : ROUTES.dashboard
  redirect(destination)
}