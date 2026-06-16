import Link from "next/link";
import type { Metadata } from "next";
import AnimatedSection from "@/components/site/AnimatedSection";
import { STORIES } from "@/content/stories";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Long-form case studies on the projects and places Prime Interest has worked over thirty-five years across Georgia.",
};

export default function StoriesIndex() {
  return (
    <div className="min-h-screen">
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
              Stories
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1
              className="font-display font-bold leading-[0.9] text-white mb-10"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              The work behind
              <br />
              <span style={{ color: "var(--color-gold)" }}>the portfolio.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p
              className="text-lg md:text-xl max-w-3xl leading-relaxed"
              style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}
            >
              Long-form case studies on the projects and places Prime Interest has worked over the years — context that a project tile can&rsquo;t carry on its own.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--color-border-custom)",
          borderBottom: "1px solid var(--color-border-custom)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {STORIES.map((story, i) => (
            <AnimatedSection key={story.slug} delay={i * 0.05}>
              <Link
                href={`/stories/${story.slug}`}
                className="group block px-8 py-14 md:py-20 border-b last:border-b-0 transition-colors"
                style={{ borderColor: "var(--color-border-custom)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                  <span
                    className="font-display text-[10px] tracking-[0.3em] uppercase md:col-span-2 tabular-nums"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {String(i + 1).padStart(2, "0")} · {story.eyebrow.split("·")[0].trim()}
                  </span>
                  <div className="md:col-span-7">
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight transition-colors group-hover:text-[color:var(--color-gold)]">
                      {story.title}
                    </h2>
                    <p className="text-base md:text-lg max-w-2xl" style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
                      {story.dek}
                    </p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <span
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-medium"
                      style={{ color: "var(--color-gold)" }}
                    >
                      Read the story
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
