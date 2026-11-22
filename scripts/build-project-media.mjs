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
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

import { PROJECTS, SCRAPED_PROJECTS } from "./project-content.mjs";

const SITES = ".firecrawl/sites";
const SHOTS = `${SITES}/shots`;
const BROWSER = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
].find(existsSync);
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
  const dots = ["#ff5f57", "#febc2e", "#28c840"].map((c, i) => `<circle cx="${bar * 0.7 + i * bar * 0.6}" cy="${bar / 2}" r="${bar * 0.17}" fill="${c}"/>`).join("");
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${bar * 0.5}" fill="#1f1f1e"/>${dots}`);
  return sharp(frame).composite([{ input: screen, top: bar, left: 0 }]).png().toBuffer();
}
async function tabletFrame(shot, w) {
  const h = Math.round(w * 1.36), pad = Math.round(w * 0.045);
  const screen = await rounded(shot, w - pad * 2, h - pad * 2, pad * 0.5);
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${pad * 1.4}" fill="#121212" stroke="#3a3a38" stroke-width="2"/>`);
  return sharp(frame).composite([{ input: screen, top: pad, left: pad }]).png().toBuffer();
}
async function phoneFrame(shot, w) {
  const h = Math.round(w * 2.05), pad = Math.round(w * 0.045);
  const screen = await rounded(shot, w - pad * 2, h - pad * 2, w * 0.11);
  const island = `<rect x="${w * 0.36}" y="${pad + w * 0.03}" width="${w * 0.28}" height="${w * 0.07}" rx="${w * 0.035}" fill="#000"/>`;
  const frame = svg(w, h, `<rect width="${w}" height="${h}" rx="${w * 0.15}" fill="#121212" stroke="#3a3a38" stroke-width="2"/>`);
  return sharp(frame).composite([{ input: screen, top: pad, left: pad }, { input: svg(w, h, island) }]).png().toBuffer();
}

const backdrop = (w, h, accent) =>
  svg(w, h, `<defs><radialGradient id="g" cx="78%" cy="18%" r="85%"><stop offset="0" stop-color="${accent}" stop-opacity=".55"/><stop offset=".6" stop-color="#0d0d0c"/></radialGradient></defs><rect width="${w}" height="${h}" fill="#0d0d0c"/><rect width="${w}" height="${h}" fill="url(#g)"/>`);

async function onBackdrop(w, h, accent, layers) {
  return sharp(backdrop(w, h, accent)).composite(layers).webp(WEBP);
}

/** Dominant colour, lifted towards a usable mid-tone so near-white sites still get a tint. */
async function accentOf(input) {
  const { dominant: { r, g, b } } = await sharp(input).stats();
  const lum = (r + g + b) / 3;
  const k = lum > 200 ? 0.55 : lum < 40 ? 2.2 : 1;
  const hex = (v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Removes cookie banners, newsletter pop-ups and the Shopify preview bar before a capture. */
const CLEAN_PAGE = `(() => {
  const sel = ['#shopify-pc__banner', '#shopify-pc__prefs', '#preview-bar-iframe', '#PBarNextFrameWrapper', '[id*="cookie" i]', '[class*="cookie" i]',
    '[id*="consent" i]', '[class*="consent" i]', '[class*="newsletter-popup" i]', '[class*="popup" i][aria-modal]', '[aria-modal="true"]', 'dialog[open]', '.klaviyo-form', '[class*="kl-private" i]'];
  document.querySelectorAll(sel.join(',')).forEach((el) => el.remove());
  for (const el of [document.documentElement, document.body]) { el.style.setProperty('overflow', 'auto', 'important'); }
})()`;

/** One headless browser for the run, driven over the DevTools protocol with Node's built-in WebSocket. */
let browser;
async function launch() {
  const dir = mkdtempSync(path.join(tmpdir(), "portfolio-capture-"));
  const child = spawn(BROWSER, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--ignore-certificate-errors", "--hide-scrollbars", "--mute-audio", "about:blank"]);
  const port = await new Promise((resolve, reject) => {
    child.stderr.on("data", (d) => { const m = /ws:\/\/[^:]+:(\d+)\//.exec(String(d)); if (m) resolve(m[1]); });
    child.on("exit", () => reject(new Error("browser exited")));
  });
  return { child, port };
}

async function cdpShot(url, out, { width, height, ua, mobile = false, fullPage = false }) {
  browser ??= await launch();
  const target = await (await fetch(`http://127.0.0.1:${browser.port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map(), listeners = [];
  ws.addEventListener("message", ({ data }) => {
    const msg = JSON.parse(data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    else listeners.forEach((fn) => fn(msg));
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  try {
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await send("Emulation.setUserAgentOverride", { userAgent: ua });
    const loaded = new Promise((r) => listeners.push((m) => m.method === "Page.loadEventFired" && r()));
    await send("Page.navigate", { url });
    await Promise.race([loaded, wait(25_000)]);
    await wait(3500);
    let clipHeight = height;
    if (fullPage) {
      // Scroll through once so lazy images and scroll-reveals load, then return to the top.
      const { result } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
      for (let y = 0; y < Math.min(result.value, 14000); y += height) { await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${y})` }); await wait(350); }
      await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" });
      await wait(1200);
    }
    await send("Runtime.evaluate", { expression: CLEAN_PAGE });
    await wait(400);
    if (fullPage) {
      const { result } = await send("Runtime.evaluate", { expression: "document.documentElement.scrollHeight", returnByValue: true });
      clipHeight = Math.min(result.value, 14000);
    }
    const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: fullPage, clip: { x: 0, y: 0, width, height: clipHeight, scale: 1 } });
    await writeFile(out, Buffer.from(data, "base64"));
  } finally {
    ws.close();
    await fetch(`http://127.0.0.1:${browser.port}/json/close/${target.id}`).catch(() => {});
  }
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

  // Banner: title block on the left, device trio on the right.
  const text = svg(1920, 1080, `
    <text x="120" y="420" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.min(24, Math.floor(640 / (category.length * 0.95)))}" letter-spacing="4" fill="#f4f1ea" fill-opacity=".72">${esc(category.toUpperCase())}</text>
    <text x="114" y="530" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.min(112, Math.floor(660 / (title.length * 0.52)))}" fill="#f4f1ea">${esc(title)}</text>
    <rect x="120" y="580" width="96" height="3" fill="${accent}"/>
    <text x="120" y="640" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#f4f1ea" fill-opacity=".6">Johns Antony · Dubai</text>`);
  await (await onBackdrop(1920, 1080, accent, [
    { input: await browserFrame(viewport, 980), left: 840, top: 200 },
    ...(handheld ? [{ input: await phoneFrame(mobile, 230), left: 1600, top: 470 }] : []),
    { input: text },
  ])).toFile(`${dir}/banner.webp`);

  return { accent, pageHeight };
}

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
browser?.child.kill();
