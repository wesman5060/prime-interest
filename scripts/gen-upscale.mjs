// Improve the real logo: 4x super-resolution upscale via Real-ESRGAN (faithful, non-generative).
// Usage: node scripts/gen-upscale.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const token = readFileSync(join(root, ".env.local"), "utf8").match(/REPLICATE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!token) throw new Error("No REPLICATE_API_TOKEN");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

// Source PNG as data URI
const png = readFileSync(join(root, "public", "original-logo.png"));
const dataUri = `data:image/png;base64,${png.toString("base64")}`;

// Resolve latest Real-ESRGAN version
const modelRes = await fetch("https://api.replicate.com/v1/models/nightmareai/real-esrgan", { headers: H });
const model = await modelRes.json();
const version = model.latest_version?.id;
if (!version) throw new Error("Could not resolve real-esrgan version: " + JSON.stringify(model).slice(0, 200));
console.log("version", version);

// Create prediction
async function create() {
  for (let a = 0; a < 6; a++) {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: H,
      body: JSON.stringify({ version, input: { image: dataUri, scale: 4, face_enhance: false } }),
    });
    const json = await res.json();
    if (res.status === 429) { const w = (json.retry_after ?? 11) + 2; console.log(`throttled ${w}s`); await sleep(w * 1000); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
    return json;
  }
  throw new Error("rate limited too many times");
}

let pred = await create();
// Poll
while (pred.status !== "succeeded" && pred.status !== "failed" && pred.status !== "canceled") {
  await sleep(2500);
  const r = await fetch(pred.urls.get, { headers: H });
  pred = await r.json();
  console.log("status", pred.status);
}
if (pred.status !== "succeeded") throw new Error("prediction " + pred.status + ": " + pred.error);

const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
const img = await fetch(url);
const buf = Buffer.from(await img.arrayBuffer());
const out = join(root, "public", "logo-ai", "original-upscaled.png");
writeFileSync(out, buf);
console.log(`saved ${out} (${buf.length} bytes)`);
