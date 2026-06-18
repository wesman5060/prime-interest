// Polish pass on the 4x Real-ESRGAN upscale of Marty's original logo.
// Goal: keep the same gold/black/sparkle character, but make it CRISP enough
// to ship on a modern site. Sharpens edges, deepens the black background to
// pure black, lifts the gold's contrast and removes the muddy halo around
// the wordmark and globe.
//
// Usage: node scripts/polish-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "logo-ai", "original-upscaled.png");
const outDir = join(root, "public", "logo-ai");

const buf = readFileSync(src);
const meta = await sharp(buf).metadata();
console.log(`source: ${meta.width}x${meta.height} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);

// Pipeline:
//  1. Levels — pull the black point hard so dark muddy areas become true #000.
//  2. Linear — small gain on the gold tones to brighten the wordmark.
//  3. Sharpen — unsharp mask tuned for type and the globe wires.
//  4. Optional slight saturation lift to keep the gold reading warm.
const polished = await sharp(buf)
  .linear(1.18, -32)                // gentle gain + crush blacks
  .modulate({ saturation: 1.08 })   // warm the gold back up a touch
  .sharpen({ sigma: 1.4, m1: 1.6, m2: 0.6, x1: 2, y2: 6, y3: 10 })
  .png({ compressionLevel: 9, palette: false })
  .toBuffer();

writeFileSync(join(outDir, "logo-polished.png"), polished);
console.log(`saved logo-polished.png (${(polished.length / 1024 / 1024).toFixed(2)} MB)`);

// Also emit a couple of derived sizes for the site (header @ 200px tall, hero
// @ 600px tall, retina 2x of each).
const derivs = [
  { name: "logo-h200.png", height: 200 },
  { name: "logo-h400.png", height: 400 },
  { name: "logo-h600.png", height: 600 },
  { name: "logo-h1200.png", height: 1200 },
];
for (const d of derivs) {
  const out = await sharp(polished).resize({ height: d.height, fit: "inside" }).png({ compressionLevel: 9 }).toBuffer();
  writeFileSync(join(outDir, d.name), out);
  console.log(`saved ${d.name} (${(out.length / 1024).toFixed(1)} KB)`);
}

// And a transparent-background variant — flood-fill the near-black corners so
// the wordmark drops onto any dark surface without a visible box.
const trans = await sharp(polished)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = trans;
// Iterate pixels — anything that's nearly pure black becomes fully transparent.
// We threshold gently so the warm gold halo around the wordmark stays.
const THRESHOLD = 18;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
    data[i + 3] = 0;
  } else if (Math.max(r, g, b) < 38) {
    // soft edge of the black background — partial transparency
    data[i + 3] = Math.round((Math.max(r, g, b) - 18) * 12);
  }
}
const transBuf = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(join(outDir, "logo-polished-transparent.png"), transBuf);
console.log(`saved logo-polished-transparent.png (${(transBuf.length / 1024 / 1024).toFixed(2)} MB)`);
