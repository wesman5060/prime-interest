// notify-marty — emails Prime Interest form submissions to Marty's inbox, and
// sends the person who submitted an instant "we received it" confirmation.
//
// Sends via Resend from the already-verified toolhoard.com domain (no new
// domain/DNS setup, no action required from Marty). Reuses the RESEND_API_KEY
// secret already configured on this Supabase project. The site also stores each
// submission in Supabase as a backup, so nothing is lost if email ever fails.
//
// This file is the source of truth; it is deployed to the shared ToolHoard
// Supabase project (qstnazchzxwphknhoxji) as `notify-marty` with verify_jwt OFF,
// because the public site posts here without a user session. It is excluded
// from the Next.js type-check (tsconfig "exclude") since it runs on Deno.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MARTY = 'martyorr@bellsouth.net'
const OFFICE_PHONE = '770-945-3241'
const FROM_TO_MARTY = 'Prime Interest <inquiries@toolhoard.com>'
const FROM_TO_SENDER = 'Prime Interest, Inc. <inquiries@toolhoard.com>'

// Test mode: {"test": true} routes BOTH emails to this inbox instead of Marty and
// the submitter, and prefixes the subjects, so a change can be verified end to
// end without putting a fake lead in Marty's inbox.
const TEST_INBOX = 'wesorr96@gmail.com'

// Unsolicited sales pitches (SEO / marketing agencies) still reach Marty, but
// don't get the confirmation — no reason to invite a reply from them.
const PITCH_MARKERS = [
  /\bseo\b/i,
  /search engine/i,
  /digital marketing/i,
  /google'?s (1st|first) page/i,
  /organic listings/i,
  /online visibility/i,
]

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tableRows(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 14px;border-bottom:1px solid #eee;font-weight:600;color:#15130F;vertical-align:top;white-space:nowrap;">${esc(label)}</td><td style="padding:8px 14px;border-bottom:1px solid #eee;color:#3A352D;">${esc(value).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')
}

function looksLikeSalesPitch(fields: Record<string, string>): boolean {
  const text = Object.values(fields).join(' ')
  return PITCH_MARKERS.some((re) => re.test(text))
}

async function sendEmail(key: string, payload: Record<string, unknown>): Promise<{ id?: string }> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json().catch(() => ({}))
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const subject: string = body.subject || 'New inquiry from the Prime Interest website'
    const replyTo: string | undefined = body.replyTo
    const fields: Record<string, string> = body.fields || {}
    const test = body.test === true
    const tag = test ? '[TEST] ' : ''

    // Honeypot — silently drop obvious bots without emailing anyone.
    if (body.hp && String(body.hp).trim() !== '') return json({ success: true })

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) return json({ error: 'Email service not configured' }, 500)

    const validReply = !!replyTo && /.+@.+\..+/.test(replyTo)
    const rows = tableRows(fields)

    // 1) Marty — the primary job. If this fails, the site shows an error and
    //    tells the visitor to call, so a lead is never silently lost.
    const martyHtml = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;">
        <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#B08D57;margin:0 0 6px;">Prime Interest, Inc.</p>
        <h2 style="color:#15130F;font-size:20px;margin:0 0 4px;">New website inquiry</h2>
        <p style="color:#8E8678;font-size:13px;margin:0 0 20px;">Submitted through primeinterestinc.com</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #eee;">${rows}</table>
        ${validReply ? `<p style="color:#8E8678;font-size:12px;margin-top:20px;">Reply directly to this email to respond to ${esc(replyTo!)}.</p>` : ''}
      </div>`
    const toMarty: Record<string, unknown> = {
      from: FROM_TO_MARTY,
      to: [test ? TEST_INBOX : MARTY],
      subject: tag + subject,
      html: martyHtml,
    }
    if (validReply) toMarty.reply_to = replyTo

    let martyId: string | undefined
    try {
      martyId = (await sendEmail(RESEND_API_KEY, toMarty)).id
    } catch (e) {
      console.error('Resend error (Marty):', e)
      return json({ error: 'Email delivery failed' }, 502)
    }

    // 2) Instant confirmation to the person who wrote in — best-effort only; a
    //    failure here never turns a delivered lead into an error on the site.
    //    Replies to it go straight to Marty.
    let confirmationId: string | undefined
    if (validReply && !looksLikeSalesPitch(fields)) {
      try {
        const isProperty = 'Role' in fields || 'Location' in fields
        const first = String(fields.Name || '').trim().split(/\s+/)[0]
        const promise = isProperty
          ? 'We review every submission directly and will be in touch within a few business days.'
          : 'Marty will be in touch shortly.'
        const confirmHtml = `
          <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px 24px;color:#3A352D;font-size:15px;line-height:1.55;">
            <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#B08D57;margin:0 0 18px;">Prime Interest, Inc.</p>
            <p style="margin:0 0 14px;">${first ? `Hi ${esc(first)},` : 'Hello,'}</p>
            <p style="margin:0 0 14px;">Thank you for contacting Prime Interest, Inc. This is a quick note to confirm we received your ${isProperty ? 'property submission' : 'message'}.</p>
            <p style="margin:0 0 14px;">${promise} If it's time-sensitive, call the office at <a href="tel:+1${OFFICE_PHONE.replace(/-/g, '')}" style="color:#B08D57;">${OFFICE_PHONE}</a> (Monday–Friday, 8:30–5).</p>
            <p style="margin:24px 0 8px;color:#8E8678;font-size:13px;">A copy of what you sent, for your records:</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;border-top:1px solid #eee;">${rows}</table>
            <p style="margin:28px 0 0;color:#8E8678;font-size:12px;">Prime Interest, Inc. · 4235 South Lee St, Buford, GA 30518 · <a href="https://primeinterestinc.com" style="color:#8E8678;">primeinterestinc.com</a></p>
          </div>`
        confirmationId = (
          await sendEmail(RESEND_API_KEY, {
            from: FROM_TO_SENDER,
            to: [test ? TEST_INBOX : replyTo],
            reply_to: MARTY,
            subject:
              tag +
              (isProperty
                ? 'We received your property submission — Prime Interest, Inc.'
                : 'We received your message — Prime Interest, Inc.'),
            html: confirmHtml,
          })
        ).id
      } catch (e) {
        console.error('Resend error (confirmation):', e)
      }
    }

    return json({ success: true, id: martyId, confirmation_id: confirmationId ?? null })
  } catch (err) {
    return json({ error: (err as Error).message }, 500)
  }
})
