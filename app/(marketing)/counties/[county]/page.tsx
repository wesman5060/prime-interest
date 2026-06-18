import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnimatedSection from "@/components/site/AnimatedSection";
import CountUp from "@/components/site/CountUp";
import ProjectCard from "@/components/site/ProjectCard";
import { COUNTIES, getCountyBySlug, type CountyEntry } from "@/content/counties";
import { projects } from "@/content/projects";
import { company } from "@/content/company";

export async function generateStaticParams() {
  return COUNTIES.map((c) => ({ county: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ county: string }>;
}): Promise<Metadata> {
  const { county } = await params;
  const entry = getCountyBySlug(county);
  if (!entry) return {};
  return {
    title: `${entry.name} County`,
    description: `${entry.name} County land development by Prime Interest. ${entry.descriptor}`,
  };
}

function buildCountyStats(entry: CountyEntry) {
  const inCounty = projects.filter((p) => p.county === entry.name);
  const homes = inCounty.reduce(
    (sum, p) => sum + (p.lots ?? 0) + (p.units ?? 0) + (p.beds ?? 0),
    0,
  );
  const acreage = Math.round(
    inCounty.reduce((sum, p) => sum + (p.acreage ?? 0), 0),
  );
  const partners = new Set<string>();
  for (const p of inCounty) {
    if (!p.partner) continue;
    for (const name of p.partner.split(/\s*\/\s*/)) {
      const t = name.trim();
      if (t) partners.add(t);
    }
  }
  const cities = Array.from(new Set(inCounty.map((p) => p.city).filter(Boolean)));
  return { inCounty, homes, acreage, partners: Array.from(partners), cities };
}

function staticMapUrl(entry: CountyEntry, pins: { coords: [number, number] }[]): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;
  const pinStr =
    pins.length === 0
      ? ""
      : pins
          .map((p) => `pin-s+c9a96e(${p.coords[0]},${p.coords[1]})`)
          .join(",") + "/";
  const [lng, lat] = entry.center;
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/${pinStr}${lng},${lat},${entry.zoom},0/1200x500@2x?access_token=${token}`;
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ county: string }>;
}) {
  const { county } = await params;
  const entry = getCountyBySlug(county);
  if (!entry) notFound();

  const { inCounty, homes, acreage, partners, cities } = buildCountyStats(entry);
  if (inCounty.length === 0) notFound();

  const mapUrl = staticMapUrl(
    entry,
    inCounty.filter((p) => p.coordinates).map((p) => ({ coords: p.coordinates })),
  );

  // JSON-LD for the county landing page — Place + BreadcrumbList so search
  // engines understand the geographic scope and the site hierarchy.
  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${entry.name} County, Georgia`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: entry.center[1],
      longitude: entry.center[0],
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "GA",
      addressCountry: "US",
    },
  };
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://prime-interest.com/" },
      { "@type": "ListItem", position: 2, name: "Markets", item: "https://prime-interest.com/counties" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${entry.name} County`,
        item: `https://prime-interest.com/counties/${entry.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Header */}
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/topo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-48 -top-40 w-[760px] max-w-none opacity-[0.06]"
        />
        <div className="relative pt-40 pb-12 px-8 max-w-7xl mx-auto">
          <AnimatedSection>
            <Link
              href="/counties"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase mb-10 transition-colors hover:text-[color:var(--color-gold)]"
              style={{ color: "var(--color-text-subtle)" }}
            >
              <span aria-hidden>&larr;</span> All markets
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={0.05}>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--color-gold)" }}>
              Market &middot; Georgia
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.12}>
            <h1
              className="font-display font-bold leading-[0.9] text-white mb-10"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              {entry.name}<br />
              <span style={{ color: "var(--color-gold)" }}>County.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p
              className="text-lg md:text-xl max-w-3xl leading-relaxed"
              style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}
            >
              {entry.descriptor}
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          borderTop: "1px solid var(--color-border-custom)",
          borderBottom: "1px solid var(--color-border-custom)",
        }}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { value: `${inCounty.length}`, label: inCounty.length === 1 ? "Project" : "Projects" },
            { value: homes > 0 ? `${homes.toLocaleString()}+` : "—", label: "Homes & Lots" },
            { value: acreage > 0 ? `${acreage.toLocaleString()}` : "—", label: "Acres Delivered" },
            { value: `${partners.length}`, label: partners.length === 1 ? "Partner" : "Partners" },
          ].map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.06}>
              <div
                className="flex flex-col items-center py-12 text-center px-4"
                style={{ borderRight: i < 3 ? "1px solid var(--color-border-custom)" : "none" }}
              >
                {s.value === "—" ? (
                  <span
                    className="font-display text-4xl md:text-5xl font-bold leading-none mb-3"
                    style={{ color: "var(--color-gold)" }}
                  >
                    —
                  </span>
                ) : (
                  <CountUp
                    value={s.value}
                    className="font-display text-4xl md:text-5xl font-bold leading-none mb-3"
                    style={{ color: "var(--color-gold)" }}
                  />
                )}
                <span
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {s.label}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Map */}
      {mapUrl && (
        <div
          className="relative"
          style={{ borderBottom: "1px solid var(--color-border-custom)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapUrl}
            alt={`Map of ${entry.name} County, Georgia with Prime Interest project locations`}
            className="block w-full h-[50vh] min-h-[360px] object-cover"
          />
          <div
            className="px-8 py-4 max-w-7xl mx-auto flex items-center justify-between text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "var(--color-text-subtle)" }}
          >
            <span>
              {inCounty.filter((p) => p.coordinates).length} pin
              {inCounty.filter((p) => p.coordinates).length === 1 ? "" : "s"} &middot; County seat: {entry.seat}
            </span>
            <span className="tabular-nums">
              {entry.center[1].toFixed(4)}&deg; N &middot; {Math.abs(entry.center[0]).toFixed(4)}&deg; W
            </span>
          </div>
        </div>
      )}

      {/* Project grid */}
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <AnimatedSection>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--color-gold)" }}>
            Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-16 leading-none">
            {inCounty.length === 1 ? "The project" : "The portfolio"} in {entry.name}.
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {inCounty.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* Cities + partners */}
      {(cities.length > 0 || partners.length > 0) && (
        <div
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border-custom)",
            borderBottom: "1px solid var(--color-border-custom)",
          }}
        >
          <div className="py-16 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {cities.length > 0 && (
              <AnimatedSection>
                <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
                  Cities
                </p>
                <p
                  className="font-display text-2xl md:text-3xl font-bold text-white leading-snug"
                >
                  {cities.join(" · ")}
                </p>
              </AnimatedSection>
            )}
            {partners.length > 0 && (
              <AnimatedSection delay={0.08}>
                <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
                  Partners in {entry.name}
                </p>
                <p
                  className="font-display text-2xl md:text-3xl font-bold text-white leading-snug"
                >
                  {partners.join(" · ")}
                </p>
              </AnimatedSection>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid var(--color-border-custom)" }}
      >
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
              Have land in {entry.name} County?
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
              We&rsquo;d like to hear about it.
            </h2>
            <p className="text-base mb-10 max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              Marty answers every inquiry personally. {company.phone} or martyorr@bellsouth.net,
              or use the form on the acquisitions page.
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
