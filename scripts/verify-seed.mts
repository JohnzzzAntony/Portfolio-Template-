/**
 * Verifies the seed snapshot without touching live data.
 *
 *   1. Compares every collection in prisma/seed-data.json against the database.
 *   2. Replays the seed inside a transaction and rolls it back.
 *
 *   npx tsx scripts/verify-seed.mts
 */
import { readFileSync } from "node:fs";
import path from "node:path";

import { PrismaClient } from "@prisma/client";

import { seedContent } from "../prisma/seed";

const snapshot = JSON.parse(
  readFileSync(path.join(import.meta.dirname, "..", "prisma", "seed-data.json"), "utf8"),
);

/** Drops the volatile timestamp so a re-seed still compares equal. */
function strip(row: Record<string, unknown>) {
  const { updatedAt, ...rest } = row;
  void updatedAt;
  return rest;
}

/** Settings is a single row; everything else is a list. */
const byId = (value: Record<string, unknown> | Record<string, unknown>[] | null) => {
  const rows = value == null ? [] : Array.isArray(value) ? value : [value];
  return JSON.stringify(rows.map(strip).sort((a, b) => String(a.id).localeCompare(String(b.id))));
};

async function loadLive(db: PrismaClient) {
  const projects = await db.project.findMany({
    orderBy: { order: "asc" },
    include: { images: { orderBy: { order: "asc" } }, services: { select: { id: true } } },
  });
  return {
    siteSettings: await db.siteSettings.findUnique({ where: { id: 1 } }),
    navItems: await db.navItem.findMany({ orderBy: { order: "asc" } }),
    socialLinks: await db.socialLink.findMany({ orderBy: { order: "asc" } }),
    pages: await db.page.findMany({ include: { sections: { orderBy: { order: "asc" } } } }),
    services: await db.service.findMany({ orderBy: { order: "asc" } }),
    projects: projects.map(({ services, ...project }) => ({
      ...project,
      serviceIds: services.map((s) => s.id),
    })),
    posts: await db.post.findMany({ orderBy: { publishedAt: "desc" } }),
    teamMembers: await db.teamMember.findMany({ orderBy: { order: "asc" } }),
    awards: await db.award.findMany({ orderBy: { order: "asc" } }),
    benefits: await db.benefit.findMany({ orderBy: { order: "asc" } }),
    achievements: await db.achievement.findMany({ orderBy: { order: "asc" } }),
    approachItems: await db.approachItem.findMany({ orderBy: { order: "asc" } }),
    playgroundImages: await db.playgroundImage.findMany({ orderBy: { order: "asc" } }),
  };
}

/** Thrown to roll the verification transaction back. */
class Rollback extends Error {}

const db = new PrismaClient();
const failures: string[] = [];

try {
  const live = await loadLive(db);
  for (const key of Object.keys(snapshot)) {
    if (byId(snapshot[key]) !== byId(live[key as keyof typeof live])) failures.push(key);
  }
  console.log(
    failures.length === 0
      ? `Snapshot matches the database across ${Object.keys(snapshot).length} collections.`
      : `MISMATCH in: ${failures.join(", ")}`,
  );

  const before = await db.project.count();
  let replayed: Record<string, number> | undefined;
  try {
    await db.$transaction(
      async (tx) => {
        await seedContent(tx);
        replayed = {
          projects: await tx.project.count(),
          services: await tx.service.count(),
          pages: await tx.page.count(),
          sections: await tx.section.count(),
          posts: await tx.post.count(),
        };
        throw new Rollback("verification complete");
      },
      { timeout: 120_000 },
    );
  } catch (error) {
    if (!(error instanceof Rollback)) throw error;
  }
  const after = await db.project.count();
  console.log(`Seed replay wrote ${JSON.stringify(replayed)} and rolled back.`);
  if (after !== before) failures.push(`rollback left the database changed (projects ${before} -> ${after})`);
} finally {
  await db.$disconnect();
}

if (failures.length > 0) {
  console.error(`FAILED: ${failures.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log("PASS: seed snapshot is complete and reproducible.");
}
