import { getFeaturedProjects, getCompany, getProjects } from "@/lib/content/source";
import { getPortfolioStats } from "@/lib/content/stats";
import Hero from "@/components/site/Hero";
import CountUp from "@/components/site/CountUp";
import RevealImage from "@/components/site/RevealImage";
import ProjectCard from "@/components/site/ProjectCard";
import PartnersSection from "@/components/site/PartnersSection";
import CTABand from "@/components/site/CTABand";
import AnimatedSection from "@/components/site/AnimatedSection";

export default async function HomePage() {
  const [company, featured, allProjects] = await Promise.all([
    getCompany(),
    getFeaturedProjects(),
    getProjects(),
  ]);
  const stats = getPortfolioStats();
  const projectCount = allProjects.length;

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Featured Projects */}
      <section className="py-36">
        <div className="max-w-7xl mx-auto px-8">

          {/* Section header */}
          <div className="flex items-end justify-between mb-20">
            <AnimatedSection>
              <p className="text-[10px] tracking-[0.45em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
                Portfolio
              </p>
              <h2
                className="font-display font-bold text-white leading-[0.9]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                Featured<br />Developments
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.15} direction="right">
              <a
                href="/projects"
                className="hidden md:flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase pb-1 border-b transition-all duration-300 hover:gap-5"
                style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--color-text-muted)" }}
              >
                View All {projectCount} <span style={{ color: "var(--color-gold)" }}>→</span>
              </a>
            </AnimatedSection>
          </div>

          {/* Cards — asymmetric editorial grid: one feature-sized card leads */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                variant={i === 0 ? "feature" : "default"}
                className={i === 0 ? "md:col-span-2" : undefined}
              />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase"
              style={{ color: "var(--color-gold)" }}
            >
              View All {projectCount} Projects →
            </a>
          </div>
        </div>
      </section>

      {/* Acquisitions band — quiet, professional surfacing of the buy-side */}
      <section className="relative overflow-hidden border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--color-surface)" }}>
        {/* Survey contour motif */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-56 w-[700px] max-w-none opacity-[0.06]"
        />
        <div className="relative max-w-7xl mx-auto px-8 py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-8">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.45em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
                  Active Acquisitions
                </p>
                <h2 className="font-display font-bold text-white leading-[1.05] mb-6" style={{ fontSize: "clamp(1.75rem, 3vw, 2.75rem)" }}>
                  We are continuously acquiring land<br className="hidden md:block" /> across the state of Georgia.
                </h2>
                <p className="text-base leading-relaxed max-w-2xl" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                  Raw land, entitled parcels, and assemblages — all sizes considered. We work directly with landowners, brokers, and partners, and handle rezoning and entitlement ourselves.
                </p>
              </AnimatedSection>
            </div>
            <div className="md:col-span-4 md:text-right">
              <AnimatedSection delay={0.15} direction="right">
                <a
                  href="/acquisitions"
                  className="inline-flex items-center gap-3 px-8 py-4 text-[11px] tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:gap-5 border"
                  style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
                >
                  Submit a Property →
                </a>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section
        className="py-36 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* Image side */}
          <AnimatedSection direction="left">
            <div className="relative">
              <RevealImage
                src="/images/about.jpg"
                alt="Prime Interest Land Development"
                className="aspect-[4/5] border border-[rgba(201,169,110,0.12)]"
                imgClassName="w-full h-full object-cover"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
                />
              </RevealImage>
              {/* Floating stat card */}
              <div
                className="absolute -bottom-6 -right-6 px-8 py-6"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid rgba(201,169,110,0.2)",
                }}
              >
                <CountUp value={`${stats.yearsActive}+`} className="font-display text-4xl font-bold mb-1 block" style={{ color: "var(--color-gold)" }} />
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--color-text-muted)" }}>Years of Experience</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Text side */}
          <AnimatedSection direction="right" delay={0.15}>
            <p className="text-[10px] tracking-[0.45em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
              Our Story
            </p>
            <h2
              className="font-display font-bold text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}
            >
              Building Georgia<br />Since 1990
            </h2>

            {/* Pull quote */}
            <blockquote className="mb-8 pl-6" style={{ borderLeft: "2px solid var(--color-gold)" }}>
              <p className="text-lg italic leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                "The value isn't in the land you buy — it's in what you're able to turn it into."
              </p>
              <footer className="mt-3 text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--color-gold)" }}>
                — Marty D. Orr, Founder
              </footer>
            </blockquote>

            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--color-text-muted)", lineHeight: 1.9 }}>
              From his first subdivisions in the 1990s to $65M mixed-use
              developments and student housing for thousands, Marty Orr has
              spent three decades turning raw Georgia land into communities —
              alongside the country's most respected builders and REITs.
            </p>

            <a
              href="/about"
              className="inline-flex items-center gap-3 text-[11px] tracking-[0.25em] uppercase border-b pb-1 transition-all duration-300 hover:gap-5"
              style={{ borderColor: "var(--color-gold)", color: "var(--color-gold)" }}
            >
              Our Full Story →
            </a>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured story */}
      <section
        className="relative overflow-hidden border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--color-bg)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-48 -bottom-40 w-[820px] max-w-none opacity-[0.05]"
        />
        <div className="relative max-w-7xl mx-auto px-8 py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-12">
            <div className="md:col-span-8">
              <AnimatedSection>
                <p className="text-[10px] tracking-[0.45em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
                  Featured Story
                </p>
                <h2
                  className="font-display font-bold text-white leading-[0.95]"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                >
                  Thirty-five years of work<br className="hidden md:block" />{" "}
                  <span style={{ color: "var(--color-gold)" }}>in Marty&rsquo;s hometown.</span>
                </h2>
              </AnimatedSection>
            </div>
            <div className="md:col-span-4 md:text-right">
              <AnimatedSection delay={0.15} direction="right">
                <a
                  href="/stories"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase pb-1 border-b transition-all duration-300 hover:gap-4"
                  style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--color-text-muted)" }}
                >
                  All stories <span style={{ color: "var(--color-gold)" }}>→</span>
                </a>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection delay={0.1}>
            <a
              href="/stories/coolray-field"
              className="group block border p-8 md:p-12 transition-colors"
              style={{ borderColor: "var(--color-border-custom)", background: "var(--color-surface)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-baseline">
                <div className="md:col-span-8">
                  <p
                    className="font-display text-[10px] tracking-[0.3em] uppercase mb-5 tabular-nums"
                    style={{ color: "var(--color-gold)" }}
                  >
                    01 · Story · Buford, Georgia
                  </p>
                  <p
                    className="text-lg md:text-2xl text-white leading-snug mb-6"
                    style={{ fontStyle: "italic" }}
                  >
                    Marty grew up in Buford. He&rsquo;s worked land here ever since.
                  </p>
                  <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                    Mall of Georgia. Coolray Field. The Northside Medical campus. Several Prime Interest projects sit within a few miles of the office Marty opened in 1998 — not because of a corridor play, but because Buford is home.
                  </p>
                </div>
                <div className="md:col-span-4 md:text-right">
                  <span
                    className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase font-medium transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--color-gold)" }}
                  >
                    Read the story <span aria-hidden>→</span>
                  </span>
                </div>
              </div>
            </a>
          </AnimatedSection>
        </div>
      </section>

      <PartnersSection />
      <CTABand />
    </div>
  );
}
