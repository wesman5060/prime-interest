// One-off: generate premium globe-mark logo concepts via Replicate (Flux).
// Usage: node scripts/gen-logos.mjs
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Parse REPLICATE_API_TOKEN from .env.local
const env = readFileSync(join(root, ".env.local"), "utf8");
const token = env.match(/REPLICATE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!token) throw new Error("No REPLICATE_API_TOKEN in .env.local");

const OUT = join(root, "public", "logo-ai");
mkdirSync(OUT, { recursive: true });

const prompts = [
  ["mark-lineart", "minimalist luxury logo icon, a wireframe globe showing North and South America continents, thin elegant gold lines on pure black background, premium real estate brand mark, centered, symmetrical, flat vector, high contrast, no text"],
  ["mark-solid", "premium logo icon, a solid gold sphere globe with engraved North and South America continents, subtle metallic gold gradient on black background, elegant luxury emblem, flat, centered, no text"],
  ["mark-geometric", "modern geometric globe logo icon, gold meridian lines forming a sphere, North and South America subtly shown, minimal, flat design, black background, app icon style, no text"],
  ["mark-crest", "luxury circular crest emblem with a globe and the Americas in the center, refined gold foil on black, real estate development seal, elegant, symmetrical, no text"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gen([name, prompt], i) {
  let res, json;
  for (let attempt = 0; attempt < 6; attempt++) {
    res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: "1:1", num_outputs: 1, output_format: "png", go_fast: true },
      }),
    });
    json = await res.json();
    if (res.status === 429) {
      const wait = (json.retry_after ?? 11) + 2;
      console.log(`[${name}] throttled, waiting ${wait}s...`);
      await sleep(wait * 1000);
      continue;
    }
    break;
  }
  if (!res.ok) {
    console.error(`[${name}] HTTP ${res.status}:`, JSON.stringify(json).slice(0, 300));
    return;
  }
  const url = Array.isArray(json.output) ? json.output[0] : json.output;
  if (!url) {
    console.error(`[${name}] no output. status=${json.status} err=${json.error}`);
    return;
  }
  const img = await fetch(url);
  const buf = Buffer.from(await img.arrayBuffer());
  const file = join(OUT, `${name}.png`);
  writeFileSync(file, buf);
  console.log(`[${name}] saved ${file} (${buf.length} bytes)`);
}

const onlyFirst = process.argv.includes("--test");
const list = onlyFirst ? prompts.slice(0, 1) : prompts;
for (let i = 0; i < list.length; i++) {
  try { await gen(list[i], i); } catch (e) { console.error(`[${list[i][0]}] error`, e.message); }
  if (i < list.length - 1) await sleep(12000); // stay under 6/min burst-1 limit
}
console.log("done");
