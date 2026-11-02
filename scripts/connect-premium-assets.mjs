import { readFile, writeFile } from 'node:fs/promises';
const replacements = {
 'hero.webp':'hero', 'hero-mobile.webp':'hero', 'silk-portrait.webp':'studio', 'silk-pill.webp':'systems',
 'mission.webp':'systems', 'benefits.webp':'studio', 'footer.webp':'hero', 'page.webp':'studio',
 'dark-1.webp':'systems','dark-2.webp':'commerce','dark-3.webp':'security',
 'light-1.webp':'studio','light-2.webp':'analytics','light-3.webp':'commerce',
 '01-ecommerce-solutions.png':'commerce','02-pos-payment-solutions.png':'commerce',
 '03-web-software-development.png':'systems','04-marketing-analytics.png':'analytics',
 '05-quality-assurance-testing.png':'security','06-cloud-it-infrastructure.png':'systems',
};
let media = await readFile('src/lib/media.ts', 'utf8');
for (const [old, name] of Object.entries(replacements)) media = media.replaceAll(`/images/art/${old}`, `/images/premium/${name}.webp`);
media = media.replace('  return trimmed;', '  return LEGACY_ART[trimmed] || trimmed;');
media += '\n/** Retired decorative artwork is replaced even when saved in the CMS. */\nconst LEGACY_ART: Record<string, string> = ' + JSON.stringify(Object.fromEntries(Object.entries(replacements).map(([old,name])=>[`/images/art/${old}`,`/images/premium/${name}.webp`])),null,2) + ';\n';
await writeFile('src/lib/media.ts',media);
for (const file of ['src/components/editorial/sections.tsx','src/components/editorial/Footer.tsx']) {
 let text = await readFile(file,'utf8');
 for (const [old,name] of Object.entries(replacements)) text=text.replaceAll(`/images/art/${old}`,`/images/premium/${name}.webp`);
 await writeFile(file,text);
}
const serviceFile='src/app/(site)/services/page.tsx';
let services=await readFile(serviceFile,'utf8');
services=services.replace('{ ART, media }','{ ART, SERVICE_ART, media }').replaceAll('media(service.image, ART.dark[i % 3])','media(service.image, SERVICE_ART[service.title] || ART.dark[i % 3])');
await writeFile(serviceFile,services);
const homeFile='src/app/(site)/page.tsx';
let home=await readFile(homeFile,'utf8');
home=home.replace('media(s.about.image, "/images/projects/carter-studio/mockup-1.webp")','media(s.about.image, ART.portrait)');
await writeFile(homeFile,home);
