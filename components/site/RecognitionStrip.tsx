import AnimatedSection from "@/components/site/AnimatedSection";
import { RANKINGS, FEATURED_AWARD } from "@/content/recognition";

/**
 * Compact homepage recognition strip — the rankings + the featured award,
 * placed between the About teaser and the partners marquee. Quiet but
 * confident: the proof points that justify everything else on the page.
 */
export default function RecognitionStrip() {
  return (
    <section
      className="py-28 border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--color-surface)" }}
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Eyebrow + headline */}
        <div className="max-w-3xl mb-16">
          <AnimatedSection>
            <p className="text-[10px] tracking-[0.45em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
              Recognition
            </p>
            <h2
              className="font-display font-bold text-white leading-[0.95] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
            >
              Among Georgia's leading commercial developers.
            </h2>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Rankings */}
          <div className="lg:col-span-7">
            <AnimatedSection delay={0.1} direction="left">
              <p className="text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-text-subtle)" }}>
                Regional Rankings · Commercial Real Estate Developers
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: "var(--color-border-custom)" }}>
                {RANKINGS.map((r) => (
                  <div
                    key={r.year}
                    className="flex flex-col items-center justify-center py-8 px-3 text-center"
                    style={{ background: "var(--color-surface)" }}
                  >
                    <p className="font-display text-5xl font-bold leading-none mb-2" style={{ color: "var(--color-gold)" }}>
                      {r.rank}
                    </p>
                    <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--color-text-muted)" }}>
                      {r.year}
                    </p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Featured Award */}
          <div className="lg:col-span-5">
            <AnimatedSection delay={0.2} direction="right">
              <div
                className="h-full flex flex-col justify-between p-8 lg:p-10"
                style={{ border: "1px solid var(--color-border-gold)", background: "var(--color-gold-dim)" }}
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 shrink-0 flex items-center justify-center"
                      style={{ border: "1.5px solid var(--color-gold)" }}
                    >
                      <span className="text-xl" style={{ color: "var(--color-gold)" }}>★</span>
                    </div>
                    <p className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--color-gold)" }}>
                      {FEATURED_AWARD.year} Award
                    </p>
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-3">
                    {FEATURED_AWARD.title}
                  </p>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {FEATURED_AWARD.category}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
