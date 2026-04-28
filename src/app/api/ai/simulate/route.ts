import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/ai/simulate
 *
 * The simulation engine. Takes a decision context + scenario variables
 * and returns a structured analysis of likely outcomes.
 *
 * Three simulation types:
 *   assumption_flip      — What if this assumption was wrong?
 *   alternative_decision — What if we had chosen differently?
 *   risk_scenario        — What if external conditions change?
 *
 * The AI grounds its analysis in the org's actual historical data:
 * assumption accuracy rate, outcome deviation patterns, DQS scores.
 * This makes results meaningful rather than generic.
 */

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI not configured.' }, { status: 503 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // Simulations require Pro
    const { data: membership } = await supabase
      .from('org_members').select('org_id').eq('user_id', user.id).limit(1).maybeSingle()
    if (!membership) return NextResponse.json({ error: 'No organization' }, { status: 403 })

    const { data: sub } = await supabase
      .from('subscriptions').select('plan').eq('org_id', membership.org_id).single()

    if (process.env.NODE_ENV === 'production' && sub?.plan === 'free') {
      return NextResponse.json({ error: 'Simulations require the Pro plan.' }, { status: 403 })
    }

    const body = await request.json()
    const { type, decision, variables, orgContext } = body

    if (!type || !decision) {
      return NextResponse.json({ error: 'type and decision are required' }, { status: 400 })
    }

    // Build type-specific prompt
    const typePrompts: Record<string, string> = {
      assumption_flip: `You are analyzing what happens if a KEY ASSUMPTION in a business decision turns out to be WRONG.`,
      alternative_decision: `You are analyzing what would have happened if a DIFFERENT DECISION had been made.`,
      risk_scenario: `You are stress-testing a business decision against CHANGED EXTERNAL CONDITIONS.`,
    }

    const prompt = `${typePrompts[type] ?? typePrompts.assumption_flip}

DECISION BEING ANALYZED:
- Title: ${decision.title}
- Intent: ${decision.intent ?? 'Not specified'}
- Description: ${decision.description ?? 'Not provided'}
- Current status: ${decision.status ?? 'active'}
- Quality score: ${decision.quality_score ?? 'Not scored'}
- Existing assumptions: ${JSON.stringify(decision.assumptions?.map((a: { content: string; status: string }) => ({ content: a.content, status: a.status })) ?? [])}
- Expected outcomes: ${JSON.stringify(decision.expected_outcomes ?? [])}

SIMULATION VARIABLES (what we're testing):
${variables.map((v: { label: string; value: string | number | boolean; description: string }) => `- ${v.label}: ${v.value} (${v.description})`).join('\n')}

ORG HISTORICAL CONTEXT:
- Assumption accuracy rate: ${orgContext?.accuracy_rate ?? 'Unknown'}%
- Average quality score: ${orgContext?.avg_quality_score ?? 'Unknown'}
- Total resolved decisions: ${orgContext?.resolved_count ?? 0}
- Common failure patterns: ${orgContext?.failure_patterns ?? 'None identified'}

Based on this analysis, provide a realistic assessment. Be specific and data-driven, not generic.

Return ONLY valid JSON in this exact structure, no markdown, no code fences:
{
  "confidence": <integer 0-100 representing confidence in this simulation>,
  "impact_score": <integer -100 to +100, negative means bad outcome, positive means good>,
  "key_findings": [<3-5 specific findings about this scenario>],
  "risk_factors": [<2-4 specific risks that emerge from this scenario>],
  "opportunities": [<1-3 opportunities this scenario might reveal>],
  "recommendation": "<one clear, actionable recommendation based on this simulation>",
  "assumption_delta": {
    "<assumption content summarized>": "<predicted outcome if this scenario played out>"
  }
}`

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const modelsToTry = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-pro-latest']

    let resultText = ''

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        })
        const result = await model.generateContent(prompt)
        resultText   = result.response.text().trim()
        if (resultText) break
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes('429') || msg.includes('404')) {
          await new Promise((r) => setTimeout(r, 1500))
          continue
        }
        break
      }
    }

    if (!resultText) {
      return NextResponse.json({ error: 'AI service busy. Try again in 30 seconds.' }, { status: 429 })
    }

    // Parse result
    let simulationResult
    try {
      const clean = resultText
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim()
      simulationResult = JSON.parse(clean)
    } catch {
      return NextResponse.json({ error: 'Could not parse AI response. Try again.' }, { status: 422 })
    }

    // Validate required fields
    if (
      typeof simulationResult.confidence !== 'number' ||
      typeof simulationResult.impact_score !== 'number' ||
      !Array.isArray(simulationResult.key_findings)
    ) {
      return NextResponse.json({ error: 'Invalid AI response structure. Try again.' }, { status: 422 })
    }

    return NextResponse.json({ result: simulationResult })
  } catch (err) {
    console.error('[ai/simulate] error:', err)
    return NextResponse.json({ error: 'Simulation failed. Please try again.' }, { status: 500 })
  }
}
