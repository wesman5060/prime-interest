// Download 50 curated Pexels stock photos for the About-teaser picker.
// Each is cropped to 4:5 portrait, color-graded to match the site.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "about-candidates");

const TARGET_W = 614;
const TARGET_H = 768;

// 50 curated Pexels photo IDs. Ordered by my best guess at strength.
const IDS = [
  10365934, 29502895, 5802827, 9751100, 8961133, 29299826, 24525165, 8961134, 8961259, 8961065,
  8961146, 8961026, 8961152, 8961154, 8961157, 8961151, 8961260, 8482551, 9405477, 30379883,
  36930873, 5802822, 5802821, 8482865, 8482646, 3862628, 3862384, 7937367, 901941, 159358,
  544971, 8470847, 11021173, 8960943, 17395035, 16311531, 36105179, 9405517, 8469988, 13279686,
  24245275, 24245276, 29560007, 29560008, 36606410, 7937313, 8470057, 8470830, 8961027, 4458210,
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
  console.log(`OK   ${index} (${id})`);
  return true;
}

for (let i = 0; i < IDS.length; i++) {
  await fetchAndCrop(IDS[i], i + 1);
}
console.log("Done.");
