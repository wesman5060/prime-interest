import { getPortfolioStats } from "@/lib/content/stats";
import AnimatedSection from "@/components/site/AnimatedSection";
import AcquisitionForm from "@/components/site/AcquisitionForm";
import CountUp from "@/components/site/CountUp";
import FAQ from "@/components/site/FAQ";
import type { Metadata } from "next";
import {
  ACQUISITIONS_INTRO,
  BUY_BOX,
  AUDIENCE_TRACKS,
  ACQUISITION_PROCESS,
} from "@/content/acquisitions";
import { LANDOWNER_FAQ } from "@/content/landowner-faq";

export const metadata: Metadata = {
  title: "Acquisitions",
  description:
    "Prime Interest Land Development actively acquires land across the state of Georgia. We work with landowners, brokers, and partners — and handle rezoning and entitlement ourselves.",
};

export default function AcquisitionsPage() {
  const stats = getPortfolioStats();

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-48 -top-40 w-[760px] max-w-none opacity-[0.06]"
        />
      <div className="relative pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
            {ACQUISITIONS_INTRO.eyebrow}
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <h1 className="font-display font-bold leading-[0.9] text-white mb-10" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            {ACQUISITIONS_INTRO.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i === 1 ? <span style={{ color: "var(--color-gold)" }}>{line}</span> : line}
                <br />
              </span>
            ))}
          </h1>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <p className="text-lg md:text-xl max-w-3xl leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
            {ACQUISITIONS_INTRO.lead}
          </p>
        </AnimatedSection>
      </div>
      </div>

      {/* ── Proof band ── */}
      <div style={{ borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { value: `${stats.yearsActive}`, label: "Years Acquiring Land" },
            { value: `${stats.residentialDelivered.toLocaleString()}+`, label: "Homes Delivered" },
            { value: `${stats.countyCount}`, label: "Georgia Counties" },
            { value: `${stats.partnerCount}`, label: "Builder & REIT Partners" },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.08}>
              <div className="flex flex-col items-center py-12 text-center px-4" style={{ borderRight: i < 3 ? "1px solid var(--color-border-custom)" : "none" }}>
                <CountUp value={s.value} className="font-display text-4xl md:text-5xl font-bold leading-none mb-3" style={{ color: "var(--color-gold)" }} />
                <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--color-text-muted)" }}>{s.label}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── Buy box ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>What We Look For</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
            Acquisition Criteria
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-border-custom)" }}>
          {BUY_BOX.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.05}>
              <div className="p-8 h-full" style={{ background: "var(--color-bg)" }}>
                <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>{item.label}</p>
                <p className="text-lg font-medium text-white leading-snug">{item.value}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── Audience tracks ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)", borderBottom: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Who We Work With</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
              Three Ways In
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AUDIENCE_TRACKS.map((track, i) => (
              <AnimatedSection key={track.key} delay={i * 0.1}>
                <div className="p-8 h-full border" style={{ borderColor: "var(--color-border-custom)", background: "var(--color-bg)" }}>
                  <p className="text-[10px] tracking-[0.25em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>{track.label}</p>
                  <h3 className="font-display text-xl font-bold text-white mb-4 leading-snug">{track.heading}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>{track.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
            Simple and Direct
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {ACQUISITION_PROCESS.map((step, i) => (
            <AnimatedSection key={step.number} delay={i * 0.1}>
              <div>
                <span className="font-display text-5xl font-bold leading-none block mb-6" style={{ color: "rgba(201,169,110,0.2)" }}>
                  {step.number}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>{step.body}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="relative overflow-hidden" style={{ borderTop: "1px solid var(--color-border-custom)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-64 top-40 w-[820px] max-w-none opacity-[0.05]"
        />
        <div className="relative py-24 px-8 max-w-5xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
              Questions
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-none">
              Common questions from landowners
            </h2>
            <p className="text-lg max-w-2xl mb-16" style={{ color: "var(--color-text-muted)" }}>
              The conversations we have most often. If yours isn't here, ask it directly — Marty answers every inquiry himself.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <FAQ items={LANDOWNER_FAQ} />
          </AnimatedSection>
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ background: "var(--color-surface)", borderTop: "1px solid var(--color-border-custom)" }}>
        <div className="py-24 px-8 max-w-4xl mx-auto">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>Submit a Property</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-none">
              Start the Conversation
            </h2>
            <p className="text-lg mb-16 max-w-2xl" style={{ color: "var(--color-text-muted)" }}>
              Share a few details and we'll take it from there. Every submission is reviewed directly — confidential, and with no obligation.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <AcquisitionForm />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
