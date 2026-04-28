import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { OrgSettingsForm } from '@/features/organizations/components/org-settings-form'
import { ROUTES } from '@/constants'

export const metadata: Metadata = { title: 'Workspace Settings · StemmQ' }

export default async function OrganizationSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.login)

  const { data: membership } = await supabase
    .from('org_members')
    .select('org_id, role, organizations(*)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  if (!membership) redirect(ROUTES.login)

  const orgRaw = membership.organizations
  const org    = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw

  if (!org) redirect(ROUTES.dashboard)

  const isAdmin = ['owner', 'admin'].includes(membership.role)

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Workspace settings</h1>
        <p className="text-sm text-surface-500">
          Update your organisation profile. These settings personalise AI suggestions
          and simulations for your entire team.
        </p>
        {!isAdmin && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
            <span>Only admins can edit workspace settings.</span>
          </div>
        )}
      </div>

      {isAdmin ? (
        <OrgSettingsForm org={org} isAdmin={isAdmin} />
      ) : (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-800">
            <p className="text-sm font-medium mb-1">Organisation name</p>
            <p className="text-surface-500 text-sm">{org.name}</p>
          </div>
          <div className="p-5 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-800">
            <p className="text-sm font-medium mb-1">Industry</p>
            <p className="text-surface-500 text-sm">{org.config?.industry ?? 'Not set'}</p>
          </div>
        </div>
      )}
    </div>
  )
}