import { notFound } from "next/navigation";

import {
  AboutSection,
  BenefitsSection,
  BlogSection,
  Hero,
  PlaygroundSection,
  PortfolioSection,
  ServicesCarousel,
  SplitMission,
} from "@/components/editorial/sections";
import { getBenefits, getPage, getPlayground, getPosts, getProjects, getServices, getSettings, sectionMap } from "@/lib/cms";
import { missionWords, postItem, projectItem } from "@/lib/presenters";
import { ART, BENEFIT_ART, PLAYGROUND_ART, SERVICE_ART, media } from "@/lib/media";

export async function generateMetadata() {
  const { pageMetadata } = await import("@/lib/seo");
  const metadata = await pageMetadata("home");
  return { ...metadata, title: { absolute: String(metadata.title || "Portfolio") } };
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();

  const [settings, services, projects, benefits, posts, playground] = await Promise.all([
    getSettings(),
    getServices(),
    getProjects(4),
    getBenefits(),
    getPosts(3),
    getPlayground(),
  ]);

  const s = sectionMap(page.sections);
  const year = new Date().getUTCFullYear();
  const [l1, l2, l3, sup] = missionWords(s.mission?.heading);

  const isHeroVideo = Boolean(page.heroImage && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(page.heroImage));
  const heroImage = media(page.heroImage, ART.hero);
  const heroImageMobile = page.heroImageMobile
    ? media(page.heroImageMobile, ART.heroMobile)
    : isHeroVideo
    ? heroImage
    : media(page.heroImage, ART.heroMobile);

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
          images={[media(s.about.image, "/images/projects/carter-studio/mockup-1.webp"), ART.pill]}
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
            image: media(service.image, SERVICE_ART[service.title] || ART.dark[i % 3]),
            tags: service.capabilities.slice(0, 4),
          }))}
        />
      )}

      {s.mission && (
        <SplitMission
          label={s.mission.label}
          eyebrow={`${settings.brandName} ${settings.brandSuffix}\n/ ©${year}`}
          words={[l1, l2, l3]}
          sup={sup}
          text={s.mission.body}
          index={s.mission.index}
          image={media(s.mission.image, ART.mission)}
          circle={s.mission.ctaUrl ? { href: s.mission.ctaUrl, text: `${s.mission.ctaLabel || "Learn more"} · ${s.mission.ctaLabel || "Learn more"} · `, label: s.mission.ctaLabel || "Learn more" } : undefined}
        />
      )}

      {projects.length > 0 && (
        <PortfolioSection
          label={s.portfolio?.label}
          index={s.portfolio?.index}
          heading={`${s.portfolio?.heading || "Selected Work"}\n${settings.copyright.replace(/[()]/g, "")}`}
          projects={projects.map(projectItem)}
          cta={{ body: s.portfolio?.body, label: s.portfolio?.ctaLabel || "View all projects", href: s.portfolio?.ctaUrl || "/portfolio" }}
        />
      )}

      {benefits.length > 0 && (
        <BenefitsSection
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
        images={(playground.length > 0 ? playground : PLAYGROUND_ART).map((p, i) => ({
          src: media(p.url, PLAYGROUND_ART[i % PLAYGROUND_ART.length]?.url || ART.dark[i % 3]),
          alt: p.alt,
        }))}
      />
    </>
  );
}

