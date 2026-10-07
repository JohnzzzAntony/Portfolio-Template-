import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ServicesAccordion } from "@/components/sections/ServicesAccordion";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProject, getPage, getServices, sectionMap } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services");
}

export default async function ServicesPage() {
  const page = await getPage("services");
  if (!page) notFound();

  const [services, featured] = await Promise.all([
    getServices(),
    getFeaturedProject(),
  ]);

  const s = sectionMap(page.sections);

  return (
    <>
      <PageHero
        title={page.title}
        metaLeft={page.metaLeft}
        metaRight={page.metaRight}
        image={page.heroImage}
      />

      <section className="section shell">
        <SectionHeader label={s.expertise?.label} index={s.expertise?.index} />
        {s.expertise?.body && (
          <SplitText
            as="p"
            by="line"
            text={s.expertise.body}
            className="t-lead mt-[var(--m-large)] max-w-[26ch]"
          />
        )}
        <ServicesAccordion services={services} className="mt-[var(--m-large)]" />
      </section>

      {featured && (
        <section className="section shell">
          <SectionHeader label={s.featured?.label} index={s.featured?.index} />
          <Reveal className="mt-[var(--m-large)]">
            <ProjectCard project={featured} className="aspect-[16/9]" />
          </Reveal>
          <Reveal className="mt-[var(--m-medium)] flex justify-center">
            <Button href="/portfolio">
              {s.featured?.ctaLabel || "View all Projects"}
            </Button>
          </Reveal>
        </section>
      )}
    </>
  );
}
