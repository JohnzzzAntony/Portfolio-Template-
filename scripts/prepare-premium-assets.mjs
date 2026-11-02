import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const sources = {"hero":"480908b6-f49e-41f0-b767-98a09adfb447","studio":"f72a1e05-a344-43a5-9a4e-7e21006104f2","systems":"d50b7ec2-88e3-4452-bc76-20ca003835c2","commerce":"d77bede2-c00f-490f-a0bb-1bad2765ef92","analytics":"0521de34-4105-4476-9942-300f50adabca","security":"4af93795-1503-479a-8dc8-b19e3f43cae2"};
await mkdir('public/images/premium', { recursive: true });
for (const [name, id] of Object.entries(sources)) {
  const source = `C:/Users/johns/.codex/generated_images/01a19caa-5008-7262-8a19-4ac8fdc51992/exec-${id}.png`;
  await sharp(source).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 88 }).toFile(`public/images/premium/${name}.webp`);
  console.log(name, await sharp(source).metadata().then(({width,height})=>({width,height})));
}
