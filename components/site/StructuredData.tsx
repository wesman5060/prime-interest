import { company } from "@/content/company";
import { getPortfolioStats } from "@/lib/content/stats";

/**
 * Site-wide structured data — emitted from the root layout so every page in
 * the static export carries it.
 *
 * - LocalBusiness: the canonical organization record. Powers local-search
 *   ("land developer Buford GA"), Google Knowledge Panel, and the office
 *   address card. Marty's portfolio counts are pulled live from
 *   content/projects.ts via getPortfolioStats so the figures can never drift
 *   out of sync with the rest of the site.
 * - WebSite: enables the Google sitelinks search box and identifies the
 *   canonical URL.
 *
 * NOTE: we deliberately do NOT use Schema.org's RealEstateAgent type — Prime
 * Interest is a developer, not a brokerage. LocalBusiness with the explicit
 * "Land Developer" description reads more accurately to crawlers.
 */
export default function StructuredData() {
  const stats = getPortfolioStats();

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://primeinterestinc.com/#organization",
    name: company.name,
    alternateName: "Prime Interest",
    description:
      "Land development and entitlement firm building communities across Georgia. Active acquisition program for raw land, agricultural land, and assemblages of any size statewide.",
    url: "https://primeinterestinc.com",
    logo: "https://primeinterestinc.com/favicon-512.png",
    image: "https://primeinterestinc.com/og.jpg",
    telephone: company.phone,
    email: company.email,
    foundingDate: String(company.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: company.city,
      addressRegion: company.state,
      postalCode: company.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.0963,
      longitude: -84.0001,
    },
    areaServed: {
      "@type": "State",
      name: "Georgia",
    },
    founder: {
      "@type": "Person",
      name: company.principals[0].name,
      jobTitle: company.principals[0].title,
    },
    knowsAbout: [
      "Real estate development",
      "Land entitlement",
      "Rezoning",
      "Master-planned communities",
      "Single-family subdivisions",
      "Mixed-use development",
      "Medical office development",
      "Student housing",
      "Luxury apartments",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:00",
    },
    aggregateRating: undefined as unknown,
  };
  // Suppress aggregateRating since we don't have one yet — leaving undefined
  // strips the field from the emitted JSON.
  delete (localBusiness as { aggregateRating?: unknown }).aggregateRating;

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://primeinterestinc.com/#website",
    name: company.name,
    url: "https://primeinterestinc.com",
    publisher: { "@id": "https://primeinterestinc.com/#organization" },
    inLanguage: "en-US",
    description: `${stats.projectCount}+ developments across Georgia since ${stats.developingSince}.`,
  };

  // Person schema for Marty — ties the human to the LocalBusiness record so
  // Google can present him in the Knowledge Panel as the firm's principal.
  const principal = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://primeinterestinc.com/#marty-orr",
    name: company.principals[0].name,
    jobTitle: company.principals[0].title,
    description: company.principals[0].bio,
    worksFor: { "@id": "https://primeinterestinc.com/#organization" },
    affiliation: { "@id": "https://primeinterestinc.com/#organization" },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: company.city,
      addressRegion: company.state,
      postalCode: company.zip,
      addressCountry: "US",
    },
    telephone: company.phone,
    email: company.email,
    url: "https://primeinterestinc.com/about",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(principal) }}
      />
    </>
  );
}
