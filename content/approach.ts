/**
 * Content for the Approach / "What We Do" page. Editable here without touching
 * page JSX. Each process step cites a real portfolio example pulled from the
 * project record described.
 */

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
  /** A real example from the portfolio that demonstrates this step. */
  example: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Acquire",
    body:
      "We identify and purchase raw and agricultural land across metro Atlanta and North Georgia — often parcels with untapped potential that other developers overlook. We work directly with landowners, brokers, and through assemblages.",
    example:
      "199 acres in Canton acquired adjacent to the Laurel Canyon project — agricultural land positioned for residential growth.",
  },
  {
    number: "02",
    title: "Entitle & Rezone",
    body:
      "This is where Prime Interest creates value. We navigate rezoning, entitlements, and the approval process — converting agricultural and low-density land into its highest and best use. Three decades of relationships with county commissions across Georgia make the difference.",
    example:
      "Regency Park: 48 one-acre parcels rezoned from Agricultural to R-100, then sold in a single closing to Homeland Communities.",
  },
  {
    number: "03",
    title: "Develop",
    body:
      "We execute horizontal development — engineering, infrastructure, roads, utilities, and finished lots. We deliver shovel-ready product that builders can move on immediately, or vertical projects we see through ourselves.",
    example:
      "Stonecreek: 48 acres in Loganville developed into 128 finished single-family lots with AMH Homes.",
  },
  {
    number: "04",
    title: "Deliver",
    body:
      "We deliver to the nation's leading builders and REITs — or hold and operate. From single-family lots to 500-bed student housing communities and $65M mixed-use developments, the finished product speaks for itself.",
    example:
      "The Holbrook: a former mobile home park transformed into a $65M four-story retail and assisted-living development in Sugar Hill.",
  },
];

export const APPROACH_INTRO = {
  eyebrow: "What We Do",
  headline: "From Raw Land\nto Community",
  lead:
    "Prime Interest is a land development company. For thirty-five years we have acquired Georgia land, navigated the entitlement and rezoning process, and delivered finished, shovel-ready developments to the country's leading builders and REITs.",
};
