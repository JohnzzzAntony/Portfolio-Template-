import { Footer } from "@/components/editorial/Footer";
import { Interactions } from "@/components/editorial/Interactions";
import { Nav } from "@/components/editorial/Nav";
import { AboutSection, CallToAction, Hero, PortfolioSection, ServicesCarousel, SplitMission } from "@/components/editorial/sections";
import { media } from "@/lib/media";
import type { PortfolioContent } from "@/lib/portfolio-content";

const ART = {
  hero: "/images/art/hero.webp",
  heroMobile: "/images/art/hero-mobile.webp",
  portrait: "/images/art/silk-portrait.webp",
  pill: "/images/art/silk-pill.webp",
  mission: "/images/art/mission.webp",
  cards: ["/images/art/dark-1.webp", "/images/art/dark-2.webp", "/images/art/dark-3.webp"],
};

const pad = (n: number, width: number) => `/${String(n).padStart(width, "0")}`;

/**
 * The template a customer publishes: one long page in the studio's editorial
 * language, driven entirely by their saved content.
 */
export function CustomerPortfolio({ content, preview = false, banner }: { content: PortfolioContent; preview?: boolean; banner?: React.ReactNode }) {
  const c = { ...content, heroImage: media(content.heroImage), projects: content.projects.map((p) => ({ ...p, image: media(p.image) })) };
  const year = new Date().getUTCFullYear();
  const words = c.name.trim().split(/\s+/);
  const lineOne = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(" ") : c.name;
  const lineTwo = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(" ") : c.role.split(/\s+/)[0] || "Studio";
  const projectImages = c.projects.map((p) => p.image).filter(Boolean);
  const contactHref = c.email ? `mailto:${c.email}` : "#contact";

  const headline = c.headline.split(/\s+/).filter(Boolean);
  const mission: [string, string, string] = headline.length >= 3
    ? [headline[0], headline[1], headline.slice(2).join(" ")]
    : [headline[0] || "Made", headline[1] || "With", "Intention"];

  const nav = [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    ...(c.services.length ? [{ label: "Services", href: "#services" }] : []),
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="rx" id="top">
      {preview && <div className="preview-banner">Private preview · Saved draft · <a href="/dashboard/editor">Back to editor ↗</a></div>}
      {banner}
      <Interactions>
        <Nav overlay={!preview} brand={c.name} location={c.location} items={nav} icon={{ href: contactHref, label: "Let's talk" }} base="#top" />
        <main id="main">
          <Hero
            title={c.name}
            services={c.services.slice(0, 4).map((s) => s.title)}
            text={c.introduction}
            cta={{ label: "View my work", href: "#work" }}
            captionLeft={`${c.role} / ©${year}`}
            image={c.heroImage || ART.hero}
            imageMobile={c.heroImage || ART.heroMobile}
          />

          {c.about && (
            <AboutSection
              body={c.about}
              cta={{ label: "Get in touch", href: contactHref }}
              images={[projectImages[0] || ART.portrait, projectImages[1] || ART.pill]}
              marquee={{ heading: "My story", index: "/01" }}
            />
          )}

          {c.services.length > 0 && (
            <ServicesCarousel
              index="/02"
              body={c.headline.replace(/\n/g, " ")}
              items={c.services.map((service, i) => ({
                index: pad(i + 1, 3),
                title: service.title,
                text: service.description,
                image: projectImages[i % Math.max(projectImages.length, 1)] || ART.cards[i % ART.cards.length],
              }))}
            />
          )}

          <SplitMission
            eyebrow={`${c.name}\n/ ©${year}`}
            label="(Approach)"
            words={mission}
            text={c.introduction || c.about.slice(0, 280)}
            index="/03"
            image={c.heroImage || ART.mission}
            circle={{ href: "#work", text: "View my work · Selected projects · ", label: "View selected work" }}
          />

          {c.projects.length > 0 && (
            <PortfolioSection
              index="/04"
              heading={`Selected Work\n©${year}`}
              projects={c.projects.map((project) => ({
                title: project.title,
                href: project.url || undefined,
                image: project.image || undefined,
                alt: project.title,
                labels: project.category.split(/\s*[,/·]\s*/).filter(Boolean),
                description: project.description,
              }))}
            />
          )}

          <div id="contact">
            <CallToAction heading="Let's Talk" index="/05" text={c.footer || "Have something in mind? Let's make it happen."} cta={{ label: c.email ? "Email me" : "Back to top", href: c.email ? contactHref : "#top" }} />
          </div>
        </main>
        <Footer
          lineOne={lineOne}
          lineTwo={lineTwo}
          headline={c.footer || "Have a project in mind?"}
          cta={{ label: "Let's Talk", href: contactHref }}
          socials={c.socials.map((s) => ({ label: s.label, href: s.url }))}
          badge={{ text: "Let's talk · Say hello · ", href: contactHref, label: "Contact" }}
          credits={<><span>© {year} {c.name}</span><span>{c.email && <a className="link-inverse" href={`mailto:${c.email}`}>{c.email}</a>}</span></>}
          links={[{ label: "Made with Forma", href: "/" }]}
        />
      </Interactions>
    </div>
  );
}
