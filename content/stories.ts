/**
 * Editorial stories — long-form case studies that read longer than a project
 * tile. The argument here is pattern-recognition: how a particular corridor
 * developed over decades, and what role Prime Interest played in it.
 *
 * Stay grounded. Every pin and number should map to a real project in
 * content/projects.ts or a real address. No puffery — see TRUTH RULE in the
 * project memory.
 */

import type { Project } from "@/lib/content/types";
import { projects } from "@/content/projects";

export interface StoryPin {
  /** Map label shown in the popup. */
  label: string;
  /** [lng, lat] */
  coords: [number, number];
  /** Optional project slug to link out to. */
  projectSlug?: string;
  /** Short caption shown under the label. */
  caption?: string;
  /** Distinguishes the "anchor" landmark (Coolray Field) from project pins. */
  kind?: "anchor" | "project" | "office";
}

export interface StoryPullQuote {
  text: string;
  attribution?: string;
}

export interface StorySection {
  heading: string;
  body: string[];
  pullQuote?: StoryPullQuote;
}

export interface Story {
  slug: string;
  title: string;
  eyebrow: string;
  dek: string;
  /** Center + zoom for the corridor map. */
  mapCenter: [number, number];
  mapZoom: number;
  pins: StoryPin[];
  sections: StorySection[];
  /** Slugs of related projects to surface at the bottom. */
  relatedProjects: string[];
}

