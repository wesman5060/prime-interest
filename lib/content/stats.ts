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
