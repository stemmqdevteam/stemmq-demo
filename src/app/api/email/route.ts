import { NextResponse, type NextRequest } from 'next/server'

/**
 * Internal email sending endpoint.
 * Uses Resend if RESEND_API_KEY is set, otherwise logs to console (dev mode).
 *
 * Protected by x-internal-key header — never expose this publicly.
 */
export async function POST(request: NextRequest) {
  // Internal key check
  const key = request.headers.get('x-internal-key')
  if (key !== (process.env.INTERNAL_API_KEY ?? 'stemmq-internal')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { to, subject, html } = await request.json()

  if (!to || !subject || !html) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // ── Resend (production) ───────────────────────────────
  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    process.env.EMAIL_FROM ?? 'StemmQ <noreply@stemmq.com>',
        to:      [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Resend error:', err)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // ── Dev mode: log to console ──────────────────────────
  console.log(`\n📧 EMAIL (dev mode — add RESEND_API_KEY to send real emails)`)
  console.log(`   To:      ${to}`)
  console.log(`   Subject: ${subject}`)
  console.log(`   (HTML omitted)\n`)

  return NextResponse.json({ success: true, dev: true })
}
