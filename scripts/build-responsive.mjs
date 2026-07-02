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
  const out = src.replace(/\.jpg$/, `-${width}w.jpg`);
  const info = await sharp(src)
    .resize(width, null, { withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(out);
  const webSrc = "/" + src.replace(/^public\//, "").replace(/\\/g, "/");
  const webOut = "/" + out.replace(/^public\//, "").replace(/\\/g, "/");
  manifest[webSrc] = { variant: webOut, variantWidth: info.width, originalWidth: meta.width };
  console.log(`${webSrc} -> ${webOut} (${info.width}w, ${Math.round(info.size / 1024)}KB)`);
}

await writeFile("lib/responsive-images.json", JSON.stringify(manifest, null, 2));
console.log(`\nmanifest: ${Object.keys(manifest).length} entries -> lib/responsive-images.json`);
