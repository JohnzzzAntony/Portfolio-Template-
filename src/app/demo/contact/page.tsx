import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, Pin } from "@/components/editorial/icons";
import { BenefitsSection, ContactLines, PageTop, ProjectCard, StoryMarquee } from "@/components/editorial/sections";
import { Button, SectionHead } from "@/components/editorial/ui";
import { getFeaturedProject, getPage, getSettings, sectionMap } from "@/lib/cms";
import { projectItem } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("contact");
}

export default async function ContactPage() {
  const page = await getPage("contact");
  if (!page) notFound();

  const [settings, featured] = await Promise.all([getSettings(), getFeaturedProject()]);
  const s = sectionMap(page.sections);
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <PageTop title={page.title} pill={settings.tagline} captions={[page.metaLeft, page.metaRight]} image={media(page.heroImage, ART.page)} />

      <section className="section">
        <div className="container-fluid">
          <div className="grid-12 sm">
            <div className="section-title-wrapper span-l7"><h2 className="section-title" data-ix="fade">{s.enquiries?.label || "(General Enquiries)"}</h2></div>
            <div className="section-title-wrapper align-right span-r7"><div className="section-title" data-ix="fade">{s.enquiries?.index || "/01"}</div></div>
            <div className="span-full">
              <div className="mb-medium"><p className="paragraph-large" data-ix="lines"><span className="indent-medium" />{(s.enquiries?.body || "").replace(/\n/g, " ")}</p></div>
              <ContactLines
                items={[
                  { label: settings.email, href: `mailto:${settings.email}`, icon: <Mail />, index: "/001" },
                  ...(settings.phone ? [{ label: settings.phone, href: `tel:${tel}`, icon: <Phone />, index: "/002" }] : []),
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <BenefitsSection
        grid
        defaultPadding
        label={s.support?.label || "(Support / Location)"}
        index={s.support?.index || "/02"}
        items={[
          { index: "/001", title: "Client\nSupport", text: "For anything about an ongoing project or something we've already shipped, the support line reaches the people who built it.", image: ART.dark[0], links: [{ label: settings.supportEmail, href: `mailto:${settings.supportEmail}`, icon: <Mail /> }] },
          { index: "/002", title: "Office\nLocation", text: "Visit the studio and see how we work. We're happiest meeting in person, with the work on the table.", image: ART.dark[1], links: [{ label: settings.address, href: settings.addressUrl || "#", icon: <Pin /> }] },
        ]}
      />

      <section className="section">
        <div className="mb-large"><StoryMarquee heading={s.form?.heading || "Email Us"} index={s.form?.index || "/03"} /></div>
        <div className="container">
          <div className="grid-12 sm">
            <div className="span-l5"><p className="paragraph-medium no-indent" data-ix="lines">{s.form?.body}</p></div>
            <div className="span-r6" data-ix="fade-up">
              <ContactForm note="All fields are required. We only use your details to reply to this message." />
            </div>
          </div>
        </div>
      </section>

      {featured && (
        <section className="section shadow">
          <div className="container-fluid">
            <div className="mb-small"><SectionHead label={s.featured?.label || "(Featured Project)"} index={s.featured?.index || "/04"} /></div>
            <div className="mb-medium"><ProjectCard project={projectItem(featured)} full /></div>
            <div className="align-center" data-ix="fade-up"><Button href="/portfolio">View all Projects</Button></div>
          </div>
        </section>
      )}
    </>
  );
}
