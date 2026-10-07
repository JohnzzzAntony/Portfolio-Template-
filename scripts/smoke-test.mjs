const base = process.env.TEST_URL || 'http://localhost:3000';
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
let assets = new Set();
for (const route of [...routes, '/admin/login']) {
 const response = await fetch(base + route);
 const html = await response.text();
 if (response.status !== 200) throw new Error(`${route}: ${response.status}`);
 for (const m of html.matchAll(/src="(\/media\/[^" ]+)"/g)) assets.add(m[1]);
 console.log(`${response.status} ${route}`);
}
for (const asset of assets) {
 const response = await fetch(base + asset);
 if (!response.ok) throw new Error(`Missing asset ${asset}`);
}
const admin = await fetch(base + '/admin', {redirect:'manual'});
if (admin.status !== 307 || !admin.headers.get('location')?.endsWith('/admin/login')) throw new Error('Admin not protected');
const missing = await fetch(base + '/projects/nonexistent-audit-project');
if(missing.status !== 404) throw new Error('Missing project must return 404');
console.log(`PASS: ${routes.length + 1} pages, ${assets.size} media assets, admin redirect, missing-project 404.`);
