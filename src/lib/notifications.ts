import { createAdminClient } from '@/lib/supabase/server'

/**
 * Push a notification to a user.
 * Uses the admin client (service role) so it works from any server action
 * regardless of RLS policies on the notifications table.
 *
 * Non-throwing — errors are logged but never crash the caller.
 */
export async function pushNotification({
  userId,
  orgId,
  type,
  source,
  title,
  body,
  actionUrl,
  actionLabel,
}: {
  userId:       string
  orgId?:       string
  type:         'info' | 'success' | 'warning' | 'error'
  source:       'decision' | 'assumption' | 'billing' | 'ai' | 'system' | 'onboarding'
  title:        string
  body?:        string
  actionUrl?:   string
  actionLabel?: string
}): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from('notifications').insert({
      user_id:      userId,
      org_id:       orgId ?? null,
      type,
      source,
      title,
      body:         body ?? null,
      action_url:   actionUrl ?? null,
      action_label: actionLabel ?? null,
      read:         false,
    })
  } catch (err) {
    console.error('[pushNotification] failed:', err)
  }
}

/**
 * Push to every member of an org (useful for team events)
 */
export async function pushToOrg({
  orgId,
  excludeUserId,
  ...rest
}: {
  orgId: string
  excludeUserId?: string
  type:         'info' | 'success' | 'warning' | 'error'
  source:       'decision' | 'assumption' | 'billing' | 'ai' | 'system' | 'onboarding'
  title:        string
  body?:        string
  actionUrl?:   string
  actionLabel?: string
}): Promise<void> {
  try {
    const admin = createAdminClient()
    const { data: members } = await admin
      .from('org_members')
      .select('user_id')
      .eq('org_id', orgId)

    if (!members?.length) return

    const notifications = members
      .filter((m: { user_id: string | undefined }) => m.user_id !== excludeUserId)
      .map((m: { user_id: any }) => ({
        user_id:      m.user_id,
        org_id:       orgId,
        type:         rest.type,
        source:       rest.source,
        title:        rest.title,
        body:         rest.body ?? null,
        action_url:   rest.actionUrl ?? null,
        action_label: rest.actionLabel ?? null,
        read:         false,
      }))

    if (notifications.length) {
      await admin.from('notifications').insert(notifications)
    }
  } catch (err) {
    console.error('[pushToOrg] failed:', err)
  }
}
