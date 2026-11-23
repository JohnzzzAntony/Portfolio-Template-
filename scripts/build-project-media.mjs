/**
 * Builds every project's media from live-site captures:
 *   public/images/projects/<slug>/{full,banner,devices,desktop,tablet,mobile}.webp + screens/0N.webp
 *
 * Sources: Firecrawl full-page desktop screenshots (.firecrawl/sites/<capture>.json)
 * and mobile/tablet captures (.firecrawl/sites/shots/<capture>-{mobile,tablet}.png,
 * taken with headless Chrome by --capture). Writes scripts/project-media.json
 * (accent colour + page height per slug) for the films and the CMS update.
 *
 *   node scripts/build-project-media.mjs --capture   # also (re)take mobile/tablet shots
 *   node scripts/build-project-media.mjs
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

import { cdpShot, closeBrowser } from "./capture.mjs";
import { PROJECTS, SCRAPED_PROJECTS } from "./project-content.mjs";

const SITES = ".firecrawl/sites";
const SHOTS = `${SITES}/shots`;
const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const TABLET_UA = "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const WEBP = { quality: 82, effort: 5 };

const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Screenshot resized to cover w×h, clipped to a rounded rectangle. */
async function rounded(input, w, h, r) {
  const img = await sharp(input).resize(w, h, { fit: "cover", position: "top" }).toBuffer();
  return sharp(img).composite([{ input: svg(w, h, `<rect width="${w}" height="${h}" rx="${r}" fill="#fff"/>`), blend: "dest-in" }]).png().toBuffer();
}

/** Device renders on a transparent canvas, so they can be placed on any background. */
async function browserFrame(shot, w) {
  const h = Math.round(w * 0.625), bar = Math.round(w * 0.03);
  const screen = await rounded(shot, w, h - bar, 0);
  const dots = ["#dfb6b2", "#854f6c", "#522b5b"].map((c, i) => `<circle cx="${bar * 0.7 + i * bar * 0.6}" cy="${bar / 2}" r="${bar * 0.17}" fill="${c}"/>`).join("");
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${bar * 0.5}" fill="#fbe4d8" stroke="#dfb6b2" stroke-width="2"/>${dots}`);
  return sharp(frame).composite([{ input: screen, top: bar, left: 0 }]).png().toBuffer();
}
async function tabletFrame(shot, w) {
  const h = Math.round(w * 1.36), pad = Math.round(w * 0.045);
  const screen = await rounded(shot, w - pad * 2, h - pad * 2, pad * 0.5);
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${pad * 1.4}" fill="#190019" stroke="#2b124c" stroke-width="2"/>`);
  return sharp(frame).composite([{ input: screen, top: pad, left: pad }]).png().toBuffer();
}
async function phoneFrame(shot, w) {
  const h = Math.round(w * 2.05), pad = Math.round(w * 0.045);
  const screen = await rounded(shot, w - pad * 2, h - pad * 2, w * 0.11);
  const island = `<rect x="${w * 0.36}" y="${pad + w * 0.03}" width="${w * 0.28}" height="${w * 0.07}" rx="${w * 0.035}" fill="#000"/>`;
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${w * 0.15}" fill="#190019" stroke="#2b124c" stroke-width="2"/>`);
  return sharp(frame).composite([{ input: screen, top: pad, left: pad }, { input: svg(w, h, island) }]).png().toBuffer();
}

/** Brand light canvas (#FFFAF8) warmed by Dusty Blush and a faint tint of the project's own colour. */
const backdrop = (w, h, accent) =>
  svg(w, h, `<defs>
    <radialGradient id="a" cx="82%" cy="12%" r="75%"><stop offset="0" stop-color="#dfb6b2" stop-opacity=".75"/><stop offset="1" stop-color="#dfb6b2" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="8%" cy="96%" r="70%"><stop offset="0" stop-color="${accent}" stop-opacity=".16"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="c" cx="40%" cy="50%" r="60%"><stop offset="0" stop-color="#fbe4d8" stop-opacity=".9"/><stop offset="1" stop-color="#fbe4d8" stop-opacity="0"/></radialGradient>
  </defs><rect width="${w}" height="${h}" fill="#fffaf8"/><rect width="${w}" height="${h}" fill="url(#c)"/><rect width="${w}" height="${h}" fill="url(#a)"/><rect width="${w}" height="${h}" fill="url(#b)"/>`);

