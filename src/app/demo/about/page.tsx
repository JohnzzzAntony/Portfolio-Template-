import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AboutSection,
  Achievements,
  AwardsList,
  BenefitsSection,
  CardsGrid,
  CtaRow,
  PageTop,
  SplitMission,
  TeamGrid,
} from "@/components/rydge/sections";
import { SectionHead } from "@/components/rydge/ui";
import { getAchievements, getApproach, getAwards, getBenefits, getPage, getSettings, getTeam, sectionMap } from "@/lib/cms";
import { missionWords } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about");
}

export default async function AboutPage() {
  const page = await getPage("about");
  if (!page) notFound();

  const [settings, achievements, approach, awards, benefits, team] = await Promise.all([
    getSettings(),
    getAchievements(),
    getApproach(),
    getAwards(),
    getBenefits(),
    getTeam(),
  ]);
  const s = sectionMap(page.sections);
  const year = new Date().getUTCFullYear();
  const [l1, l2, l3, sup] = missionWords(s.mission?.heading);

  return (
    <>
      <PageTop title={page.title} pill={settings.tagline} captions={[page.metaLeft, page.metaRight]} />

      {achievements.length > 0 && (
        <div className="mb-large">
          <Achievements items={achievements.map((a, i) => ({ value: a.value, label: a.label, image: media(a.image, ART.dark[i % 3]) }))} />
        </div>
      )}

      {s.about && (
        <AboutSection
          label={s.about.label}
          body={s.about.body.replace(/\n/g, " ")}
          cta={s.about.ctaUrl ? { label: s.about.ctaLabel || "View our services", href: s.about.ctaUrl } : undefined}
          images={[media(s.about.image, ART.portrait), ART.pill]}
          marquee={s["story-marquee"]?.heading ? { heading: s["story-marquee"].heading, index: s["story-marquee"].index } : undefined}
        />
      )}

      {approach.length > 0 && (
        <section className="section shadow">
          <div className="container-fluid">
            <div className="mb-large">
              <SectionHead label={s.approach?.label} index={s.approach?.index}>
                {s.approach?.body && <p className="paragraph-large" data-ix="lines">{s.approach.body.replace(/\n/g, " ")}</p>}
              </SectionHead>
            </div>
            <CardsGrid parallax items={approach.map((a) => ({ number: a.letter, title: a.title, text: a.description }))} />
          </div>
        </section>
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
          circle={s.mission.ctaUrl ? { href: s.mission.ctaUrl, text: `${s.mission.ctaLabel} · ${s.mission.ctaLabel} · `, label: s.mission.ctaLabel || "Learn more" } : undefined}
        />
      )}

      {awards.length > 0 && (
        <section className="section shadow">
          <div className="container-fluid">
            <div className="mb-large">
              <SectionHead label={s.awards?.label} index={s.awards?.index}>
                <h3 className="heading-medium" data-ix="lines">{s.awards?.heading || "Awards & Recognitions"}</h3>
              </SectionHead>
            </div>
            <div className="mb-large"><AwardsList items={awards} /></div>
            <CtaRow cta={{ body: "Recognition is nice. Work that keeps working for the people who commissioned it is the point.", label: "View portfolio", href: "/portfolio" }} />
          </div>
        </section>
      )}

      {benefits.length > 0 && (
        <BenefitsSection
          label={s.benefits?.label}
          index={s.benefits?.index}
          headingOne={s.benefits?.heading}
          headingTwo={s.benefits?.subheading}
          items={benefits.map((b) => ({ index: b.index, title: b.title, text: b.description, image: media(b.image, ART.dark[0]) }))}
        />
      )}

      {team.length > 0 && (
        <section className="section">
          <div className="overflow-hidden">
            <div className="container-fluid">
              <div className="mb-large">
                <SectionHead label={s.team?.label} index={s.team?.index}>
                  {s.team?.body && <p className="paragraph-large" data-ix="lines">{s.team.body.replace(/\n/g, " ")}</p>}
                </SectionHead>
              </div>
              <TeamGrid
                members={team.map((m, i) => ({
                  name: m.name,
                  role: m.role,
                  photo: media(m.photo, ART.dark[i % 3]),
                  links: [
                    ...(m.linkedinUrl ? [{ label: "LinkedIn", href: m.linkedinUrl }] : []),
                    ...(m.instagramUrl ? [{ label: "Instagram", href: m.instagramUrl }] : []),
                  ],
                }))}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
