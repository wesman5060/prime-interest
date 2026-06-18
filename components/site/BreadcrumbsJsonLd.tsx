/**
 * Renders a BreadcrumbList JSON-LD block. Helps Google show the site
 * hierarchy in SERP snippets and improves crawl prioritization.
 *
 * Pass `items` in order from the top of the hierarchy to the current page.
 * The component prepends Home automatically — don't include it yourself.
 */
const BASE = "https://prime-interest.com";

interface Crumb {
  name: string;
  /** Path relative to the site root, e.g. "/projects" or "/projects/alta-dalton". */
  path: string;
}

export default function BreadcrumbsJsonLd({ items }: { items: Crumb[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${BASE}${c.path === "/" ? "/" : c.path}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
