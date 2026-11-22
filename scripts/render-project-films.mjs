/**
 * Renders an 8-second silent film per project (video/ProjectFilm.tsx) into
 * public/videos/projects/<slug>.mp4, from the media made by build-project-media.mjs.
 *
 *   node scripts/render-project-films.mjs [--only=slug,slug]
 */
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

import { PROJECTS, SCRAPED_PROJECTS } from "./project-content.mjs";

const browserExecutable = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find(existsSync);
const media = JSON.parse(await readFile("scripts/project-media.json", "utf8"));
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");

const serveUrl = await bundle({ entryPoint: path.resolve("video/ProjectFilm.tsx"), publicDir: path.resolve("public") });
await mkdir("public/videos/projects", { recursive: true });

for (const { slug, title, category } of [...PROJECTS, ...SCRAPED_PROJECTS]) {
  if (!media[slug] || (only && !only.includes(slug))) continue;
  const inputProps = { slug, title, category, accent: media[slug].accent, pageHeight: media[slug].pageHeight };
  const composition = await selectComposition({ serveUrl, id: "ProjectFilm", inputProps, browserExecutable });
  await renderMedia({
    composition, serveUrl, inputProps, browserExecutable, codec: "h264", crf: 26, concurrency: 4, muted: true,
    outputLocation: `public/videos/projects/${slug}.mp4`,
  });
  console.log(`ok ${slug}`);
}
