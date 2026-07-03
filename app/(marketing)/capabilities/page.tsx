import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbsJsonLd from "@/components/site/BreadcrumbsJsonLd";
import PrintButton from "@/components/site/PrintButton";
import { company } from "@/content/company";
import { COUNTIES } from "@/content/counties";
import { getAssetClassCounts, getPortfolioStats } from "@/lib/content/stats";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Prime Interest, Inc. — capabilities one-pager. Asset classes, geography, partners, and the principal who answers every inquiry.",
};

/**
 * Capabilities one-pager — designed for screen viewing, print, and
 * "Save as PDF." Everything on this page is pulled live from the project
 * data so the figures and asset-class breakdown stay in sync.
 *
 * Print rules:
 * - Hide the site header, footer, scroll-to-top, and the Print button.
 * - Preserve dark background + gold accents (print-color-adjust: exact).
 * - Force compact spacing so the page fits on one or two letter-size pages.
 */
export default function CapabilitiesPage() {
  const stats = getPortfolioStats();
  const assetClasses = getAssetClassCounts();
  const countiesWithProjects = COUNTIES.filter((c) =>
    projects.some((p) => p.county === c.name),
  );

  return (
    <div className="capabilities-sheet min-h-screen">
      <BreadcrumbsJsonLd items={[{ name: "Capabilities", path: "/capabilities" }]} />

      <style>{`
        /* Hide the marketing chrome when this page goes to print. */
        @media print {
          header, footer, .skip-link, button[aria-label*="scroll"], .no-print {
            display: none !important;
          }
          body, .capabilities-sheet {
            background: var(--color-bg) !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .capabilities-sheet { padding-top: 0 !important; }
          .capabilities-sheet section { break-inside: avoid; }
        }
      `}</style>

      <div className="pt-32 pb-20 px-8 max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex items-end justify-between mb-12 pb-8 border-b" style={{ borderColor: "var(--color-border-custom)" }}>
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>
              Capabilities Overview
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-[0.95] text-white">
              Prime Interest,<br />
              <span style={{ color: "var(--color-gold)" }}>Inc.</span>
            </h1>
            <p className="text-sm mt-4 tracking-[0.2em] uppercase tabular-nums" style={{ color: "var(--color-text-subtle)" }}>
              {company.address} &middot; {company.city}, {company.state} {company.zip}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--color-text-subtle)" }}>
              Office
            </p>
            <p className="font-display text-xl text-white tabular-nums">{company.phone}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {company.email}
            </p>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px mb-12" style={{ background: "var(--color-border-custom)" }}>
          {[
            { value: `${stats.yearsActive}+`, label: "Years Active" },
            { value: `${stats.residentialDelivered.toLocaleString()}+`, label: "Homes & Lots" },
            { value: `${stats.countyCount}`, label: "Counties" },
            { value: `${stats.partnerCount}`, label: "Partners" },
          ].map((s) => (
            <div key={s.label} className="px-4 py-6 text-center" style={{ background: "var(--color-bg)" }}>
              <p className="font-display text-3xl md:text-4xl font-bold tabular-nums leading-none" style={{ color: "var(--color-gold)" }}>
                {s.value}
              </p>
              <p className="text-[10px] tracking-[0.22em] uppercase mt-3" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </section>

        {/* Firm overview */}
        <section className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>
            About the firm
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.85 }}>
            Prime Interest, Inc. is a Buford, Georgia land development firm. Founded by{" "}
            {company.principals[0].name} in {company.founded} after eight years working as a developer under W.T.{" "}
            &ldquo;Terry&rdquo; Dunahoo, the firm has delivered{" "}
            <strong className="text-white font-bold">
              {stats.residentialDelivered.toLocaleString()}+ homes and lots across {stats.countyCount} Georgia counties
            </strong>
            , spanning every major real estate asset class &mdash; single-family communities, townhomes, mid-rise apartments, student housing, mixed-use, medical office, commercial, and industrial. We handle our own rezoning and entitlement.
          </p>
        </section>

        {/* Asset classes */}
        <section className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-5" style={{ color: "var(--color-gold)" }}>
            What we develop
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "var(--color-border-custom)" }}>
            {assetClasses.map((ac) => (
              <div key={ac.key} className="p-4" style={{ background: "var(--color-bg)" }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-display text-xl font-bold tabular-nums leading-none" style={{ color: "var(--color-gold)" }}>
                    {ac.count}
                  </span>
                  <span className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
                    {ac.count === 1 ? "project" : "projects"}
                  </span>
                </div>
                <p className="font-display text-sm font-bold text-white leading-snug">{ac.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Geography */}
        <section className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>
            Where we work
          </p>
          <p className="text-base mb-4" style={{ color: "var(--color-text-muted)" }}>
            Active acquisition program across the state of Georgia. Visible recent and historical work in:
          </p>
          <p className="font-display text-lg md:text-xl text-white leading-snug">
            {countiesWithProjects.map((c) => `${c.name} County`).join(" · ")}
          </p>
        </section>

        {/* Partners */}
        <section className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase mb-3" style={{ color: "var(--color-gold)" }}>
            Builder &amp; capital partners
          </p>
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            {company.partners.join(" · ")}
          </p>
        </section>

        {/* Acquisition criteria */}
        <section
          className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-px"
          style={{ background: "var(--color-border-custom)" }}
        >
          {[
            { label: "Geography", value: "Anywhere in Georgia" },
            { label: "Acreage", value: "1 to 200+ acres" },
            { label: "Land type", value: "Raw, agricultural, infill, assemblage" },
            { label: "Zoning", value: "Any — we handle rezoning" },
            { label: "Product", value: "Residential, commercial, mixed-use, medical" },
            { label: "Timeline", value: "Flexible — close on your schedule" },
          ].map((item) => (
            <div key={item.label} className="p-4" style={{ background: "var(--color-bg)" }}>
              <p className="text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: "var(--color-gold)" }}>
                {item.label}
              </p>
              <p className="text-sm font-medium text-white leading-snug">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Principal */}
        <section
          className="mb-10 p-6 border"
          style={{ borderColor: "var(--color-border-gold)" }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: "var(--color-gold)" }}>
                Principal
              </p>
              <p className="font-display text-2xl font-bold text-white leading-none">
                {company.principals[0].name}
              </p>
              <p className="text-xs tracking-[0.18em] uppercase mt-2" style={{ color: "var(--color-text-muted)" }}>
                {company.principals[0].title}
              </p>
            </div>
            <div className="flex flex-col gap-1 text-sm md:text-right" style={{ color: "var(--color-text-muted)" }}>
              <span className="tabular-nums">Office &nbsp;{company.phone}</span>
              <span className="tabular-nums">Cell &nbsp;&nbsp;&nbsp;{company.cell}</span>
              <a href={`mailto:${company.email}`} className="hover:text-[color:var(--color-gold)]">
                {company.email}
              </a>
            </div>
          </div>
        </section>

        {/* Footer line */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t"
          style={{ borderColor: "var(--color-border-custom)", color: "var(--color-text-subtle)" }}
        >
          <p className="text-xs">
            {company.tagline}
          </p>
        </div>

        {/* Print button (hidden in print) */}
        <div className="no-print mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <PrintButton />
          <Link
            href="/acquisitions"
            className="inline-flex items-center gap-2 px-6 py-3 text-[11px] tracking-[0.25em] uppercase border"
            style={{ borderColor: "var(--color-border-gold)", color: "var(--color-gold)" }}
          >
            Submit a Property <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
