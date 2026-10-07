import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageTop, ProjectCard, ServicesGalleryHero, ServiceStackItem } from "@/components/rydge/sections";
import { Button, SectionHead } from "@/components/rydge/ui";
import { getFeaturedProject, getPage, getServices, getSettings, sectionMap } from "@/lib/cms";
import { projectItem } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services");
}

export default async function ServicesPage() {
  const page = await getPage("services");
  if (!page) notFound();

  const [settings, services, featured] = await Promise.all([getSettings(), getServices(), getFeaturedProject()]);
  const s = sectionMap(page.sections);
  const gallery = services.map((service, i) => media(service.image, ART.dark[i % 3])).slice(0, 3);

  return (
    <>
      <PageTop title={page.title} pill={settings.tagline} captions={[page.metaLeft, page.metaRight]}>
        <ServicesGalleryHero background={media(page.heroImage, ART.page)} images={gallery} />
      </PageTop>

      <section className="section no-pb">
        <div className="container-fluid">
          <div className="mb-small">
            <SectionHead label={s.expertise?.label} index={s.expertise?.index}>
              {s.expertise?.body && <p className="paragraph-large" data-ix="lines">{s.expertise.body.replace(/\n/g, " ")}</p>}
            </SectionHead>
          </div>
        </div>
      </section>

      <div>
        {services.map((service, i) => (
          <ServiceStackItem
            key={service.id}
            title={service.title}
            text={service.description}
            tags={service.capabilities}
            image={media(service.image, ART.dark[i % 3])}
            thumb={ART.dark[(i + 1) % 3]}
          />
        ))}
      </div>

      {featured && (
        <section className="section shadow no-pb">
          <div className="container-fluid">
            <div className="mb-small"><SectionHead label={s.featured?.label} index={s.featured?.index} /></div>
            <div className="mb-medium"><ProjectCard project={projectItem(featured)} full /></div>
            <div className="align-center" data-ix="fade-up">
              <Button href={s.featured?.ctaUrl || "/portfolio"}>{s.featured?.ctaLabel || "View all Projects"}</Button>
            </div>
          </div>
          <div style={{ height: "var(--r-section-y)" }} />
        </section>
      )}
    </>
  );
}
