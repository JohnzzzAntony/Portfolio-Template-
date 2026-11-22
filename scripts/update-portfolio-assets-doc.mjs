import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = path.join(root, 'Johns-Antony-Portfolio.md');
const original = await readFile(target, 'utf8');
const catalog = JSON.parse(await readFile(path.join(root, 'src/lib/project-catalog.json'), 'utf8'));
const report = JSON.parse(await readFile(path.join(root, 'public/images/projects/live/capture-report.json'), 'utf8'));
const start = '<!-- PORTFOLIO-ASSETS:START -->', end = '<!-- PORTFOLIO-ASSETS:END -->';
const asset = relative => {
  if (!existsSync(path.join(root, relative))) throw Error(`Missing deliverable: ${relative}`);
  return relative;
};
const rows = catalog.map(project => {
  const capture = report.projects.find(item => item.slug === project.slug);
  const status = capture?.status || 'not attempted';
  if (status !== 'captured') return `| [${project.title}](${project.url}) | ${status} | Not captured | Not generated |`;
  const captureLinks = ['desktop', 'tablet', 'mobile'].map(device => `[${device}](${asset('public' + capture.captures[device].image)})`).join(' · ');
  const mockups = capture.mockup ? `[Device mockup](${asset('public' + capture.mockup)})` + (capture.video ? ` · [Motion reel](${asset('public' + capture.video)})` : '') : 'Not generated';
  return `| [${project.title}](${project.url}) | captured | ${captureLinks} | ${mockups} |`;
});
const completed = report.projects.filter(project => project.status === 'captured').length;
const section = `${start}

## G. Premium Portfolio — Real Projects & Original Asset Package

This section extends the supplied portfolio document. Its existing biography, case-study copy and implementation notes are preserved as supplied; they were not independently verified. The project URLs below come from Johns Antony's request. No client results, project screenshots or product interfaces have been invented.

### Visual direction

Use editorial typography, charcoal (#11120E), warm white (#F4F3EB), muted olive and a restrained lime accent (#D9FF83). Give actual website captures the largest space. Reserve chrome sculptures, isometric vectors and abstract motion for the personal brand, service explanations and section transitions. Never use them as project thumbnails, UI screenshots or evidence of client work.

The home and portfolio collections now use the 20 supplied URLs, and featured project cards on the services and contact pages use the same real catalog. The creative lab now shows original brand artwork rather than unrelated project interfaces. Until successful captures exist, project cards use typography and the real domain; they do not use stock images, fabricated screens or the repository's generic concept artwork. The previously existing CMS case studies retain their text but no longer substitute generic art for project images. No CMS database content was overwritten.

### Created assets — available now

![Original 3D chrome orbital sculpture with Johns Antony typography](${asset('public/images/portfolio-art/orbital-systems.png')})

| Deliverable | Files | Intended placement |
| --- | --- | --- |
| Orbital Systems — original 3D animation | [MP4](${asset('public/videos/orbital-systems.mp4')}) · [WebM](${asset('public/videos/orbital-systems.webm')}) | Personal-brand motion study between the statement and work sections |
| Animation poster | [PNG, 1280 × 720](${asset('public/images/portfolio-art/orbital-systems.png')}) | Static fallback, reduced-motion experience, social/editorial use |
| Dimensional orbital mark | [SVG](${asset('public/images/portfolio-art/orbit-mark.svg')}) | About-page brand accent or identity detail |
| Connected Commerce | [SVG](${asset('public/images/portfolio-art/commerce-flow.svg')}) | Diagram supporting storefront, payments, analytics and operations services |
| Provenance | [Asset record](${asset('public/images/portfolio-art/provenance.json')}) | Identifies original procedural work and distinguishes it from project evidence |

The animation contains 144 rendered frames at 24 fps, is six seconds long, and is encoded in H.264 MP4 and VP9 WebM. Both files were decoded successfully with FFmpeg; dimensions and duration were checked with FFprobe. The poster was visually inspected. The artwork was constructed with Three.js geometry, materials and studio lighting, not downloaded client imagery. No external stock images were fetched or included.

![Original dimensional orbital vector](${asset('public/images/portfolio-art/orbit-mark.svg')})

![Original Connected Commerce isometric diagram](${asset('public/images/portfolio-art/commerce-flow.svg')})

### Capture register — all 20 supplied URLs

Capture run: **${report.capturedAt}**. Completed three-viewport captures: **${completed}/20**.

The latest run attempted every URL with the environment's configured HTTPS client. A status of \`network-policy-blocked\` means the Cloud proxy returned CONNECT 403 before the site could load. It is not evidence that the website itself is down. No proxy error page was saved as a project screenshot. Browser captures, mockups and project reels remain pending for blocked entries.

| Real project URL | Observed result | Desktop · Tablet · Mobile | Mockup / video |
| --- | --- | --- | --- |
${rows.join('\n')}

The malformed Asset Manager link in the request was normalized to the complete linked destination: https://assetmanager-production-59c3.up.railway.app/.

### Responsive capture and mockup specification

| Capture | CSS viewport | Outputs after a successful visit |
| --- | --- | --- |
| Desktop | 1440 × 1000 | Viewport PNG and full-page PNG |
| Tablet | 834 × 1112 | Viewport PNG and full-page PNG |
| Mobile | 390 × 844 | Viewport PNG and full-page PNG, touch enabled |
| Device composition | 1800 × 1200 | Perspective browser, tablet and phone frames containing those exact captures |
| Project motion reel | 1200 × 800, 24 fps | Six-second H.264 composition with a gentle camera move; clearly a presentation reel, not a recording of interactions |

Use the original page content. Do not replace real UI text, invent dashboard records or fill unavailable authenticated screens with fake data. Reject navigation errors, blank pages, common bot challenges and failed visible images. Record final URL, page title, date and viewport in the capture report. Review captures visually before publication; automated checks cannot establish that every lazy-loaded section looks correct. For sign-in pages, capture the public sign-in screen only; authenticated product views need a separately authorized session with private data excluded.

### Reproduce the work

Run from \`/workspace/Portfolio-Template-\` using Node 24, system Chromium and FFmpeg. Playwright is installed outside the checkout so this package does not alter application dependencies:

\`\`\`sh
npm install --prefix /workspace/.portfolio-tools --cache /workspace/.npm --no-audit --no-fund playwright@1.58.2
node scripts/capture-projects.mjs
node scripts/build-project-mockups.mjs
node scripts/update-portfolio-assets-doc.mjs
\`\`\`

The capture command exits nonzero if any site remains incomplete and writes a per-project report. After reviewing partial results, the mockup command can process entries marked \`captured\`; it refuses to make mockups when none are verified. The exact capture and mockup scripts were tested end to end against a temporary local HTML fixture: all three viewport/full-page pairs, the device composition and six-second MP4 were produced. The fixture and its outputs were removed and are not presented as client work. Successful external capture and real-project composition remain unverified because all destinations are blocked. The no-capture guard was also exercised.

To regenerate the original personal-brand 3D animation:

\`\`\`sh
node scripts/render-portfolio-motion.mjs
\`\`\`

That renderer was run successfully in this environment. It renders locally, without external image sources. Tool overrides are \`PLAYWRIGHT_MODULE\` (module file path/URL) and \`CHROMIUM_PATH\`. Retain all TLS, package-integrity and artifact-checksum verification.

### Motion and delivery rules

- The integrated brand video loads on approach, plays only while visible, pauses in a hidden tab, and respects \`prefers-reduced-motion\`. A keyboard-accessible pause control is included.
- Show the static poster for reduced motion. Keep the six-second loop muted. Project cards must remain useful without animations or thumbnails.
- Use responsive image sizes and lazy loading for project grids. Keep mobile screenshots readable with no text painted over the UI.
- Use factual case-study copy from the supplied document. Keep commerce work, software projects and supporting brand art visibly distinct.
- Preserve original full-page captures as evidence; export lighter delivery images only after reviewing the originals.

### What still needs access or verification

All 20 project domains and the likely \`www\` redirects for the nine custom domains are saved in the environment network draft, alongside the previously required \`binaries.prisma.sh\`. The user must review and save those settings before external capture can proceed. Additional image, font or script hosts may be revealed once the sites can load; record those exact failures before adding further domains.

No project screenshots, device mockups, project reels or fetched web images have been claimed as completed. The original brand animation and vectors are completed. Application lint passed with four pre-existing warnings. Full application typechecking, build and runtime checks remain blocked by missing generated Prisma types and the previously denied engine download; an isolated browser check of the actual new components passed: 20 correct project links, no substitute project images, reduced-motion behavior, pause/resume, offscreen pause and no browser errors. This is component validation, not a full application runtime check.

The supplied document still contains \`YOUR-DOMAIN.com\` and \`your-email@example.com\` placeholders. They were preserved rather than replaced with invented personal details. Draft environment changes are saved, not published. Publish the environment only after capture and application validation are complete.

${end}`;
const a = original.indexOf(start), b = original.indexOf(end);
if ((a === -1) !== (b === -1) || (a !== -1 && b < a)) throw Error('Malformed generated appendix markers; original document preserved.');
const next = a === -1 ? `${original.trimEnd()}\n\n---\n\n${section}\n` : original.slice(0, a) + section + original.slice(b + end.length);
await writeFile(target, next);
console.log(`Updated ${target}; ${completed}/20 projects captured.`);
