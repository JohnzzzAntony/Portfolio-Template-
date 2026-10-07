import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getAchievements,
  getApproach,
  getAwards,
  getBenefits,
  getPage,
  getSettings,
  getTeam,
  sectionMap,
} from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about");
}

export default async function AboutPage() {
  const page = await getPage("about");
  if (!page) notFound();

  const [settings, achievements, approach, awards, benefits, team] =
    await Promise.all([
      getSettings(),
      getAchievements(),
      getApproach(),
      getAwards(),
      getBenefits(),
      getTeam(),
    ]);

  const s = sectionMap(page.sections);

  return (
    <>
      <PageHero
        title={page.title}
        metaLeft={page.metaLeft}
        metaRight={page.metaRight}
      />

      {/* ---------------------------------------------------- achievements */}
      {achievements.length > 0 && (
        <Reveal
          as="ul"
          stagger
          className="shell section-md grid gap-[var(--gutter-x)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {achievements.map((item) => (
            <li key={item.id} className="flex flex-col">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              )}
              <span className="mt-[var(--m-small)] block text-[length:var(--fs-achievement)] font-semibold leading-[var(--lh-3)] tracking-[var(--ls-3)]">
                {item.value}
              </span>
              <span className="t-caption text-muted">{item.label}</span>
            </li>
          ))}
        </Reveal>
      )}

      {/* ----------------------------------------------------------- about */}
      {s.about && (
        <section className="section shell">
          <SectionHeader label={s.about.label} index={s.about.index} />
          <div className="mt-[var(--m-large)] grid gap-[var(--gutter-y-sm)] lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <SplitText as="p" by="line" text={s.about.body} className="t-lead max-w-[22ch]" />
              {s.about.ctaUrl && (
                <Reveal delay={0.2} className="mt-[var(--m-medium)]">
                  <Button href={s.about.ctaUrl}>{s.about.ctaLabel || "View our services"}</Button>
                </Reveal>
              )}
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

      {/* -------------------------------------------------------- approach */}
      {approach.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.approach?.label} index={s.approach?.index} />
          {s.approach?.body && (
            <SplitText
              as="p"
              by="line"
              text={s.approach.body}
              className="t-lead mt-[var(--m-large)] max-w-[26ch]"
            />
          )}
          <Reveal
            as="ul"
            stagger
            className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] md:grid-cols-3"
          >
            {approach.map((item) => (
              <li key={item.id} className="hairline flex flex-col pt-[var(--m-small)]">
                <span className="t-caption text-muted">{item.letter}</span>
                <h3 className="t-card-title mt-[var(--m-xs)] uppercase">{item.title}</h3>
                <p className="t-para-md mt-[var(--m-small)]">{item.description}</p>
              </li>
            ))}
          </Reveal>
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

      {/* ---------------------------------------------------------- awards */}
      {awards.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.awards?.label} index={s.awards?.index} />
          <h2 className="t-display mt-[var(--m-large)] uppercase">
            {s.awards?.heading || "Awards & Recognitions"}
          </h2>
          <ul className="mt-[var(--m-large)]">
            {awards.map((award) => (
              <li key={award.id}>
                <a
                  href={award.url || "#"}
                  target={award.url ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="hairline group flex items-center gap-6 py-[var(--m-base)] transition-colors duration-500 hover:bg-ink hover:text-paper"
                >
                  <span className="text-[length:var(--fs-project-list-title)] font-semibold tracking-[var(--ls-5)]">
                    {award.title}
                  </span>
                  <span className="t-caption ml-auto hidden opacity-70 md:block">
                    {award.category}
                  </span>
                  <span className="t-caption tabular-nums">{award.year}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 shrink-0 transition-transform duration-500 group-hover:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="square" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
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

      {/* ------------------------------------------------------------ team */}
      {team.length > 0 && (
        <section className="section shell">
          <SectionHeader label={s.team?.label} index={s.team?.index} />
          {s.team?.body && (
            <SplitText
              as="p"
              by="line"
              text={s.team.body}
              className="t-lead mt-[var(--m-large)] max-w-[26ch]"
            />
          )}

          <Reveal
            as="ul"
            stagger
            className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] md:grid-cols-3"
          >
            {team.map((member) => (
              <li key={member.id} className="group flex flex-col">
                <div className="relative overflow-hidden">
                  {member.photo && (
                    // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
                    <img
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-3 bg-ink/80 p-4 text-paper transition-transform duration-500 group-hover:translate-y-0">
                    {member.linkedinUrl && (
                      <a href={member.linkedinUrl} target="_blank" rel="noreferrer noopener" className="t-caption hover:opacity-70">
                        LinkedIn
                      </a>
                    )}
                    {member.instagramUrl && (
                      <a href={member.instagramUrl} target="_blank" rel="noreferrer noopener" className="t-caption hover:opacity-70">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="t-card-title mt-[var(--m-small)]">{member.name}</h3>
                <span className="t-caption text-muted">{member.role}</span>
              </li>
            ))}
          </Reveal>
        </section>
      )}
    </>
  );
}
