import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProject, getPage, getSettings, sectionMap } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

export default async function ContactPage() {
  const page = await getPage("contact");
  if (!page) notFound();

  const [settings, featured] = await Promise.all([
    getSettings(),
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

      {/* ------------------------------------------------ general enquiries */}
      <section className="section shell">
        <SectionHeader label={s.enquiries?.label} index={s.enquiries?.index} />
        <div className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] lg:grid-cols-[1.3fr_1fr]">
          {s.enquiries?.body && (
            <SplitText as="p" by="line" text={s.enquiries.body} className="t-para-md" />
          )}

          <Reveal className="flex flex-col gap-[var(--m-base)]">
            <ContactLine
              index="/001"
              href={`mailto:${settings.email}`}
              value={settings.email}
            />
            <ContactLine
              index="/002"
              href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
              value={settings.phone}
            />
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------- support/location */}
      <section className="section shell">
        <SectionHeader label={s.support?.label} index={s.support?.index} />
        <div className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] md:grid-cols-2">
          <Reveal className="flex flex-col">
            <span className="t-caption text-muted">/001</span>
            <SplitText
              as="h2"
              by="char"
              text="Client Support"
              className="t-display-sm mt-[var(--m-xs)] uppercase"
            />
            <p className="t-para-md mt-[var(--m-small)]">
              For assistance with ongoing projects or services, our dedicated team is
              ready to support you.
            </p>
            <div className="mt-[var(--m-small)] flex flex-col gap-2">
              <a href={`mailto:${settings.supportEmail}`} className="t-caption hover:opacity-60">
                {settings.supportEmail}
              </a>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="t-caption hover:opacity-60">
                {settings.phone}
              </a>
            </div>
          </Reveal>

          <Reveal className="flex flex-col">
            <span className="t-caption text-muted">/002</span>
            <SplitText
              as="h2"
              by="char"
              text="Office Location"
              className="t-display-sm mt-[var(--m-xs)] uppercase"
            />
            <p className="t-para-md mt-[var(--m-small)]">
              Visit us at our studio and experience where creativity and collaboration
              come to life.
            </p>
            <a
              href={settings.addressUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="t-caption mt-[var(--m-small)] hover:opacity-60"
            >
              {settings.address}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ form */}
      <section className="section-md">
        <Marquee speed={26} repeat={3} itemClassName="flex items-baseline gap-[3vw] pr-[3vw]">
          <span className="text-[length:var(--fs-marquee)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
            {s.form?.heading || "Email Us"}
          </span>
          <span className="t-caption">{s.form?.index}</span>
        </Marquee>

        <div className="shell mt-[var(--m-large)] grid gap-[var(--gutter-x)] lg:grid-cols-[1fr_1.2fr]">
          {s.form?.body && <p className="t-para-md">{s.form.body}</p>}
          <ContactForm note="All the fields are required. By sending the form you agree to the Terms & Conditions and Privacy Policy." />
        </div>
      </section>

      {/* ------------------------------------------------ featured project */}
      {featured && (
        <section className="section shell">
          <SectionHeader label={s.featured?.label} index={s.featured?.index} />
          <Reveal className="mt-[var(--m-large)]">
            <ProjectCard project={featured} className="aspect-[16/9]" />
          </Reveal>
          <Reveal className="mt-[var(--m-medium)] flex justify-center">
            <Button href="/portfolio">View all Projects</Button>
          </Reveal>
        </section>
      )}
    </>
  );
}

function ContactLine({
  index,
  href,
  value,
}: {
  index: string;
  href: string;
  value: string;
}) {
  return (
    <a href={href} className="hairline group flex items-baseline gap-4 pt-[var(--m-xs)]">
      <span className="text-[length:var(--fs-h4)] transition-opacity group-hover:opacity-60">
        {value}
      </span>
      <span className="t-caption ml-auto text-muted">{index}</span>
    </a>
  );
}
