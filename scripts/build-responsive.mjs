// Generate small responsive variants for every image the site serves in a
// card / phone-width context, and write a manifest the runtime helper uses
// to emit srcset. Rerun after adding any new project photo:
//   node scripts/build-responsive.mjs
//
// Variants are written next to the original as <name>-640w.jpg (or -960w for
// the hero poster / office panorama) and mapped in lib/responsive-images.json.

import sharp from "sharp";
import { readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const JOBS = [];

// Project photos + cached partner photos → 640w card variants.
for (const dir of ["public/images/projects", "public/images/projects-cache"]) {
  for (const f of await readdir(dir)) {
    if (!f.endsWith(".jpg") || f.includes("-640w") || f.includes("-960w")) continue;
    JOBS.push({ src: path.join(dir, f), width: 640 });
  }
}

// Type-fallback imagery (served on every project card without a real photo).
for (const name of [
  "luxury-apartments", "student-housing", "mixed-use", "medical-office",
  "commercial", "industrial", "single-family", "townhomes", "subdivision",
]) {
  const p = `public/images/${name}.jpg`;
  if (existsSync(p)) JOBS.push({ src: p, width: 640 });
}

// Full-bleed images → 960w phone variants.
for (const p of ["public/images/hero-poster.jpg", "public/images/office.jpg"]) {
  if (existsSync(p)) JOBS.push({ src: p, width: 960 });
}

const manifest = {};
for (const { src, width } of JOBS) {
  const meta = await sharp(src).metadata();
  if (!meta.width || meta.width <= width) continue; // nothing to gain
  const webSrc = "/" + src.replace(/\\/g, "/").replace(/^public\//, "");
  const entry = { variants: [], originalWidth: meta.width };
  // Two tiers: `width` covers 1x card/phone renders; the mid tier covers
  // high-DPR phones (~2.6x on common devices) that would otherwise pull
  // the full-size original.
  const widths = width === 640 ? [640, 1024] : [width];
  for (const w of widths) {
    if (meta.width <= w) continue;
    const out = src.replace(/\.jpg$/, `-${w}w.jpg`);
    const info = await sharp(src)
      .resize(w, null, { withoutEnlargement: true })
      .jpeg({ quality: 76, mozjpeg: true })
      .toFile(out);
    const webOut = "/" + out.replace(/\\/g, "/").replace(/^public\//, "");
    entry.variants.push({ src: webOut, width: info.width });
    console.log(`${webSrc} -> ${webOut} (${info.width}w, ${Math.round(info.size / 1024)}KB)`);
  }
  if (entry.variants.length) manifest[webSrc] = entry;
}

await writeFile("lib/responsive-images.json", JSON.stringify(manifest, null, 2));
console.log(`\nmanifest: ${Object.keys(manifest).length} entries -> lib/responsive-images.json`);
