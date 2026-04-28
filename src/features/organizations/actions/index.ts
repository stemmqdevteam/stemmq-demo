'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateOrganizationSchema, inviteMemberSchema } from '@/lib/validations/organization'
import type { ActionResult } from '@/types'

// ── Update organization profile ────────────────────────────
export async function updateOrganization(
  orgId: string,
  formData: FormData
): Promise<ActionResult<{ name: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const raw = {
    name:     formData.get('name') as string,
    industry: formData.get('industry') as string || undefined,
    size:     formData.get('size') as string || undefined,
    stage:    formData.get('stage') as string || undefined,
    website:  formData.get('website') as string || undefined,
  }

  const parsed = updateOrganizationSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { data, error } = await supabase
    .from('organizations')
    .update(parsed.data)
    .eq('id', orgId)
    .select('name')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/organization')
  return { success: true, data }
}

// ── Update org config (risk profile, strategy etc) ────────
export async function updateOrgConfig(
  orgId: string,
  patch: Record<string, unknown>
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Fetch existing config first
  const { data: org } = await supabase
    .from('organizations')
    .select('config')
    .eq('id', orgId)
    .single()

  const { error } = await supabase
    .from('organizations')
    .update({ config: { ...(org?.config ?? {}), ...patch } })
    .eq('id', orgId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings')
  return { success: true }
}

// ── Invite member ──────────────────────────────────────────
export async function inviteMember(
  orgId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const parsed = inviteMemberSchema.safeParse({
    email: formData.get('email'),
    role:  formData.get('role') || 'member',
  })
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, role } = parsed.data

  // Check if already a member
  const { data: existing } = await supabase
    .from('org_members')
    .select('user_id, auth_users:user_id(email)')
    .eq('org_id', orgId)

  // Check for pending invitation
  const { data: pendingInvite } = await supabase
    .from('invitations')
    .select('id')
    .eq('org_id', orgId)
    .eq('email', email)
    .eq('status', 'pending')
    .maybeSingle()

  if (pendingInvite) {
    return { success: false, error: 'An invitation has already been sent to this email.' }
  }

  // Create invitation
  const { error } = await supabase
    .from('invitations')
    .insert({ org_id: orgId, invited_by: user.id, email, role })

  if (error) return { success: false, error: error.message }

  // TODO M4: Send invitation email via Supabase edge function
  revalidatePath('/dashboard/settings/members')
  return { success: true }
}

// ── Revoke invitation ──────────────────────────────────────
export async function revokeInvitation(invitationId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/members')
  return { success: true }
}

// ── Remove member ──────────────────────────────────────────
export async function removeMember(
  orgId: string,
  memberId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Can't remove yourself if you're the only owner
  const { count } = await supabase
    .from('org_members')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('role', 'owner')

  if (memberId === user.id && (count ?? 0) <= 1) {
    return { success: false, error: 'You cannot remove the only owner.' }
  }

  const { error } = await supabase
    .from('org_members')
    .delete()
    .eq('org_id', orgId)
    .eq('user_id', memberId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/members')
  return { success: true }
}

// ── Update member role ─────────────────────────────────────
export async function updateMemberRole(
  orgId: string,
  memberId: string,
  role: 'admin' | 'member' | 'viewer'
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('org_members')
    .update({ role })
    .eq('org_id', orgId)
    .eq('user_id', memberId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/members')
  return { success: true }
}

// ── Update org settings (from settings page) ──────────────

export async function updateOrgSettings({
  orgId,
  name,
  config,
}: {
  orgId:  string
  name:   string
  config: Record<string, unknown>
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Verify admin/owner
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return { success: false, error: 'Only admins can update workspace settings' }
  }

  const { error } = await supabase
    .from('organizations')
    .update({ name: name.trim(), config })
    .eq('id', orgId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/settings/organization')
  revalidatePath('/dashboard')
  return { success: true }
}
