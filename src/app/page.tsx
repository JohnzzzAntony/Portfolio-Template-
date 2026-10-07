import { Footer } from "@/components/rydge/Footer";
import { Interactions } from "@/components/rydge/Interactions";
import { Nav } from "@/components/rydge/Nav";
import {
  AboutSection,
  BenefitsSection,
  Hero,
  PlaygroundSection,
  PortfolioSection,
  ServicesCarousel,
  SplitMission,
} from "@/components/rydge/sections";
import { Button } from "@/components/rydge/ui";
import { ART } from "@/lib/media";

export const metadata = {
  title: { absolute: "Forma — A home for your best work" },
  description: "A customizable editorial portfolio. Register, unlock with a one-time payment, and publish your own creative space.",
  alternates: { canonical: "/" },
};

const work = (slug: string, n = 1) => `/images/work/${slug}-mockup-${n}.webp`;

const SHOWCASE = [
  { title: "Finora", slug: "finora", labels: ["Fintech", "SaaS"] },
  { title: "The House of Karji", slug: "house-of-karji", labels: ["Commerce", "Brand"] },
  { title: "Nexora", slug: "nexora", labels: ["SaaS", "Product"] },
  { title: "Invitara", slug: "invitara", labels: ["Platform", "Design"] },
  { title: "Mechaura", slug: "mechaura", labels: ["Industrial", "Web"] },
  { title: "CertGuard", slug: "certguard", labels: ["Security", "SaaS"] },
];

export default function Home() {
  const year = new Date().getUTCFullYear();
  return (
    <div className="rx" id="top">
      <a href="#main" className="rx-skip">Skip to content</a>
      <Interactions>
        <Nav
          overlay
          brand="Forma"
          location="One template · Your space"
          items={[
            { label: "Template", href: "/template" },
            { label: "How it works", href: "#how" },
            { label: "Showcase", href: "#work" },
            { label: "Demo", href: "/demo" },
            { label: "Sign in", href: "/login" },
          ]}
          icon={{ href: "/register", label: "Make it yours" }}
        />
        <main id="main">
          <Hero
            title="Forma Folio"
            services={["Portfolio template", "Personal editor", "One-time purchase", "Your own address"]}
            text="Forma is an editorial portfolio template with its own editor. Register, unlock it once and publish a space that feels like a studio site."
            cta={{ label: "Make it yours", href: "/register" }}
            captionLeft={`Portfolio / ©${year}`}
            image={ART.hero}
            imageMobile={ART.heroMobile}
          />

          <AboutSection
            body="A portfolio that feels like a studio, not a page builder. Oversized type, considered motion and room for your work — with an editor that keeps every word yours."
            cta={{ label: "Explore the template", href: "/template" }}
            images={[work("house-of-karji", 3), ART.pill]}
            marquee={{ heading: "How it works", index: "/01" }}
          />

          <ServicesCarousel
            id="how"
            label="(How it works)"
            index="/02"
            body="No subscriptions, no plug-ins, no fiddling — four steps from account to out there."
            items={[
              { index: "/001", title: "Register", text: "Create an account in a minute. Your workspace stays private until you decide to publish.", image: work("finora", 2), tags: ["Free account", "Private by default"] },
              { index: "/002", title: "Unlock", text: "A single payment unlocks the editor for good. You review the exact price in secure checkout.", image: work("nexora", 2), tags: ["One-time", "Stripe checkout"] },
              { index: "/003", title: "Make it yours", text: "Edit your name, story, services and projects. Upload your own images and preview every change.", image: work("invitara", 3), tags: ["Live preview", "Image uploads"] },
              { index: "/004", title: "Publish", text: "Go live at your own Forma address, unpublish whenever you like, and keep improving the draft.", image: work("carter-studio", 2), tags: ["/p/your-name", "Drafts & publishing"] },
            ]}
          />

          <SplitMission
            label="(The idea)"
            eyebrow={`Forma Portfolio\n/ ©${year}`}
            words={["Less", "Noise", "More you"]}
            sup="®"
            text="One considered template instead of a thousand choices. Forma handles the layout, the type and the motion so your work is the only thing people remember."
            index="/03"
            image={ART.mission}
            circle={{ href: "/template", text: "Explore the template · Live preview · ", label: "Explore the template" }}
          />

          <PortfolioSection
            label="(Showcase)"
            index="/04"
            heading={`Work it was\nbuilt for`}
            projects={SHOWCASE.map((p) => ({ title: p.title, href: `/demo/projects/${p.slug}`, image: work(p.slug), alt: p.title, labels: p.labels }))}
            cta={{ body: "See the template running a full studio site, with projects, writing and a contact inbox.", label: "Open the demo", href: "/demo" }}
          />

          <BenefitsSection
            label="(Included)"
            index="/05"
            headingOne={"One template.\nYour space."}
            headingTwo={"Everything\nincluded"}
            items={[
              { index: "/001", title: "One-time\npurchase", text: "Pay once and the editor is yours. No recurring template subscription and no surprise tiers.", image: work("workflow-hub") },
              { index: "/002", title: "Private\ndrafts", text: "Save as often as you like. Nothing goes public until you press publish, and you can take it down again anytime.", image: work("certguard", 2) },
              { index: "/003", title: "Your own\naddress", text: "Your portfolio lives at its own Forma address, ready to share with clients, studios and collaborators.", image: work("mechaura", 2) },
            ]}
          />

          <PlaygroundSection
            label="(Playground)"
            index="/06"
            heading="Make it yours"
            cta={{ label: "Create your account", href: "/register" }}
            images={[
              { src: work("finora", 3) }, { src: work("invitara") }, { src: work("house-of-karji", 2) }, { src: work("carter-studio") },
              { src: work("nexora", 4) }, { src: work("mechaura", 3) }, { src: work("workflow-hub", 2) },
            ]}
          />
        </main>
        <Footer
          lineOne="Forma"
          lineTwo="Portfolio"
          headline="Ready to make it yours?"
          cta={{ label: "Get started", href: "/register" }}
          socials={[
            { label: "Template", href: "/template" },
            { label: "Demo studio", href: "/demo" },
            { label: "Sign in", href: "/login" },
            { label: "Register", href: "/register" },
          ]}
          badge={{ text: "Make it yours · Get started · ", href: "/register", label: "Get started" }}
          credits={<><span>© {year} Forma Portfolio</span><span>A considered home for creative work.</span></>}
          links={[{ label: "Template", href: "/template" }, { label: "Demo", href: "/demo" }, { label: "Dashboard", href: "/dashboard" }]}
        />
      </Interactions>
      <div className="float-banner">One-time purchase <Button href="/register" variant="white">Make it yours</Button></div>
    </div>
  );
}
