/**
 * Generates the monochrome "silk" artwork used by the editorial template:
 * blurred ribbons of light over black (or soft greys over white), finished with
 * film grain. Rasterised to WebP because full-bleed blurred SVG is expensive to
 * paint while scroll animations run. Deterministic.
 *
 *   node scripts/generate-art.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "images", "art");

function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}

function silk({ seed, width, height, tone = "dark", ribbons = 5, focus = 0.5 }) {
  const rand = rng(seed);
  const dark = tone === "dark";
  const bg = dark ? "#050505" : "#ececec";
  const light = dark ? "#ffffff" : "#5e5e5e";
  const shade = dark ? "#000000" : "#9a9a9a";
  const min = Math.min(width, height);

  const paths = Array.from({ length: ribbons }, (_, i) => {
    const y0 = height * (0.1 + rand() * 0.8);
    const y1 = height * (rand() * 1.1 - 0.05);
    const cx1 = width * (focus - 0.35 + rand() * 0.3);
    const cx2 = width * (focus + 0.05 + rand() * 0.3);
    const w = min * (dark ? 0.07 + rand() * 0.2 : 0.12 + rand() * 0.28);
    const o = (dark ? 0.12 + rand() * 0.55 : 0.18 + rand() * 0.3).toFixed(2);
    const d = `M${-width * 0.1} ${y0.toFixed(0)} C${cx1.toFixed(0)} ${(y0 - height * (0.3 + rand() * 0.5)).toFixed(0)} ${cx2.toFixed(0)} ${(y1 + height * (0.2 + rand() * 0.5)).toFixed(0)} ${width * 1.1} ${y1.toFixed(0)}`;
    const id = `r${i}`;
    return {
      defs: `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}" stop-opacity="0"/><stop offset="${(0.35 + rand() * 0.3).toFixed(2)}" stop-color="${light}" stop-opacity="${o}"/><stop offset="1" stop-color="${shade}" stop-opacity="0"/></linearGradient>`,
      path: `<path d="${d}" fill="none" stroke="url(#${id})" stroke-width="${w.toFixed(0)}" stroke-linecap="round"/>`,
      edge: `<path d="${d}" fill="none" stroke="${light}" stroke-opacity="${(Number(o) * 0.5).toFixed(2)}" stroke-width="${(w * 0.05).toFixed(1)}" transform="translate(0 ${(-w * 0.32).toFixed(0)})"/>`,
    };
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice">
<defs>
<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(min * (dark ? 0.022 : 0.035)).toFixed(0)}"/></filter>
<filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${(min * 0.006).toFixed(1)}"/></filter>
<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 ${dark ? ".22" : ".16"} 0"/></filter>
<radialGradient id="v" cx="${focus}" cy=".45" r=".8"><stop offset=".45" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${dark ? "#000" : "#d6d6d6"}" stop-opacity="${dark ? ".85" : ".6"}"/></radialGradient>
${paths.map((p) => p.defs).join("")}
</defs>
<rect width="100%" height="100%" fill="${bg}"/>
<g filter="url(#b)">${paths.map((p) => p.path).join("")}</g>
<g filter="url(#s)">${paths.map((p) => p.edge).join("")}</g>
<rect width="100%" height="100%" fill="url(#v)"/>
<rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;
}

const art = [
  ["hero", { width: 1920, height: 1080, ribbons: 6, focus: 0.62 }],
  ["hero-mobile", { width: 900, height: 1600, ribbons: 5, focus: 0.5 }],
  ["silk-portrait", { width: 900, height: 1260, ribbons: 5, focus: 0.45 }],
  ["silk-pill", { width: 600, height: 840, ribbons: 4, focus: 0.55, tone: "light" }],
  ["mission", { width: 1200, height: 1500, ribbons: 6, focus: 0.4 }],
  ["benefits", { width: 1920, height: 1080, ribbons: 7, focus: 0.5 }],
  ["footer", { width: 1920, height: 1080, ribbons: 5, focus: 0.7 }],
  ["page", { width: 1920, height: 960, ribbons: 6, focus: 0.35 }],
  ["light-1", { width: 1200, height: 900, ribbons: 5, focus: 0.3, tone: "light" }],
  ["light-2", { width: 1200, height: 900, ribbons: 5, focus: 0.7, tone: "light" }],
  ["light-3", { width: 1200, height: 900, ribbons: 4, focus: 0.5, tone: "light" }],
  ["dark-1", { width: 1200, height: 900, ribbons: 5, focus: 0.3 }],
  ["dark-2", { width: 1200, height: 900, ribbons: 5, focus: 0.7 }],
  ["dark-3", { width: 1200, height: 900, ribbons: 4, focus: 0.5 }],
];

await mkdir(OUT, { recursive: true });
for (const [name, options] of art) {
  const svg = Buffer.from(silk({ seed: name, ...options }));
  await sharp(svg).webp({ quality: 74 }).toFile(path.join(OUT, `${name}.webp`));
}
console.log(`Wrote ${art.length} artworks to public/images/art`);
