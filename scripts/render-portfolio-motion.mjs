/** Original 3D brand art; never used as a project screenshot. */
import { createServer } from 'node:http';
import { readFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || pathToFileURL('/workspace/.portfolio-tools/node_modules/playwright/index.mjs').href);
const width = 1280, height = 720, frames = 144, fps = 24;
const images = path.join(root, 'public/images/portfolio-art');
const videos = path.join(root, 'public/videos');
await mkdir(images, { recursive: true });
await mkdir(videos, { recursive: true });
const temporary = await mkdtemp(path.join(tmpdir(), 'portfolio-motion-'));
const html = `<!doctype html><html><head><style>html,body{margin:0;background:#11120e}canvas{display:block}</style>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js"}}</script></head><body><script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from '/three/examples/jsm/environments/RoomEnvironment.js';
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(${width},${height});renderer.setPixelRatio(1);renderer.toneMapping=THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#11120e');
const camera=new THREE.PerspectiveCamera(36,${width}/${height},.1,100);camera.position.set(0,0,10);
const generator=new THREE.PMREMGenerator(renderer);scene.environment=generator.fromScene(new RoomEnvironment(),.04).texture;
const group=new THREE.Group();scene.add(group);group.position.x=1.1;
const metal=new THREE.MeshPhysicalMaterial({color:'#d9dfd1',metalness:1,roughness:.13,clearcoat:1});
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.15,.32,240,48,2,3),metal);group.add(knot);
const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.12,.012,12,220),new THREE.MeshBasicMaterial({color:'#d9ff83'}));orbit.rotation.x=1.1;group.add(orbit);
const orbit2=orbit.clone();orbit2.rotation.set(.5,1.1,.6);group.add(orbit2);
const bead=new THREE.Mesh(new THREE.SphereGeometry(.09,24,24),new THREE.MeshBasicMaterial({color:'#d9ff83'}));group.add(bead);
const plane=new THREE.GridHelper(24,38,'#3b4031','#25271e');plane.position.y=-2.3;scene.add(plane);
const fill=new THREE.PointLight('#c8e7a0',30);fill.position.set(-3,3,4);scene.add(fill);
const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1024;const ctx=canvas.getContext('2d');
ctx.fillStyle='#d9ff83';ctx.font='20px monospace';ctx.fillText('JOHNS ANTONY / DIGITAL CRAFT',58,170);
ctx.fillStyle='#f4f3eb';ctx.font='68px sans-serif';ctx.fillText('Systems.',58,300);ctx.fillText('With soul.',58,385);
ctx.fillStyle='#8f9684';ctx.font='17px monospace';ctx.fillText('COMMERCE / CODE / CONNECTION',58,470);ctx.fillText('DUBAI, UAE',58,510);
const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;
const text=new THREE.Mesh(new THREE.PlaneGeometry(5.6,5.6),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthTest:false}));text.position.set(-1.7,0,2);text.renderOrder=10;scene.add(text);
window.drawFrame=(frame)=>{const angle=frame/${frames}*Math.PI*2;knot.rotation.set(.3+Math.sin(angle)*.16,angle,.4);orbit.rotation.z=angle;orbit2.rotation.z=-angle;bead.position.set(Math.cos(angle)*2.12,Math.sin(angle)*.93,Math.sin(angle)*1.9);renderer.render(scene,camera)};
window.drawFrame(0);window.ready=true;
</script></body></html>`;
const server = createServer(async (request, response) => {
  try {
    if (request.url === '/') { response.setHeader('Content-Type', 'text/html'); response.end(html); return; }
    if (!request.url.startsWith('/three/') || request.url.includes('..')) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', 'text/javascript');
    response.end(await readFile(path.join(root, 'node_modules/three', request.url.slice(7))));
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'], headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', error => console.error(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.waitForFunction(() => window.ready, { timeout: 30000 });
  await page.screenshot({ path: path.join(images, 'orbital-systems.png') });
  for (let frame = 0; frame < frames; frame++) {
    await page.evaluate(frame => window.drawFrame(frame), frame);
    await page.screenshot({ path: path.join(temporary, `${String(frame).padStart(4, '0')}.png`) });
    if (frame % 24 === 0) console.log(`Rendered ${frame}/${frames} frames`);
  }
  for (const [extension, codec] of [['mp4', 'libx264'], ['webm', 'libvpx-vp9']]) {
    const args = ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(temporary, '%04d.png'), '-an', '-c:v', codec, '-pix_fmt', 'yuv420p'];
    if (extension === 'mp4') args.push('-crf', '22', '-movflags', '+faststart');
    else args.push('-crf', '34', '-b:v', '0');
    const result = spawnSync('ffmpeg', [...args, path.join(videos, `orbital-systems.${extension}`)], { stdio: 'inherit' });
    if (result.status !== 0) throw Error(`ffmpeg ${extension} failed`);
  }
  await writeFile(path.join(images, 'provenance.json'), JSON.stringify({ creator: 'Original procedural Three.js composition for Johns Antony', generatedAt: new Date().toISOString(), frames, fps, width, height, projectScreenshot: false, thirdPartyImages: [] }, null, 2) + '\n');
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); await rm(temporary, { recursive: true, force: true }); }
