import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pick About Image",
  description: "Internal page — pick a candidate for the About-teaser slot.",
  robots: { index: false, follow: false },
};

/**
 * Temporary picker — 50 real Pexels stock candidates for the About-teaser slot.
 * Theme: construction site + plat / blueprint review. Delete this route once a
 * winner is chosen.
 */
const COUNT = 50;

export default function PickAbout() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
          About-teaser candidates &middot; 50 stock photos &middot; site / plat review
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-none">
          Pick a number, tell me which.
        </h1>
        <p className="text-base mb-12 max-w-2xl" style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
          Every image is a real Pexels stock photo cropped to the 4:5 portrait the teaser uses.
          Click a number to anchor &mdash; the URL updates so you can paste it back to me.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: COUNT }, (_, i) => i + 1).map((n) => {
            const id = `c${String(n).padStart(2, "0")}`;
            return (
              <a
                key={n}
                id={id}
                href={`#${id}`}
                className="flex flex-col gap-2 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/about-candidates/${String(n).padStart(2, "0")}.jpg`}
                  alt={`Candidate ${n}`}
                  className="img-grade w-full block border transition-opacity duration-200 group-hover:opacity-85"
                  style={{ aspectRatio: "4 / 5", objectFit: "cover", borderColor: "var(--color-border-custom)" }}
                  loading="lazy"
                />
                <span
                  className="font-display text-2xl font-bold tabular-nums leading-none"
                  style={{ color: "var(--color-gold)" }}
                >
                  {String(n).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </div>

        <p className="mt-16 text-sm" style={{ color: "var(--color-text-muted)" }}>
          When you decide, tell me the number(s) you want and I&rsquo;ll wire one in and delete this page.
        </p>
      </div>
    </div>
  );
}
