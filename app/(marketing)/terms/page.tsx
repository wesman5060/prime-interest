import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/site/AnimatedSection";
import BreadcrumbsJsonLd from "@/components/site/BreadcrumbsJsonLd";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for the Prime Interest, Inc. website — what the site is, what it is not, and the rules for using it.",
};

const UPDATED = "June 18, 2026";

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: "Purpose of the site",
    body: [
      "This website describes the work, history, and acquisition program of Prime Interest, Inc. The content is informational. Submitting a property through the acquisitions form, or otherwise contacting us, is the beginning of a conversation — not the formation of a contract, listing agreement, brokerage relationship, or offer.",
      "Nothing on this site is a solicitation to buy or sell real estate where such a solicitation would require a license we do not hold. We are a developer, not a brokerage.",
    ],
  },
  {
    heading: "Accuracy of content",
    body: [
      "We do our best to keep the project portfolio, acquisition criteria, and company information accurate and current. Real estate is a moving target — partners change, projects sell, scopes evolve. We may update or correct content at any time without notice.",
      "Photography of completed projects is supplied by our builder and REIT partners where available; on parcels we have not photographed ourselves, we may use neutral type-based imagery to indicate the product category rather than a specific deal.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The Prime Interest name, the wordmark, the globe mark, the LAND DEVELOPMENT tagline, all written content, and the original photography we commission are the property of Prime Interest. The portfolio photography credited to builder and REIT partners belongs to them and is used here with their permission.",
      "You may not copy, reproduce, or republish the content of the site without our permission, except for ordinary fair use (brief quotation with attribution, link sharing on social media, internal reference at a brokerage or capital partner).",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Use the site for lawful purposes only. Do not attempt to disrupt the site's operation, scrape data at a volume that interferes with normal use, submit malicious content through the forms, or impersonate another person or company in correspondence with us.",
    ],
  },
  {
    heading: "Third-party services and links",
    body: [
      "The site uses mapping services from Mapbox, fonts from Google Fonts, and hosting from Cloudflare Pages. The site may link to external websites we do not control (a partner's site, a county records portal, a news article). We are not responsible for the content, availability, or privacy practices of those external sites.",
    ],
  },
  {
    heading: "No warranty",
    body: [
      "The site is provided on an \"as is\" and \"as available\" basis. To the maximum extent permitted by law, we disclaim all warranties, express or implied, including the warranties of merchantability, fitness for a particular purpose, and non-infringement.",
      "We do not guarantee that the site will be uninterrupted, secure, error-free, or that any defect will be corrected.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, Prime Interest and its principals will not be liable for any indirect, incidental, special, consequential, or punitive damages — including lost profits, lost data, or business interruption — arising out of or in connection with your use of, or inability to use, the site.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the State of Georgia, without regard to its conflict of laws principles. The state and federal courts located in Gwinnett County, Georgia will have exclusive jurisdiction over any dispute arising from the site or these terms.",
    ],
  },
  {
    heading: "Updates",
    body: [
      `These terms were last updated on ${UPDATED}. We may revise them from time to time; the revised version is effective when posted. Your continued use of the site after a revision constitutes acceptance of the updated terms.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbsJsonLd items={[{ name: "Terms", path: "/terms" }]} />
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
              Terms
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1
              className="font-display font-bold leading-[0.9] text-white mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              Terms of use<br />
              <span style={{ color: "var(--color-gold)" }}>for this site.</span>
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
              See also our <Link href="/privacy" className="hover:text-[color:var(--color-gold)] transition-colors">privacy policy</Link>.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
