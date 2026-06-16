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
    title: "Thirty-Five Years in Buford",
    eyebrow: "Story · Buford, Georgia",
    dek: "Marty grew up in Buford and built his career here. These are some of the deals that have happened near what's now Coolray Field.",
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
        heading: "From Buford",
        body: [
          "Marty Orr grew up in Buford, Georgia. He entered land development in 1990 under the mentorship of W.T. \"Terry\" Dunahoo — a Barrow County surveyor, developer, and banker — and spent the early years laying roads, installing utilities, and learning the trade across Barrow and Gwinnett. In 1998 he founded Prime Interest and built the firm's headquarters a few miles from where he was raised, on a parcel along South Lee Street he had developed himself.",
          "He has not moved. The office is still on South Lee Street. Most of his closest relationships — bankers, brokers, contractors, county staff — were built in this part of Gwinnett over the same thirty-five years.",
        ],
      },
      {
        heading: "The deals that happen close to home",
        body: [
          "When you work a county for thirty-five years, the projects pile up near where you live. There is no corridor strategy behind the cluster of Prime Interest deals between Buford and Lawrenceville. No quiet land-banking play. No patient assemblage waiting for an inflection. Each transaction has its own story — a seller who knew Marty's name, a rezoning that worked out, a parcel that found the right partner — and most of them happened independently of one another.",
          "They cluster here because Marty does business from a desk on South Lee Street, and because the people in this part of Gwinnett know who he is.",
        ],
        pullQuote: {
          text: "There is no corridor strategy. There's just the place we're from, and the work that's come with it.",
        },
      },
      {
        heading: "What Coolray meant",
        body: [
          "Coolray Field — then called Gwinnett Stadium — opened in April 2009, a few miles south of the office. The Triple-A ballpark didn't create the area's growth. The Mall of Georgia, opened a decade earlier just south of the stadium site, had already begun pulling commercial activity north along Buford Drive. But the stadium confirmed a direction. Restaurants and hospitality followed it. Residential rooftops kept arriving. Northside Hospital began planning a major outpatient campus a mile and a half up the road.",
          "Prime Interest watched all of this from the office on South Lee Street, the same office it had operated from since 1998.",
        ],
      },
      {
        heading: "Some of the work",
        body: [
          "Visible recent projects in the area include the Northside Medical Office Buildings — two hundred thousand square feet of outpatient medical office for Northside Hospital, a mile and a half north of the stadium — and The Stables Motor Condos, a luxury storage condominium development on four-and-a-half acres at the north end of South Lee Street.",
          "Pugh Street Industrial Complex, twenty-three acres on Peachtree Industrial sold to the City of Buford and now being developed by Brookfield Properties, sits a few blocks west. Smaller deals over the years fill out the map: Daly's Truck Driving School on the same boulevard, the Highway 324 parcel adjacent to the Mall of Georgia, Ashley Falls on Wade Orr Road. None of them grew out of a master plan. They simply happened, one at a time, in the same few square miles.",
        ],
      },
      {
        heading: "Why we tell it this way",
        body: [
          "We mention the Buford projects together not because they were part of a coordinated play, but because together they show what thirty-five years in one county actually looks like. Most of our visible recent work sits in the part of Georgia we know best. That is a feature, not a marketing line — landowners and brokers around here can ask anyone who has been in the business a while, and the people they ask have known Marty for decades.",
          "Our buy box, though, has never been limited to one corner of the state. We acquire land anywhere in Georgia. For sellers outside this area, the same direct relationship is the one we try to extend — answered by the same principal at the same desk on South Lee Street.",
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
