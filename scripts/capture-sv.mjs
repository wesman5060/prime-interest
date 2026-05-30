// Capture a Google Street View still and polish it for a project image.
// Usage: node scripts/capture-sv.mjs <slug> <panoid> [heading] [pitch] [fov]
//
// Defaults: heading from URL, pitch=0, fov=75
// Output: public/images/projects/<slug>.jpg (polished, ~120KB, 1600px wide)

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const [, , slug, panoid, headingArg = "0", pitchArg = "0", fovArg = "75"] = process.argv;
if (!slug || !panoid) {
  console.error("usage: node scripts/capture-sv.mjs <slug> <panoid> [heading] [pitch] [fov]");
  process.exit(1);
}

const heading = Number(headingArg);
const pitch = Number(pitchArg);
const fov = Number(fovArg);

// Pull the largest free thumbnail Google will serve.
const url = `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=2048&h=1280&pitch=${pitch}&panoid=${panoid}&yaw=${heading}&thumbfov=${fov}`;

console.log(`[${slug}] fetching pano ${panoid} heading=${heading} pitch=${pitch} fov=${fov}`);
const res = await fetch(url);
if (!res.ok) {
  console.error(`fetch failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());

await mkdir("public/images/original", { recursive: true });
await mkdir("public/images/projects", { recursive: true });
const rawPath = `public/images/original/${slug}-sv.jpg`;
await writeFile(rawPath, buf);
console.log(`  raw: ${rawPath} (${Math.round(buf.length/1024)}KB)`);

const outPath = `public/images/projects/${slug}.jpg`;
const info = await sharp(buf)
  .resize(1600, null, { withoutEnlargement: true })
  .modulate({ brightness: 1.03, saturation: 1.10 })
  .linear(1.06, -6)
  .sharpen()
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(outPath);
console.log(`  out: ${outPath} ${info.width}x${info.height} ${Math.round(info.size/1024)}KB`);
