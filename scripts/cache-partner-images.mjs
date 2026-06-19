// Walk content/projects.ts, download every remote partner-CDN image, resize
// to a reasonable web maximum (1600px wide), save locally under
// public/images/projects-cache/<hash>.jpg, and emit a JSON manifest mapping
// the original URL → the local path. The site reads the manifest at build
// time so the static export can serve every project image from our own
// origin instead of a dozen builder partner CDNs.
//
// Run any time content/projects.ts changes a partner URL:
//   node scripts/cache-partner-images.mjs

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "images", "projects-cache");
const manifestPath = join(root, "lib", "cached-images.json");
mkdirSync(outDir, { recursive: true });

const projectsSrc = readFileSync(join(root, "content", "projects.ts"), "utf8");
const urls = new Set();
const re = /"(https:\/\/[^"]+)"/g;
let m;
while ((m = re.exec(projectsSrc)) !== null) urls.add(m[1]);

const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : {};

let cached = 0, skipped = 0, errored = 0;
for (const url of urls) {
  if (manifest[url] && existsSync(join(root, "public", manifest[url].replace(/^\//, "")))) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PrimeInterestImageCache/1.0)",
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
      },
    });
    if (!res.ok) {
      console.log(`skip ${url} (${res.status})`);
      errored++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const hash = crypto.createHash("sha1").update(url).digest("hex").slice(0, 12);
    const filename = `${hash}.jpg`;
    const filepath = join(outDir, filename);
    const optimized = await sharp(buf)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
    writeFileSync(filepath, optimized);
    manifest[url] = `/images/projects-cache/${filename}`;
    cached++;
    console.log(
      `OK ${filename}  (${(optimized.length / 1024).toFixed(0)}KB)  ← ${url.slice(0, 70)}`,
    );
  } catch (e) {
    errored++;
    console.log(`err ${url}: ${e.message}`);
  }
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(
  `\nDone. cached=${cached}  skipped(already)=${skipped}  failed=${errored}  manifest=${Object.keys(manifest).length}`,
);
