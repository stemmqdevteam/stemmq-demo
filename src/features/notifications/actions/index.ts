'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types'

export async function markNotificationRead(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/notifications')
  return { success: true }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/notifications')
  return { success: true }
}

export async function deleteNotification(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/notifications')
  return { success: true }
}

/**
 * Create a notification — called from other server actions
 * e.g. when a decision is resolved, assumption is resolved, etc.
 */
export async function createNotification({
  userId,
  orgId,
  type,
  source,
  title,
  body,
  actionUrl,
  actionLabel,
}: {
  userId: string
  orgId: string
  type: 'info' | 'success' | 'warning' | 'error'
  source: string
  title: string
  body?: string
  actionUrl?: string
  actionLabel?: string
}): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('notifications').insert({
      user_id:      userId,
      org_id:       orgId,
      type,
      source,
      title,
      body:         body ?? null,
      action_url:   actionUrl ?? null,
      action_label: actionLabel ?? null,
    })
  } catch (err) {
    // Non-critical — log but don't throw
    console.error('[createNotification] failed:', err)
  }
}
