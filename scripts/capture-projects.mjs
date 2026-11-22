/** Real pages only. Install playwright outside the checkout or set PLAYWRIGHT_MODULE. */
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const projects = JSON.parse(await readFile(path.join(root, 'src/lib/project-catalog.json'), 'utf8'));
const output = path.join(root, 'public/images/projects/live');
await mkdir(output, { recursive: true });
const reportPath = path.join(output, 'capture-report.json');
const previous = existsSync(reportPath) ? JSON.parse(await readFile(reportPath, 'utf8')).projects : [];
const report = { capturedAt: new Date().toISOString(), projects: [] };
const devices = {
  desktop: { width: 1440, height: 1000 },
  tablet: { width: 834, height: 1112 },
  mobile: { width: 390, height: 844 },
};
let browser;
let chromium;
try {
  for (const project of projects) {
    const record = { ...project, checkedAt: new Date().toISOString(), captures: {} };
    // curl honors the Cloud proxy and certificate configuration; never disable TLS.
    const probe = spawnSync('curl', ['-sS', '-L', '--max-time', '25', '-o', '/dev/null', '-w', '%{http_code}', project.url], { encoding: 'utf8' });
    record.httpStatus = Number(probe.stdout.trim()) || null;
    if (probe.status !== 0 || !record.httpStatus || record.httpStatus >= 400) {
      record.status = probe.stderr.includes('CONNECT tunnel failed, response 403') ? 'network-policy-blocked' : 'unavailable';
      record.error = record.status === 'network-policy-blocked' ? 'Cloud proxy denied destination (CONNECT 403).' : `HTTP probe failed (${record.httpStatus || probe.status}).`;
    } else {
      if (!browser) {
        ({ chromium } = await import(process.env.PLAYWRIGHT_MODULE || pathToFileURL('/workspace/.portfolio-tools/node_modules/playwright/index.mjs').href));
        // Managed system Chromium supplies its own proxy/CA configuration.
        browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
      }
      const directory = path.join(output, project.slug);
      await mkdir(directory, { recursive: true });
      try {
        for (const [device, viewport] of Object.entries(devices)) {
          const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: device === 'mobile', hasTouch: device !== 'desktop', reducedMotion: 'reduce' });
          try {
            const page = await context.newPage();
            const deniedHosts = new Set();
            page.on('requestfailed', request => { try { if (!new URL(request.url()).hostname.endsWith('google-analytics.com')) deniedHosts.add(new URL(request.url()).hostname); } catch {} });
            const response = await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
            if (!response?.ok()) throw Error(`Navigation returned ${response?.status()}`);
            await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
            await page.evaluate(() => document.fonts.ready);
            const body = (await page.locator('body').innerText()).trim();
            if (body.length < 30 || /checking your browser|verify you are human|application failed to respond|site not found|access denied|just a moment/i.test(body.slice(0, 500))) throw Error('Blank, unavailable, or challenge page; capture rejected.');
            await page.evaluate(async () => {
              const max = Math.min(document.body.scrollHeight, 12000);
              for (let y = 0; y < max; y += window.innerHeight) { window.scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 150)); }
              window.scrollTo(0, 0);
            });
            await page.waitForTimeout(1200);
            const brokenImages = await page.locator('img').evaluateAll(images => images.filter(img => img.getBoundingClientRect().top < innerHeight && img.getBoundingClientRect().width > 80 && (!img.complete || img.naturalWidth === 0)).length);
            if (brokenImages > 0) throw Error(`${brokenImages} visible images failed to load; review required hosts: ${[...deniedHosts].join(', ')}`);
            const prefix = `/images/projects/live/${project.slug}`;
            await page.screenshot({ path: path.join(directory, `${device}.png`), animations: 'disabled' });
            await page.screenshot({ path: path.join(directory, `${device}-full.png`), fullPage: true, animations: 'disabled' });
            record.captures[device] = { viewport, image: `${prefix}/${device}.png`, fullPage: `${prefix}/${device}-full.png`, title: await page.title(), finalUrl: page.url() };
          } finally { await context.close(); }
        }
        record.status = 'captured';
      } catch (error) { record.status = 'review-required'; record.error = error.message; }
    }
    // Keep previously verified images if a later recapture fails.
    const old = previous.find(entry => entry.slug === project.slug && entry.status === 'captured');
    if (old && record.status !== 'captured') record.previousVerifiedCapture = old;
    report.projects.push(record);
    console.log(`${project.slug}: ${record.status}`);
    await writeFile(`${reportPath}.tmp`, JSON.stringify(report, null, 2) + '\n');
    await rename(`${reportPath}.tmp`, reportPath);
  }
} finally { await browser?.close(); }
if (report.projects.some(project => project.status !== 'captured')) process.exitCode = 1;
