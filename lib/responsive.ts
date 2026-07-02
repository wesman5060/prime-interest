import manifest from "./responsive-images.json";

interface Variant {
  variant: string;
  variantWidth: number;
  originalWidth: number;
}

const MAP = manifest as Record<string, Variant>;

/**
 * srcSet for a local image that has a generated small variant
 * (scripts/build-responsive.mjs). Returns undefined for remote URLs and
 * images with no variant, so callers can spread the result safely:
 *   <img src={src} {...respSrcSet(src)} sizes="..." />
 */
export function respSrcSet(src: string): { srcSet: string } | undefined {
  const v = MAP[src];
  if (!v) return undefined;
  return { srcSet: `${v.variant} ${v.variantWidth}w, ${src} ${v.originalWidth}w` };
}

/** Small-variant path when one exists — for thumbnails that never need full size. */
export function smallSrc(src: string): string {
  return MAP[src]?.variant ?? src;
}
