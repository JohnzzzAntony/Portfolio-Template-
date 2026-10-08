/**
 * Seeds the database with a complete, working site.
 *
 * Demonstration content for the operator CMS and /demo pages.
 * All copy and imagery is this project's own.
 *
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const YEARS = "(©2021 — 2026)";

/** Committed placeholder artwork (see src/lib/media.ts). */
const ART = ["/images/art/dark-1.webp", "/images/art/dark-2.webp", "/images/art/dark-3.webp", "/images/art/light-1.webp", "/images/art/light-2.webp", "/images/art/light-3.webp"];
const art = (n: number) => ART[n % ART.length];
const PLACEHOLDER_OVERVIEW =
  "A one-line summary of the project goes here.\nDescribe the challenge, who it was for and what needed to change. This placeholder is replaced with real project copy from the admin.\nExplain the approach, the tools and the outcome. Add screenshots from the admin media library.";

async function main() {
  // ------------------------------------------------------------------ admin
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12 || password === "ChangeMe123!") {
    // Content can be seeded without an operator; re-run with ADMIN_PASSWORD to add one.
    console.warn("ADMIN_PASSWORD is unset or too weak — skipping the operator account. Set a unique password of 12+ characters and re-run to create it.");
  } else {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: "Studio Admin",
        role: "ADMIN",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
  }

  // --------------------------------------------------------------- settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      brandName: "Forma",
      brandSuffix: "Studio",
      tagline: "Full-service creative studio",
      coordinates: "51.5072° N, 0.1276° W",
      email: "hello@example.com",
      supportEmail: "support@example.com",
      phone: "+44 20 7946 0100",
      address: "12 Charlotte Road, London, UK",
      addressUrl: "https://www.openstreetmap.org",
      footerHeadline: "Have a project in mind?",
      footerCtaLabel: "Let's Talk",
      footerCtaUrl: "/contact",
      footerImage: "/images/art/footer.webp",
      badgeText: "LET'S TALK · SAY HELLO · ",
      credits: "Designed & built in-house.",
      copyright: YEARS,
      metaTitle: "Forma Studio — Creative Studio",
      metaDescription:
        "A full-service creative studio crafting brands, digital products and the systems that hold them together.",
      ogImage: "/images/art/hero.webp",
    },
  });

  // -------------------------------------------------------------- nav/social
  await prisma.navItem.deleteMany();
  await prisma.navItem.createMany({
    data: [
      { label: "Home", href: "/", order: 0 },
      { label: "About", href: "/about", order: 1 },
      { label: "Services", href: "/services", order: 2 },
      { label: "Portfolio", href: "/portfolio", order: 3 },
      { label: "Blog", href: "/blog", order: 4 },
      { label: "Contact", href: "/contact", order: 5 },
    ],
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { label: "Instagram", url: "https://instagram.com", order: 0 },
      { label: "LinkedIn", url: "https://linkedin.com", order: 1 },
      { label: "Dribbble", url: "https://dribbble.com", order: 2 },
      { label: "Read.cv", url: "https://read.cv", order: 3 },
    ],
  });

  // --------------------------------------------------------------- services
  await prisma.service.deleteMany();
  const services = await Promise.all(
    [
      {
        slug: "branding",
        index: "/001",
        title: "Branding",
        description:
          "We build identities that hold up everywhere they land — not just on the pitch deck. Positioning, naming, marks, type and the rules that keep it all coherent as the company grows.",
        image: art(0),
        capabilities: JSON.stringify([
          "Brand Strategy",
          "Naming",
          "Identity Design",
          "Brand Guidelines",
          "Rebranding",
        ]),
        order: 0,
      },
      {
        slug: "design",
        index: "/002",
        title: "Design",
        description:
          "Interfaces and products that are pleasant to use and cheap to maintain. We design in systems, so the tenth screen costs less than the first.",
        image: art(1),
        capabilities: JSON.stringify([
          "Product Design",
          "UI/UX",
          "Design Systems",
          "Motion Design",
          "Prototyping",
        ]),
        order: 1,
      },
      {
        slug: "engineering",
        index: "/003",
        title: "Engineering",
        description:
          "We ship the thing. Fast, accessible front-ends, sensible back-ends, and a content model your team can actually operate without calling us.",
        image: art(2),
        capabilities: JSON.stringify([
          "Front-End",
          "Back-End",
          "CMS Development",
          "E-Commerce",
          "Web Applications",
        ]),
        order: 2,
      },
      {
        slug: "art-direction",
        index: "/004",
        title: "Art Direction",
        description:
          "The connective tissue: how a brand looks in a photograph, a film, a room. We set the visual argument and then make sure every asset makes it.",
        image: art(3),
        capabilities: JSON.stringify([
          "Creative Concept",
          "Photography Direction",
          "Storyboarding",
          "Film & Video",
          "Campaign Rollout",
        ]),
        order: 3,
      },
    ].map((data) => prisma.service.create({ data })),
  );

  const byslug = Object.fromEntries(services.map((s) => [s.slug, s.id]));

  // --------------------------------------------------------------- projects
  await prisma.project.deleteMany();

  const projects = [
    {
      slug: "project-one",
      title: "Project One",
      client: "Client or industry",
      year: "2026",
      services: ["design", "engineering"],
      overview: PLACEHOLDER_OVERVIEW,
      featured: true,
    },
    {
      slug: "project-two",
      title: "Project Two",
      client: "Client or industry",
      year: "2026",
      services: ["branding", "art-direction"],
      overview: PLACEHOLDER_OVERVIEW,
    },
    {
      slug: "project-three",
      title: "Project Three",
      client: "Client or industry",
      year: "2026",
      services: ["design", "engineering"],
      overview: PLACEHOLDER_OVERVIEW,
    },
    {
      slug: "project-four",
      title: "Project Four",
      client: "Client or industry",
      year: "2025",
      services: ["branding", "design"],
      overview: PLACEHOLDER_OVERVIEW,
    },
    {
      slug: "project-five",
      title: "Project Five",
      client: "Client or industry",
      year: "2025",
      services: ["design", "engineering"],
      overview: PLACEHOLDER_OVERVIEW,
    },
    {
      slug: "project-six",
      title: "Project Six",
      client: "Client or industry",
      year: "2025",
      services: ["engineering"],
      overview: PLACEHOLDER_OVERVIEW,
    },
  ];

  for (const [i, project] of projects.entries()) {
    await prisma.project.create({
      data: {
        slug: project.slug,
        title: project.title,
        client: project.client,
        year: project.year,
        overview: project.overview,
        coverImage: art(i),
        previewImage: art(i),
        viewUrl: "",
        featured: project.featured ?? false,
        published: true,
        order: i,
        services: { connect: project.services.map((s) => ({ id: byslug[s] })) },
        images: {
          create: [2, 3, 4].map((n) => ({
            url: art(i + n),
            alt: `${project.title} — screen ${n}`,
            order: n - 2,
          })),
        },
      },
    });
  }

  // ------------------------------------------------------------------- blog
  await prisma.post.deleteMany();
  const posts = [
    {
      slug: "we-are-hiring-a-senior-designer",
      title: "We're hiring a senior designer",
      excerpt:
        "A role for someone who wants to own the whole arc of a project, from positioning to the last hover state.",
      body: "We're looking for a senior designer to join the studio in London.\n\nThis is a generalist role in the old sense: you'd work on identity, product and the site that ties them together, often on the same project. If you like the part where a brand decision turns into a component, you'll enjoy it here.\n\nWhat we care about: taste you can explain, comfort with ambiguity early in a project, and the discipline to finish. What we don't care about: where you studied, or how many followers the work has.\n\nWrite to us with three pieces of work and a paragraph on each about what you'd change now.",
    },
    {
      slug: "designing-atlas-a-system-for-eleven-teams",
      title: "Designing Atlas: a system for eleven teams",
      excerpt:
        "What we learned building a design system nobody was required to adopt.",
      body: "Atlas had no mandate behind it. Eleven product teams could take it or leave it, which turned out to be the most useful constraint we've worked under.\n\nWhen adoption is voluntary, every component has to be better than the thing the team would have written themselves — including the time cost of learning it. That killed a lot of ideas early.\n\nThe components that spread fastest weren't the complex ones. They were the boring primitives with unusually good documentation: a button with every state drawn, a form field that handled error text without being asked.\n\nTwo quarters in, roughly 80% of surfaces were on Atlas. We still think the docs did more work than the code.",
    },
    {
      slug: "the-case-for-fewer-breakpoints",
      title: "The case for fewer breakpoints",
      excerpt:
        "Most responsive complexity is self-inflicted. Viewport units and a floor will get you further than another media query.",
      body: "A layout with six breakpoints is usually a layout that hasn't decided what it is.\n\nWe've been building display type in viewport units and reserving media queries for the two or three moments where the structure genuinely changes — a grid going from four columns to one, a nav collapsing. Everything in between scales on its own.\n\nThe catch is reading text. Body copy in viewport units becomes unreadable on a phone, so anything a person actually reads gets a rem floor. Display type scales; reading type doesn't.\n\nThat single rule removed about two-thirds of the media queries from our last three projects.",
    },
    {
      slug: "northwind-wins-at-the-brand-awards",
      title: "Northwind wins at the Brand Impact Awards",
      excerpt:
        "Our identity work for Northwind Energy took the Infrastructure category.",
      body: "Northwind picked up the Infrastructure category at this year's Brand Impact Awards.\n\nThe jury singled out the data-led type system — the decision to treat generation figures as a primary brand asset rather than something to hide in a report.\n\nCredit to the Northwind comms team, who defended the harder version of the idea internally for six months before any of it shipped.",
    },
    {
      slug: "what-a-content-model-is-actually-for",
      title: "What a content model is actually for",
      excerpt:
        "If your client has to call you to change a headline, the build isn't finished.",
      body: "A content model is not a database schema with nicer names. It's a description of the decisions you're willing to let someone make after you leave.\n\nWe've started drawing it during design rather than after. Every section gets a label, a counter, a heading, a body and an optional image — and if a section needs a field outside that shape, it's usually a sign the section is doing two jobs.\n\nThe test is simple: can a non-technical editor change every word on the site without opening a code editor? If not, the build isn't finished, however good it looks.",
    },
    {
      slug: "notes-on-motion-that-survives-contact-with-users",
      title: "Notes on motion that survives contact with users",
      excerpt:
        "Scroll animation is easy to add and hard to keep. Some rules we've settled on.",
      body: "Motion is the first thing to break and the last thing anyone tests.\n\nOur rules, arrived at the hard way: animate on scroll only once — replaying on every pass reads as a glitch. Never hide content behind an animation that JavaScript has to un-hide, or a failed bundle takes the page with it. And wire reduced-motion at the source, not per-component, so there's one place to be wrong.\n\nThe last one matters most. A user who has asked their operating system to calm things down is not asking for a slower version of your parallax.",
    },
  ];

  for (const [i, post] of posts.entries()) {
    await prisma.post.create({
      data: {
        ...post,
        coverImage: ["/images/art/light-1.webp", "/images/art/dark-1.webp", "/images/art/light-2.webp", "/images/art/dark-2.webp", "/images/art/light-3.webp", "/images/art/dark-3.webp"][i % 6],
        author: "Forma Studio",
        tags: JSON.stringify(["studio"]),
        published: true,
        publishedAt: new Date(2026, 8 - i, 12),
      },
    });
  }

  // -------------------------------------------------------------- about bits
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      { name: "Bea Okonjo", role: "Co-founder, Design", photo: "/images/art/silk-portrait.webp", linkedinUrl: "https://linkedin.com", instagramUrl: "https://instagram.com", order: 0 },
      { name: "Marek Dvořák", role: "Co-founder, Engineering", photo: "/images/art/dark-2.webp", linkedinUrl: "https://linkedin.com", instagramUrl: "https://instagram.com", order: 1 },
      { name: "Ines Ferreira", role: "Art Director", photo: "/images/art/dark-3.webp", linkedinUrl: "https://linkedin.com", instagramUrl: "https://instagram.com", order: 2 },
    ],
  });

  await prisma.award.deleteMany();
  await prisma.award.createMany({
    data: [
      { title: "Brand Impact Awards", category: "Infrastructure", year: "2026", url: "", order: 0 },
      { title: "D&AD", category: "Wood Pencil, Digital Design", year: "2025", url: "", order: 1 },
      { title: "The Webby Awards", category: "Honoree, Websites", year: "2025", url: "", order: 2 },
      { title: "Type Directors Club", category: "Certificate of Excellence", year: "2024", url: "", order: 3 },
      { title: "CSS Design Awards", category: "Site of the Day", year: "2024", url: "", order: 4 },
      { title: "Awwwards", category: "Honourable Mention", year: "2023", url: "", order: 5 },
    ],
  });

  await prisma.benefit.deleteMany();
  await prisma.benefit.createMany({
    data: [
      {
        index: "/001",
        title: "Senior people only",
        description:
          "The people in the pitch are the people doing the work. No handover to a junior team after you sign.",
        image: art(4),
        order: 0,
      },
      {
        index: "/002",
        title: "Built to hand over",
        description:
          "Every project ships with a content model your team can operate and documentation written for someone who wasn't in the room.",
        image: art(5),
        order: 1,
      },
      {
        index: "/003",
        title: "Dates we can keep",
        description:
          "We scope narrow and commit hard. If something is going to slip you'll hear it from us first, with the options attached.",
        image: art(6),
        order: 2,
      },
    ],
  });

  await prisma.achievement.deleteMany();
  await prisma.achievement.createMany({
    data: [
      { value: "75+", label: "Projects shipped", image: "/images/art/dark-1.webp", order: 0 },
      { value: "2019", label: "Established", image: "/images/art/dark-2.webp", order: 1 },
      { value: "11", label: "People", image: "/images/art/dark-3.webp", order: 2 },
      { value: "94%", label: "Repeat clients", image: "/images/art/hero.webp", order: 3 },
    ],
  });

  await prisma.approachItem.deleteMany();
  await prisma.approachItem.createMany({
    data: [
      {
        letter: "A",
        title: "Strategy first",
        description:
          "We spend the first weeks on the argument, not the artwork. If we can't explain why the work should look like this, it shouldn't.",
        order: 0,
      },
      {
        letter: "B",
        title: "Designed for people",
        description:
          "Real users, real content, real edge cases. We test with the messy version of the data, because that's the version that ships.",
        order: 1,
      },
      {
        letter: "C",
        title: "Built together",
        description:
          "You're in the file with us. Weekly, in progress, before things are pretty — which is when your input is worth the most.",
        order: 2,
      },
    ],
  });

  await prisma.playgroundImage.deleteMany();
  await prisma.playgroundImage.createMany({
    data: Array.from({ length: 7 }, (_, n) => ({
      url: art(n),
      alt: `Project study ${n + 1}`,
      order: n,
    })),
  });

  // ------------------------------------------------------- pages + sections
  await prisma.page.deleteMany();

  await createPage({
    key: "home",
    name: "Home",
    title: "Forma\nStudio",
    heroImage: "/images/art/hero.webp",
    heroImageMobile: "/images/art/hero-mobile.webp",
    seoTitle: "Forma Studio — Creative Studio",
    seoDescription:
      "A full-service creative studio crafting brands, digital products and the systems that hold them together.",
    sections: [
      {
        key: "intro",
        body: "Forma is a creative studio working across brand,\nproduct and the engineering that ships them.\nSenior people, narrow scopes, dates we keep.",
        ctaLabel: "View Our Works",
        ctaUrl: "/portfolio",
      },
      {
        key: "about",
        label: "(About)",
        index: "/01",
        body: "We make brands and the\nproducts they live inside.\nStrategy, design and code\nunder one roof, so nothing\ngets lost in the handoff.",
        image: art(7),
        ctaLabel: "More about us",
        ctaUrl: "/about",
      },
      { key: "story-marquee", heading: "Our Story", index: "/01" },
      {
        key: "services",
        label: "(Services)",
        index: "/02",
        body: "No fluff, no noise — sharp design,\nclear strategy, and code that\noutlives the launch.",
      },
      {
        key: "mission",
        label: "(Our Mission)",
        index: "/03",
        heading: "Design®\nWith\npurpose",
        body: "We take on work where the design decision and the business decision are the same decision. That means fewer projects, longer engagements, and a studio that can still name every client. If a thing looks good but can't be operated by your team six months from now, we haven't finished it.",
        image: "/images/art/mission.webp",
        ctaLabel: "View our services",
        ctaUrl: "/services",
      },
      {
        key: "portfolio",
        label: "(Portfolio)",
        index: "/04",
        heading: "Selected Work",
        body: "A sample of recent work across brand, product and platform.",
        ctaLabel: "View all projects",
        ctaUrl: "/portfolio",
      },
      {
        key: "benefits",
        label: "(Benefits)",
        index: "/05",
        heading: "Beyond Just Websites",
        subheading: "The Impact We Deliver",
      },
      {
        key: "blog",
        label: "(Blog)",
        index: "/06",
        body: "Notes on the work, the studio,\nand what we're figuring out\nin public.",
        subheading: "Writing on design systems, motion, and the parts of the process that usually go undocumented.",
        ctaLabel: "View Our Blog",
        ctaUrl: "/blog",
      },
      {
        key: "playground",
        label: "(Playground)",
        index: "/07",
        heading: "Creative Lab",
        ctaLabel: "View archive",
        ctaUrl: "/portfolio",
      },
    ],
  });

  await createPage({
    key: "about",
    name: "About",
    title: "About the\nStudio",
    metaLeft: "Based in London, UK",
    metaRight: YEARS,
    sections: [
      {
        key: "about",
        label: "(About)",
        index: "/01",
        body: "Eleven people who would\nrather do six projects well\nthan twenty adequately.",
        image: art(8),
        ctaLabel: "View our services",
        ctaUrl: "/services",
      },
      { key: "story-marquee", heading: "Our Story", index: "/01" },
      {
        key: "approach",
        label: "(Approach)",
        index: "/02",
        body: "Strategy, design and code\nheld to the same argument\nfrom week one.",
      },
      {
        key: "mission",
        label: "(Our Mission)",
        index: "/03",
        heading: "Design®\nWith\npurpose",
        body: "We started the studio because we were tired of good design dying in handoff. So we kept strategy, design and engineering in the same room, on the same project, accountable to the same outcome. It makes us slower to scale and much harder to hand a broken thing.",
        image: "/images/art/mission.webp",
        ctaLabel: "View our work",
        ctaUrl: "/portfolio",
      },
      {
        key: "awards",
        label: "(Awards)",
        index: "/04",
        heading: "Awards & Recognitions",
      },
      {
        key: "benefits",
        label: "(Benefits)",
        index: "/05",
        heading: "Beyond Just Websites",
        subheading: "The Impact We Deliver",
      },
      {
        key: "team",
        label: "(Team)",
        index: "/06",
        body: "The people behind the work —\nand the ones you'll actually\nbe talking to.",
      },
    ],
  });

  await createPage({
    key: "services",
    name: "Services",
    title: "Services &\ncapabilities",
    metaLeft: "Seven years of practice",
    metaRight: YEARS,
    heroImage: "/images/art/page.webp",
    sections: [
      {
        key: "expertise",
        label: "(Expertise)",
        index: "/01",
        body: "Four disciplines, one team.\nMost projects use three of them.",
      },
      {
        key: "featured",
        label: "(Featured Project)",
        index: "/02",
        ctaLabel: "View all Projects",
        ctaUrl: "/portfolio",
      },
    ],
  });

  await createPage({
    key: "portfolio",
    name: "Portfolio",
    title: "Selected Work",
    metaLeft: "Brand, product & platform",
    metaRight: YEARS,
    sections: [
      {
        key: "portfolio",
        label: "(Portfolio)",
        index: "/01",
        heading: "Work we can talk about.\nAsk us about the rest.",
      },
    ],
  });

  await createPage({
    key: "blog",
    name: "Blog",
    title: "Latest News\n& press",
    metaLeft: "Process, events, awards",
    metaRight: YEARS,
    sections: [
      {
        key: "cta",
        heading: "Contact Us",
        body: "Got something you'd like to build? Tell us what you're working on and we'll tell you honestly whether we're the right studio for it.",
        ctaLabel: "Reach out to us",
        ctaUrl: "/contact",
      },
    ],
  });

  await createPage({
    key: "contact",
    name: "Contact",
    title: "Let's Work\nTogether",
    metaLeft: "Based in London, UK",
    metaRight: YEARS,
    heroImage: "/images/art/page.webp",
    sections: [
      {
        key: "enquiries",
        label: "(General Enquiries)",
        index: "/01",
        body: "We're taking on new projects.\nWhether you have a brief ready\nor just a problem you can't\nname yet, drop us a line.",
      },
      { key: "support", label: "(Support / Location)", index: "/02" },
      {
        key: "form",
        heading: "Email Us",
        index: "/03",
        body: "Tell us what you're building and roughly when you need it. We reply to everything within two working days.",
      },
      { key: "featured", label: "(Featured Project)", index: "/04" },
    ],
  });

  console.log("Seed complete.");
  if (password && password.length >= 12 && password !== "ChangeMe123!") console.log(`Admin account: ${email}. Use your configured ADMIN_PASSWORD.`);
}

type SectionSeed = {
  key: string;
  label?: string;
  index?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

async function createPage(input: {
  key: string;
  name: string;
  title: string;
  metaLeft?: string;
  metaRight?: string;
  heroImage?: string;
  heroImageMobile?: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: SectionSeed[];
}) {
  const { sections, ...page } = input;

  await prisma.page.create({
    data: {
      ...page,
      metaLeft: page.metaLeft ?? "",
      metaRight: page.metaRight ?? "",
      heroImage: page.heroImage ?? "",
      heroImageMobile: page.heroImageMobile ?? "",
      seoTitle: page.seoTitle ?? "",
      seoDescription: page.seoDescription ?? "",
      sections: {
        create: sections.map((section, order) => ({
          key: section.key,
          label: section.label ?? "",
          index: section.index ?? "",
          heading: section.heading ?? "",
          subheading: section.subheading ?? "",
          body: section.body ?? "",
          image: section.image ?? "",
          ctaLabel: section.ctaLabel ?? "",
          ctaUrl: section.ctaUrl ?? "",
          order,
        })),
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
