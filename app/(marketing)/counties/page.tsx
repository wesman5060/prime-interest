import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/site/AnimatedSection";
import BreadcrumbsJsonLd from "@/components/site/BreadcrumbsJsonLd";
import CountUp from "@/components/site/CountUp";
import { COUNTIES } from "@/content/counties";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Prime Interest has developed across ten Georgia counties — from Whitfield in the northwest to Liberty on the coast. Each county page surfaces the portfolio for that market.",
};

interface CountyRow {
  slug: string;
  name: string;
  seat: string;
  descriptor: string;
  count: number;
  homes: number;
}

function buildRows(): CountyRow[] {
  return COUNTIES.map((c) => {
    const inCounty = projects.filter((p) => p.county === c.name);
    const homes = inCounty.reduce(
      (sum, p) => sum + (p.lots ?? 0) + (p.units ?? 0) + (p.beds ?? 0),
      0,
    );
    return {
      slug: c.slug,
      name: c.name,
      seat: c.seat,
      descriptor: c.descriptor,
      count: inCounty.length,
      homes,
    };
  })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);
}

export default function CountiesIndexPage() {
  const rows = buildRows();
  const totalCounties = rows.length;

  return (
    <div className="min-h-screen">
      <BreadcrumbsJsonLd items={[{ name: "Markets", path: "/counties" }]} />
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
              Markets
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h1
              className="font-display font-bold leading-[0.9] text-white mb-10"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              Ten Georgia<br />
              <span style={{ color: "var(--color-gold)" }}>counties.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p
              className="text-lg md:text-xl max-w-3xl leading-relaxed"
              style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}
            >
              Marty has worked land in {totalCounties} Georgia counties over thirty-five years &mdash;
              from Whitfield in the northwest to Liberty on the coast. The portfolio for
              each market is below.
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
          {rows.map((row, i) => (
            <AnimatedSection key={row.slug} delay={i * 0.04}>
              <Link
                href={`/counties/${row.slug}`}
                className="group block px-8 py-12 md:py-14 border-b last:border-b-0 transition-colors"
                style={{ borderColor: "var(--color-border-custom)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
                  <span
                    className="font-display text-[10px] tracking-[0.3em] uppercase md:col-span-2 tabular-nums"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {String(i + 1).padStart(2, "0")} &middot; {row.seat}
                  </span>
                  <div className="md:col-span-7">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-tight transition-colors group-hover:text-[color:var(--color-gold)]">
                      {row.name} County
                    </h2>
                    <p
                      className="text-base max-w-2xl"
                      style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}
                    >
                      {row.descriptor}
                    </p>
                  </div>
                  <div className="md:col-span-3 md:text-right flex md:block items-baseline gap-6">
                    <div>
                      <CountUp
                        value={`${row.count}`}
                        className="font-display text-3xl md:text-4xl font-bold leading-none tabular-nums block"
                        style={{ color: "var(--color-gold)" }}
                      />
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase mt-1 block"
                        style={{ color: "var(--color-text-subtle)" }}
                      >
                        {row.count === 1 ? "project" : "projects"}
                      </span>
                    </div>
                    {row.homes > 0 && (
                      <div className="mt-0 md:mt-3">
                        <span
                          className="text-[10px] tracking-[0.2em] uppercase tabular-nums"
                          style={{ color: "var(--color-text-subtle)" }}
                        >
                          {row.homes.toLocaleString()}+ homes
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -left-48 -bottom-40 w-[760px] max-w-none opacity-[0.05]"
        />
        <div className="relative py-20 px-8 max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
              Don&rsquo;t see your county?
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              We buy land anywhere in Georgia.
            </h2>
            <p className="text-base mb-10 max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              Our portfolio is concentrated in metro Atlanta and North Georgia, but our buy
              box is the entire state. If you have land for sale anywhere in Georgia, we want
              to hear about it.
            </p>
            <Link
              href="/acquisitions"
              className="gold-sheen inline-flex items-center gap-3 px-10 py-4 text-[11px] tracking-[0.25em] uppercase font-medium"
              style={{ background: "var(--color-gold)", color: "#0a0a0a" }}
            >
              Submit a Property <span aria-hidden>&rarr;</span>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
