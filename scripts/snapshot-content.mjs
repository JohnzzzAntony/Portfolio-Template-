/**
 * Regenerates prisma/seed-data.json from the live database.
 *
 * Run this after editing content in /admin so a fresh installation still seeds
 * the real site:
 *
 *   npm run snapshot
 *
 * The User table is never exported, so no credentials end up in the snapshot.
 */
import { writeFileSync } from "node:fs";

import { PrismaClient } from "@prisma/client";

try {
  process.loadEnvFile();
} catch {
  /* variables may come from the host */
}

const prisma = new PrismaClient();

try {
  const data = {
    siteSettings: await prisma.siteSettings.findUnique({ where: { id: 1 } }),
    navItems: await prisma.navItem.findMany({ orderBy: { order: "asc" } }),
    socialLinks: await prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    pages: await prisma.page.findMany({ include: { sections: { orderBy: { order: "asc" } } } }),
    services: await prisma.service.findMany({ orderBy: { order: "asc" } }),
    projects: await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { images: { orderBy: { order: "asc" } }, services: { select: { id: true } } },
    }),
    posts: await prisma.post.findMany({ orderBy: { publishedAt: "desc" } }),
    teamMembers: await prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
    awards: await prisma.award.findMany({ orderBy: { order: "asc" } }),
    benefits: await prisma.benefit.findMany({ orderBy: { order: "asc" } }),
    achievements: await prisma.achievement.findMany({ orderBy: { order: "asc" } }),
    approachItems: await prisma.approachItem.findMany({ orderBy: { order: "asc" } }),
    playgroundImages: await prisma.playgroundImage.findMany({ orderBy: { order: "asc" } }),
  };

  // Flatten the project/services many-to-many to plain ids so the seed can
  // reconnect them by id.
  data.projects = data.projects.map(({ services, ...project }) => ({
    ...project,
    serviceIds: services.map((service) => service.id),
  }));

  writeFileSync("prisma/seed-data.json", `${JSON.stringify(data, null, 2)}\n`);
  const counts = Object.entries(data).map(([key, value]) => `${key}=${Array.isArray(value) ? value.length : value ? 1 : 0}`);
  console.log(`Wrote prisma/seed-data.json — ${counts.join(", ")}`);
} finally {
  await prisma.$disconnect();
}
