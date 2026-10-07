/** Post-seed sanity check. Run with: npx tsx scripts/verify-seed.ts */
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();

const counts = {
  users: await p.user.count(),
  settings: await p.siteSettings.count(),
  pages: await p.page.count(),
  sections: await p.section.count(),
  projects: await p.project.count(),
  projectImages: await p.projectImage.count(),
  services: await p.service.count(),
  posts: await p.post.count(),
  team: await p.teamMember.count(),
  awards: await p.award.count(),
  benefits: await p.benefit.count(),
  achievements: await p.achievement.count(),
  approach: await p.approachItem.count(),
  playground: await p.playgroundImage.count(),
  nav: await p.navItem.count(),
  socials: await p.socialLink.count(),
};

console.log(counts);

for (const key of ["home", "about", "services", "portfolio", "blog", "contact"]) {
  const page = await p.page.findUnique({
    where: { key },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  console.log(`${key.padEnd(10)} -> ${page?.sections.map((s) => s.key).join(", ")}`);
}

const featured = await p.project.findFirst({
  where: { featured: true },
  include: { services: true, images: true },
});
console.log(
  `featured: ${featured?.title} | services: ${featured?.services.map((s) => s.title).join("/")} | images: ${featured?.images.length}`,
);

await p.$disconnect();
