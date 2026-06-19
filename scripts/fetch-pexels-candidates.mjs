// Download 10 curated Pexels stock photos for the About-teaser slot.
// Each is cropped to 4:5 portrait (614x768), color-graded to match the site.
// Pexels licence: free to use, attribution appreciated but not required.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "about-candidates");

const TARGET_W = 614;
const TARGET_H = 768;

// Curated 10. Each: pexels photo id + a slug for the filename hint.
const PICKS = [
  { id: 8961133, slug: "engineering-team-outdoor" },
  { id: 8961146, slug: "two-engineers-blueprint" },
  { id: 5802827, slug: "surveyor-with-bulldozer" },
  { id: 9751100, slug: "group-surveyors-foggy" },
  { id: 10365934, slug: "team-map-forest" },
  { id: 29502895, slug: "hands-blueprint-outdoor" },
  { id: 3862628, slug: "hands-pointing-blueprint" },
  { id: 7937367, slug: "two-architects-unfinished" },
  { id: 30379883, slug: "theodolite-building-site" },
  { id: 5802822, slug: "total-station-bulldozer" },
];

async function fetchAndCrop(id, index) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 prime-interest about-teaser candidate picker" },
  });
  if (!res.ok) throw new Error(`fetch ${id} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());

  // Center-crop to 4:5 portrait, apply the same warm grade as the rest of the site.
  const meta = await sharp(buf).metadata();
  let cropW = Math.floor((meta.height * TARGET_W) / TARGET_H);
  let cropH = meta.height;
  if (cropW > meta.width) {
    cropW = meta.width;
    cropH = Math.floor((meta.width * TARGET_H) / TARGET_W);
  }
  const left = Math.floor((meta.width - cropW) / 2);
  const top = Math.floor((meta.height - cropH) / 2);

  const out = join(outDir, `${String(index).padStart(2, "0")}.jpg`);
  await sharp(buf)
    .extract({ left, top, width: cropW, height: cropH })
    .resize({ width: TARGET_W, height: TARGET_H, fit: "cover" })
    .modulate({ saturation: 0.94 })
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log(`wrote ${index}: ${id}`);
}

for (let i = 0; i < PICKS.length; i++) {
  await fetchAndCrop(PICKS[i].id, i + 1);
}
console.log("Done.");
