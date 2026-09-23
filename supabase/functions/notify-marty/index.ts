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
//
// Request flags (both optional):
//   test:    true -> send both emails to TEST_INBOX with a [TEST] subject prefix
//   preview: true -> send nothing; return both rendered emails as JSON

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MARTY = 'martyorr@bellsouth.net'
const TEST_INBOX = 'wesorr96@gmail.com'
const FROM_TO_MARTY = 'Prime Interest Website <inquiries@toolhoard.com>'
const FROM_TO_SENDER = 'Prime Interest, Inc. <inquiries@toolhoard.com>'

const SITE = 'https://primeinterestinc.com'
// 822x216, shown at 274x72. ?v= is the first 10 hex chars of the file's
// SHA-256: change the file -> change the value. Cloudflare caches images for a
// week per URL, so NEVER request a new ?v= before the site deploy has finished —
// the first fetch gets cached, stale copy included (happened 2026-09-23).
const LOGO = `${SITE}/images/email/logo-email.png?v=925bdbdfad`
const OFFICE_PHONE = '770-945-3241'
const OFFICE_TEL = 'tel:+17709453241'
const ADDRESS = '4235 South Lee St · Buford, GA 30518'

// Brand palette — matches the site (globals.css) on a light reading surface.
const GOLD = '#C9A96E'
const GOLD_LIGHT = '#E8C98A'
const INK = '#15130F'
const BODY = '#3A352D'
const MUTED = '#8A8378'
const RULE = '#E7E0D3'
const PAPER = '#FFFFFF'
const CANVAS = '#F2EEE7'
const TINT = '#FAF7F1'
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

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

const ROLE_LABELS: Record<string, string> = {
  owner: 'Landowner',
  broker: 'Broker',
  investor: 'Investor / Partner',
}

type Fields = Record<string, string>
interface Rendered {
  subject: string
  html: string
  text: string
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escMultiline(s: string): string {
  return esc(s).replace(/\r?\n/g, '<br>')
}

function clean(fields: Fields): Fields {
  const out: Fields = {}
  for (const [k, v] of Object.entries(fields)) {
    if (v != null && String(v).trim() !== '') out[k] = String(v).trim()
  }
  return out
}

function firstName(name?: string): string {
  return String(name || '').trim().split(/\s+/)[0] || ''
}

function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `tel:+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`
  return `tel:${digits}`
}

function looksLikeSalesPitch(fields: Fields): boolean {
  const text = Object.values(fields).join(' ')
  return PITCH_MARKERS.some((re) => re.test(text))
}

// ---------------------------------------------------------------------------
// Building blocks. Table-based, inline-styled — the only layout that survives
// Gmail, Outlook, Apple Mail and AT&T/Yahoo webmail (Marty reads on bellsouth).
// ---------------------------------------------------------------------------

function eyebrow(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${SANS};font-size:11px;line-height:1.4;letter-spacing:0.22em;text-transform:uppercase;color:${GOLD};font-weight:600;">${esc(text)}</p>`
}

function heading(text: string): string {
  return `<h1 class="h1" style="margin:0 0 22px;font-family:${SERIF};font-size:30px;line-height:1.2;font-weight:700;color:${INK};">${esc(text)}</h1>`
}

function para(html: string, extra = ''): string {
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};${extra}">${html}</p>`
}

function sectionLabel(text: string): string {
  return `<p style="margin:0 0 12px;font-family:${SANS};font-size:11px;line-height:1.4;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};font-weight:600;">${esc(text)}</p>`
}

function goldButton(label: string, href: string): string {
  return `<td class="btn-cell" align="center" style="background:${GOLD};"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;white-space:nowrap;color:#000000;text-decoration:none;">${esc(label)}</a></td>`
}

function outlineButton(label: string, href: string): string {
  return `<td class="btn-cell" align="center" style="border:1px solid ${GOLD};"><a href="${esc(href)}" style="display:inline-block;padding:13px 24px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;white-space:nowrap;color:#8C6F3E;text-decoration:none;">${esc(label)}</a></td>`
}

// Side by side on desktop; on phones each button becomes a full-width row
// (see .btn-* in the layout's media query) so labels never wrap mid-word.
function buttonRow(cells: string[]): string {
  const spaced = cells
    .map((c, i) => (i === 0 ? c : `<td class="btn-gap" style="width:10px;font-size:0;line-height:0;">&nbsp;</td>${c}`))
    .join('')
  return `<table role="presentation" class="btn-row" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;"><tr>${spaced}</tr></table>`
}

