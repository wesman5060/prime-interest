export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["owner", "broker", "investor"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().min(2),
  acreage: z.string().optional(),
  price: z.string().optional(),
  timeline: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Acquisition lead intake.
 *
 * NOTE: This is a dev-only stub. The production site is a static export
 * (`output: "export"`), so this edge route does NOT run on Cloudflare Pages.
 * Before launch, the form will be wired to submit client-side directly to
 * Supabase (insert-only RLS) so leads persist as a queryable pipeline, with an
 * optional Resend email to Marty. Until then this validates and logs.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // TODO: persist to Supabase `leads` table + notify via Resend.
  console.log("Acquisition lead:", result.data);

  return NextResponse.json({ ok: true });
}
