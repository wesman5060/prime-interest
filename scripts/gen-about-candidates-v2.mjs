// Regenerate the 10 About-teaser candidates with a construction-site +
// plat-review vibe. Professionals reviewing site plans on graded Georgia land,
// not a lone hard-hat-guy.
import { readFileSync } from "node:fs";
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
    pred = j; break;
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
  console.log(`wrote candidate ${index}`);
}

// Construction-site + plan-review vibe. Each prompt is engineered to:
//   - put PROFESSIONALS (not laborers) on the site
//   - feature documents (plats, blueprints, tablets, rolls)
//   - keep the Georgia land context (red clay, pines, graded development)
//   - avoid the lone-hardhat-stock look (always 2+ people)
//   - avoid generative text/signage failures (no signs, no logos, no text)
const PROMPTS = [
  // 1 — Tailgate plat review
  "Photograph of two professional land developers in their forties, business casual button-down shirts and hard hats, leaning over a large rolled-out site plan spread on the open tailgate of a pickup truck, freshly graded red Georgia clay development site visible behind them, distant pine forest, soft golden hour light, premium editorial real estate photography, no logos, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 2 — Three engineers on graded land with plat
  "Photograph of three civil engineers in collared shirts and hard hats reviewing a large blueprint spread between them on a folding table, standing at the edge of a freshly graded red clay development site in rural Georgia, distant pine trees and rolling hills, late afternoon warm light, premium editorial composition, no logos, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 3 — Over-the-shoulder plat detail
  "Over-the-shoulder photograph of two men in business casual and hard hats studying a detailed land survey plat held between them, blurred red Georgia clay graded development site in the background, golden hour, premium editorial composition, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 4 — Developer + architect pointing at site
  "Photograph of a senior land developer in a button-down shirt and an architect in business casual standing on a slight rise overlooking a freshly graded red clay development site, the older man pointing toward the distance, both holding rolled blueprints, dense pine forest and rolling hills behind, soft warm afternoon light, premium editorial real estate photography, no logos, no readable text, hyper-detailed, 4:5 portrait orientation",

  // 5 — Tablet site walkthrough
  "Photograph of two land development professionals walking across a graded red clay site in rural Georgia, both in collared shirts and hard hats, one holding a tablet showing a development site plan, the other gesturing toward the landscape, pine forest backdrop, late afternoon golden hour, premium editorial composition, no logos, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 6 — Aerial wide of small team on site
  "Aerial drone photograph from above of three professionals standing in a triangle on freshly graded red Georgia clay, large unrolled site plan visible on the ground between them, surrounded by dense pine forest at the edges, late afternoon golden light, premium editorial composition, no signage, no readable text, hyper-detailed, 4:5 portrait orientation",

  // 7 — Closeup hands + plat detail
  "Closeup photograph of two pairs of hands tracing a large detailed land survey plat unrolled on a wooden table, hard hats resting on the corner of the document, soft natural light, very shallow depth of field, premium editorial real estate photography, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 8 — Site meeting with surveyor's tripod
  "Photograph of three land development professionals at a graded red clay Georgia development site, a surveyor's tripod and total station in the foreground, the three men reviewing a site plan together, pine forest edge in background, late afternoon warm light, premium editorial real estate photography, no logos, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",

  // 9 — Dusk site review with vehicle headlights
  "Photograph of two land developers in business casual reviewing rolled blueprints on the hood of a pickup truck at dusk on a freshly graded red Georgia clay development site, soft blue and orange dusk sky, golden light from the truck headlights, distant pine forest, premium editorial composition, cinematic, no logos, no readable text, hyper-detailed, 4:5 portrait orientation",

  // 10 — Plat held against the landscape
  "Photograph of a senior land developer holding a large rolled-out site plat in both hands against the backdrop of a freshly graded red Georgia clay development site and pine forest beyond, the document partly transparent against the landscape, late afternoon golden light, premium editorial real estate photography, no readable text, no signage, hyper-detailed, 4:5 portrait orientation",
];

for (let i = 0; i < PROMPTS.length; i++) {
  await generateFlux(PROMPTS[i], i + 1);
}
console.log("Done. 10 v2 candidates ready.");