export const STORIES: Story[] = [
  {
    slug: "coolray-field",
    title: "The Coolray Field Corridor",
    eyebrow: "Corridor Story · Buford & Sugar Hill",
    dek: "Thirty years working a stretch of Highway 20 and South Lee Street that nobody was paying attention to — and what's there now.",
    mapCenter: [-83.992, 34.092],
    mapZoom: 12,
    pins: [
      {
        label: "Coolray Field",
        coords: [-83.9758, 34.0756],
        caption: "Opened 2009 · home of the Gwinnett Stripers",
        kind: "anchor",
      },
      {
        label: "Prime Interest Office",
        coords: [-84.00014, 34.09633],
        caption: "4235 South Lee Street",
        kind: "office",
      },
      {
        label: "Northside Medical Office Buildings",
        coords: [-83.971, 34.1087],
        caption: "200,000 sq ft for Northside Hospital",
        projectSlug: "northside-medical-office",
        kind: "project",
      },
      {
        label: "The Stables Motor Condos",
        coords: [-83.9932, 34.1198],
        caption: "4375 South Lee Street",
        projectSlug: "the-stables-motor-condos",
        kind: "project",
      },
      {
        label: "Pugh Street Industrial",
        coords: [-83.9956, 34.1162],
        caption: "23.7 acres · City of Buford / Brookfield",
        projectSlug: "pugh-street-industrial-complex",
        kind: "project",
      },
      {
        label: "Daly's Truck Driving School",
        coords: [-83.9968, 34.114],
        caption: "Peachtree Industrial Blvd.",
        projectSlug: "dalys-truck-driving-school",
        kind: "project",
      },
      {
        label: "Highway 324",
        coords: [-84.022, 34.075],
        caption: "7.5 acres next to Mall of Georgia",
        projectSlug: "highway-324",
        kind: "project",
      },
      {
        label: "Ashley Falls",
        coords: [-83.978, 34.124],
        caption: "Wade Orr Rd. · 32 lots with Century",
        projectSlug: "ashley-falls",
        kind: "project",
      },
    ],
    sections: [
      {
        heading: "Before the stadium",
        body: [
          "When Marty Orr opened the doors of Prime Interest in 1990, the stretch of Gwinnett County between Buford and Lawrenceville was mostly pasture, gravel access roads, and a handful of family farms whose owners weren't sure what their land was worth or what to do with it. South Lee Street ran past the office to nowhere in particular. Highway 20 was a two-lane road into the country.",
          "He bought a small office on South Lee Street in those early years because it was inexpensive, but also because it sat in the middle of a corridor he believed would eventually turn. The reasoning was unromantic: Lake Lanier was to the north, I-985 cut through the middle, the Mall of Georgia was in early planning south of town, and Atlanta's growth pressure was inevitable. The land would move. It was a matter of when, and of who was patient enough to wait.",
        ],
      },
      {
        heading: "Mall of Georgia, and the first inflection",
        body: [
          "The first inflection point came in the late 1990s. Once construction of the Mall of Georgia became public, the seven-and-a-half-acre parcel Prime Interest had assembled along Highway 324 — originally separated by exemption plat and sold as estate lots — became commercial overnight. The plats were redrawn, the parcels were sold as commercial, and the corridor's character started to shift. Single-family rezonings followed. Then commercial. Then warehousing along Peachtree Industrial.",
          "This is the part of land development that doesn't fit into a press release: a piece of paper at the county, an exemption plat refiled, and the same dirt suddenly worth several times what it was the month before. Prime Interest worked through dozens of these quiet transformations along the corridor in the late nineties and early two-thousands.",
        ],
        pullQuote: {
          text: "The land would move. It was a matter of when, and of who was patient enough to wait.",
        },
      },
      {
        heading: "Coolray, and the second inflection",
        body: [
          "Coolray Field — then called Gwinnett Stadium — opened in April 2009. A Triple-A ballpark is not, on its own, a development thesis. But for the corridor it confirmed a direction. Restaurants and hospitality followed the stadium. Residential rooftops kept appearing. Northside Hospital began planning a major medical campus. Buford's downtown started its own renaissance a few miles north.",
          "Prime Interest was already there. The South Lee Street office had been on the same parcel for nearly twenty years by then. The acquisitions Marty had quietly stitched together over the prior decade — small commercial rezonings, single-family subdivision sites with Century Communities, industrial assemblages along Peachtree Industrial — became the inventory for the next wave of partners.",
        ],
      },
      {
        heading: "What's there now",
        body: [
          "Today the corridor carries two of Prime Interest's most visible active projects. The Northside Medical Office Buildings — two hundred thousand square feet of outpatient medical office, developed for Northside Hospital — sits a mile and a half north of the stadium. The Stables Motor Condos, a luxury storage condominium development for exotic cars and offices, is rising on four-and-a-half acres at the north end of South Lee Street, directly up the road from the original office.",
          "Pugh Street Industrial Complex, twenty-three acres on Peachtree Industrial sold to the City of Buford and now being developed by Brookfield Properties, sits a few blocks west. Daly's Truck Driving School is on the same boulevard.",
          "None of this was inevitable when Marty opened the office. It looked, at the time, like the wrong side of a county that hadn't decided what it wanted to be. The thesis was patient: build the relationships, rezone the parcels, and wait for the corridor to find its tenants. Thirty-five years later the corridor has found them.",
        ],
        pullQuote: {
          text: "It looked, at the time, like the wrong side of a county that hadn't decided what it wanted to be.",
        },
      },
      {
        heading: "How we think about it now",
        body: [
          "Corridors take decades. We are honest about that with the landowners and partners we work with. The work that pays off in 2026 was acquired and entitled in the late nineties and early two-thousands; the work we are acquiring today is for the corridor that exists in 2040.",
          "Our buy box hasn't changed much in thirty-five years. We are looking at metro Atlanta and North Georgia, at parcels that read \"wrong\" to most of the market because the use isn't obvious yet, and at sellers who would rather work with a principal than a chain of intermediaries. If that sounds like land you own or land you've come across, the door is the same one Marty has been walking through every morning since 1990.",
        ],
      },
    ],
    relatedProjects: [
      "northside-medical-office",
      "the-stables-motor-condos",
      "pugh-street-industrial-complex",
      "ashley-falls",
    ],
  },
];

export function getStoryBySlug(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

export function getRelatedProjects(story: Story): Project[] {
  return story.relatedProjects
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}
