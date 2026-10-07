import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";

import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { PortfolioTabs } from "@/components/portfolio/PortfolioTabs";
import { Button } from "@/components/ui/Button";
import { DragGallery } from "@/components/ui/DragGallery";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getBenefits,
  getPage,
  getPlayground,
  getPosts,
  getProjects,
  getServices,
  getSettings,
  sectionMap,
} from "@/lib/cms";
import { formatDate } from "@/lib/utils";

export async function generateMetadata() {
  const { pageMetadata } = await import("@/lib/seo");
  const metadata = await pageMetadata("home");
  return { ...metadata, title: { absolute: String(metadata.title || "Portfolio") } };
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();

  const [settings, services, projects, benefits, posts, playground] =
    await Promise.all([
      getSettings(),
      getServices(),
      getProjects(4),
      getBenefits(),
      getPosts(3),
      getPlayground(),
    ]);

  const s = sectionMap(page.sections);
  const disciplines = services.map((service) => service.title);

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate flex min-h-svh flex-col justify-between overflow-hidden px-[var(--page-x)] pb-[var(--section-y-sm)] pt-[var(--nav-h)] on-dark">
        {page.heroImage && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
            <img
              src={page.heroImage}
              alt=""
              className="absolute inset-0 -z-10 hidden size-full object-cover md:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
            <img
              src={page.heroImageMobile || page.heroImage}
              alt=""
              className="absolute inset-0 -z-10 size-full object-cover md:hidden"
            />
          </>
        )}

        <h1 className="t-hero mt-[6vh] whitespace-pre-line">{page.title}</h1>

        {disciplines.length > 0 && (
          <ul className="hairline mt-auto flex flex-wrap justify-between gap-x-6 gap-y-2 pt-[var(--m-xs)]">
            {disciplines.map((item) => (
              <li key={item} className="t-caption">
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-[var(--m-large)] flex flex-col items-center gap-[var(--m-small)] text-center">
          {s.intro?.body && (
            <SplitText
              as="p"
              by="line"
              text={s.intro.body}
              className="t-para-md max-w-[46ch]"
            />
          )}
          <Button href={s.intro?.ctaUrl || "/portfolio"} variant="primary">
            {s.intro?.ctaLabel || "View Our Works"}
          </Button>
        </div>

        <div className="mt-[var(--m-medium)] flex items-end justify-between">
          <span className="t-caption">
            Portfolio / {settings.copyright.replace(/^\(|\)$/g, "")}
          </span>
          <ScrollCue />
        </div>
      </section>

      {/* ----------------------------------------------------------- about */}
      {s.about && (
        <section className="section shell">
          <SectionHeader label={s.about.label} index={s.about.index} />
          <div className="mt-[var(--m-large)] grid gap-[var(--gutter-y-sm)] lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <SplitText
                as="p"
                by="line"
                text={s.about.body}
                className="t-lead max-w-[22ch]"
              />
              <Reveal delay={0.2} className="mt-[var(--m-medium)]">
                <Button href={s.about.ctaUrl || "/about"}>
                  {s.about.ctaLabel || "More about us"}
                </Button>
              </Reveal>
            </div>
            {s.about.image && (
              <Reveal as="figure">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
                <img src={s.about.image} alt="" className="aspect-[4/5] w-full object-cover" />
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* --------------------------------------------- "Our Story" marquee */}
      {s["story-marquee"]?.heading && (
        <Marquee speed={30} repeat={3} itemClassName="flex items-baseline gap-[3vw] pr-[3vw]">
          <span className="text-[length:var(--fs-marquee)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
            {s["story-marquee"].heading}
          </span>
          <span className="t-caption">{s["story-marquee"].index}</span>
        </Marquee>
      )}

      {/* -------------------------------------------------------- services */}
      {services.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.services?.label} index={s.services?.index} />
          {s.services?.body && (
            <SplitText
              as="p"
              by="line"
              text={s.services.body}
              className="t-lead mt-[var(--m-large)] max-w-[24ch]"
            />
          )}
          <ServicesAccordion services={services} className="mt-[var(--m-large)]" />
        </section>
      )}

      {/* --------------------------------------------------------- mission */}
      {s.mission && (
        <MissionSection
          label={s.mission.label}
          index={s.mission.index}
          heading={s.mission.heading}
          body={s.mission.body}
          image={s.mission.image}
          eyebrow={`${settings.brandName} ${settings.brandSuffix}`}
          ctaLabel={s.mission.ctaLabel}
          ctaUrl={s.mission.ctaUrl}
        />
      )}

      {/* ------------------------------------------------------- portfolio */}
      {projects.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.portfolio?.label} index={s.portfolio?.index} />
          <h2 className="t-display mt-[var(--m-large)] mb-[var(--m-medium)]">
            {s.portfolio?.heading || "Selected Work"}
          </h2>
          <PortfolioTabs projects={projects} />
          <Reveal className="mt-[var(--m-large)] flex flex-col items-center gap-[var(--m-small)] text-center">
            <p className="t-para-md max-w-[42ch]">{s.portfolio?.body}</p>
            <Button href={s.portfolio?.ctaUrl || "/portfolio"}>
              {s.portfolio?.ctaLabel || "View all projects"}
            </Button>
          </Reveal>
        </section>
      )}

      {/* -------------------------------------------------------- benefits */}
      {benefits.length > 0 && (
        <BenefitsSection
          label={s.benefits?.label}
          index={s.benefits?.index}
          heading={s.benefits?.heading}
          subheading={s.benefits?.subheading}
          benefits={benefits}
        />
      )}

      {/* ------------------------------------------------------------ blog */}
      {posts.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.blog?.label} index={s.blog?.index} />
          {s.blog?.body && (
            <SplitText
              as="p"
              by="line"
              text={s.blog.body}
              className="t-lead mt-[var(--m-large)] max-w-[24ch]"
            />
          )}

          <Reveal
            as="ul"
            stagger
            className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] md:grid-cols-3"
          >
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {post.coverImage && (
                    <div className="overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
                      <img
                        src={post.coverImage}
                        alt=""
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="mt-[var(--m-small)] text-[length:var(--fs-h4)] font-semibold leading-[var(--lh-6)] tracking-[var(--ls-4)]">
                    {post.title}
                  </h3>
                  <time
                    dateTime={post.publishedAt.toISOString()}
                    className="t-caption mt-2 block text-muted"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-[var(--m-large)] flex flex-col items-center gap-[var(--m-small)] text-center">
            <p className="t-para-md max-w-[42ch]">{s.blog?.subheading}</p>
            <Button href="/blog">{s.blog?.ctaLabel || "View Our Blog"}</Button>
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------ playground */}
      {playground.length > 0 && (
        <section className="section-md">
          <div className="shell">
            <SectionHeader label={s.playground?.label} index={s.playground?.index} />
            <div className="mt-[var(--m-medium)] flex flex-wrap items-end justify-between gap-4">
              <h2 className="t-display">{s.playground?.heading || "Creative Lab"}</h2>
              <span className="t-caption text-muted">Drag cards</span>
            </div>
          </div>

          <DragGallery
            items={playground}
            className="mt-[var(--m-medium)] px-[var(--page-x)]"
            itemClassName="aspect-[3/4] w-[62vw] md:w-[24vw]"
          />

          {s.playground?.ctaUrl && (
            <div className="shell mt-[var(--m-medium)] flex justify-center">
              <Button href={s.playground.ctaUrl}>
                {s.playground.ctaLabel || "View archive"}
              </Button>
            </div>
          )}
        </section>
      )}
    </>
  );
}
