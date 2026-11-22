/**
 * Adds each project's banner, device mockups, film and page link under its heading
 * in the portfolio markdown, plus a section for live projects the .md did not list.
 * Paths are site-root relative (/images/..., /videos/...). Safe to re-run.
 *
 *   node scripts/add-media-to-md.mjs <in.md> <out.md>
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { PROJECTS, SCRAPED_PROJECTS } from "./project-content.mjs";

const [input, output = input] = process.argv.slice(2);
const HEADINGS = {
  "Karji (The House of Karji)": "house-of-karji",
  "Atelier Perfumery": "atelier-perfumery",
  "Flower District": "flower-district-delivery",
  "Daima": "daima",
  "Juvenis Paris": "juvenis-paris",
  "Touch of Oud": "touch-of-oud",
  "Saleel Parfums": "fragrance-brand-care",
  "Mechaura International": "mechaura",
  "Internal Business Applications": ["maylaa-assets", "finora", "certguard"],
  "NexEcoms": "nexecoms",
  "Invitara": "invitara",
  "NexPixels": "nexpixels-automation",
  "Torque Moulds Factory": "torque-moulds",
};
const all = [...PROJECTS, ...SCRAPED_PROJECTS];
const bySlug = Object.fromEntries(all.map((p) => [p.slug, p]));
const has = (url) => existsSync(`public${url}`);

function block(slug) {
  const p = bySlug[slug];
  const base = `/images/projects/${slug}`;
  if (!p || !has(`${base}/banner.webp`)) return "";
  const film = `/videos/projects/${slug}.mp4`;
  return [
    `<!-- media:${slug} -->`,
    `![${p.title} project banner](${base}/banner.webp)`,
    "",
    ...(has(`${base}/mobile.webp`) ? [
      `| Desktop | Tablet | Mobile |`,
      `|---|---|---|`,
      `| ![${p.title} desktop mockup](${base}/desktop.webp) | ![${p.title} tablet mockup](${base}/tablet.webp) | ![${p.title} mobile mockup](${base}/mobile.webp) |`,
      "",
    ] : []),
    `![${p.title} on desktop, tablet and mobile](${base}/devices.webp)`,
    "",
    [has(film) && `🎬 [Project film](${film})`, `📄 [Case study](/projects/${slug})`, p.viewUrl && `🌐 [Live site](${p.viewUrl})`].filter(Boolean).join(" · "),
    `<!-- /media:${slug} -->`,
    "",
  ].join("\n");
}

let md = readFileSync(input, "utf8")
  .replace("**Fragrance & lifestyle brand · UAE · Shopify**", "**Fine food, dates & gifting · UAE · Shopify**").replace(/<!-- media:[\s\S]*?<!-- \/media:[^>]+-->\n*/g, "");
md = md.replace(/<!-- more-live-projects -->[\s\S]*?<!-- \/more-live-projects -->\n*/, "");

for (const [prefix, slugs] of Object.entries(HEADINGS)) {
  const re = new RegExp(`^(### ${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^\n]*\n(?:\\*\\*[^\n]*\\*\\*\n)?)`, "m");
  const media = [slugs].flat().map(block).join("\n");
  if (media && re.test(md)) md = md.replace(re, `$1\n${media}`);
}

const extra = SCRAPED_PROJECTS.map((p) => `### ${p.title} | ${p.category}\n${p.seoDescription ?? ""}\n\n${block(p.slug)}`).join("\n");
md = md.replace(/\n## Work Experience/, `\n<!-- more-live-projects -->\n## More Live Projects\n\n${extra}<!-- /more-live-projects -->\n\n---\n\n## Work Experience`);

writeFileSync(output, md);
console.log(`Wrote ${output}`);
