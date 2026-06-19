// Genera los íconos PWA — branding USA Latino Prime (navy + barras doradas).
// Uso: node scripts/gen-icons.mjs
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BG1 = "#13213f";
const BG2 = "#060d1c";

const defs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BG1}"/>
      <stop offset="1" stop-color="${BG2}"/>
    </linearGradient>
  </defs>`;

// Barras ascendentes (crecimiento) en degradado dorado de la marca.
const glyph = `
  <g>
    <rect x="120" y="272" width="78" height="120" rx="20" fill="#e9ae4e"/>
    <rect x="217" y="192" width="78" height="200" rx="20" fill="#f2bc5a"/>
    <rect x="314" y="112" width="78" height="280" rx="20" fill="#ffd98a"/>
    <circle cx="353" cy="74" r="26" fill="#ffd98a"/>
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
