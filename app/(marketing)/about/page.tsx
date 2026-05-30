import { getCompany } from "@/lib/content/source";
import AnimatedSection from "@/components/site/AnimatedSection";
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
    body: "Marty forms Prime Interest Properties with friend and former teacher Larry Cheek — a board member of Peoples Bank & Trust, the Buford bank that has long backed the firm's developments. Together they deliver single-family and commercial projects across North Georgia.",
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
    heading: "Regional Recognition",
    body: "Prime Interest earns consecutive rankings among the largest commercial real estate developers in the region: #5 (2019), #7 (2020), #12 (2021), #13 (2022). In 2022, the company receives the Washington Contractor Award in the Multi-Family / Mixed-Use / Hospitality category.",
  },
  {
    year: "Today",
    heading: "Back to the Land",
    body: "With lots in short supply across the metro's best markets, Prime Interest has returned to acquiring raw land for single-family communities in upscale, walkable areas like Roswell, Alpharetta, Milton, and Smyrna — while continuing to develop apartments and student housing. Active projects include Alta Dalton, the $65M Holbrook in Sugar Hill, Bellwood Park, and the Northside Medical Office Buildings.",
  },
];

const RANKINGS = [
  { year: "2019", rank: "#5", note: "Commercial RE Developer" },
  { year: "2020", rank: "#7", note: "Commercial RE Developer" },
  { year: "2021", rank: "#12", note: "Commercial RE Developer" },
  { year: "2022", rank: "#13", note: "Commercial RE Developer" },
];

export default async function AboutPage() {
  const company = await getCompany();

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
            Est. 1990 &nbsp;·&nbsp; Buford, Georgia
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
                  "The value isn't in the land you buy — it's in what you're able to turn it into."
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

        <div className="relative">
          {/* vertical rule */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "var(--color-border-custom)" }} />

          <div className="space-y-0">
            {TIMELINE.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 0.07} direction={i % 2 === 0 ? "left" : "right"}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-24 py-12 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                  {/* Year side */}
                  <div className={`flex items-start gap-6 ${i % 2 === 0 ? "md:text-right md:justify-end" : "md:order-2"}`}>
                    <div className={`flex flex-col ${i % 2 === 0 ? "md:items-end" : ""}`}>
                      <span className="font-display text-5xl font-bold leading-none mb-3" style={{ color: "rgba(201,169,110,0.18)" }}>
                        {item.year}
                      </span>
                      <span className="text-sm font-medium tracking-wider text-white">{item.heading}</span>
                    </div>
                  </div>

                  {/* dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 mt-4" style={{ borderColor: "var(--color-gold)", background: "var(--color-bg)" }} />

                  {/* Content side */}
                  <div className={`mt-3 md:mt-0 ${i % 2 === 0 ? "md:order-2" : ""}`}>
                    <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{item.body}</p>
                  </div>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="md:hidden h-px mx-0 my-2" style={{ background: "var(--color-border-custom)" }} />
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Rankings ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Recognition</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
              Regional Rankings
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {RANKINGS.map((r, i) => (
              <AnimatedSection key={r.year} delay={i * 0.08}>
                <div className="p-8 text-center border" style={{ borderColor: "var(--color-border-gold)", background: "var(--color-surface-2)" }}>
                  <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-text-subtle)" }}>{r.year}</p>
                  <p className="font-display text-6xl font-bold leading-none mb-3" style={{ color: "var(--color-gold)" }}>{r.rank}</p>
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--color-text-muted)" }}>{r.note}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Award callout */}
          <AnimatedSection>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 p-10 border" style={{ borderColor: "var(--color-border-gold)", background: "var(--color-gold-dim)" }}>
              <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2" style={{ borderColor: "var(--color-gold)" }}>
                <span className="text-2xl" style={{ color: "var(--color-gold)" }}>★</span>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>2022 Award</p>
                <p className="font-display text-xl font-bold text-white mb-1">Washington Contractor Award</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Multi-Family / Mixed-Use / Hospitality Category
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
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
              Prime Interest actively acquires land across metro Atlanta and North Georgia. If you have a site, we want to hear from you.
            </p>
            <Link
              href="/acquisitions"
              className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:gap-5"
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
