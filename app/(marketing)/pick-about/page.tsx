import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pick About Image",
  description: "Internal page — pick a candidate for the About-teaser slot.",
  robots: { index: false, follow: false },
};

/**
 * Temporary picker page — 10 candidate images for the home page About teaser,
 * shown at the actual 4:5 aspect with their numbers. Delete this route once a
 * winner is chosen.
 */
const CAPTIONS: { n: number; tag: string; desc: string }[] = [
  { n: 1,  tag: "REAL PHOTO", desc: "Drone view of Georgia suburban hills with big puffy clouds" },
  { n: 2,  tag: "REAL PHOTO", desc: "Dramatic dusk through a Georgia development with mountains" },
  { n: 3,  tag: "REAL PHOTO", desc: "Classic cul-de-sac aerial (completed community)" },
  { n: 4,  tag: "AI",         desc: "Golden-hour aerial of a Georgia neighborhood, glowing sunset" },
  { n: 5,  tag: "AI",         desc: "Misty mountain ridges at dawn (Blue Ridge feel)" },
  { n: 6,  tag: "AI",         desc: "Winding road through pine forest with sunbeams" },
  { n: 7,  tag: "AI",         desc: "Top-down red clay with new road snaking through forest" },
  { n: 8,  tag: "AI",         desc: "Long straight country road at sunset, mountains in distance" },
  { n: 9,  tag: "AI",         desc: "Premium completed community at dusk, lit windows glowing" },
  { n: 10, tag: "AI",         desc: "Overhead red clay clearing surrounded by dense pine forest" },
];

export default function PickAbout() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
          About-teaser candidates &middot; pick one
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
                  style={{ color: c.tag === "AI" ? "var(--color-text-subtle)" : "var(--color-text-muted)" }}
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
