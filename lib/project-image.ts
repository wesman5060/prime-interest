import type { Project, ProjectType } from "@/lib/content/types";

/**
 * Curated fallback photography per development type, used when a project has
 * no real images of its own. Keeps the grid, map panels, and detail pages
 * visually complete while real photography is sourced.
 */
export const TYPE_IMAGES: Record<ProjectType, string> = {
  "luxury-apartments": "/images/luxury-apartments.jpg",
  "student-housing":   "/images/student-housing.jpg",
  "mixed-use":         "/images/mixed-use.jpg",
  "medical-office":    "/images/medical-office.jpg",
  "commercial":        "/images/commercial.jpg",
  "industrial":        "/images/industrial.jpg",
  "single-family":     "/images/single-family.jpg",
  "townhomes":         "/images/townhomes.jpg",
  "subdivision":       "/images/subdivision.jpg",
  "other":             "/images/commercial.jpg",
};

/** Primary image for a project — its first real photo, or a typed fallback. */
export function getProjectImage(project: Project): string {
  if (project.images?.length > 0) return project.images[0];
  return TYPE_IMAGES[project.type] ?? TYPE_IMAGES.other;
}

/** True when the project has at least one real (non-fallback) photo. */
export function hasRealPhotos(project: Project): boolean {
  return (project.images?.length ?? 0) > 0;
}
