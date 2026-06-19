import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pick About Image",
  description: "Internal page — pick a candidate for the About-teaser slot.",
  robots: { index: false, follow: false },
};

/**
 * Temporary picker — 10 candidates for the About-teaser slot, second round.
 * Theme: construction site + professionals reviewing plats / blueprints.
 * Delete this route once a winner is chosen.
 */
const CAPTIONS: { n: number; tag: "STRONG" | "OK" | "WEAK"; desc: string }[] = [
  { n:  1, tag: "STRONG", desc: "Two developers leaning on truck tailgate over a plat, red clay site + pines, golden hour" },
  { n:  2, tag: "STRONG", desc: "Three engineers studying a blueprint on a folding table, red clay site, rolling hills" },
  { n:  3, tag: "WEAK",   desc: "Over-shoulder of plat review — landscape reads more desert than Georgia" },
  { n:  4, tag: "STRONG", desc: "Senior developer pointing across a site, holding a rolled plan, mountains behind" },
  { n:  5, tag: "STRONG", desc: "Two professionals walking on red clay with a tablet, pine forest backdrop" },
  { n:  6, tag: "WEAK",   desc: "Aerial top-down of two figures standing on a plat in a circular clearing" },
  { n:  7, tag: "OK",     desc: "Closeup of hands on a plat, hard hat resting on top (slightly off hand count)" },
  { n:  8, tag: "STRONG", desc: "Two surveyors with tripod + total station on red clay, pine forest" },
  { n:  9, tag: "OK",     desc: "Two pros reviewing plans at dusk on truck hood, headlights glowing (truck text garbled)" },
  { n: 10, tag: "OK",     desc: "Senior man holding a plat against a red clay site (plat text garbled)" },
];

function tagColor(tag: "STRONG" | "OK" | "WEAK") {
  if (tag === "STRONG") return "var(--color-gold)";
  if (tag === "OK") return "var(--color-text-muted)";
  return "var(--color-text-subtle)";
}

export default function PickAbout() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
          About-teaser candidates &middot; round 2 &middot; site / plat review
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-12 leading-none">
          Which image for &ldquo;Our Story&rdquo;?
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {CAPTIONS.map((c) => (
            <div key={c.n} className="flex flex-col gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/about-candidates/${String(c.n).padStart(2, "0")}.jpg`}
                alt={`Candidate ${c.n}: ${c.desc}`}
                className="img-grade w-full block border"
                style={{ aspectRatio: "4 / 5", objectFit: "cover", borderColor: "var(--color-border-custom)" }}
              />
              <div className="flex items-baseline gap-2">
                <span
                  className="font-display text-2xl font-bold tabular-nums leading-none"
                  style={{ color: "var(--color-gold)" }}
                >
                  {String(c.n).padStart(2, "0")}
                </span>
                <span
                  className="text-[9px] tracking-[0.18em] uppercase"
                  style={{ color: tagColor(c.tag) }}
                >
                  {c.tag}
                </span>
              </div>
              <p className="text-xs leading-snug" style={{ color: "var(--color-text-muted)" }}>
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-sm" style={{ color: "var(--color-text-muted)" }}>
          When you decide, tell me the number and I&rsquo;ll wire it in and delete this page.
        </p>
      </div>
    </div>
  );
}
