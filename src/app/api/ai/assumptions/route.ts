import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const AI_LIMITS = {
  free:       5,
  pro:        -1,
  enterprise: -1,
}

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI is not configured. Add GEMINI_API_KEY to .env.local' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: membership } = await supabase
      .from('org_members')
      .select('org_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })

    // Check plan
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('org_id', membership.org_id)
      .single()

    const plan  = (sub?.plan ?? 'free') as keyof typeof AI_LIMITS
    const limit = AI_LIMITS[plan] ?? AI_LIMITS.free

    // Check monthly usage for free plan
    if (limit > 0) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action', 'ai_assumption_generated')
        .gte('created_at', startOfMonth.toISOString())

      if ((count ?? 0) >= limit) {
        return NextResponse.json({
          error: `You've used all ${limit} AI generations for this month. Upgrade to Pro for unlimited AI service .`,
          upgrade: true,
        }, { status: 403 })
      }
    }

    // Fetch org config to personalise AI output
    const { data: orgData } = await supabase
      .from('organizations')
      .select('config, name')
      .eq('id', membership.org_id)
      .single()

    const orgConfig = orgData?.config as Record<string, string | null> | null

    const body = await request.json()
    const { title, description, intent, reasoning, existing_assumptions } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Decision title is required' }, { status: 400 })
    }

    const prompt = `You are a decision intelligence assistant helping teams surface hidden assumptions.

Organisation context (use this to make assumptions industry-specific and relevant):
- Organisation: ${orgData?.name ?? 'Unknown'}
- Industry: ${orgConfig?.industry ?? 'Not specified'}
- Company size: ${orgConfig?.size ?? 'Not specified'}
- Stage: ${orgConfig?.stage ?? 'Not specified'}
- Strategic focus: ${orgConfig?.strategy_focus ?? 'Not specified'}
- Decision culture: ${orgConfig?.decision_culture ?? 'Not specified'}
- Risk profile: ${orgConfig?.risk_profile ?? 'moderate'}

Decision being made:
- Title: ${title}
- Intent: ${intent ?? 'Not specified'}
- Description: ${description ?? 'Not provided'}
- Reasoning: ${reasoning ?? 'Not provided'}
${existing_assumptions?.length > 0
  ? `\nExisting assumptions (do NOT repeat these):\n${(existing_assumptions as string[]).map((a, i) => `${i + 1}. ${a}`).join('\n')}`
  : ''}

Generate exactly 5 critical assumptions this decision depends on that are NOT already listed.
Make them specific to the organisation context above — a healthcare company needs different assumptions than a tech startup.
Cover different angles: market/customer, resources/capacity, technical, competitive, regulatory, timing.
Each must be specific, testable, one sentence, starting with a verb: "Users will...", "The team can...", "Regulators will..."

Return ONLY a valid JSON array of 5 strings. No explanation, no markdown, no code fences.`

    const genAI       = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const modelsToTry = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-pro-latest']

    let assumptions: string[] = []
    let succeeded             = false

    for (const modelName of modelsToTry) {
      try {
        const model  = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        })
        const result = await model.generateContent(prompt)
        const text   = result.response.text().trim()
        try {
          const clean  = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim()
          const parsed = JSON.parse(clean)
          assumptions  = (Array.isArray(parsed) ? parsed : Object.values(parsed))
            .filter((a): a is string => typeof a === 'string' && a.trim().length > 5)
            .slice(0, 5)
        } catch {
          assumptions = text
            .split('\n')
            .map((l) => l.replace(/^[\d\-\*\.\s"'\[]+/, '').replace(/["\]\,]+$/, '').trim())
            .filter((l) => l.length > 10)
            .slice(0, 5)
        }

        if (assumptions.length > 0) { succeeded = true; break }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('429') || msg.includes('quota')) {
          await new Promise((r) => setTimeout(r, 1500))
          continue
        }
        if (msg.includes('404') || msg.includes('not found')) continue
        break
      }
    }

    if (!succeeded || assumptions.length === 0) {
      return NextResponse.json(
        { error: 'AI service is busy. Wait 30 seconds and try again.' },
        { status: 429 }
      )
    }

    // Log usage
    await supabase.from('audit_logs').insert({
      user_id:       user.id,
      action:        'ai_assumption_generated',
      resource_type: 'decision',
      after_state:   { count: assumptions.length, plan },
    })

    // Calculate remaining uses for free plan
    let remainingUses: number | undefined
    if (limit > 0) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      const { count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('action', 'ai_assumption_generated')
        .gte('created_at', startOfMonth.toISOString())
      remainingUses = Math.max(0, limit - (count ?? 0))
    }

    return NextResponse.json({ assumptions, remainingUses })

  } catch (err: unknown) {
    console.error('[AI assumptions] unexpected error:', err)
    return NextResponse.json(
      { error: 'Failed to generate assumptions. Please try again.' },
      { status: 500 }
    )
  }
}