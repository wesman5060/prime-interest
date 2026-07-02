import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
        404 · Unentitled Territory
      </p>
      <h1
        className="font-display font-bold text-white leading-none mb-6"
        style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
      >
        Undeveloped<br />Land
      </h1>
      <p className="text-lg mb-12 max-w-md" style={{ color: "var(--color-text-muted)" }}>
        There’s nothing built at this address yet. Head back home, or explore
        the many developments we did build.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:gap-5"
          style={{ background: "var(--color-gold)", color: "#000" }}
        >
          Back to Home →
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.3em] uppercase transition-all duration-300"
          style={{ border: "1px solid rgba(201,169,110,0.35)", color: "var(--color-text-muted)" }}
        >
          View Projects
        </Link>
      </div>
    </div>
  );
}
