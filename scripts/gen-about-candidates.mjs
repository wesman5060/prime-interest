// Generate 10 candidate images for the home page About-teaser slot.
//
//  1–4: portrait crops of existing /public/images stock photos
//  5–10: fresh atmospheric Georgia drone shots via Replicate Flux-schnell
//
// Output: public/images/about-candidates/{01..10}.jpg
// Run: node scripts/gen-about-candidates.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "about-candidates");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const token = readFileSync(join(root, ".env.local"), "utf8").match(/REPLICATE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!token) throw new Error("No REPLICATE_API_TOKEN");

const TARGET_W = 614;
const TARGET_H = 768;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

/** Center-crop a landscape source to TARGET_W × TARGET_H portrait. */
async function cropSourceToPortrait(srcRel, index) {
  const src = join(root, srcRel);
  const meta = await sharp(src).metadata();
  // Decide the crop window: keep full height when possible, otherwise scale.
  let extractWidth = Math.floor((meta.height * TARGET_W) / TARGET_H);
  let extractHeight = meta.height;
  if (extractWidth > meta.width) {
    extractWidth = meta.width;
    extractHeight = Math.floor((meta.width * TARGET_H) / TARGET_W);
  }
  const left = Math.floor((meta.width - extractWidth) / 2);
  const top = Math.floor((meta.height - extractHeight) / 2);
  const out = join(outDir, `${String(index).padStart(2, "0")}.jpg`);
  await sharp(src)
    .extract({ left, top, width: extractWidth, height: extractHeight })
    .resize({ width: TARGET_W, height: TARGET_H, fit: "cover" })
    .modulate({ saturation: 0.94 })
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log(`wrote candidate ${index} from ${srcRel}`);
}

/** Generate a fresh image via Replicate Flux-schnell. */
async function generateFlux(prompt, index) {
  // Resolve latest model version
  const modelRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell", { headers: H });
  const model = await modelRes.json();
  const version = model.latest_version?.id;
  if (!version) throw new Error("Could not resolve flux-schnell version");

  const body = {
    version,
    input: {
      prompt,
      aspect_ratio: "4:5",
      output_format: "jpg",
      output_quality: 92,
      num_outputs: 1,
      num_inference_steps: 4,
    },
  };

  let pred;
  for (let a = 0; a < 6; a++) {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: H,
      body: JSON.stringify(body),
    });
    const j = await res.json();
    if (res.status === 429) {
      const w = (j.retry_after ?? 11) + 2;
      console.log(`throttled ${w}s`);
      await sleep(w * 1000);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
    pred = j;
    break;
  }
  if (!pred) throw new Error("rate limited too many times");

  // Poll
  while (pred.status !== "succeeded" && pred.status !== "failed" && pred.status !== "canceled") {
    await sleep(1500);
    const r = await fetch(pred.urls.get, { headers: H });
    pred = await r.json();
  }
  if (pred.status !== "succeeded") throw new Error("prediction " + pred.status + ": " + pred.error);

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const img = await fetch(url);
  const buf = Buffer.from(await img.arrayBuffer());

  // Normalize to TARGET_W × TARGET_H portrait
  const out = join(outDir, `${String(index).padStart(2, "0")}.jpg`);
  await sharp(buf)
    .resize({ width: TARGET_W, height: TARGET_H, fit: "cover" })
    .modulate({ saturation: 0.94 })
    .jpeg({ quality: 88 })
    .toFile(out);
  console.log(`wrote candidate ${index} (AI)`);
}

// 1–4: crops of existing stock images
await cropSourceToPortrait("public/images/hero-poster.jpg", 1);
await cropSourceToPortrait("public/images/subdivision.jpg", 2);
await cropSourceToPortrait("public/images/single-family.jpg", 3);
await cropSourceToPortrait("public/images/mixed-use.jpg", 4);

// 5–10: fresh AI drone shots, all atmospheric, no people
const PROMPTS = [
  "Aerial drone photograph of rolling Georgia foothills covered in pine forest at sunrise, soft morning mist clinging to the valleys, golden hour light, premium editorial real estate photography, no people, cinematic composition, 4:5 portrait orientation",
  "Aerial drone photograph of a winding red clay road carving through dense Georgia pine forest at dawn, atmospheric morning mist, no people, premium editorial composition, soft warm light, 4:5 portrait orientation",
  "Top-down aerial drone photograph of a newly graded development site in Georgia, red clay building pads laid out in a curved street pattern, surrounded by pine forest, golden hour, no people, premium editorial real estate photography, 4:5 portrait orientation",
  "Aerial drone photograph of rural Georgia at golden hour, rolling pasture with a single red clay road cutting through, distant blue ridge mountains on the horizon, no people, no vehicles, premium editorial composition, 4:5 portrait orientation",
  "Aerial drone photograph of a quiet completed luxury suburban community at dusk, manicured streets curving through pine trees, lit windows starting to glow, warm sunset sky, no people visible, premium editorial real estate photography, 4:5 portrait orientation",
  "High overhead drone photograph of dense Georgia longleaf pine forest at the boundary of a cleared development site, organic edge between forest and red clay, soft afternoon light, no people, premium editorial composition, 4:5 portrait orientation",
];

for (let i = 0; i < PROMPTS.length; i++) {
  await generateFlux(PROMPTS[i], 5 + i);
}

console.log("Done. 10 candidates in public/images/about-candidates/");
