/**
 * Renders the brand films (video/BrandFilm.tsx) from the project media:
 *   public/videos/brand-hero.mp4 + public/images/brand/hero-poster.webp  (homepage hero)
 *   public/videos/brand-reel.mp4 + public/images/brand/reel-poster.webp  (homepage motion section)
 *   public/images/brand/{commerce,systems,web}.webp                       (page and section artwork)
 *
 *   node scripts/render-brand-films.mjs
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import sharp from "sharp";

import { PROJECTS, SCRAPED_PROJECTS } from "./project-content.mjs";

const browserExecutable = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const slugs = [...PROJECTS, ...SCRAPED_PROJECTS].map((p) => p.slug).filter((slug) => existsSync(`public/images/projects/${slug}/banner.webp`));

const serveUrl = await bundle({ entryPoint: path.resolve("video/BrandFilm.tsx"), publicDir: path.resolve("public") });
await mkdir("public/images/brand", { recursive: true });

for (const [id, file, props, posterFrame] of [
  ["BrandHero", "brand-hero", { slugs: slugs.slice(0, 15) }, 0],
  ["BrandReel", "brand-reel", { slugs }, 45],
]) {
  const composition = await selectComposition({ serveUrl, id, inputProps: props, browserExecutable });
  await renderMedia({ composition, serveUrl, inputProps: props, browserExecutable, codec: "h264", crf: 27, concurrency: 4, muted: true, outputLocation: `public/videos/${file}.mp4` });
  const still = `public/images/brand/${file}.png`;
  await renderStill({ composition, serveUrl, inputProps: props, browserExecutable, frame: posterFrame, output: still });
  await sharp(still).webp({ quality: 82 }).toFile(`public/images/brand/${file}-poster.webp`);
  console.log(`ok ${file}`);
}

// Brand stills used as page and section artwork (src/lib/media.ts ART), grouped by kind of work.
const hero = await selectComposition({ serveUrl, id: "BrandHero", inputProps: { slugs }, browserExecutable });
const groups = {
  commerce: ["house-of-karji", "atelier-perfumery", "flower-district-delivery", "daima", "juvenis-paris", "touch-of-oud", "fragrance-brand-care", "the-exceptional-parfums", "nexecoms"],
  systems: ["finora", "certguard", "nexora", "maylaa-assets", "workflow-hub", "koshys-nursing-study"],
  web: ["mechaura", "torque-moulds", "el-moretto", "hale-fashion", "nexpixels-automation", "invitara"],
};
for (const [name, group] of Object.entries(groups)) {
  const inputProps = { slugs: group.filter((slug) => slugs.includes(slug)) };
  const still = `public/images/brand/${name}.png`;
  await renderStill({ composition: { ...hero, props: inputProps }, serveUrl, inputProps, browserExecutable, frame: 90, output: still });
  await sharp(still).webp({ quality: 82 }).toFile(`public/images/brand/${name}.webp`);
  console.log(`ok ${name}`);
}
