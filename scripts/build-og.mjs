// Build the social Open Graph image (1200x630). Run with: node scripts/build-og.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const W = 1200;
const H = 630;
const GOLD = "#C9A96E";

await mkdir("public", { recursive: true });

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0%" stop-color="${GOLD}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- subtle border frame -->
  <rect x="40" y="40" width="${W-80}" height="${H-80}" fill="none" stroke="${GOLD}" stroke-opacity="0.18" stroke-width="1"/>

  <!-- eyebrow -->
  <g transform="translate(96, 144)">
    <line x1="0" y1="10" x2="56" y2="10" stroke="${GOLD}" stroke-width="2"/>
    <text x="76" y="16" fill="${GOLD}" font-family="Geist, Inter, Helvetica, sans-serif" font-size="18" letter-spacing="6">EST. 1990 · BUFORD, GEORGIA</text>
  </g>

  <!-- headline -->
  <text x="96" y="280" fill="#ffffff" font-family="Playfair Display, Georgia, serif" font-weight="800" font-size="92" letter-spacing="-2">Prime Interest</text>
  <text x="96" y="360" fill="${GOLD}" font-family="Playfair Display, Georgia, serif" font-weight="700" font-style="italic" font-size="56" letter-spacing="-1">Land Development</text>

  <!-- divider -->
  <line x1="96" y1="420" x2="220" y2="420" stroke="${GOLD}" stroke-width="2"/>

  <!-- sub -->
  <text x="96" y="478" fill="#bbbbbb" font-family="Geist, Inter, Helvetica, sans-serif" font-size="28" font-weight="400">Building Georgia's communities since 1990.</text>
  <text x="96" y="520" fill="#888888" font-family="Geist, Inter, Helvetica, sans-serif" font-size="22" font-weight="400">46 developments · 3,500+ homes · 10 counties</text>

  <!-- corner mark -->
  <g transform="translate(1040, 120)">
    <circle cx="0" cy="0" r="48" fill="none" stroke="${GOLD}" stroke-width="1.5"/>
    <ellipse cx="0" cy="0" rx="48" ry="20" fill="none" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.7"/>
    <ellipse cx="0" cy="0" rx="20" ry="48" fill="none" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.7"/>
    <line x1="-48" y1="0" x2="48" y2="0" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.7"/>
    <line x1="0" y1="-48" x2="0" y2="48" stroke="${GOLD}" stroke-width="1" stroke-opacity="0.7"/>
  </g>
</svg>
`;

const out = "public/og.jpg";
const info = await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);

console.log(`Wrote ${out} ${info.width}x${info.height} ${Math.round(info.size/1024)}KB`);
