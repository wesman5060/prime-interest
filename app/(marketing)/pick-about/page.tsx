import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pick About Image",
  description: "Internal page — pick a candidate for the About-teaser slot.",
  robots: { index: false, follow: false },
};

/**
 * Temporary picker — 10 real Pexels stock photos for the About-teaser slot,
 * round 3 (replacing the AI batch). Theme: construction site + plat /
 * blueprint review. Delete this route once a winner is chosen.
 */
const CAPTIONS: { n: number; tag: "STRONG" | "OK" | "WEAK"; desc: string }[] = [
  { n:  1, tag: "STRONG", desc: "Two engineers studying a blueprint at an active construction site, crane behind" },
  { n:  2, tag: "STRONG", desc: "Same shoot as 01, tighter framing of the two engineers + blueprint" },
  { n:  3, tag: "OK",     desc: "Surveyor with theodolite in front of a John Deere bulldozer (from behind)" },
  { n:  4, tag: "STRONG", desc: "Silhouettes of a survey team at golden hour, atmospheric and editorial" },
  { n:  5, tag: "STRONG", desc: "Three surveyors in vests examining a map together in a dense forest" },
  { n:  6, tag: "WEAK",   desc: "Hands pointing at blueprints on a rough workbench (not premium)" },
  { n:  7, tag: "STRONG", desc: "Closeup of a hand pointing at a detailed civil engineering plat" },
  { n:  8, tag: "WEAK",   desc: "Two pros holding blueprint in a concrete loft renovation (wrong context)" },
  { n:  9, tag: "OK",     desc: "Single surveyor with theodolite, golden hour closeup portrait" },
  { n: 10, tag: "OK",     desc: "Surveyor crouching at tripod base, John Deere bulldozer behind" },
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
          About-teaser candidates &middot; round 3 &middot; real Pexels stock
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
