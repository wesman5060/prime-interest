import manifest from "./responsive-images.json";

interface Entry {
  variants: { src: string; width: number }[];
  originalWidth: number;
}

const MAP = manifest as Record<string, Entry>;

/**
 * srcSet for a local image with generated variants
 * (scripts/build-responsive.mjs). Returns undefined for remote URLs and
 * images with no variants, so callers can spread the result safely:
 *   <img src={src} {...respSrcSet(src)} sizes="..." />
 */
export function respSrcSet(src: string): { srcSet: string } | undefined {
  const e = MAP[src];
  if (!e) return undefined;
  const candidates = [
    ...e.variants.map((v) => `${v.src} ${v.width}w`),
    `${src} ${e.originalWidth}w`,
  ];
  return { srcSet: candidates.join(", ") };
}

/** Smallest-variant path when one exists — for thumbnails that never need full size. */
export function smallSrc(src: string): string {
  return MAP[src]?.variants[0]?.src ?? src;
}
