export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
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

  const { name, email, phone, company, message } = result.data;

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    ``,
    `Message:`,
    message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const [inbound, confirmation] = await Promise.all([
    resend.emails.send({
      from: "Prime Interest Website <onboarding@resend.dev>",
      to: "martyorr@bellsouth.net",
      replyTo: email,
      subject: `New inquiry from ${name}${company ? ` — ${company}` : ""}`,
      text: lines,
    }),
    resend.emails.send({
      from: "Prime Interest Land Development <onboarding@resend.dev>",
      to: email,
      subject: "We received your message — Prime Interest Land Development",
      text: [
        `Hi ${name},`,
        ``,
        `Thank you for reaching out to Prime Interest Land Development. We've received your message and Marty will be in touch shortly.`,
        ``,
        `In the meantime, feel free to call us directly:`,
        `Phone: 770-945-3241`,
        ``,
        `Prime Interest Land Development`,
        `4235 South Lee St, Buford, GA 30518`,
        `www.prime-interest.com`,
      ].join("\n"),
    }),
  ]);

  if (inbound.error) {
    console.error("Resend inbound error:", inbound.error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  if (confirmation.error) {
    // Non-fatal — Marty's copy went through, log and continue.
    console.warn("Resend confirmation error:", confirmation.error);
  }

  return NextResponse.json({ ok: true });
}
