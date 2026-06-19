import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/site/AnimatedSection";
import BreadcrumbsJsonLd from "@/components/site/BreadcrumbsJsonLd";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Prime Interest Land Development handles the information you share through the website — what we collect, how we use it, and how to ask us to delete it.",
};

const UPDATED = "June 18, 2026";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "Who we are",
    body: [
      "Prime Interest Land Development is a Buford, Georgia land development firm operated by Marty D. Orr. This policy covers primeinterestinc.com and any successor domain we operate.",
      "Questions about your data can be sent directly to Marty at martyorr@bellsouth.net, or to our office at 770-945-3241.",
    ],
  },
  {
    heading: "What we collect",
    body: [
      "We collect what you give us. If you submit a property through the acquisitions form, send a message through the contact form, or email us directly, we keep your name, contact details, the property information you shared, and any subsequent correspondence.",
      "We do not use third-party analytics that profile you across the web. Basic visitor data (which pages were viewed, what country the visit came from) may be logged by our hosting provider for security and performance purposes; that data is not connected to your identity.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "Submissions and emails are used to evaluate properties, respond to your inquiry, and follow up if there is a deal to discuss. We do not sell or rent your information. We do not send marketing email — we contact you only about the inquiry you sent us.",
      "If we determine we are not interested in a property, we will tell you. We may keep your information in our records in case the situation changes in the future or in case the property becomes relevant to a partner we are working with.",
    ],
  },
  {
    heading: "Who else sees it",
    body: [
      "Inquiries are reviewed by Marty directly. Other than that, we share information only with: (i) our attorneys, accountants, lenders, title companies, surveyors, engineers, and similar professional advisors when necessary to evaluate or close a transaction, and (ii) any party we are required to share with by law or by court order.",
      "When we work with a builder, REIT, or capital partner on a transaction, we may share property-specific details with them so they can underwrite the deal. We do not share unrelated information.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep records of inquiries and transactions for as long as is useful to our business — generally for several years. Real estate is a long-horizon business, and information about a property you mentioned today may matter again next decade.",
      "You can ask us at any time to delete your information. Send the request to martyorr@bellsouth.net and we will remove what we can within a reasonable time, except where we are required by law or by a tax, audit, or recordkeeping obligation to retain it.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "The site does not currently use marketing or advertising cookies. The hosting platform and any embedded mapping or video services may set strictly necessary cookies to deliver content; these are not used for cross-site tracking.",
    ],
  },
  {
    heading: "Children",
    body: [
      "The site is not directed at children under 13 and we do not knowingly collect information from anyone under 13.",
    ],
  },
  {
    heading: "Updates",
    body: [
      `This policy was last updated on ${UPDATED}. If we change how we handle information in a meaningful way, we will update this page and revise the date above.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbsJsonLd items={[{ name: "Privacy", path: "/privacy" }]} />
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-48 -top-40 w-[760px] max-w-none opacity-[0.05]"
        />
        <div className="relative pt-40 pb-12 px-8 max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
              Privacy
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1
              className="font-display font-bold leading-[0.9] text-white mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              How we handle<br />
              <span style={{ color: "var(--color-gold)" }}>your information.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="text-base" style={{ color: "var(--color-text-subtle)" }}>
              Last updated {UPDATED}.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div
        className="px-8 py-16 max-w-3xl mx-auto"
        style={{ borderTop: "1px solid var(--color-border-custom)" }}
      >
        {SECTIONS.map((s, i) => (
          <AnimatedSection key={s.heading} delay={i * 0.04}>
            <section className="mb-12 last:mb-0">
              <p
                className="text-[10px] tracking-[0.35em] uppercase mb-3 tabular-nums"
                style={{ color: "var(--color-gold)" }}
              >
                § {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-5 leading-tight">
                {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p
                  key={j}
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "var(--color-text-muted)", lineHeight: 1.9 }}
                >
                  {p}
                </p>
              ))}
            </section>
          </AnimatedSection>
        ))}

        <AnimatedSection delay={0.2}>
          <div
            className="mt-16 pt-10 flex flex-col gap-3"
            style={{ borderTop: "1px solid var(--color-border-custom)" }}
          >
            <p className="text-xs tracking-[0.25em] uppercase" style={{ color: "var(--color-gold)" }}>
              Questions
            </p>
            <p className="text-base" style={{ color: "var(--color-text-muted)" }}>
              <a
                href="mailto:martyorr@bellsouth.net"
                className="hover:text-[color:var(--color-gold)] transition-colors"
              >
                martyorr@bellsouth.net
              </a>{" "}
              &middot;{" "}
              <a href="tel:7709453241" className="hover:text-[color:var(--color-gold)] transition-colors">
                770-945-3241
              </a>
            </p>
            <p className="text-sm mt-6" style={{ color: "var(--color-text-subtle)" }}>
              See also our <Link href="/terms" className="hover:text-[color:var(--color-gold)] transition-colors">terms of use</Link>.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
