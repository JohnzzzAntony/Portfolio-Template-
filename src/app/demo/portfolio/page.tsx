import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CallToAction, PortfolioSection } from "@/components/editorial/sections";
import { Marquee, ScrollDown } from "@/components/editorial/ui";
import { WorkSlides } from "@/components/editorial/WorkSlides";
import { getPage, getProjects, getSettings, sectionMap } from "@/lib/cms";
import { projectItem } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("portfolio");
}

export default async function PortfolioPage() {
  const page = await getPage("portfolio");
  if (!page) notFound();

  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);
  const s = sectionMap(page.sections);
  const covers = projects.slice(0, 3).map((p, i) => media(p.coverImage, ART.dark[i % 3]));

  return (
    <>
      <section className="work-hero">
        <div className="hero-content">
          <div className="container-fluid">
            <div className="page-title-wrap hero">
              <div className="page-pill-wrap">
                <div className="page-pill" data-ix="fade-scale"><Marquee duration={24} itemClassName="tiny-gap"><div className="section-caption">{settings.tagline}</div></Marquee></div>
              </div>
              <div className="page-title-inner"><h1 className="page-title" data-ix="lines">{`${page.title}\n${settings.copyright}`}</h1></div>
            </div>
          </div>
        </div>
        <div className="captions">
          <div className="container-fluid">
            <div className="caption-grid">
              <div data-ix="fade-up" data-ix-delay="0.2"><div className="hero-caption">{page.metaLeft}</div></div>
              <div data-ix="fade-up" data-ix-delay="0.3"><div className="hero-caption">({settings.brandName} {settings.brandSuffix})</div></div>
              <div data-ix="fade-up" data-ix-delay="0.4"><ScrollDown /></div>
            </div>
          </div>
        </div>
        <WorkSlides images={covers.length ? covers : [ART.hero]} />
      </section>

      <PortfolioSection
        label={s.portfolio?.label}
        index={s.portfolio?.index}
        heading={s.portfolio?.heading || "Selected Work"}
        projects={projects.map(projectItem)}
      />

      <CallToAction
        index="/02"
        text="Got something you'd like to build? Tell us what you're working on and we'll tell you honestly whether we're the right studio for it."
        cta={{ label: "Reach out to us", href: "/contact" }}
      />
    </>
  );
}
