import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { SplitText } from "@/components/motion/SplitText";
import { PortfolioTabs } from "@/components/portfolio/PortfolioTabs";
import { DragGallery } from "@/components/ui/DragGallery";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPage, getPlayground, getProjects, sectionMap } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("portfolio");
}

export default async function PortfolioPage() {
  const page = await getPage("portfolio");
  if (!page) notFound();

  const [projects, slides] = await Promise.all([
    getProjects(),
    getPlayground(),
  ]);

  const s = sectionMap(page.sections);

  return (
    <>
      <PageHero
        title={page.title}
        metaLeft={page.metaLeft}
        metaRight={page.metaRight}
      />

      {slides.length > 0 && (
        <DragGallery
          items={slides.slice(0, 3)}
          className="px-[var(--page-x)]"
          itemClassName="aspect-[16/10] w-[82vw] md:w-[46vw]"
        />
      )}

      <section className="section shell">
        <SectionHeader label={s.portfolio?.label} index={s.portfolio?.index} />
        {s.portfolio?.heading && (
          <SplitText
            as="h2"
            by="line"
            text={s.portfolio.heading}
            className="t-lead mb-[var(--m-large)] mt-[var(--m-large)] max-w-[26ch]"
          />
        )}
        <PortfolioTabs projects={projects} />
      </section>
    </>
  );
}
