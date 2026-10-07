/**
 * Generates the project's own placeholder imagery as SVG so the seeded site has
 * no third-party assets in it. Deterministic: same seed, same image.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "media");

/** Tiny deterministic PRNG so re-runs don't churn the files. */
function rng(seed) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

/**
 * Monochrome abstract composition: a soft gradient field with a few large
 * overlapping shapes. Reads as photography-shaped negative space without
 * pretending to be a photo.
 */
function composition({ width, height, seed, dark }) {
  const rand = rng(seed);
  const bg = dark ? "#0b0b0b" : "#e9e9e9";
  const fg = dark ? "#ffffff" : "#111111";

  const shapes = Array.from({ length: 5 }, (_, i) => {
    const cx = rand() * width;
    const cy = rand() * height;
    const r = (0.18 + rand() * 0.42) * Math.min(width, height);
    const opacity = (0.05 + rand() * 0.16).toFixed(3);
    const rotate = Math.floor(rand() * 180);

    return i % 2 === 0
      ? `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${fg}" opacity="${opacity}"/>`
      : `<rect x="${(cx - r).toFixed(0)}" y="${(cy - r / 2).toFixed(0)}" width="${(r * 2).toFixed(0)}" height="${r.toFixed(0)}" fill="${fg}" opacity="${opacity}" transform="rotate(${rotate} ${cx.toFixed(0)} ${cy.toFixed(0)})"/>`;
  }).join("");

  const angle = Math.floor(rand() * 360);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${dark ? "#2a2a2a" : "#cfcfcf"}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)"/>
  ${shapes}
</svg>`;
}

const FILES = [
  // hero + footer
  ["hero.svg", 1920, 1080, true],
  ["hero-mobile.svg", 900, 1400, true],
  ["footer-bg.svg", 1920, 900, true],
  ["og.svg", 1200, 630, true],
  ["contact-hero.svg", 1920, 900, false],
  ["services-hero.svg", 1920, 900, false],
  ["mission.svg", 1920, 1080, true],
  ["mission-about.svg", 1920, 1080, true],
  // about
  ["about-1.svg", 900, 1125, false],
  ["about-2.svg", 900, 1125, false],
  // services
  ...[1, 2, 3, 4].map((n) => [`service-${n}.svg`, 1200, 900, false]),
  // projects
  ...[1, 2, 3, 4, 5, 6].map((n) => [`project-${n}.svg`, 1400, 1050, n % 2 === 0]),
  ...[1, 2, 3].map((n) => [`project-detail-${n}.svg`, 1600, 1000, n % 2 === 1]),
  // blog
  ...[1, 2, 3, 4, 5, 6].map((n) => [`post-${n}.svg`, 1200, 900, false]),
  // people + stats
  ...[1, 2, 3].map((n) => [`team-${n}.svg`, 900, 1125, false]),
  ...[1, 2, 3].map((n) => [`benefit-${n}.svg`, 900, 1200, false]),
  ...[1, 2, 3, 4].map((n) => [`achievement-${n}.svg`, 800, 800, n % 2 === 0]),
  // playground
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => [`play-${n}.svg`, 900, 1200, n % 3 === 0]),
];

await mkdir(OUT, { recursive: true });

for (const [name, width, height, dark] of FILES) {
  const svg = composition({ width, height, seed: name, dark });
  await writeFile(path.join(OUT, name), svg, "utf8");
}

console.log(`Generated ${FILES.length} placeholder images in public/media`);
