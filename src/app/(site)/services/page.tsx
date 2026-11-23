import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageTop, ProjectCard, ServicesGalleryHero, ServiceStackItem } from "@/components/editorial/sections";
import { Button, SectionHead } from "@/components/editorial/ui";
import { getPage, getServices, getSettings, sectionMap, getFeaturedProject } from "@/lib/cms";
import { projectItem } from "@/lib/presenters";
import { ART, serviceArt, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services");
}

export default async function ServicesPage() {
  const page = await getPage("services");
  if (!page) notFound();

  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const featured = await getFeaturedProject();
  const s = sectionMap(page.sections);
  const gallery = services.map((service, i) => serviceArt(service.title, service.image, ART.dark[i % 3])).slice(0, 3);

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

      <figure className="service-film container-fluid">
        <video controls playsInline preload="none" width="800" height="600"
          poster="/images/portfolio-art/fields/figma.svg" aria-label="A storefront build from design through launch">
          <source src="/videos/storefront-to-launch.mp4" type="video/mp4" />
        </video>
        <figcaption>From design to launch · A storefront build in seven steps</figcaption>
      </figure>

      <div>
        {services.map((service, i) => (
          <ServiceStackItem
            key={service.id}
            title={service.title}
            text={service.description}
            tags={service.capabilities}
            image={serviceArt(service.title, service.image, ART.dark[i % 3])}
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
