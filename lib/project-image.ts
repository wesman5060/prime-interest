import type { Project, ProjectType } from "@/lib/content/types";
import cachedImages from "./cached-images.json";

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

const CACHE_MAP = cachedImages as Record<string, string>;

/**
 * Translate a partner-CDN image URL to its locally-cached, resized copy if
 * one exists. Falls through to the original URL when the URL hasn't been
 * cached (yet). Run scripts/cache-partner-images.mjs to refresh.
 */
export function cachedImage(src: string): string {
  return CACHE_MAP[src] ?? src;
}

/** Primary image for a project — its first real photo, or a typed fallback. */
export function getProjectImage(project: Project): string {
  const src =
    project.images?.length > 0 ? project.images[0] : (TYPE_IMAGES[project.type] ?? TYPE_IMAGES.other);
  return cachedImage(src);
}

/** All images for a project, each translated to its cached local copy when available. */
export function getProjectImages(project: Project): string[] {
  if (project.images?.length > 0) return project.images.map(cachedImage);
  return [TYPE_IMAGES[project.type] ?? TYPE_IMAGES.other];
}

/** True when the project has at least one real (non-fallback) photo. */
export function hasRealPhotos(project: Project): boolean {
  return (project.images?.length ?? 0) > 0;
}
