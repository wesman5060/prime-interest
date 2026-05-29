import type { Project, CompanyInfo, GalleryItem } from "./types";
import { projects as localProjects } from "@/content/projects";
import { company as localCompany } from "@/content/company";

// CMS seam: swap these implementations for a Sanity/Payload fetch
// without touching any page or component.

export async function getProjects(): Promise<Project[]> {
  return localProjects;
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return localProjects.find((p) => p.slug === slug);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return localProjects.filter((p) => p.featured);
}

export async function getProjectsByCounty(county: string): Promise<Project[]> {
  return localProjects.filter(
    (p) => p.county.toLowerCase() === county.toLowerCase()
  );
}

export async function getProjectsByType(type: string): Promise<Project[]> {
  return localProjects.filter((p) => p.type === type);
}

export async function getCompany(): Promise<CompanyInfo> {
  return localCompany;
}

export async function getGallery(): Promise<GalleryItem[]> {
  // Placeholder — populate when real photography is available
  return [];
}
