import { Footer } from "@/components/editorial/Footer";
import { Interactions } from "@/components/editorial/Interactions";
import { Nav } from "@/components/editorial/Nav";
import {
  AboutSection,
  BenefitsSection,
  Hero,
  PlaygroundSection,
  PortfolioSection,
  ServicesCarousel,
  SplitMission,
} from "@/components/editorial/sections";
import { Button } from "@/components/editorial/ui";
import { ART } from "@/lib/media";

export const metadata = {
  title: { absolute: "Forma — A home for your best work" },
  description: "A customizable editorial portfolio. Register, unlock with a one-time payment, and publish your own creative space.",
  alternates: { canonical: "/" },
};

/** Placeholder artwork only — no real client work on the product page. */
const art = (n: number) => [...ART.dark, ...ART.light][n % 6];

const SHOWCASE = [
  { title: "Project One", labels: ["Brand", "Web"] },
  { title: "Project Two", labels: ["Product", "Design"] },
  { title: "Project Three", labels: ["Commerce", "Web"] },
  { title: "Project Four", labels: ["Platform", "Design"] },
  { title: "Project Five", labels: ["Identity", "Print"] },
  { title: "Project Six", labels: ["Campaign", "Motion"] },
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
            images={[art(0), ART.pill]}
            marquee={{ heading: "How it works", index: "/01" }}
          />

          <ServicesCarousel
            id="how"
            label="(How it works)"
            index="/02"
            body="No subscriptions, no plug-ins, no fiddling — four steps from account to out there."
            items={[
              { index: "/001", title: "Register", text: "Create an account in a minute. Your workspace stays private until you decide to publish.", image: art(1), tags: ["Free account", "Private by default"] },
              { index: "/002", title: "Unlock", text: "A single payment unlocks the editor for good. You review the exact price in secure checkout.", image: art(2), tags: ["One-time", "Stripe checkout"] },
              { index: "/003", title: "Make it yours", text: "Edit your name, story, services and projects. Upload your own images and preview every change.", image: art(3), tags: ["Live preview", "Image uploads"] },
              { index: "/004", title: "Publish", text: "Go live at your own Forma address, unpublish whenever you like, and keep improving the draft.", image: art(4), tags: ["/p/your-name", "Drafts & publishing"] },
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
            projects={SHOWCASE.map((p, i) => ({ title: p.title, href: "/demo/portfolio", image: art(i), alt: p.title, labels: p.labels }))}
            cta={{ body: "See the template running a full studio site, with projects, writing and a contact inbox.", label: "Open the demo", href: "/demo" }}
          />

          <BenefitsSection
            label="(Included)"
            index="/05"
            headingOne={"One template.\nYour space."}
            headingTwo={"Everything\nincluded"}
            items={[
              { index: "/001", title: "One-time\npurchase", text: "Pay once and the editor is yours. No recurring template subscription and no surprise tiers.", image: art(5) },
              { index: "/002", title: "Private\ndrafts", text: "Save as often as you like. Nothing goes public until you press publish, and you can take it down again anytime.", image: art(0) },
              { index: "/003", title: "Your own\naddress", text: "Your portfolio lives at its own Forma address, ready to share with clients, studios and collaborators.", image: art(1) },
            ]}
          />

          <PlaygroundSection
            label="(Playground)"
            index="/06"
            heading="Make it yours"
            cta={{ label: "Create your account", href: "/register" }}
            images={[
              { src: art(0) }, { src: art(1) }, { src: art(2) }, { src: art(3) },
              { src: art(4) }, { src: art(5) }, { src: art(0) },
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
