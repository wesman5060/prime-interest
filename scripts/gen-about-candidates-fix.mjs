// Replace candidates 04, 07, 10 which came back with AI artifacts.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "about-candidates");
const token = readFileSync(join(root, ".env.local"), "utf8").match(/REPLICATE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!token) throw new Error("No REPLICATE_API_TOKEN");

const TARGET_W = 614;
const TARGET_H = 768;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function generateFlux(prompt, index) {
  const modelRes = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell", { headers: H });
  const model = await modelRes.json();
  const version = model.latest_version?.id;

  let pred;
  for (let a = 0; a < 6; a++) {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: H,
      body: JSON.stringify({
        version,
        input: {
          prompt,
          aspect_ratio: "4:5",
          output_format: "jpg",
          output_quality: 92,
          num_outputs: 1,
          num_inference_steps: 4,
        },
      }),
    });
    const j = await res.json();
    if (res.status === 429) { await sleep(((j.retry_after ?? 11) + 2) * 1000); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
    pred = j;
    break;
  }
  while (pred.status !== "succeeded" && pred.status !== "failed") {
    await sleep(1500);
    pred = await (await fetch(pred.urls.get, { headers: H })).json();
  }
  if (pred.status !== "succeeded") throw new Error("prediction " + pred.status + ": " + pred.error);

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const out = join(outDir, `${String(index).padStart(2, "0")}.jpg`);
  await sharp(buf).resize({ width: TARGET_W, height: TARGET_H, fit: "cover" })
    .modulate({ saturation: 0.94 }).jpeg({ quality: 88 }).toFile(out);
  console.log(`wrote candidate ${index} (AI fixed)`);
}

const FIXES = [
  [4, "Aerial drone photograph of a curated Georgia residential neighborhood at golden hour sunset, two-story homes with manicured lawns separated by mature oak trees, organic curving streets, warm orange evening light, no people visible, premium editorial real estate photography, hyper-detailed, no text, no signage, 4:5 portrait orientation"],
  [7, "Top-down aerial photograph of freshly graded red Georgia clay land prepared for a new subdivision, three new asphalt roads carving the parcel into building lots, dense pine forest at the edges, late afternoon sun casting long shadows, no people, no vehicles, no buildings yet, no signage, premium editorial composition, 4:5 portrait orientation"],
  [10, "Aerial drone photograph looking straight down over the boundary between dense Georgia longleaf pine forest and a recently cleared red clay development parcel, the edge of the trees creating a natural curve, warm afternoon golden hour light, no people, no vehicles, no drone visible, no signage, premium editorial composition, hyper-detailed, 4:5 portrait orientation"],
];

for (const [idx, prompt] of FIXES) {
  await generateFlux(prompt, idx);
}
console.log("Done.");
