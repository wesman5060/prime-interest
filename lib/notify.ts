/**
 * Emails form submissions straight to Marty's inbox.
 *
 * Posts to the `notify-marty` Supabase Edge Function, which sends the email
 * server-side via Resend from the already-verified toolhoard.com sending domain
 * (from "Prime Interest <inquiries@toolhoard.com>", reply-to = the prospect).
 * No new mailbox or domain is set up, and Marty never has to click, confirm, or
 * do anything — mail simply arrives at martyorr@bellsouth.net.
 *
 * The Resend API key lives only in the edge function's server-side secret, so it
 * is never exposed in the browser bundle. The site also stores each submission
 * in Supabase (see lib/supabase.ts) as a backup, so nothing is lost even if an
 * email ever fails.
 */
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://qstnazchzxwphknhoxji.supabase.co";
const ENDPOINT = `${SUPABASE_URL}/functions/v1/notify-marty`;

const CALL_TO_ACTION = "Could not send right now — please call us at 770-945-3241.";

export async function emailToMarty(
  subject: string,
  replyTo: string,
  fields: Record<string, string | undefined>,
): Promise<void> {
  const cleanFields: Record<string, string> = {};
  for (const [label, value] of Object.entries(fields)) {
    if (value != null && value.trim() !== "") cleanFields[label] = value.trim();
  }

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, replyTo, fields: cleanFields }),
    });
  } catch {
    throw new Error(CALL_TO_ACTION);
  }

  if (!res.ok) throw new Error(CALL_TO_ACTION);

  const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!data || data.success !== true) {
    throw new Error(CALL_TO_ACTION);
  }
}