function detailRows(pairs: Array<[string, string]>): string {
  const rows = pairs
    .map(
      ([label, value]) => `
        <tr>
          <td class="stack" valign="top" style="width:32%;padding:12px 16px 12px 0;border-top:1px solid ${RULE};font-family:${SANS};font-size:11px;line-height:1.5;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};font-weight:600;">${esc(label)}</td>
          <td class="stack stack-value" valign="top" style="padding:12px 0;border-top:1px solid ${RULE};font-family:${SANS};font-size:15px;line-height:1.55;color:${INK};">${value}</td>
        </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid ${RULE};">${rows}</table>`
}

function quote(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${TINT};border-left:3px solid ${GOLD};padding:18px 22px;font-family:${SANS};font-size:15px;line-height:1.65;color:${BODY};">${html}</td></tr></table>`
}

function statGrid(stats: Array<[string, string]>): string {
  const cell = ([label, value]: [string, string], rightRule: boolean) => `
    <td class="stack stat" valign="top" width="50%" style="width:50%;padding:18px 20px;${rightRule ? `border-right:1px solid ${RULE};` : ''}">
      <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};font-weight:600;">${esc(label)}</p>
      <p style="margin:0;font-family:${SERIF};font-size:19px;line-height:1.3;color:${INK};font-weight:600;">${value ? escMultiline(value) : `<span style="color:#B9B1A3;font-family:${SANS};font-size:15px;font-weight:400;">Not given</span>`}</p>
    </td>`
  const rows: string[] = []
  for (let i = 0; i < stats.length; i += 2) {
    const a = stats[i]
    const b = stats[i + 1]
    rows.push(
      `<tr>${cell(a, !!b)}${b ? cell(b, false) : '<td class="stack" width="50%"></td>'}</tr>`,
    )
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${TINT};border:1px solid ${RULE};">${rows.join(`<tr><td colspan="2" style="height:1px;line-height:1px;font-size:0;background:${RULE};">&nbsp;</td></tr>`)}</table>`
}

function layout(opts: { preheader: string; body: string; footerNote: string }): string {
  // Invisible preheader padding keeps inbox previews from pulling in body text.
  const filler = '&#8199;&#65279;&#847;'.repeat(60)
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>Prime Interest, Inc.</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; background:${CANVAS}; -webkit-text-size-adjust:100%; }
  a { color:${GOLD}; }
  @media screen and (max-width:620px) {
    .outer { padding:16px 0 !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
    .body-pad { padding-top:34px !important; padding-bottom:32px !important; }
    .h1 { font-size:26px !important; }
    .stack { display:block !important; width:100% !important; box-sizing:border-box; }
    .stack-value { border-top:0 !important; padding-top:0 !important; }
    .stat { border-right:0 !important; }
    .btn-row { width:100% !important; }
    .btn-cell { display:block !important; width:100% !important; box-sizing:border-box; margin:0 0 10px !important; }
    .btn-cell a { display:block !important; }
    .btn-gap { display:none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${CANVAS};">${esc(opts.preheader)}${filler}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS};">
  <tr>
    <td class="outer" align="center" style="padding:36px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td align="center" style="background:#000000;padding:32px 24px 28px;">
            <a href="${SITE}" style="text-decoration:none;"><img src="${LOGO}" width="274" height="72" alt="Prime Interest, Inc. &#8212; Land Development" style="display:block;border:0;outline:none;width:274px;max-width:100%;height:auto;color:${GOLD_LIGHT};font-family:${SERIF};font-size:22px;"></a>
          </td>
        </tr>
        <tr><td style="background:${GOLD};height:2px;line-height:2px;font-size:0;">&nbsp;</td></tr>
        <tr>
          <td class="px body-pad" style="background:${PAPER};padding:46px 48px 42px;">
            ${opts.body}
          </td>
        </tr>
        <tr>
          <td class="px" style="background:#0A0A0A;padding:28px 48px 30px;">
            <p style="margin:0 0 2px;font-family:${SERIF};font-size:16px;line-height:1.3;color:${GOLD_LIGHT};font-weight:600;">Prime Interest, Inc.</p>
            <p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.5;color:${GOLD};">Georgia land development since 1990</p>
            <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.8;color:#A29A8B;">${ADDRESS}<br><a href="${OFFICE_TEL}" style="color:#A29A8B;text-decoration:none;">${OFFICE_PHONE}</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<a href="${SITE}" style="color:${GOLD};text-decoration:none;">primeinterestinc.com</a></p>
          </td>
        </tr>
        <tr>
          <td align="center" class="px" style="padding:20px 24px 0;font-family:${SANS};font-size:11px;line-height:1.6;color:${MUTED};">${opts.footerNote}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// The two emails
// ---------------------------------------------------------------------------

function renderForMarty(fields: Fields, fallbackSubject: string): Rendered {
  const isProperty = 'Role' in fields || 'Location' in fields
  const name = fields.Name || 'Someone'
  const first = firstName(fields.Name) || 'them'
  const role = fields.Role ? ROLE_LABELS[fields.Role.toLowerCase()] || fields.Role : ''
  const email = fields.Email || ''
  const phone = fields.Phone || ''
  const when = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const who = [role, fields.Company].filter(Boolean).join(' · ')
  const replyHref = `mailto:${email}?subject=${encodeURIComponent('Re: your inquiry — Prime Interest, Inc.')}`

  const buttons: string[] = []
  if (email) buttons.push(goldButton(`Reply to ${first}`, replyHref))
  if (phone) buttons.push(outlineButton(`Call ${phone}`, telHref(phone)))

  const contactPairs: Array<[string, string]> = []
  if (email) contactPairs.push(['Email', `<a href="mailto:${esc(email)}" style="color:${INK};text-decoration:underline;text-decoration-color:${GOLD};">${esc(email)}</a>`])
  if (phone) contactPairs.push(['Phone', `<a href="${telHref(phone)}" style="color:${INK};text-decoration:none;">${esc(phone)}</a>`])
  if (fields.Company) contactPairs.push(['Company', esc(fields.Company)])
  if (fields['How they found us']) contactPairs.push(['Found us via', esc(fields['How they found us'])])

  const message = fields.Notes || fields.Message || ''

  let body = eyebrow(isProperty ? 'New land inquiry' : 'New website inquiry')
  body += heading(name)
  if (who) body += para(esc(who), `margin-top:-12px;color:${MUTED};`)
  if (buttons.length) body += buttonRow(buttons)

  if (isProperty) {
    body += `<div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>`
    body += sectionLabel('The property')
    body += statGrid([
      ['Location', fields.Location || ''],
      ['Acreage', fields.Acreage || ''],
      ['Asking price', fields.Price || ''],
      ['Timeline', fields.Timeline || ''],
    ])
  }

  if (message) {
    body += `<div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>`
    body += sectionLabel(isProperty ? 'Their notes' : 'Their message')
    body += quote(escMultiline(message))
  }

  if (contactPairs.length) {
    body += `<div style="height:30px;line-height:30px;font-size:0;">&nbsp;</div>`
    body += sectionLabel('Contact')
    body += detailRows(contactPairs)
  }

  const html = layout({
    preheader: isProperty
      ? `${name}${role ? ` (${role})` : ''} · ${fields.Location || 'property'}${fields.Acreage ? ` · ${fields.Acreage}` : ''}`
      : `${name}${fields.Company ? ` · ${fields.Company}` : ''} sent a message through the website`,
    body,
    footerNote: `Submitted ${esc(when)} ET through primeinterestinc.com${email ? ` &middot; Reply to this email to answer ${esc(first)} directly.` : '.'}`,
  })

  const textLines = [
    isProperty ? 'NEW LAND INQUIRY' : 'NEW WEBSITE INQUIRY',
    '',
    name + (who ? ` — ${who}` : ''),
    email ? `Email: ${email}` : null,
    phone ? `Phone: ${phone}` : null,
    fields['How they found us'] ? `Found us via: ${fields['How they found us']}` : null,
    '',
    ...(isProperty
      ? [
          `Location: ${fields.Location || 'Not given'}`,
          `Acreage: ${fields.Acreage || 'Not given'}`,
          `Asking price: ${fields.Price || 'Not given'}`,
          `Timeline: ${fields.Timeline || 'Not given'}`,
          '',
        ]
      : []),
    message ? `${isProperty ? 'Notes' : 'Message'}:\n${message}\n` : null,
    `Submitted ${when} ET through primeinterestinc.com. Reply to this email to answer ${first} directly.`,
  ].filter((l): l is string => typeof l === 'string')

  // Property leads get a subject Marty can triage from the inbox list alone.
  const where = [fields.Acreage, fields.Location].filter(Boolean).join(', ')
  const subject = isProperty
    ? `New land inquiry: ${name}${role ? ` (${role})` : ''}${where ? ` — ${where}` : ''}`
    : fallbackSubject

  return { subject, html, text: textLines.join('\n') }
}

function renderConfirmation(fields: Fields): Rendered {
  const isProperty = 'Role' in fields || 'Location' in fields
  const first = firstName(fields.Name)
  const greeting = first ? `Thank you, ${first}.` : 'Thank you.'

  // Promise text is reused verbatim from each form's own success message.
  const lead = isProperty
    ? "We've received the details of your property. We review every submission directly and will be in touch within a few business days."
    : "We've received your message. Marty will be in touch shortly."

  const shown: Array<[string, string]> = []
  const order = ['Role', 'Name', 'Email', 'Phone', 'Company', 'Location', 'Acreage', 'Price', 'Timeline', 'Notes', 'Message']
  const labels: Record<string, string> = { Role: 'You are', Price: 'Asking price', Notes: 'Notes', Message: 'Message' }
  for (const key of order) {
    if (!fields[key]) continue
    const value = key === 'Role' ? ROLE_LABELS[fields[key].toLowerCase()] || fields[key] : fields[key]
    shown.push([labels[key] || key, escMultiline(value)])
  }

  let body = eyebrow(isProperty ? 'Property submission received' : 'Message received')
  body += heading(greeting)
  body += para(esc(lead))
  body += para(
    `If your timing is tight, call the office at <a href="${OFFICE_TEL}" style="color:${INK};font-weight:600;text-decoration:none;white-space:nowrap;">${OFFICE_PHONE}</a>, Monday through Friday, 8:30 to 5.`,
  )
  body += buttonRow([goldButton('Call the office', OFFICE_TEL), outlineButton('See our work', `${SITE}/projects`)])
  body += `<div style="height:34px;line-height:34px;font-size:0;">&nbsp;</div>`
  body += sectionLabel(isProperty ? 'Your submission' : 'Your message')
  body += detailRows(shown)

  const html = layout({
    preheader: isProperty
      ? "We've received your property submission. A copy is inside for your records."
      : "We've received your message. A copy is inside for your records.",
    body,
    footerNote: "You're receiving this because you contacted Prime Interest, Inc. through primeinterestinc.com. Replies to this email go directly to Marty D. Orr.",
  })

  const text = [
    greeting,
    '',
    lead,
    '',
    `If your timing is tight, call the office at ${OFFICE_PHONE}, Monday through Friday, 8:30 to 5.`,
    '',
    isProperty ? 'YOUR SUBMISSION' : 'YOUR MESSAGE',
    ...order
      .filter((k) => fields[k])
      .map((k) => `${labels[k] || k}: ${k === 'Role' ? ROLE_LABELS[fields[k].toLowerCase()] || fields[k] : fields[k]}`),
    '',
    'Prime Interest, Inc.',
    ADDRESS.replace(' · ', ', '),
    `${OFFICE_PHONE} · primeinterestinc.com`,
  ].join('\n')

  return {
    subject: isProperty
      ? 'We received your property submission — Prime Interest, Inc.'
      : 'We received your message — Prime Interest, Inc.',
    html,
    text,
  }
}

// ---------------------------------------------------------------------------

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
    const fields = clean(body.fields || {})
    const test = body.test === true
    const preview = body.preview === true
    const tag = test ? '[TEST] ' : ''

    // Honeypot — silently drop obvious bots without emailing anyone.
    if (body.hp && String(body.hp).trim() !== '') return json({ success: true })

    const validReply = !!replyTo && /.+@.+\..+/.test(replyTo)
    const wantsConfirmation = validReply && !looksLikeSalesPitch(fields)
    const toMarty = renderForMarty(fields, subject)
    const confirmation = wantsConfirmation ? renderConfirmation(fields) : null

    if (preview) {
      return json({ success: true, marty: toMarty, confirmation })
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) return json({ error: 'Email service not configured' }, 500)

    // 1) Marty — the primary job. If this fails, the site shows an error and
    //    tells the visitor to call, so a lead is never silently lost.
    const martyPayload: Record<string, unknown> = {
      from: FROM_TO_MARTY,
      to: [test ? TEST_INBOX : MARTY],
      subject: tag + toMarty.subject,
      html: toMarty.html,
      text: toMarty.text,
    }
    if (validReply) martyPayload.reply_to = replyTo

    let martyId: string | undefined
    try {
      martyId = (await sendEmail(RESEND_API_KEY, martyPayload)).id
    } catch (e) {
      console.error('Resend error (Marty):', e)
      return json({ error: 'Email delivery failed' }, 502)
    }

    // 2) Instant confirmation to the person who wrote in — best-effort only; a
    //    failure here never turns a delivered lead into an error on the site.
    //    Replies to it go straight to Marty.
    let confirmationId: string | undefined
    if (confirmation) {
      try {
        confirmationId = (
          await sendEmail(RESEND_API_KEY, {
            from: FROM_TO_SENDER,
            to: [test ? TEST_INBOX : replyTo],
            reply_to: MARTY,
            subject: tag + confirmation.subject,
            html: confirmation.html,
            text: confirmation.text,
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
