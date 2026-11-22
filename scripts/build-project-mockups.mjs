/** Compose device frames from approved real captures; never fabricate UI. */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const reportPath = path.join(root, 'public/images/projects/live/capture-report.json');
const report = JSON.parse(await readFile(reportPath, 'utf8'));
const projects = report.projects.filter(project => project.status === 'captured');
if (projects.length === 0) { console.error('No verified captures. Device mockups and project videos were not generated.'); process.exit(1); }
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || pathToFileURL('/workspace/.portfolio-tools/node_modules/playwright/index.mjs').href);
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const escape = text => text.replace(/[<>&"]/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[character]);
try {
  for (const project of projects) {
    const sources = {};
    for (const device of ['desktop', 'tablet', 'mobile']) {
      const source = project.captures[device]?.image;
      if (!source?.startsWith(`/images/projects/live/${project.slug}/`) || source.includes('..')) throw Error(`Invalid ${device} capture: ${project.slug}`);
      sources[device] = `data:image/png;base64,${(await readFile(path.join(root, 'public', source))).toString('base64')}`;
    }
    const directory = path.join(root, 'public/images/projects/live', project.slug);
    const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
    try {
      await page.setContent(`<!doctype html><html><head><style>
        *{box-sizing:border-box}body{margin:0;width:1800px;height:1200px;overflow:hidden;background:radial-gradient(ellipse at 65% 55%,#343b2b,#11120e 70%);color:#f1f3eb;font-family:Arial,sans-serif}
        h1{position:absolute;top:55px;left:80px;font-size:62px;font-weight:400;margin:0}p{position:absolute;top:135px;left:84px;color:#b2baa7;letter-spacing:3px;font:17px monospace}
        .stage{perspective:2000px}.device{position:absolute;overflow:hidden;background:#1a1b18;border:9px solid #41463a;border-radius:20px;box-shadow:0 45px 70px #0009}
        .desktop{left:80px;top:300px;width:1110px;height:797px;transform:rotateY(9deg) rotateX(3deg);padding-top:28px}
        .desktop:before{content:'● ● ●';position:absolute;top:3px;left:12px;color:#a5ad98;letter-spacing:6px;font-size:11px}
        .tablet{left:1190px;top:270px;width:440px;height:594px;transform:rotateY(-12deg) rotateZ(3deg);border-width:12px;border-radius:26px}
        .mobile{left:1060px;top:650px;width:210px;height:454px;transform:rotateY(-10deg) rotateZ(-4deg);border-width:7px;border-radius:28px}
        img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}footer{position:absolute;bottom:35px;left:84px;font:13px monospace;color:#b2baa7;letter-spacing:3px}
        </style></head><body><h1>${escape(project.title)}</h1><p>${escape(project.url)} / RESPONSIVE WEB</p><div class="stage"><div class="device desktop"><img src="${sources.desktop}" alt="Desktop capture"></div><div class="device tablet"><img src="${sources.tablet}" alt="Tablet capture"></div><div class="device mobile"><img src="${sources.mobile}" alt="Mobile capture"></div></div><footer>JOHNS ANTONY / LIVE WEBSITE CAPTURES / ${escape(project.checkedAt.slice(0, 10))}</footer></body></html>`);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await page.screenshot({ path: path.join(directory, 'device-mockup.png') });
      project.mockup = `/images/projects/live/${project.slug}/device-mockup.png`;
      const videoPath = path.join(directory, 'project-reel.mp4');
      const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', path.join(directory, 'device-mockup.png'), '-vf', "zoompan=z='1+0.035*sin(on/144*PI)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=144:s=1200x800:fps=24", '-t', '6', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-movflags', '+faststart', videoPath], { stdio: 'inherit' });
      if (result.status !== 0 || !existsSync(videoPath)) throw Error(`Project reel failed: ${project.slug}`);
      project.video = `/images/projects/live/${project.slug}/project-reel.mp4`;
      project.mockupGeneratedAt = new Date().toISOString();
      await writeFile(`${reportPath}.tmp`, JSON.stringify(report, null, 2) + '\n');
      const { rename } = await import('node:fs/promises');
      await rename(`${reportPath}.tmp`, reportPath);
      console.log(`Created responsive device mockup and 6-second motion reel: ${project.slug}`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
