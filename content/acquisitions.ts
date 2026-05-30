/**
 * Content for the Acquisitions page — the buy-side of the business. Editable
 * here without touching page JSX. Professional and integrated, not a "sell your
 * land" funnel: the portfolio is the argument, this is the invitation.
 */

export interface AudienceTrack {
  key: "landowner" | "broker" | "investor";
  label: string;
  heading: string;
  body: string;
}

export interface BuyBoxItem {
  label: string;
  value: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export const ACQUISITIONS_INTRO = {
  eyebrow: "Acquisitions",
  headline: "We Are\nAcquiring Land",
  lead:
    "Prime Interest maintains an active acquisition program across metro Atlanta and North Georgia. We work directly with landowners, brokers, and investment partners to identify land with development potential — and we handle the rezoning and entitlement ourselves.",
};

export const BUY_BOX: BuyBoxItem[] = [
  { label: "Geography", value: "Metro Atlanta & North Georgia" },
  { label: "Acreage", value: "All sizes — 1 to 200+ acres" },
  { label: "Land Type", value: "Raw, agricultural, infill & assemblages" },
  { label: "Zoning", value: "Any — we handle rezoning & entitlement" },
  { label: "Product", value: "Residential, mixed-use, commercial" },
  { label: "Timeline", value: "Flexible — we close on your schedule" },
];

export const AUDIENCE_TRACKS: AudienceTrack[] = [
  {
    key: "landowner",
    label: "Landowners",
    heading: "If you own land",
    body:
      "Whether it's family land, a farm, or an inherited parcel, we make the process straightforward and confidential. We've turned hundreds of Georgia parcels into thriving communities — and we deal directly, with no obligation and no pressure.",
  },
  {
    key: "broker",
    label: "Brokers",
    heading: "If you represent a seller",
    body:
      "We respect and protect co-broke arrangements. Bring us a deal that fits our criteria and you'll work with a principal who closes clean and fast — backed by thirty-five years of relationships and a track record of single-closing transactions.",
  },
  {
    key: "investor",
    label: "Investors & Partners",
    heading: "If you're a capital or development partner",
    body:
      "We have partnered with national builders and REITs — from D.R. Horton and Beazer to American Campus Communities — on projects ranging from single-family subdivisions to $65M mixed-use developments. We're always open to the right partnership.",
  },
];

export const ACQUISITION_PROCESS: ProcessStep[] = [
  {
    number: "01",
    title: "Submit",
    body:
      "Tell us about the property — location, acreage, and anything you know about it. A few details are enough to start.",
  },
  {
    number: "02",
    title: "Review",
    body:
      "We evaluate the parcel against our criteria and current pipeline, and follow up directly — typically within a few business days.",
  },
  {
    number: "03",
    title: "Offer",
    body:
      "If it's a fit, we make a fair, no-obligation offer and close on a timeline that works for you. We handle the complexity.",
  },
];
