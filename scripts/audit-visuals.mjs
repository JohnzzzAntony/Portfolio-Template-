import { PrismaClient } from '@prisma/client';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
process.loadEnvFile('.env');
const db = new PrismaClient();
try {
 const records = await Promise.all([db.page.findMany({include:{sections:true}}), db.project.findMany({include:{images:true}}), db.service.findMany(), db.post.findMany(), db.teamMember.findMany(), db.benefit.findMany(), db.achievement.findMany(), db.playgroundImage.findMany(), db.siteSettings.findMany()]);
 const urls = [...new Set(JSON.stringify(records).match(/\/(?:images|files|media)\/[^"\\]+/g))];
 const missing = urls.filter(url => !existsSync(url.startsWith('/files/') ? 'storage/media/' + url.slice(7) : 'public' + url));
 const replacement = (url) => /architectbuilding/.test(url) ? '/images/premium/hero.webp' : /finora/.test(url) ? '/images/projects/finora/mockup-1.webp' : `/images/premium/${/ecom|shopify|store|daima|payment|commerce|img105|img204/.test(url) ? 'commerce' : /analytics|seo|feeds/.test(url) ? 'analytics' : /qa|security|domains/.test(url) ? 'security' : /nexpixels|workflow|integration|stack|systems|tools|it-operations/.test(url) ? 'systems' : 'studio'}.webp`;
 await writeFile('src/lib/replaced-media.json', JSON.stringify(Object.fromEntries(missing.map(url=>[url,replacement(url)])),null,2)+'\n');
 console.log(`Mapped ${missing.length} missing assets to available artwork.`);
} finally { await db.$disconnect(); }
