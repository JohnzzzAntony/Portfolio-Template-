/**
 * Writes the rewritten portfolio (scripts/project-content.mjs) and the generated
 * project media into the CMS database. Non-destructive: projects and services
 * that are no longer listed are unpublished, not deleted, and existing gallery
 * images are kept after the new captures.
 *
 *   node scripts/apply-portfolio-content.mjs && npm run snapshot
 */
import { existsSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

import { PROJECTS, RETIRED_PROJECTS, RETIRED_SERVICES, SCRAPED_PROJECTS, SERVICES } from "./project-content.mjs";

try {
  process.loadEnvFile();
} catch {
  /* variables may come from the host */
}

const prisma = new PrismaClient();
const exists = (url) => existsSync(`public${url}`);

/** New captures first: device trio, single devices, then page sections. */
function capturedImages({ slug, title, extraCaptures = [] }) {
  const base = `/images/projects/${slug}`;
  const images = [
    [`${base}/devices.webp`, `${title} on desktop, tablet and mobile`],
    [`${base}/desktop.webp`, `${title} desktop website mockup`],
    [`${base}/tablet.webp`, `${title} tablet mockup`],
    [`${base}/mobile.webp`, `${title} mobile mockup`],
    [`${base}/screens/01.webp`, `${title} homepage hero`],
    [`${base}/screens/02.webp`, `${title} page section`],
    [`${base}/screens/03.webp`, `${title} page section`],
    ...extraCaptures.flatMap((extra) => [
      [`/images/projects/${extra.slug}/devices.webp`, `${extra.title} on desktop, tablet and mobile`],
      [`/images/projects/${extra.slug}/screens/01.webp`, `${extra.title} homepage`],
    ]),
  ];
  return images.filter(([url]) => exists(url)).map(([url, alt]) => ({ url, alt }));
}

try {
  // ---------------------------------------------------------------- services
  const serviceIds = {};
  for (const [order, { slug, title, description, image, capabilities }] of SERVICES.entries()) {
    const data = { title, description, image, capabilities: JSON.stringify(capabilities), order, published: true, index: `/${String(order + 1).padStart(3, "0")}` };
    const row = await prisma.service.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    serviceIds[slug] = row.id;
  }
  await prisma.service.updateMany({ where: { slug: { in: RETIRED_SERVICES } }, data: { published: false } });

  // ---------------------------------------------------------------- projects
  for (const [order, project] of [...PROJECTS, ...SCRAPED_PROJECTS].entries()) {
    const { slug, previousSlug, keepCopy, services = [] } = project;
    const existing = await prisma.project.findFirst({
      where: { slug: { in: [slug, previousSlug].filter(Boolean) } },
      include: { images: { orderBy: { order: "asc" } } },
    });

    const base = `/images/projects/${slug}`;
    const banner = exists(`${base}/banner.webp`) ? `${base}/banner.webp` : undefined;
    const preview = exists(`${base}/devices.webp`) ? `${base}/devices.webp` : undefined;
    const video = exists(`/videos/projects/${slug}.mp4`) ? `/videos/projects/${slug}.mp4` : "";

    // Kept copy predates the Railway deployments; correct the one sentence that says otherwise.
    const live = (text) => text.replaceAll("Developed application; not deployed to a public live URL.", "Deployed on Railway — open the live demo from this page.");
    const copy = keepCopy ? (existing && project.viewUrl ? { overview: live(existing.overview), scope: live(existing.scope) } : {}) : Object.fromEntries(
      ["client", "overview", "features", "journey", "engineering", "scope", "approach", "steps"].filter((k) => project[k] !== undefined).map((k) => [k, project[k]]),
    );
    const data = {
      slug, title: project.title, year: project.year ?? "", category: project.category ?? "", stack: project.stack ?? "",
      viewUrl: project.viewUrl ?? "", featured: Boolean(project.featured), published: true, order, videoUrl: video,
      ...(project.client && keepCopy ? { client: project.client } : {}),
      ...copy,
      ...(project.seoTitle ? { seoTitle: project.seoTitle, seoDescription: project.seoDescription } : {}),
      ...(banner ? { coverImage: banner } : {}),
      ...(preview ? { previewImage: preview } : {}),
    };

    const fresh = capturedImages(project);
    const kept = (existing?.images ?? []).filter((image) => !fresh.some((f) => f.url === image.url)).map(({ url, alt }) => ({ url, alt }));
    const images = [...fresh, ...kept].map((image, i) => ({ ...image, order: i }));
    const servicesConnect = services.map((s) => ({ id: serviceIds[s] })).filter((s) => s.id);

    if (existing) {
      await prisma.$transaction([
        prisma.projectImage.deleteMany({ where: { projectId: existing.id } }),
        prisma.project.update({
          where: { id: existing.id },
          data: { ...data, services: { set: servicesConnect }, images: { create: images } },
        }),
      ]);
    } else {
      await prisma.project.create({ data: { ...data, coverImage: data.coverImage ?? "", previewImage: data.previewImage ?? "", services: { connect: servicesConnect }, images: { create: images } } });
    }
    console.log(`${existing ? "updated" : "created"} ${slug} (${images.length} images${video ? ", film" : ""})`);
  }
  await prisma.project.updateMany({ where: { slug: { in: RETIRED_PROJECTS } }, data: { published: false } });

  // ----------------------------------------------------- site-wide copy (.md)
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      tagline: "Shopify Developer & E-commerce Specialist",
      metaTitle: "Johns Antony | Freelance Shopify Developer & E-commerce Specialist in Dubai, UAE",
      metaDescription: "Shopify developer and e-commerce specialist in Dubai. Shopify theme customisation, Figma to Shopify, Tabby & Tamara integration, GA4/GTM tracking, product feeds, Next.js websites and n8n automation for UAE & GCC brands.",
      footerHeadline: "Let's build or grow your online store.",
    },
  });

  const glance = [
    ["8+", "Live Shopify storefronts"],
    ["1,500", "Products in the largest catalogue"],
    ["130+", "Fragrance brands merchandised"],
    ["30+", "Domains & SSL certificates managed"],
    ["5+", "Years in e-commerce, web, QA & IT"],
  ];
  const achievements = await prisma.achievement.findMany({ orderBy: { order: "asc" } });
  for (const [i, [value, label]] of glance.entries()) {
    if (achievements[i]) await prisma.achievement.update({ where: { id: achievements[i].id }, data: { value, label } });
    else await prisma.achievement.create({ data: { value, label, order: i } });
  }

  const section = async (pageKey, key, data) => {
    const page = await prisma.page.findUnique({ where: { key: pageKey } });
    if (page) await prisma.section.updateMany({ where: { pageId: page.id, key }, data });
  };
  const page = (key, data) => prisma.page.updateMany({ where: { key }, data });

  await page("home", { seoTitle: "Shopify Developer & E-commerce Specialist in Dubai", seoDescription: "I build, fix and grow Shopify stores for brands in the UAE and GCC: custom themes, Figma to Shopify, Tabby & Tamara, GA4/GTM tracking, product feeds and Next.js websites." });
  await section("home", "intro", { body: "I build, fix and grow Shopify stores for brands in the UAE and GCC. Custom Shopify themes, Figma-to-Shopify builds, Tabby & Tamara payments, GA4 and Google Tag Manager tracking, Google Shopping feeds and custom Next.js websites — mobile-first, SEO-ready and safe to publish." });
  await section("home", "about", { body: "I run the Shopify storefronts for a group of luxury fragrance, flower and lifestyle brands in Dubai — Karji, Atelier Perfumery, Flower District, Daima, Touch of Oud, Juvenis Paris and more. Theme code, payments, tracking, feeds, ads and the domains behind them, handled by one person who tests every change before it goes live." });
  await section("home", "services", { body: "Shopify development and theme customisation, Figma to Shopify, payments and BNPL, tracking and feeds, speed and SEO, custom websites, n8n automation and the domains and hosting behind them." });
  await section("home", "portfolio", { body: "Live Shopify storefronts for UAE luxury fragrance, flower and lifestyle brands, plus custom websites, business applications and platforms built with Next.js." });
  await page("services", { seoTitle: "Shopify, E-commerce & Web Development Services in Dubai", seoDescription: "Shopify store development, theme customisation, Figma to Shopify, Tabby & Tamara, GA4/GTM tracking, product feeds, speed & SEO, Next.js websites and n8n automation." });
  await section("services", "expertise", { body: "Ten services, one specialist. Most engagements combine a Shopify build with payments, tracking and SEO." });
  await page("portfolio", { seoTitle: "Shopify & Web Development Portfolio", seoDescription: "Case studies: Karji, Atelier Perfumery, Flower District, Daima, Juvenis Paris, Touch of Oud, Mechaura and custom Next.js platforms." });
  await section("portfolio", "portfolio", { body: "Eight live Shopify storefronts for UAE brands, and the websites, platforms and business apps built alongside them." });

  console.log("Done. Run `npm run snapshot` to refresh prisma/seed-data.json.");
} finally {
  await prisma.$disconnect();
}
