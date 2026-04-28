/**
 * StemmQ Email System
 *
 * Uses Supabase's built-in email (or your custom SMTP if configured).
 * For production: configure SMTP in Supabase → Project Settings → Auth → SMTP.
 * Recommended: Resend.com — free tier 3,000 emails/month.
 *
 * This module sends transactional emails using fetch to a simple API route
 * so we don't need to install extra packages for the MVP.
 */

export interface EmailPayload {
  to:      string
  subject: string
  html:    string
}

/** Base URL for internal API calls */
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

/**
 * Send an email via the /api/email route.
 * Non-throwing — logs errors but never crashes the caller.
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  try {
    await fetch(`${BASE}/api/email`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-internal-key': process.env.INTERNAL_API_KEY ?? 'stemmq-internal' },
      body:    JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[sendEmail] failed:', err)
  }
}

/* ── Email Templates ──────────────────────────────────── */

export function welcomeEmail(name: string, orgName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to StemmQ</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#4f46e5;border-radius:10px;width:38px;height:38px;text-align:center;vertical-align:middle;">
                <span style="color:white;font-size:20px;line-height:38px;">⚡</span>
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <span style="font-size:22px;font-weight:700;color:#1c1917;letter-spacing:-0.5px;">StemmQ</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;border:1px solid #e7e5e4;padding:40px 40px 36px;">

          <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:1.5px;">Welcome aboard</p>
          <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;color:#1c1917;line-height:1.2;">
            Hey ${name || 'there'}, welcome to StemmQ! 👋
          </h1>
          <p style="margin:0 0 20px;font-size:15px;color:#78716c;line-height:1.7;">
            Your workspace <strong style="color:#1c1917;">${orgName}</strong> is ready. You're now part of a growing community of decision-makers building organizations that learn and improve with every decision.
          </p>

          <div style="background:#f5f3ff;border-radius:12px;padding:20px 24px;margin-bottom:28px;border-left:4px solid #6366f1;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#4338ca;">What you can do with StemmQ:</p>
            <table cellpadding="0" cellspacing="0" style="width:100%;">
              ${[
                ['🎯', 'Create structured decision records', 'Document every decision with intent, context, and expected outcomes.'],
                ['🧠', 'Track your assumptions', 'List every belief your decision depends on. Mark right or wrong as reality unfolds.'],
                ['✨', 'AI assumption generation', 'Let AI surface blind spots you may have missed before committing.'],
                ['📊', 'Measure decision quality', 'Your DQS score compounds as you track outcomes and improve accuracy.'],
              ].map(([emoji, title, desc]) => `
              <tr>
                <td style="padding:6px 0;vertical-align:top;width:28px;font-size:16px;">${emoji}</td>
                <td style="padding:6px 0 6px 8px;vertical-align:top;">
                  <p style="margin:0;font-size:13px;font-weight:600;color:#1c1917;">${title}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#78716c;">${desc}</p>
                </td>
              </tr>`).join('')}
            </table>
          </div>

          <!-- CTA Button -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="background:#4f46e5;border-radius:12px;">
                <a href="${BASE}/dashboard" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:12px;">
                  Go to my dashboard →
                </a>
              </td>
            </tr>
          </table>

          <!-- Next steps -->
          <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#1c1917;">Your first steps:</p>
          <ol style="margin:0 0 24px;padding-left:20px;color:#78716c;font-size:13px;line-height:1.8;">
            <li>Complete your workspace setup (takes 2 minutes)</li>
            <li>Create your first decision</li>
            <li>Add assumptions and try AI generation</li>
            <li>Invite a teammate to collaborate</li>
          </ol>

          <hr style="border:none;border-top:1px solid #f5f5f4;margin:0 0 20px;">
          <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.6;">
            Questions? Reply to this email or contact us at <a href="mailto:hello@stemmq.com" style="color:#6366f1;">hello@stemmq.com</a>.<br>
            You're receiving this because you created an account at stemmq.com.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:24px;">
          <p style="margin:0;font-size:11px;color:#a8a29e;">
            StemmQ · Decision Intelligence Infrastructure<br>
            <a href="${BASE}/privacy" style="color:#a8a29e;text-decoration:none;">Privacy</a> ·
            <a href="${BASE}/terms"   style="color:#a8a29e;text-decoration:none;">Terms</a> ·
            <a href="mailto:hello@stemmq.com" style="color:#a8a29e;text-decoration:none;">Contact</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function newLoginEmail(name: string, device: string, location: string, time: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New login to StemmQ</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td align="center" style="padding-bottom:24px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:#4f46e5;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
              <span style="color:white;font-size:18px;line-height:36px;">⚡</span>
            </td>
            <td style="padding-left:10px;vertical-align:middle;">
              <span style="font-size:20px;font-weight:700;color:#1c1917;">StemmQ</span>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:16px;border:1px solid #e7e5e4;padding:36px 36px 28px;">
          <div style="background:#fef2f2;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;border:1px solid #fee2e2;">
            <span style="font-size:20px;margin-right:10px;">🔐</span>
            <p style="margin:0;font-size:13px;font-weight:600;color:#991b1b;">Security alert — new login detected</p>
          </div>
          <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#1c1917;">New sign-in to your account</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#78716c;line-height:1.6;">
            Hi ${name || 'there'}, we detected a new login to your StemmQ account.
          </p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            ${[['Device', device], ['Location', location], ['Time', time]].map(([label, val]) => `
            <tr style="border-bottom:1px solid #f5f5f4;">
              <td style="padding:10px 0;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.5px;width:30%;">${label}</td>
              <td style="padding:10px 0;font-size:13px;color:#1c1917;font-weight:500;">${val}</td>
            </tr>`).join('')}
          </table>
          <p style="margin:0 0 20px;font-size:13px;color:#78716c;line-height:1.6;">
            If this was you, no action is needed. If you don't recognize this login, please secure your account immediately.
          </p>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#dc2626;border-radius:10px;">
              <a href="${BASE}/dashboard/settings/security" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">
                Review my sessions →
              </a>
            </td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #f5f5f4;margin:24px 0 16px;">
          <p style="margin:0;font-size:11px;color:#a8a29e;">
            If you need help, contact <a href="mailto:security@stemmq.com" style="color:#6366f1;">security@stemmq.com</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
