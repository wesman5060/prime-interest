/**
 * Emails form submissions straight to Marty's inbox.
 *
 * Uses FormSubmit (https://formsubmit.co) — a form-to-email relay that sends
 * from its own servers to an existing address. No new mailbox or domain is set
 * up here; it simply delivers to martyorr@bellsouth.net. On the very first
 * submission FormSubmit emails Marty a one-time confirmation link; once he
 * clicks it, every submission after that arrives in his inbox automatically.
 *
 * The site also stores each submission in Supabase (see lib/supabase.ts) as a
 * backup, so nothing is lost even if an email ever fails.
 */
const ENDPOINT = "https://formsubmit.co/ajax/martyorr@bellsouth.net";

const CALL_TO_ACTION = "Could not send right now — please call us at 770-945-3241.";

export async function emailToMarty(
  subject: string,
  replyTo: string,
  fields: Record<string, string | undefined>,
): Promise<void> {
  const payload: Record<string, string> = {
    _subject: subject,
    _template: "table",
    _captcha: "false",
    _replyto: replyTo,
  };
  for (const [label, value] of Object.entries(fields)) {
    if (value != null && value.trim() !== "") payload[label] = value.trim();
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(CALL_TO_ACTION);
  }

  if (!res.ok) throw new Error(CALL_TO_ACTION);

  const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
  // FormSubmit returns success:"true" (string) on the AJAX endpoint.
  if (data && (data.success === false || data.success === "false")) {
    throw new Error(CALL_TO_ACTION);
  }
}
