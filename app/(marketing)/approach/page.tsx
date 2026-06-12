import { getProjects, getCompany } from "@/lib/content/source";
import { getPortfolioStats } from "@/lib/content/stats";
import AnimatedSection from "@/components/site/AnimatedSection";
import CountUp from "@/components/site/CountUp";
import Link from "next/link";
import type { Metadata } from "next";
import type { ProjectType } from "@/lib/content/types";
import { PROCESS_STEPS, APPROACH_INTRO } from "@/content/approach";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "How Prime Interest Land Development works — acquiring Georgia land, navigating entitlement and rezoning, and delivering finished developments to leading builders and REITs.",
};

const TYPE_LABELS: Record<ProjectType, string> = {
  "luxury-apartments": "Luxury Apartments",
  "student-housing": "Student Housing",
  "single-family": "Single-Family",
  townhomes: "Townhomes",
  subdivision: "Subdivisions",
  commercial: "Commercial",
  "medical-office": "Medical Office",
  "mixed-use": "Mixed-Use",
  industrial: "Industrial",
  other: "Other",
};

export default async function ApproachPage() {
  const [projects, company] = await Promise.all([getProjects(), getCompany()]);
  const stats = getPortfolioStats();

  // Live count per development type, most common first.
  const typeCounts = new Map<ProjectType, number>();
  for (const p of projects) {
    typeCounts.set(p.type, (typeCounts.get(p.type) ?? 0) + 1);
  }
  const types = Array.from(typeCounts.entries())
    .filter(([t]) => t !== "other")
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen">
      {/* ── Page Header ── */}
      <div className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
            {APPROACH_INTRO.eyebrow}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h1 className="font-display font-bold leading-[0.9] text-white mb-10" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            {APPROACH_INTRO.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? <span style={{ color: "var(--color-gold)" }}>{line}</span> : line}
                <br />
              </span>
            ))}
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
            {APPROACH_INTRO.lead}
          </p>
        </AnimatedSection>
      </div>

      {/* ── The Process ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>The Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-20 leading-none">
              How We Create Value
            </h2>
          </AnimatedSection>

          <div className="space-y-px">
            {PROCESS_STEPS.map((step, i) => (
              <AnimatedSection key={step.number} delay={i * 0.08}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 py-12 border-t" style={{ borderColor: "var(--color-border-custom)" }}>
                  {/* Number */}
                  <div className="md:col-span-2">
                    <span className="font-display text-6xl font-bold leading-none" style={{ color: "rgba(201,169,110,0.2)" }}>
                      {step.number}
                    </span>
                  </div>
                  {/* Title + body */}
                  <div className="md:col-span-6">
                    <h3 className="font-display text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
                      {step.body}
                    </p>
                  </div>
                  {/* Example */}
                  <div className="md:col-span-4">
                    <div className="pl-6 h-full flex items-center" style={{ borderLeft: "2px solid var(--color-gold)" }}>
                      <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-gold-light)" }}>
                        {step.example}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── What We Develop ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Capabilities</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-none">
            What We Develop
          </h2>
          <p className="text-lg max-w-2xl mb-16" style={{ color: "var(--color-text-muted)" }}>
            {stats.residentialDelivered.toLocaleString()}+ residential lots, units, and beds delivered across {stats.projectCount} developments — spanning every major asset class.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px" style={{ background: "var(--color-border-custom)" }}>
          {types.map(([type, count], i) => (
            <AnimatedSection key={type} delay={i * 0.04}>
              <div className="flex flex-col justify-between p-8 h-40" style={{ background: "var(--color-bg)" }}>
                <CountUp value={String(count)} className="font-display text-5xl font-bold leading-none" style={{ color: "var(--color-gold)" }} />
                <span className="text-sm font-medium tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                  {TYPE_LABELS[type]}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── Partners strip ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Delivery</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 leading-tight max-w-3xl">
              We deliver to the nation's leading builders and REITs.
            </h2>
            <p className="text-lg max-w-2xl mb-16" style={{ color: "var(--color-text-muted)" }}>
              {stats.partnerCount} builder and REIT partners have trusted Prime Interest to deliver shovel-ready land and finished developments.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px" style={{ background: "var(--color-border-custom)" }}>
            {company.partners.map((partner, i) => (
              <AnimatedSection key={partner} delay={i * 0.03}>
                <div className="flex items-center justify-center p-8 text-center text-sm font-medium tracking-wide h-24" style={{ background: "var(--color-bg)", color: "var(--color-text-muted)" }}>
                  {partner}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA → Acquisitions ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="py-20 px-12 text-center border" style={{ borderColor: "var(--color-border-gold)" }}>
            <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>The First Step</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-8 leading-none">
              It Starts With the Land
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              Every development on this site began as a parcel of Georgia land. If you own land or represent a seller, we'd like to hear from you.
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
