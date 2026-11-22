import { notFound } from "next/navigation";

import {
  AboutSection,
  BenefitsSection,
  BlogSection,
  Hero,
  PlaygroundSection,
  PortfolioSection,
  ServicesCarousel,
} from "@/components/editorial/sections";
import { CinematicGallery } from "@/components/editorial/CinematicGallery";
import { StatementSection } from "@/components/editorial/StatementSection";
import { PortfolioMotion } from "@/components/editorial/PortfolioMotion";
import { getBenefits, getPage, getPosts, getServices, getSettings, sectionMap } from "@/lib/cms";
import { postItem } from "@/lib/presenters";
import { liveProjects, liveProjectItem } from "@/lib/live-projects";
import { ART, BENEFIT_ART, serviceArt, media } from "@/lib/media";

export async function generateMetadata() {
  const { pageMetadata } = await import("@/lib/seo");
  const metadata = await pageMetadata("home");
  return { ...metadata, title: { absolute: String(metadata.title || "Portfolio") } };
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();

  const [settings, services, benefits, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getBenefits(),
    getPosts(3),
  ]);

  const s = sectionMap(page.sections);
  const year = new Date().getUTCFullYear();
  const statementLines = (s.mission?.heading || "We Build\nDigital\nExperiences\nThat Last.")
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);

  const isHeroVideo = Boolean(page.heroImage && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(page.heroImage));
  const heroImage = media(page.heroImage, ART.hero);
  const heroImageMobile = page.heroImageMobile
    ? media(page.heroImageMobile, ART.heroMobile)
    : isHeroVideo
    ? heroImage
    : media(page.heroImage, ART.heroMobile);

  // The gallery showcases the first four projects; the grid below picks up from
  // there so the same work is never presented twice in a row.
  const capturedProjects = liveProjects.filter(project => project.image);
  const cinematicSelection = capturedProjects.slice(0, 4);
  const gridProjects = liveProjects.filter(project => !cinematicSelection.includes(project)).slice(0, 8);

  const cinematicProjects = cinematicSelection.map((project, i) => ({
    title: project.title,
    category: new URL(project.url).hostname,
    year: "",
    href: project.url,
    image: project.image,
    number: `/${String(i + 1).padStart(2, "0")}`,
  }));

  return (
    <>
      <Hero
        title={page.title}
        services={services.map((service) => service.title)}
        text={s.intro?.body.replace(/\n/g, " ")}
        cta={{ label: s.intro?.ctaLabel || "View Our Works", href: s.intro?.ctaUrl || "/portfolio" }}
        captionLeft={`Portfolio / ©${year}`}
        image={heroImage}
        imageMobile={heroImageMobile}
      />

      {s.about && (
        <AboutSection
          label={s.about.label}
          body={s.about.body.replace(/\n/g, " ")}
          cta={{ label: s.about.ctaLabel || "More about us", href: s.about.ctaUrl || "/about" }}
          images={[media(s.about.image, ART.portrait), ART.pill]}
          marquee={s["story-marquee"]?.heading ? { heading: s["story-marquee"].heading, index: s["story-marquee"].index } : undefined}
        />
      )}

      {services.length > 0 && (
        <ServicesCarousel
          label={s.services?.label}
          index={s.services?.index}
          body={s.services?.body.replace(/\n/g, " ")}
          items={services.map((service, i) => ({
            index: service.index || `/${String(i + 1).padStart(3, "0")}`,
            title: service.title,
            text: service.description,
            image: serviceArt(service.title, service.image, ART.dark[i % 3]),
            tags: service.capabilities.slice(0, 4),
          }))}
        />
      )}

      {/* ── CINEMATIC STATEMENT ────────────────────────────────────── */}
      <StatementSection
        label={s.mission?.label || "(Our Approach)"}
        lines={statementLines.map((text, index) => ({ text, accent: index === 2 }))}
        subText={
          s.mission?.body?.split("\n")[0] ??
          "Crafting purposeful, human-centred digital products that perform across every touchpoint."
        }
        ctaLabel={s.mission?.ctaLabel || "See our process"}
        ctaHref={s.mission?.ctaUrl || "/about"}
      />

      <PortfolioMotion />

      {/* ── 3D CINEMATIC PROJECT GALLERY ──────────────────────────── */}
      {cinematicProjects.length > 0 && (
        <CinematicGallery
          projects={cinematicProjects}
          label={s.portfolio?.label || "(Selected Work)"}
          title={s.portfolio?.heading || "Selected\nProjects"}
          ctaLabel={s.portfolio?.ctaLabel || "View all projects"}
          ctaHref={s.portfolio?.ctaUrl || "/portfolio"}
        />
      )}

      {/* Standard portfolio grid (tab/list view) */}
      {gridProjects.length > 0 && (
        <PortfolioSection
          label={s.portfolio?.label}
          index={s.portfolio?.index}
          heading={`${s.portfolio?.heading || "Selected Work"}\n${settings.copyright.replace(/[()]/g, "")}`}
          projects={gridProjects.map(liveProjectItem)}
          cta={{ body: s.portfolio?.body, label: s.portfolio?.ctaLabel || "View all projects", href: s.portfolio?.ctaUrl || "/portfolio" }}
        />
      )}

      {benefits.length > 0 && (
        <BenefitsSection
          grid
          label={s.benefits?.label}
          index={s.benefits?.index}
          headingOne={s.benefits?.heading}
          headingTwo={s.benefits?.subheading}
          items={benefits.map((b, i) => ({
            index: b.index,
            title: b.title,
            text: b.description,
            image: media(b.image, BENEFIT_ART[b.title] || ART.dark[i % 3]),
          }))}
        />
      )}

      {posts.length > 0 && (
        <BlogSection
          label={s.blog?.label}
          index={s.blog?.index}
          body={s.blog?.body.replace(/\n/g, " ")}
          posts={posts.map(postItem)}
          cta={{ body: s.blog?.subheading, label: s.blog?.ctaLabel || "View Our Blog", href: s.blog?.ctaUrl || "/blog" }}
        />
      )}

      <PlaygroundSection
        label={s.playground?.label || "(Lab)"}
        index={s.playground?.index || "/06"}
        heading={s.playground?.heading || "Creative Lab"}
        cta={s.playground?.ctaUrl ? { label: s.playground.ctaLabel || "View archive", href: s.playground.ctaUrl } : undefined}
        images={[
          { src: "/images/portfolio-art/orbital-systems.png", alt: "Original chrome orbital sculpture — personal brand motion study" },
          { src: "/images/portfolio-art/orbit-mark.svg", alt: "Original dimensional orbital vector" },
          { src: "/images/portfolio-art/commerce-flow.svg", alt: "Original connected commerce diagram" },
        ]}
      />
    </>
  );
}
