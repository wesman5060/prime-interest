import { getCompany } from "@/lib/content/source";
import AnimatedSection from "@/components/site/AnimatedSection";
import Timeline from "@/components/site/Timeline";
import BreadcrumbsJsonLd from "@/components/site/BreadcrumbsJsonLd";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "The story of Prime Interest Land Development and founder Marty D. Orr — developing Georgia since 1990.",
};

const TIMELINE = [
  {
    year: "1990",
    heading: "Learning the Land",
    body: "Marty D. Orr enters development under the mentorship of W.T. \"Terry\" Dunahoo — a Barrow County surveyor, developer, and banker — laying miles of roads and utilities across Barrow and Gwinnett Counties and learning the business from the ground up.",
  },
  {
    year: "1990s",
    heading: "Homes Etc.",
    body: "Through the company's homebuilding arm, Marty builds homes on developed lots and sells every one in-house — no agents, no brokers. He partners with Dunahoo in Subdivision Developer's, Inc., capturing the full value chain from raw land to finished home.",
  },
  {
    year: "1998",
    heading: "Prime Interest Founded",
    body: "Marty founds Prime Interest, Inc. and builds its headquarters in Buford, beside a commercial strip center the company developed itself. The firm moves into larger subdivisions, commercial tracts, and ground-up commercial construction.",
  },
  {
    year: "2000s",
    heading: "Prime Interest Properties",
    body: "Marty forms Prime Interest Properties with friend and former teacher Larry Cheek — a board member of Peoples Bank & Trust, the Buford bank that has long backed the firm's developments. Together they deliver single-family and commercial projects across Georgia.",
  },
  {
    year: "2008+",
    heading: "The Pivot",
    body: "When housing collapses, Marty retools the business rather than wait it out — reading the moment correctly and moving into market-rate apartments and university student housing. He partners with national REITs including American Campus Communities, one of the largest student housing operators in the world.",
  },
  {
    year: "2012",
    heading: "Coolray Field",
    body: "Prime Interest secures a contract on 19 acres surrounding Coolray Field, home of the Gwinnett Braves (now Stripers). Co-planned with partners: 500,000+ sq. ft. of retail and dining, plus 800 residential units. Gwinnett County commissioners ultimately reject the revised plans — one of the company's most ambitious near-misses.",
  },
  {
    year: "2019–2022",
    heading: "Scaling Up",
    body: "Prime Interest takes on its largest and most complex work yet — partnering with national builders and REITs on luxury apartments, student housing, and mixed-use developments across metro Atlanta, including the $65M Holbrook in Sugar Hill and the Northside Medical Office Buildings near Coolray Field.",
  },
  {
    year: "Today",
    heading: "Back to the Land",
    body: "With lots in short supply across the metro's best markets, Prime Interest has returned to acquiring raw land for single-family communities in upscale, walkable areas like Roswell, Alpharetta, Milton, and Smyrna — while continuing to develop apartments and student housing. Active projects include Alta Dalton, the $65M Holbrook in Sugar Hill, Bellwood Park, and the Northside Medical Office Buildings.",
  },
];

export default async function AboutPage() {
  const company = await getCompany();

  return (
    <div className="min-h-screen">
      <BreadcrumbsJsonLd items={[{ name: "About", path: "/about" }]} />
      {/* ── Page Header ── */}
      <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
            Buford, Georgia &nbsp;·&nbsp; In the work since 1990
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h1 className="font-display font-bold leading-[0.88] text-white mb-0" style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}>
            Thirty-Five<br />
            <span style={{ color: "var(--color-gold)" }}>Years of</span><br />
            Georgia Land
          </h1>
        </AnimatedSection>
      </div>

      {/* ── Divider line ── */}
      <div className="mx-8 max-w-7xl" style={{ borderTop: "1px solid var(--color-border-custom)" }} />

      {/* ── Company Story ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-4">
            <AnimatedSection>
              <p className="text-xs tracking-[0.3em] uppercase sticky top-32" style={{ color: "var(--color-gold)" }}>
                Our Story
              </p>
            </AnimatedSection>
          </div>
          <div className="md:col-span-8 space-y-8">
            {company.story.map((paragraph, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <p className="text-lg md:text-xl leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {paragraph}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Marty Bio ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4">
              <AnimatedSection>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Leadership</p>
                {/* PLACEHOLDER: low-res photo pulled from the original prime-interest.com — swap when Marty provides a current headshot */}
                <div className="relative mb-8 overflow-hidden" style={{ maxWidth: "256px", border: "1px solid var(--color-border-gold)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/original/marty.jpg"
                    alt="Marty D. Orr, Founder & Principal of Prime Interest Land Development"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 45%)" }} />
                </div>
                <p className="font-display text-4xl font-bold text-white leading-tight mb-3">
                  Marty D. Orr
                </p>
                <p className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--color-text-muted)" }}>
                  Founder &amp; Principal
                </p>
              </AnimatedSection>
            </div>
            <div className="md:col-span-8">
              <AnimatedSection delay={0.1}>
                <blockquote
                  className="text-2xl md:text-3xl font-display font-bold leading-snug mb-12 pl-8"
                  style={{ borderLeft: "3px solid var(--color-gold)", color: "var(--color-gold-light)" }}
                >
                  &ldquo;The value isn&rsquo;t in the land you buy &mdash; it&rsquo;s in what you&rsquo;re able to turn it into.&rdquo;
                </blockquote>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {company.principals[0].bio}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>History</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-20 leading-none">
            Milestones
          </h2>
        </AnimatedSection>

        <Timeline items={TIMELINE} />
      </div>

      {/* ── Partners ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Partnerships</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
            Who We Build With
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px" style={{ background: "var(--color-border-custom)" }}>
          {company.partners.map((partner, i) => (
            <AnimatedSection key={partner} delay={i * 0.04}>
              <div
                className="flex items-center justify-center p-8 text-center text-sm font-medium tracking-wide"
                style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}
              >
                {partner}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="pb-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="py-20 px-12 text-center border" style={{ borderColor: "var(--color-border-gold)" }}>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>Work With Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-none">
              Have Land to Sell?
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              Prime Interest actively acquires land across the state of Georgia. If you have a site, we want to hear from you.
            </p>
            <Link
              href="/acquisitions"
              className="gold-sheen inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:gap-5"
              style={{ background: "var(--color-gold)", color: "#000" }}
            >
              Our Acquisitions Program →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
