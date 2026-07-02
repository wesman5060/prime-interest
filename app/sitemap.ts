export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content/source";
import { COUNTIES } from "@/content/counties";

const BASE = "https://primeinterestinc.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                   changeFrequency: "monthly", priority: 1.0 },
    { url: `${BASE}/approach`,     changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/projects`,     changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/acquisitions`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${BASE}/about`,        changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`,      changeFrequency: "yearly",  priority: 0.7 },
    { url: `${BASE}/counties`,     changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/capabilities`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`,      changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/terms`,        changeFrequency: "yearly",  priority: 0.3 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const countyRoutes: MetadataRoute.Sitemap = COUNTIES.map((c) => ({
    url: `${BASE}/counties/${c.slug}`,
    
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...projectRoutes, ...countyRoutes];
}
