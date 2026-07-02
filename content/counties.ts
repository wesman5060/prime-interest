/**
 * County metadata for the per-county market pages at /counties/[slug].
 *
 * Each entry is grounded in verifiable, neutral facts — the county seat, the
 * geographic center, and a short factual descriptor of the market. No
 * invented Marty-specific claims; the project list is rendered live from
 * `content/projects.ts` so the page can't drift out of sync with the
 * portfolio (see TRUTH RULE in project memory).
 */

export interface CountyEntry {
  /** URL slug — lowercase, hyphenated. */
  slug: string;
  /** Display name (e.g. "Gwinnett"). */
  name: string;
  /** County seat city. */
  seat: string;
  /** [lng, lat] geographic center, used for the Mapbox static image. */
  center: [number, number];
  /** Map zoom level for the static image. */
  zoom: number;
  /**
   * One-sentence factual descriptor. Stays neutral about Marty's specific
   * work in the county — that data comes from the live project records.
   */
  descriptor: string;
}

export const COUNTIES: CountyEntry[] = [
  {
    slug: "gwinnett",
    name: "Gwinnett",
    seat: "Lawrenceville",
    center: [-84.028, 33.96],
    zoom: 9.5,
    descriptor:
      "Atlanta's largest northern suburb and the county Prime Interest has called home since 1990. Anchored by the I-85 / I-985 corridor, Mall of Georgia, and Coolray Field.",
  },
  {
    slug: "fulton",
    name: "Fulton",
    seat: "Atlanta",
    center: [-84.467, 33.79],
    zoom: 9.5,
    descriptor:
      "Georgia's most populous county, stretching from Atlanta's urban core north through Sandy Springs, Roswell, Alpharetta, and Milton — the market most active in luxury infill and walkable mixed-use.",
  },
  {
    slug: "cobb",
    name: "Cobb",
    seat: "Marietta",
    center: [-84.518, 33.881],
    zoom: 9.8,
    descriptor:
      "Atlanta's western suburban county, home to Smyrna, Vinings, the Battery, and an established corridor of single-family communities along I-75 and the Chattahoochee.",
  },
  {
    slug: "cherokee",
    name: "Cherokee",
    seat: "Canton",
    center: [-84.474, 34.23],
    zoom: 9.6,
    descriptor:
      "North-Atlanta growth corridor anchored by I-575 and the Etowah River, where former agricultural land continues to be entitled for master-planned residential.",
  },
  {
    slug: "forsyth",
    name: "Forsyth",
    seat: "Cumming",
    center: [-84.14, 34.2],
    zoom: 9.8,
    descriptor:
      "One of the fastest-growing counties in the country, anchored by GA-400 and Lake Lanier — a primary market for new master-planned residential.",
  },
  {
    slug: "hall",
    name: "Hall",
    seat: "Gainesville",
    center: [-83.77, 34.297],
    zoom: 9.8,
    descriptor:
      "North-Georgia gateway to Lake Lanier and the Blue Ridge foothills, with Gainesville as its regional commercial center.",
  },
  {
    slug: "whitfield",
    name: "Whitfield",
    seat: "Dalton",
    center: [-84.97, 34.767],
    zoom: 10,
    descriptor:
      "Northwest-Georgia industrial center known globally for carpet and flooring manufacturing. Downtown Dalton is the county's commercial and cultural anchor.",
  },
  {
    slug: "barrow",
    name: "Barrow",
    seat: "Winder",
    center: [-83.717, 33.987],
    zoom: 10,
    descriptor:
      "Northeast-Atlanta exurban county along I-85 and the Athens corridor — the part of Georgia where Marty learned the trade in the early 1990s.",
  },
  {
    slug: "dekalb",
    name: "DeKalb",
    seat: "Decatur",
    center: [-84.28, 33.777],
    zoom: 10,
    descriptor:
      "Atlanta's first eastern suburb and a major intown market, home to Decatur, the CDC, and Emory University.",
  },
  {
    slug: "liberty",
    name: "Liberty",
    seat: "Hinesville",
    center: [-81.516, 31.79],
    zoom: 9.5,
    descriptor:
      "Coastal Georgia, adjacent to Fort Stewart and within commuting distance of Savannah — an emerging market driven by base and port growth.",
  },
  {
    slug: "newton",
    name: "Newton",
    seat: "Covington",
    center: [-83.86, 33.596],
    zoom: 10,
    descriptor:
      "East-Atlanta county along the I-20 corridor, home to the Stanton Springs megasite — anchor of major industrial and data-center investment including Meta and Rivian.",
  },
];

export function getCountyBySlug(slug: string): CountyEntry | undefined {
  return COUNTIES.find((c) => c.slug === slug);
}
