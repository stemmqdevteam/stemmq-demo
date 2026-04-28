import { z } from 'zod'
import { LIMITS } from '@/constants'

export const createDecisionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(LIMITS.TITLE_MAX, `Title must be under ${LIMITS.TITLE_MAX} characters`),
  description: z
    .string()
    .max(LIMITS.DESCRIPTION_MAX, `Description must be under ${LIMITS.DESCRIPTION_MAX} characters`)
    .optional(),
  intent: z.enum(['growth', 'efficiency', 'risk', 'experiment', 'other']),
  category: z.string().max(60).optional(),
  reasoning: z.string().max(LIMITS.DESCRIPTION_MAX).optional(),
  time_horizon: z.enum(['days', 'weeks', 'months', 'quarters', 'years']).optional(),
  reversibility: z
    .enum(['easily_reversible', 'reversible', 'difficult', 'irreversible'])
    .optional(),
  financial_exposure: z.number().min(0).optional().nullable(),
  tags: z.array(z.string().max(LIMITS.TAG_LENGTH_MAX)).max(LIMITS.TAGS_MAX).default([]),
  stakeholders: z.array(z.string()).default([]),
  expected_outcomes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1),
        metric: z.string().optional(),
        target_value: z.string().optional(),
        timeframe: z.string().optional(),
      })
    )
    .default([]),
  assumptions: z
    .array(z.string().min(3, 'Assumption must be at least 3 characters'))
    .min(1, 'At least one assumption is required'),
})

export const updateDecisionSchema = createDecisionSchema.partial().extend({
  status: z.enum(['draft', 'active', 'resolved', 'archived']).optional(),
  resolution_notes: z.string().max(LIMITS.DESCRIPTION_MAX).optional(),
})

export const createAssumptionSchema = z.object({
  content: z
    .string()
    .min(3, 'Assumption must be at least 3 characters')
    .max(LIMITS.ASSUMPTION_MAX),
  rationale: z.string().max(LIMITS.DESCRIPTION_MAX).optional(),
  confidence: z.number().min(0).max(100).optional(),
})

export const resolveAssumptionSchema = z.object({
  status: z.enum(['correct', 'incorrect', 'partially_correct']),
  resolution_note: z.string().max(500).optional(),
})

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>
export type UpdateDecisionInput = z.infer<typeof updateDecisionSchema>
export type CreateAssumptionInput = z.infer<typeof createAssumptionSchema>
export type ResolveAssumptionInput = z.infer<typeof resolveAssumptionSchema>
