// Build favicon PNGs (32px, 192px, 512px, apple-touch 180px) from the
// GlobeMark-style wireframe globe on black. Run: node scripts/build-favicon.mjs
import sharp from "sharp";

const GOLD = "#C9A96E";

function globeSvg(size, pad) {
  const c = size / 2;
  const r = c - pad;
  const rMinor = r * 0.42;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <g stroke="${GOLD}" fill="none" stroke-width="${Math.max(size / 32, 1.5)}">
    <circle cx="${c}" cy="${c}" r="${r}"/>
    <ellipse cx="${c}" cy="${c}" rx="${r}" ry="${rMinor}"/>
    <ellipse cx="${c}" cy="${c}" rx="${rMinor}" ry="${r}"/>
    <line x1="${c - r}" y1="${c}" x2="${c + r}" y2="${c}"/>
    <line x1="${c}" y1="${c - r}" x2="${c}" y2="${c + r}"/>
  </g>
</svg>`;
}

const targets = [
  { file: "public/favicon-32.png", size: 32, pad: 3 },
  { file: "public/favicon-192.png", size: 192, pad: 18 },
  { file: "public/favicon-512.png", size: 512, pad: 48 },
  { file: "public/apple-touch-icon.png", size: 180, pad: 26 },
];

for (const t of targets) {
  const info = await sharp(Buffer.from(globeSvg(t.size, t.pad))).png().toFile(t.file);
  console.log(`${t.file} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
