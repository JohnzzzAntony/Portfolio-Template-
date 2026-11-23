/**
 * Headless-browser screenshots over the DevTools protocol (Node's built-in WebSocket),
 * with cookie banners, pop-ups and the Shopify preview bar removed first.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const BROWSER = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
].find(existsSync);

/** Removes cookie banners, newsletter pop-ups and the Shopify preview bar before a capture. */
const CLEAN_PAGE = `(() => {
  const sel = ['#shopify-pc__banner', '#shopify-pc__prefs', '#preview-bar-iframe', '#PBarNextFrameWrapper', '[id*="cookie" i]', '[class*="cookie" i]',
    '[id*="consent" i]', '[class*="consent" i]', '[class*="newsletter-popup" i]', '[class*="popup" i][aria-modal]', '[aria-modal="true"]', 'dialog[open]', '.klaviyo-form', '[class*="kl-private" i]'];
  document.querySelectorAll(sel.join(',')).forEach((el) => el.remove());
  for (const el of [document.documentElement, document.body]) { el.style.setProperty('overflow', 'auto', 'important'); }
})()`;

/** One headless browser for the run, driven over the DevTools protocol with Node's built-in WebSocket. */
let browser;
export const closeBrowser = () => browser?.child.kill();

async function launch() {
  const dir = mkdtempSync(path.join(tmpdir(), "portfolio-capture-"));
  const child = spawn(BROWSER, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${dir}`, "--ignore-certificate-errors", "--hide-scrollbars", "--mute-audio", "about:blank"]);
  const port = await new Promise((resolve, reject) => {
    child.stderr.on("data", (d) => { const m = /ws:\/\/[^:]+:(\d+)\//.exec(String(d)); if (m) resolve(m[1]); });
    child.on("exit", () => reject(new Error("browser exited")));
  });
  return { child, port };
}

export async function cdpShot(url, out, { width, height, ua, mobile = false, fullPage = false }) {
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

