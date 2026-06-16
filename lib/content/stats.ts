import type { Project } from "./types";
import { projects as localProjects } from "@/content/projects";

/**
 * Live portfolio statistics computed from the project data — single source of
 * truth. Adding or editing a project automatically updates every figure shown
 * on the site, so the numbers can never drift out of sync with reality.
 */
export interface PortfolioStats {
  /** Total number of developments. */
  projectCount: number;
  /** Residential product delivered: lots + units + beds across the portfolio. */
  residentialDelivered: number;
  /** Sum of recorded acreage (undercount — not every record lists acreage). */
  acreage: number;
  /** Distinct Georgia counties with at least one development. */
  countyCount: number;
  /** Distinct builder / REIT partners. */
  partnerCount: number;
  /** First year of development activity. */
  developingSince: number;
  /** Years in operation, relative to the given year. */
  yearsActive: number;
}

const DEVELOPING_SINCE = 1990;

export function computePortfolioStats(
  projects: Project[],
  asOfYear = 2026,
): PortfolioStats {
  let residentialDelivered = 0;
  let acreage = 0;
  const counties = new Set<string>();
  const partners = new Set<string>();

  for (const p of projects) {
    residentialDelivered += (p.lots ?? 0) + (p.units ?? 0) + (p.beds ?? 0);
    acreage += p.acreage ?? 0;
    if (p.county) counties.add(p.county);
    if (p.partner) {
      // Split combined partner credits ("A / B") into distinct entities.
      for (const name of p.partner.split(/\s*\/\s*/)) {
        const trimmed = name.trim();
        if (trimmed) partners.add(trimmed);
      }
    }
  }

  return {
    projectCount: projects.length,
    residentialDelivered,
    acreage: Math.round(acreage),
    countyCount: counties.size,
    partnerCount: partners.size,
    developingSince: DEVELOPING_SINCE,
    yearsActive: asOfYear - DEVELOPING_SINCE,
  };
}

export function getPortfolioStats(asOfYear?: number): PortfolioStats {
  return computePortfolioStats(localProjects, asOfYear);
}

/**
 * Asset-class breakdown for the homepage "What We Develop" band.
 *
 * Project `type` values get rolled up into the customer-facing categories the
 * firm actually pitches. Counts are pulled live from `content/projects.ts`, so
 * adding or retyping a project automatically updates the home page.
 */
export interface AssetClassCount {
  key: string;
  label: string;
  /** Short descriptor shown under the label. */
  caption: string;
  count: number;
}

export function getAssetClassCounts(): AssetClassCount[] {
  const byType = new Map<string, number>();
  for (const p of localProjects) {
    byType.set(p.type, (byType.get(p.type) ?? 0) + 1);
  }
  const get = (...keys: string[]) =>
    keys.reduce((sum, k) => sum + (byType.get(k) ?? 0), 0);

  const groups: AssetClassCount[] = [
    {
      key: "residential",
      label: "Residential",
      caption: "Single-family subdivisions, lot deliveries, and master-planned communities",
      count: get("single-family", "subdivision"),
    },
    {
      key: "townhomes",
      label: "Townhomes",
      caption: "Attached for-sale product, developed for national and regional builders",
      count: get("townhomes"),
    },
    {
      key: "apartments",
      label: "Luxury Apartments",
      caption: "Mid-rise multifamily for institutional operators",
      count: get("luxury-apartments"),
    },
    {
      key: "student",
      label: "Student Housing",
      caption: "Purpose-built student communities with national REIT partners",
      count: get("student-housing"),
    },
    {
      key: "mixed-use",
      label: "Mixed-Use",
      caption: "Residential, retail, and amenity components on a single site",
      count: get("mixed-use"),
    },
    {
      key: "commercial",
      label: "Commercial & Retail",
      caption: "Strip centers, outparcels, and ground-up commercial assemblages",
      count: get("commercial"),
    },
    {
      key: "medical",
      label: "Medical Office",
      caption: "Outpatient campuses developed for major hospital systems",
      count: get("medical-office"),
    },
    {
      key: "industrial",
      label: "Industrial",
      caption: "Industrial assemblages and flex space along key Georgia corridors",
      count: get("industrial"),
    },
  ];

  // Drop empty categories so the grid never shows a 0.
  return groups.filter((g) => g.count > 0);
}