/** A device placed on the canvas with a soft plum shadow beneath it. */
async function place(input, left, top) {
  const { width, height } = await sharp(input).metadata();
  const pad = 60;
  const shadow = await sharp(svg(width + pad * 2, height + pad * 2, `<rect x="${pad}" y="${pad}" width="${width}" height="${height}" rx="28" fill="#2b124c" fill-opacity=".26"/>`)).blur(26).png().toBuffer();
  return [{ input: shadow, left: left - pad, top: top - pad + 28 }, { input, left, top }];
}

async function onBackdrop(w, h, accent, layers) {
  const placed = (await Promise.all(layers.map((l) => (l.shadow === false ? [l] : place(l.input, l.left, l.top))))).flat();
  return sharp(backdrop(w, h, accent)).composite(placed).webp(WEBP);
}

/** Dominant colour, lifted towards a usable mid-tone so near-white sites still get a tint. */
async function accentOf(input) {
  const { dominant: { r, g, b } } = await sharp(input).stats();
  const lum = (r + g + b) / 3;
  const k = lum > 200 ? 0.55 : lum < 40 ? 2.2 : 1;
  const hex = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

async function build(project, doCapture) {
  const { slug, capture, viewUrl, captureUrl, title, category } = project;
  const dir = `public/images/projects/${slug}`;
  await mkdir(`${dir}/screens`, { recursive: true });

  const full = `${SHOTS}/${capture}-full.png`;
  const url = captureUrl || viewUrl;
  // Firecrawl's full page is used unless the site needs overlays removed (cleanDesktop) or Firecrawl could not render it.
  if ((project.cleanDesktop && doCapture) || (!existsSync(full) && (project.cleanDesktop || !existsSync(`${SITES}/${capture}.json`)))) {
    await cdpShot(url, full, { width: 1440, height: 900, ua: DESKTOP_UA, fullPage: true });
  }
  if (!existsSync(full)) {
    const { screenshot } = JSON.parse(await readFile(`${SITES}/${capture}.json`, "utf8"));
    if (!screenshot) throw new Error(`${capture}: Firecrawl returned no screenshot`);
    const res = await fetch(screenshot);
    if (!res.ok) throw new Error(`${capture}: screenshot download ${res.status}`);
    await writeFile(full, Buffer.from(await res.arrayBuffer()));
  }
  const mobile = `${SHOTS}/${capture}-mobile.png`, tablet = `${SHOTS}/${capture}-tablet.png`;
  for (const [file, opts] of [[mobile, { width: 390, height: 844, ua: MOBILE_UA, mobile: true }], [tablet, { width: 820, height: 1180, ua: TABLET_UA, mobile: true }]]) {
    if (project.handheld === false) break;
    if (doCapture || !existsSync(file)) await cdpShot(url, file, opts).catch((e) => console.warn(`  ${capture}: ${e.message}`));
  }
  // Sites unreachable from this machine (e.g. a local TLS failure) keep desktop-only mockups.
  const handheld = project.handheld !== false && existsSync(mobile) && existsSync(tablet);

  // Full page, 1440 wide; WebP caps at 16383px so very long pages are trimmed.
  const fullBuf = await sharp(full).resize({ width: 1440 }).toBuffer();
  const { height: fullH } = await sharp(fullBuf).metadata();
  const pageHeight = Math.min(fullH, 16000);
  await sharp(fullBuf).extract({ left: 0, top: 0, width: 1440, height: pageHeight }).webp({ ...WEBP, quality: 75 }).toFile(`${dir}/full.webp`);

  const viewport = await sharp(fullBuf).extract({ left: 0, top: 0, width: 1440, height: Math.min(900, pageHeight) }).toBuffer();
  const accent = await accentOf(viewport);

  // Screens: the hero plus two sections further down the page.
  for (const [i, at] of [0, 0.35, 0.7].entries()) {
    const top = Math.max(0, Math.min(Math.round(pageHeight * at), pageHeight - 900));
    await sharp(fullBuf).extract({ left: 0, top, width: 1440, height: Math.min(900, pageHeight) }).webp(WEBP).toFile(`${dir}/screens/0${i + 1}.webp`);
  }

  const desktopDev = await browserFrame(viewport, 1240);
  await (await onBackdrop(1600, 1000, accent, [{ input: desktopDev, left: 180, top: 112 }])).toFile(`${dir}/desktop.webp`);
  if (handheld) {
    await (await onBackdrop(1600, 1000, accent, [{ input: await tabletFrame(tablet, 520), left: 540, top: 146 }])).toFile(`${dir}/tablet.webp`);
    await (await onBackdrop(1600, 1000, accent, [{ input: await phoneFrame(mobile, 300), left: 650, top: 192 }])).toFile(`${dir}/mobile.webp`);
    await (await onBackdrop(1600, 1000, accent, [
      { input: await browserFrame(viewport, 1080), left: 120, top: 140 },
      { input: await tabletFrame(tablet, 390), left: 1010, top: 330 },
      { input: await phoneFrame(mobile, 215), left: 1300, top: 500 },
    ])).toFile(`${dir}/devices.webp`);
  } else {
    await (await onBackdrop(1600, 1000, accent, [{ input: desktopDev, left: 180, top: 112 }])).toFile(`${dir}/devices.webp`);
  }

  // Banner: device art on the brand canvas, then the title set in Manrope by the browser.
  const art = `${SHOTS}/${slug}-banner-art.png`;
  await (await onBackdrop(1920, 1080, accent, [
    { input: await browserFrame(viewport, 980), left: 840, top: 200 },
    ...(handheld ? [{ input: await phoneFrame(mobile, 230), left: 1600, top: 470 }] : []),
  ])).png().toFile(art);
  const html = path.resolve(`${SHOTS}/${slug}-banner.html`);
  await writeFile(html, bannerHtml({ art: pathToFileURL(path.resolve(art)).href, title, category }));
  const shot = `${SHOTS}/${slug}-banner.png`;
  await cdpShot(pathToFileURL(html).href, shot, { width: 1920, height: 1080, ua: DESKTOP_UA });
  await sharp(shot).webp(WEBP).toFile(`${dir}/banner.webp`);

  return { accent, pageHeight };
}

const FONT = pathToFileURL(path.resolve("public/fonts/manrope-vf.woff2")).href;
const bannerHtml = ({ art, title, category }) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: Manrope; src: url("${FONT}") format("woff2"); font-weight: 200 800; }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; }
body { background: url("${art}") center / cover; font-family: Manrope, sans-serif; color: #190019; }
.copy { position: absolute; left: 120px; top: 0; bottom: 0; width: 640px; display: flex; flex-direction: column; justify-content: center; }
.cat { font-size: 22px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #854f6c; }
h1 { margin: 22px 0 30px; font-size: ${title.length > 22 ? 64 : title.length > 14 ? 80 : 104}px; line-height: 1.02; font-weight: 800; letter-spacing: -.045em; }
.rule { width: 96px; height: 4px; border-radius: 4px; background: #522b5b; }
.by { margin-top: 30px; font-size: 24px; font-weight: 600; color: #522b5b; }
</style><div class="copy"><div class="cat">${esc(category)}</div><h1>${esc(title)}</h1><div class="rule"></div><div class="by">Johns Antony · Dubai</div></div>`;

const doCapture = process.argv.includes("--capture");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");
await mkdir(SHOTS, { recursive: true });
const manifestPath = "scripts/project-media.json";
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};
const targets = [...PROJECTS, ...SCRAPED_PROJECTS].flatMap((p) => [p, ...(p.extraCaptures ?? [])]);
for (const project of targets.filter((p) => p.capture && (!only || only.includes(p.slug)))) {
  try {
    manifest[project.slug] = await build(project, doCapture);
    console.log(`ok ${project.slug}`);
  } catch (error) {
    console.error(`FAIL ${project.slug}: ${error.message}`);
  }
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
closeBrowser();
