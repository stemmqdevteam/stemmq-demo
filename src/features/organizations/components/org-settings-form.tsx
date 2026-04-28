'use client'

import { useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Building2, Globe, Save } from 'lucide-react'
import { updateOrganization } from '@/features/organizations/actions'
import { updateOrganizationSchema, type UpdateOrganizationInput } from '@/lib/validations/organization'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useOrgStore } from '@/store'
import type { Organization } from '@/types'
import { Input, Select } from '@/components/ui'

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'E-commerce & Retail',
  'Manufacturing', 'Education', 'Media & Entertainment', 'Consulting',
  'Real Estate', 'Other',
].map(i => ({ value: i, label: i }))

const SIZES = [
  { value: '1-10',     label: '1–10 people' },
  { value: '11-50',    label: '11–50 people' },
  { value: '51-200',   label: '51–200 people' },
  { value: '201-1000', label: '201–1,000 people' },
  { value: '1000+',    label: '1,000+ people' },
]

const STAGES = [
  { value: 'idea',       label: 'Idea stage' },
  { value: 'mvp',        label: 'MVP' },
  { value: 'growth',     label: 'Growth' },
  { value: 'scale',      label: 'Scale' },
  { value: 'enterprise', label: 'Enterprise' },
]

interface Props {
  org: Organization
  isAdmin: boolean
}

export function OrgSettingsForm({ org, isAdmin }: Props) {
  const { setOrg, updateConfig } = useOrgStore()
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema as any),
    defaultValues: {
      name:     org.name,
      industry: org.industry ?? '',
      size:     org.size ?? undefined,
      stage:    org.stage ?? undefined,
      website:  org.website ?? '',
    },
  })

  const onSubmit = (values: UpdateOrganizationInput) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([k, v]) => { if (v) formData.set(k, v) })
      const result = await updateOrganization(org.id, formData)

      if (result.success) {
        toast.success('Organization updated')
        const updatedValues = Object.fromEntries(
          Object.entries(values).filter(([_, v]) => v !== undefined)
        )
        setOrg({ ...org, ...updatedValues } as Organization)
      } else {
        toast.error(result.error ?? 'Failed to update')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Organization profile</h3>
              <p className="text-sm text-muted-foreground">Basic information about your workspace.</p>
            </div>
            <Badge variant="default" className="capitalize">
              {org.plan} plan
            </Badge>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Organization name"
            leftIcon={<Building2 className="w-4 h-4" />}
            error={errors.name?.message}
            disabled={!isAdmin}
            {...register('name')}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Select
                  label="Industry"
                  options={INDUSTRIES}
                  placeholder="Select industry"
                  value={field.value ?? ''}
                  onChange={isAdmin ? field.onChange : () => { } } name={''} required={undefined}                />
              )}
            />
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <Select
                  label="Team size"
                  options={SIZES}
                  placeholder="Select size"
                  value={field.value ?? ''}
                  onChange={isAdmin ? field.onChange : () => { } } name={''} required={undefined}                />
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Controller
              name="stage"
              control={control}
              render={({ field }) => (
                <Select
                  label="Company stage"
                  options={STAGES}
                  placeholder="Select stage"
                  value={field.value ?? ''}
                  onChange={isAdmin ? field.onChange : () => { } } name={''} required={undefined}                />
              )}
            />
            <Input
              label="Website"
              placeholder="https://example.com"
              leftIcon={<Globe className="w-4 h-4" />}
              error={errors.website?.message}
              disabled={!isAdmin}
              {...register('website')}
            />
          </div>

          {isAdmin && (
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                loading={isPending}
                disabled={!isDirty}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save changes
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Config card */}
      <Card>
        <CardHeader className="mb-6">
          <div>
            <h3 className="text-lg font-semibold">Decision intelligence config</h3>
            <p className="text-sm text-muted-foreground">Configure how StemmQ analyses your decisions.</p>
          </div>
        </CardHeader>
        <div className="space-y-4">
          {[
            { key: 'risk_profile', label: 'Risk profile', current: org.config?.risk_profile ?? 'moderate',
              options: [
                { value: 'conservative', label: 'Conservative — prefer certainty' },
                { value: 'moderate',     label: 'Balanced — weigh risk and reward' },
                { value: 'aggressive',   label: 'Aggressive — embrace risk for reward' },
              ]
            },
            { key: 'ai_suggestions_enabled', label: 'AI suggestion mode', current: String(org.config?.ai_suggestions_enabled ?? true),
              options: [
                { value: 'true',  label: 'Enabled — AI generates assumptions' },
                { value: 'false', label: 'Disabled — manual assumptions only' },
              ]
            },
          ].map(field => (
            <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-[var(--border)] last:border-0">
              <div>
                <p className="text-sm font-medium">{field.label}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5 capitalize">{field.current.replace(/_/g, ' ')}</p>
              </div>
              {isAdmin && (
                <select
                  className="text-sm rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 min-w-[200px]"
                  defaultValue={field.current}
                  onChange={async e => {
                    const val = field.key === 'ai_suggestions_enabled'
                      ? e.target.value === 'true'
                      : e.target.value
                    updateConfig({ [field.key]: val })
                    const { updateOrgConfig } = await import('@/features/organizations/actions')
                    const result = await updateOrgConfig(org.id, { [field.key]: val })
                    if (result.success) toast.success('Config updated')
                    else toast.error(result.error ?? 'Failed')
                  }}
                >
                  {field.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      {isAdmin && (
        <Card className="border-red-100 ">
          <CardHeader className="mb-4">
            <div>
              <h3 className="text-lg font-semibold">Danger zone</h3>
              <p className="text-sm text-muted-foreground">Irreversible actions. Proceed with caution.</p>
            </div>
          </CardHeader>
          <div className="flex items-center justify-between p-4 rounded-xl border border-red-100  bg-red-50/50 ">
            <div>
              <p className="text-sm font-medium text-red-700 ">Delete organization</p>
              <p className="text-xs text-red-500/70 mt-0.5">Permanently delete this workspace and all data</p>
            </div>
            <Button variant="danger" size="sm" disabled>
              Delete (Enterprise only)
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
