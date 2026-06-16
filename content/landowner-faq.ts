/**
 * Landowner FAQ — answers Marty would actually give. Plain-spoken, no jargon,
 * no scare tactics. Order roughly maps to landowner anxiety: process, money,
 * timing, privacy.
 */

export interface FAQItem {
  q: string;
  a: string;
}

export const LANDOWNER_FAQ: FAQItem[] = [
  {
    q: "I'm just curious what my land might be worth — do I have to commit to anything?",
    a: "No. Every conversation starts the same way: you tell us about the property, we take a look, and we follow up. There is no obligation, no listing agreement, and nothing to sign. Most of our acquisitions begin as exploratory conversations.",
  },
  {
    q: "Will my information stay confidential?",
    a: "Yes. We do not publish what we're looking at, we do not approach neighbors without your blessing, and we do not market your property. Conversations are between you and Marty.",
  },
  {
    q: "Does my land need to already be zoned for development?",
    a: "No. We handle rezoning and entitlement ourselves — it is one of the things we are known for. Land that is currently agricultural, residential, or unzoned is fine. We assess the parcel's highest and best use, then we do the work to get there.",
  },
  {
    q: "What size parcels do you buy?",
    a: "Anything from a single infill lot to assemblages of two hundred acres or more. The right deal is more about location and feasibility than acreage.",
  },
  {
    q: "How quickly can you close?",
    a: "We close on your timeline. Some sellers want speed — others want time to plan around taxes or a 1031 exchange. We've closed in under thirty days and we've held closings open for a year. Tell us what works for you.",
  },
  {
    q: "Do you pay cash, or are you tied to financing contingencies?",
    a: "We close clean. Our offers are not contingent on outside financing falling into place, and we have a thirty-five-year track record of single-closing transactions. If we sign a contract, we close.",
  },
  {
    q: "What about the taxes when I sell?",
    a: "We're not your tax advisor, but we work with sellers' CPAs and 1031 exchange intermediaries all the time. Many of the sellers we work with are families managing inherited or long-held land where tax structure matters. We're patient about closing dates so your team can structure the sale properly.",
  },
  {
    q: "How is your offer different from a residential cash-offer company?",
    a: "We are a development firm, not a flip operation. We are buying land to build on, with our own capital and our own builder partners. That means our offer is based on what the land can become — entitled, developed, and delivered — not on a quick discount to current condition.",
  },
  {
    q: "Will you tear down the house or take the trees?",
    a: "It depends on the project, the topography, and what the entitlement will allow. We are happy to talk through specifics before any contract. We've also walked away from deals where the owner wanted a particular tree, view, or structure preserved and the development math couldn't support it. That's an honest conversation we have up front.",
  },
  {
    q: "What if I'm not the only owner — it's family land with multiple heirs?",
    a: "Common situation, and one we handle often. We can talk to one point of contact while you coordinate with the other heirs, and we can structure the closing to handle multiple sellers cleanly. The patience and confidentiality matter even more in these cases.",
  },
  {
    q: "What happens after I reach out?",
    a: "Marty reviews every inquiry personally. You'll typically hear back within a few business days. If it looks like a fit, we'll set up a call or come walk the property. If it isn't a fit, we'll tell you honestly — and often we know someone who would be interested.",
  },
];
