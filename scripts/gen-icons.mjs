// Genera los íconos PWA a partir de un SVG de marca.
// Uso: node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const GOLD = "#f4b740";
const GOLD_DEEP = "#d9971f";
const BG1 = "#1b1620";
const BG2 = "#0b0a0c";

const defs = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${GOLD}"/>
      <stop offset="1" stop-color="${GOLD_DEEP}"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG1}"/>
      <stop offset="1" stop-color="${BG2}"/>
    </linearGradient>
  </defs>`;

// Barras ascendentes + nodo (crecimiento / la ruta al éxito).
const glyph = `
  <g>
    <rect x="120" y="272" width="78" height="120" rx="20" fill="url(#g)"/>
    <rect x="217" y="192" width="78" height="200" rx="20" fill="url(#g)"/>
    <rect x="314" y="112" width="78" height="280" rx="20" fill="url(#g)"/>
    <circle cx="353" cy="74" r="26" fill="${GOLD}"/>
  </g>`;

const svgAny = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs}
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  ${glyph}
</svg>`;

const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  ${defs}
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(256 256) scale(0.78) translate(-256 -256)">${glyph}</g>
</svg>`;

const dir = "public/icons";
await mkdir(dir, { recursive: true });
await writeFile("public/icon.svg", svgAny);

const render = (svg, size, out) =>
  sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);

await Promise.all([
  render(svgAny, 192, `${dir}/icon-192.png`),
  render(svgAny, 512, `${dir}/icon-512.png`),
  render(svgMaskable, 512, `${dir}/maskable-512.png`),
  render(svgAny, 180, `${dir}/apple-180.png`),
]);

console.log("Íconos generados en public/icons/");
