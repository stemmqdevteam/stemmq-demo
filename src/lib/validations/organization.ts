import { z } from 'zod'

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(80, 'Organization name must be under 80 characters'),
  industry: z.string().max(60).optional(),
  size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  stage: z.enum(['idea', 'mvp', 'growth', 'scale', 'enterprise']).optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
})

export const updateOrganizationSchema = createOrganizationSchema.partial()

export const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
})

export const onboardingSchema = z.object({
  org_name:         z.string().min(2).max(80),
  industry:         z.string().optional(),
  // Accept both old numeric format and new wizard labels
  size:             z.string().optional(),
  stage:            z.string().optional(),
  strategy_focus:   z.string().optional(),
  decision_culture: z.string().optional(),
  risk_profile:     z.enum(['conservative', 'moderate', 'aggressive']).default('moderate'),
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>