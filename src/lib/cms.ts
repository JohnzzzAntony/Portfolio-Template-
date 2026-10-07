import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/prisma";

/**
 * Read layer for the public site. Every query is wrapped in React `cache` so a
 * single render reuses one round-trip even when several components ask for the
 * same data (settings and nav are needed by both header and footer).
 */

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "portfolio"
  | "blog"
  | "contact";

export const getSettings = cache(async () => {
  const existing = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (existing) return existing;
  // First boot before seeding: create the row from schema defaults so the site
  // renders instead of crashing.
  return prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
});

export const getNav = cache(() =>
  prisma.navItem.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  }),
);

export const getSocials = cache(() =>
  prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
);

export const getPage = cache(async (key: PageKey) =>
  prisma.page.findUnique({
    where: { key },
    include: { sections: { where: { visible: true }, orderBy: { order: "asc" } } },
  }),
);

/** Turns a page's sections into a `key -> section` lookup for the templates. */
export function sectionMap<T extends { key: string }>(sections: T[]) {
  return Object.fromEntries(sections.map((s) => [s.key, s])) as Record<
    string,
    T | undefined
  >;
}

export const getProjects = cache((limit?: number) =>
  prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
    include: { services: { orderBy: { order: "asc" } } },
  }),
);

export const getFeaturedProject = cache(() =>
  prisma.project.findFirst({
    where: { published: true, featured: true },
    orderBy: { order: "asc" },
    include: { services: { orderBy: { order: "asc" } } },
  }),
);

export const getProject = cache((slug: string) =>
  prisma.project.findFirst({
    where: { slug, published: true },
    include: {
      services: { orderBy: { order: "asc" } },
      images: { orderBy: { order: "asc" } },
    },
  }),
);

export const getRelatedProjects = cache((slug: string, limit = 2) =>
  prisma.project.findMany({
    where: { published: true, slug: { not: slug } },
    orderBy: { order: "asc" },
    take: limit,
    include: { services: { orderBy: { order: "asc" } } },
  }),
);

/** Parses a "list" field stored as a JSON-encoded string (see src/lib/admin/form.ts). */
function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const getServices = cache(async () => {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return services.map((service) => ({
    ...service,
    capabilities: parseList(service.capabilities),
  }));
});

export const getPosts = cache((limit?: number) =>
  prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  }),
);

export const getPost = cache((slug: string) =>
  prisma.post.findFirst({ where: { slug, published: true } }),
);

export const getTeam = cache(() =>
  prisma.teamMember.findMany({ orderBy: { order: "asc" } }),
);

export const getAwards = cache(() =>
  prisma.award.findMany({ orderBy: { order: "asc" } }),
);

export const getBenefits = cache(() =>
  prisma.benefit.findMany({ orderBy: { order: "asc" } }),
);

export const getAchievements = cache(() =>
  prisma.achievement.findMany({ orderBy: { order: "asc" } }),
);

export const getApproach = cache(() =>
  prisma.approachItem.findMany({ orderBy: { order: "asc" } }),
);

export const getPlayground = cache(() =>
  prisma.playgroundImage.findMany({ orderBy: { order: "asc" } }),
);
