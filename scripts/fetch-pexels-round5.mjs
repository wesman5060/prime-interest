// Round 5: 10 candidates curated to match the user's picks
// (1, 4, 6, 15, 26, 31, 34 — documentary, atmospheric, hands-on-docs).
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "about-candidates");
const TARGET_W = 614;
const TARGET_H = 768;

// Replace slots 1-10 with these new picks
const IDS = [
  32938586,  // 1 — Chattanooga construction site, mountain backdrop (Southern Appalachian)
  15554147,  // 2 — Rural construction site with barren landscape
  33255287,  // 3 — Two workers silhouetted on a roof during Fort Worth sunset
  28964677,  // 4 — Silhouetted workers against warm sunset sky
  14973290,  // 5 — Silhouette of workers handling soil at sunset, rural
  8469982,   // 6 — Hands examining detailed architectural blueprint with measurements
  6282077,   // 7 — Architect's hand drafting a blueprint in a workspace
  9052461,   // 8 — Hands on a detailed architectural floor plan
  4458193,   // 9 — Close-up of architectural floor plan, technical elements
  11467684,  // 10 — Drone shot of Nashville TN excavation work
];

async function fetchAndCrop(id, index) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 prime-interest about-teaser candidate picker" },
  });
  if (!res.ok) {
    console.log(`SKIP ${index} (${id}): ${res.status}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
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
    .jpeg({ quality: 86 })
    .toFile(out);
  console.log(`OK ${index} (${id})`);
  return true;
}

for (let i = 0; i < IDS.length; i++) {
  await fetchAndCrop(IDS[i], i + 1);
}
console.log("Done.");
