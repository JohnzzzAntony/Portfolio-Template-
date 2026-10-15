/**
 * Seeds a fresh database with Johns Antony's portfolio.
 *
 * The content lives in prisma/seed-data.json — a snapshot of the live CMS — so
 * a new installation comes up as the real site instead of a blank template.
 * Seeding replaces every content collection, so it refuses to run against a
 * database that already has content unless SEED_FORCE=1 is set.
 *
 *   npm run db:seed                 # empty database only
 *   SEED_FORCE=1 npm run db:seed    # deliberately replace existing content
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const snapshot = JSON.parse(readFileSync(new URL("./seed-data.json", import.meta.url), "utf8"));

/**
 * Writes the whole site into `db`. Takes the client so it can run inside a
 * transaction that is rolled back by scripts/verify-seed.mts.
 */
export async function seedContent(db: Prisma.TransactionClient) {
  // --------------------------------------------------------------- settings
  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: snapshot.siteSettings });

  // ------------------------------------------------------------- nav/social
  await db.navItem.deleteMany();
  await db.navItem.createMany({ data: snapshot.navItems });
  await db.socialLink.deleteMany();
  await db.socialLink.createMany({ data: snapshot.socialLinks });

  // ------------------------------------------------------------------ work
  // Projects reference services, so clear them first (images cascade).
  await db.project.deleteMany();
  await db.service.deleteMany();
  await db.service.createMany({ data: snapshot.services });
  for (const { serviceIds, images, ...project } of snapshot.projects) {
    await db.project.create({
      data: {
        ...project,
        images: { create: images.map((image: { id: string; url: string; alt: string; order: number }) => ({ id: image.id, url: image.url, alt: image.alt, order: image.order })) },
        services: { connect: serviceIds.map((id: string) => ({ id })) },
      },
    });
  }

  // ------------------------------------------------------------------ blog
  await db.post.deleteMany();
  await db.post.createMany({ data: snapshot.posts });

  // ------------------------------------------------------------------ lists
  await db.teamMember.deleteMany();
  await db.teamMember.createMany({ data: snapshot.teamMembers });
  await db.award.deleteMany();
  await db.award.createMany({ data: snapshot.awards });
  await db.benefit.deleteMany();
  await db.benefit.createMany({ data: snapshot.benefits });
  await db.achievement.deleteMany();
  await db.achievement.createMany({ data: snapshot.achievements });
  await db.approachItem.deleteMany();
  await db.approachItem.createMany({ data: snapshot.approachItems });
  await db.playgroundImage.deleteMany();
  await db.playgroundImage.createMany({ data: snapshot.playgroundImages });

  // ------------------------------------------------------------------ pages
  // Sections cascade from Page, so one delete clears the whole copy tree.
  await db.page.deleteMany();
  for (const { sections, ...page } of snapshot.pages) {
    await db.page.create({
      data: {
        ...page,
        sections: {
          create: sections.map((section: Record<string, unknown>) => ({
            id: section.id,
            key: section.key,
            label: section.label,
            index: section.index,
            heading: section.heading,
            subheading: section.subheading,
            body: section.body,
            image: section.image,
            ctaLabel: section.ctaLabel,
            ctaUrl: section.ctaUrl,
            order: section.order,
            visible: section.visible,
          })),
        },
      },
    });
  }
}

async function main() {
  const db = new PrismaClient();
  try {
    if (process.env.SEED_FORCE !== "1" && (await db.siteSettings.count()) > 0) {
      throw new Error(
        "This database already has content. Re-run with SEED_FORCE=1 only if you intend to replace it.",
      );
    }

    await seedContent(db);

    // The operator is created separately by `npm run admin:create`; seeding is
    // allowed to run without it so a fresh install never depends on secrets.
    const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD ?? "";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 12 || password === "ChangeMe123!") {
      console.warn("No operator account: set ADMIN_EMAIL and a unique 12+ character ADMIN_PASSWORD, or run `npm run admin:create` later.");
    } else {
      await db.user.upsert({
        where: { email },
        update: {},
        create: { email, name: "Johns Antony", role: "ADMIN", passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`Operator account ready: ${email}. Remove ADMIN_PASSWORD from the environment now.`);
    }

    console.log("Seeded Johns Antony's portfolio.");
  } finally {
    await db.$disconnect();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
