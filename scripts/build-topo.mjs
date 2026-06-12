// Generate a topographic contour-line motif (public/images/topo.svg).
// Deterministic wobbly concentric contours, like elevation lines on a survey.
// Run: node scripts/build-topo.mjs
import { writeFile } from "node:fs/promises";

const W = 900;
const H = 900;
const CX = W * 0.62;
const CY = H * 0.45;

// One shared wobble field for every ring — real contour lines never cross,
// they nest. A light per-ring phase drift keeps it organic.
function wobble(angle, ring) {
  return (
    Math.sin(angle * 3 + ring * 0.18) * 0.07 +
    Math.sin(angle * 5 - ring * 0.12) * 0.045 +
    Math.sin(angle * 8 + ring * 0.07) * 0.025
  );
}

function contour(baseR, ring) {
  const pts = [];
  const steps = 140;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const r = baseR * (1 + wobble(a, ring));
    const x = CX + Math.cos(a) * r * 1.12 + ring * 4;
    const y = CY + Math.sin(a) * r * 0.86 - ring * 3;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `<polyline points="${pts.join(" ")}" />`;
}

const rings = [];
for (let i = 0; i < 11; i++) {
  rings.push(contour(60 + i * 52, i));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="#C9A96E" stroke-width="1" stroke-linejoin="round">
${rings.join("\n")}
<circle cx="${CX}" cy="${CY}" r="3" fill="#C9A96E" stroke="none"/>
</svg>`;

await writeFile("public/images/topo.svg", svg);
console.log(`Wrote public/images/topo.svg (${rings.length} contours, ${Math.round(svg.length / 1024)}KB)`);
