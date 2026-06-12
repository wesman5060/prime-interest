"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Project, ProjectStatus, ProjectType } from "@/lib/content/types";
import { getProjectImage } from "@/lib/project-image";
import ProjectCard from "@/components/site/ProjectCard";

const ProjectsMap = dynamic(() => import("@/components/site/ProjectsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" style={{ background: "var(--color-surface)" }}>
      <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
        Loading map…
      </p>
    </div>
  ),
});

const TYPE_LABELS: Record<ProjectType, string> = {
  "luxury-apartments": "Luxury Apartments",
  "student-housing": "Student Housing",
  "single-family": "Single-Family",
  townhomes: "Townhomes",
  subdivision: "Subdivision",
  commercial: "Commercial",
  "medical-office": "Medical Office",
  "mixed-use": "Mixed-Use",
  industrial: "Industrial",
  other: "Other",
};

function titleCase(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function isComplete(status: ProjectStatus) {
  return status === "completed" || status === "fully-leased";
}

const selectStyle: React.CSSProperties = {
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(201,169,110,0.25)",
  color: "var(--color-gold)",
  padding: "8px 28px 8px 12px",
  fontSize: "10px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
  outline: "none",
  minWidth: 0,
};

interface Props {
  projects: Project[];
}

export default function ProjectsExplorer({ projects }: Props) {
  const [typeFilter, setTypeFilter] = useState<ProjectType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [county, setCounty] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const types = useMemo(() => Array.from(new Set(projects.map((p) => p.type))) as ProjectType[], [projects]);
  const counties = useMemo(() => Array.from(new Set(projects.map((p) => p.county))).sort(), [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (typeFilter === "all" || p.type === typeFilter) &&
        (statusFilter === "all" || p.status === statusFilter) &&
        (county === "all" || p.county === county) &&
        (q === "" ||
          [p.name, p.city, p.county, p.location, p.partner, p.description]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q))
    );
  }, [projects, typeFilter, statusFilter, county, query]);

  const selected = filtered.find((p) => p.slug === selectedSlug) ?? null;
  const anyFilter = typeFilter !== "all" || statusFilter !== "all" || county !== "all" || query !== "";

  return (
    <div>
      {/* ── Map: list-first on phones (shorter map), full-viewport on desktop ── */}
      <div className="relative w-full overflow-hidden h-[52vh] min-h-[380px] md:h-[calc(100vh-72px)]">
        <ProjectsMap projects={filtered} selectedSlug={selected?.slug ?? null} onSelect={setSelectedSlug} />

        {/* Floating filter bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Text search */}
          <div className="relative w-full md:w-auto md:flex-1 md:max-w-[260px]">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, partner…"
              aria-label="Search developments"
              className="w-full px-3 py-2 pr-8 text-[11px] tracking-[0.12em] uppercase outline-none placeholder:normal-case placeholder:tracking-normal"
              style={{
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(201,169,110,0.25)",
                color: "var(--color-gold)",
                caretColor: "var(--color-gold)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "rgba(201,169,110,0.6)" }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Count badge */}
          <div
            className="shrink-0 px-3 py-2 text-[10px] tracking-[0.18em] uppercase whitespace-nowrap"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(201,169,110,0.25)", color: "var(--color-gold)" }}
          >
            {filtered.length} / {projects.length}
          </div>

          {/* Type select */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ProjectType | "all")}
              style={selectStyle}
            >
              <option value="all">All Types</option>
              {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: "var(--color-gold)" }}>▾</span>
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "all")}
              style={selectStyle}
            >
              <option value="all">All Statuses</option>
              <option value="under-development">Under Development</option>
              <option value="developed">Developed</option>
              <option value="completed">Completed</option>
              <option value="fully-leased">Fully Leased</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: "var(--color-gold)" }}>▾</span>
          </div>

          {/* County select */}
          <div className="relative">
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Counties</option>
              {counties.map((c) => <option key={c} value={c}>{c} County</option>)}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: "var(--color-gold)" }}>▾</span>
          </div>

          {/* Reset — only shown when any filter is active */}
          {anyFilter && (
            <button
              onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setCounty("all"); setQuery(""); setSelectedSlug(null); }}
              className="text-[10px] tracking-[0.15em] uppercase transition-colors"
              style={{ color: "rgba(201,169,110,0.6)" }}
            >
              ✕ Reset
            </button>
          )}
        </div>

        {/* Slide-in detail panel */}
        <AnimatePresence>
          {selected && (
            <motion.aside
              key={selected.slug}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 z-20 flex h-full w-full max-w-sm flex-col overflow-y-auto"
              style={{ background: "rgba(6,6,6,0.97)", backdropFilter: "blur(16px)", borderLeft: "1px solid rgba(201,169,110,0.2)" }}
            >
              {/* Hero image */}
              <div className="relative shrink-0" style={{ height: "200px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getProjectImage(selected)} alt={selected.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,6,6,1) 0%, transparent 65%)" }} />
                <button
                  onClick={() => setSelectedSlug(null)}
                  aria-label="Close"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-base transition-colors"
                  style={{ background: "rgba(0,0,0,0.65)", color: "var(--color-gold)", border: "1px solid rgba(201,169,110,0.3)" }}
                >
                  ×
                </button>
              </div>

              <div className="flex flex-1 flex-col px-7 pb-7 pt-5">
                {/* Type + status */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "var(--color-gold)" }}>
                    {TYPE_LABELS[selected.type]}
                  </span>
                  <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: isComplete(selected.status) ? "#6DC87A" : "rgba(201,169,110,0.6)" }}>
                    · {titleCase(selected.status)}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold leading-tight text-white mb-1">{selected.name}</h3>
                <p className="text-xs mb-5" style={{ color: "var(--color-text-subtle)" }}>{selected.location}</p>

                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                  {selected.description}
                </p>

                {/* Key facts */}
                {[
                  selected.units && { label: "Units", value: String(selected.units) },
                  selected.beds && { label: "Beds", value: String(selected.beds) },
                  selected.lots && { label: "Lots", value: String(selected.lots) },
                  selected.acreage && { label: "Acres", value: `${selected.acreage}` },
                  selected.sqft && { label: "Sq Ft", value: selected.sqft },
                  selected.price && { label: "Value", value: selected.price },
                  selected.partner && { label: "Partner", value: selected.partner },
                ].filter(Boolean).length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      selected.units && { label: "Units", value: String(selected.units) },
                      selected.beds && { label: "Beds", value: String(selected.beds) },
                      selected.lots && { label: "Lots", value: String(selected.lots) },
                      selected.acreage && { label: "Acres", value: `${selected.acreage}` },
                      selected.sqft && { label: "Sq Ft", value: selected.sqft },
                      selected.price && { label: "Value", value: selected.price },
                    ].filter((f): f is { label: string; value: string } => Boolean(f)).map((f) => (
                      <div key={f.label} className="py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                        <p className="text-[9px] tracking-[0.12em] uppercase mb-1" style={{ color: "var(--color-text-subtle)" }}>{f.label}</p>
                        <p className="text-xs font-medium" style={{ color: "var(--color-gold)" }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selected.partner && (
                  <p className="text-xs mb-6" style={{ color: "var(--color-text-subtle)" }}>
                    <span className="tracking-[0.1em] uppercase text-[9px]">Partner</span><br />
                    <span style={{ color: "var(--color-text-muted)" }}>{selected.partner}</span>
                  </p>
                )}

                <div className="mt-auto">
                  <Link
                    href={`/projects/${selected.slug}`}
                    className="flex items-center justify-between border px-5 py-3 text-[10px] tracking-[0.2em] uppercase transition-all duration-200 hover:border-[color:var(--color-gold)]"
                    style={{ borderColor: "rgba(201,169,110,0.3)", color: "var(--color-gold)" }}
                  >
                    Full Project Details
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── Card grid ── */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-10">
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-text-subtle)" }}>
            {filtered.length} {filtered.length === 1 ? "development" : "developments"}
            {filtered.length < projects.length ? ` · ${projects.length - filtered.length} filtered out` : ""}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="border py-24 text-center" style={{ borderColor: "var(--color-border-custom)" }}>
            <p className="text-sm tracking-[0.15em] uppercase mb-4" style={{ color: "var(--color-text-muted)" }}>
              No developments match these filters
            </p>
            <button
              onClick={() => { setTypeFilter("all"); setStatusFilter("all"); setCounty("all"); setQuery(""); }}
              className="text-xs tracking-[0.15em] uppercase underline"
              style={{ color: "var(--color-gold)" }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
