import type { Metadata } from "next";

import { Footer } from "@/components/rydge/Footer";
import { Interactions } from "@/components/rydge/Interactions";
import { Nav } from "@/components/rydge/Nav";
import { Button } from "@/components/rydge/ui";
import { getNav, getSettings, getSocials } from "@/lib/cms";
import { ART, media } from "@/lib/media";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const og = media(settings.ogImage, ART.hero);
  return {
    title: { default: settings.metaTitle, template: `%s — ${settings.brandName} ${settings.brandSuffix}` },
    description: settings.metaDescription,
    robots: { index: false },
    openGraph: { title: settings.metaTitle, description: settings.metaDescription, images: [og], type: "website" },
    icons: settings.favicon ? { icon: settings.favicon } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, nav, socials] = await Promise.all([getSettings(), getNav(), getSocials()]);
  const year = new Date().getUTCFullYear();

  return (
    <div className="rx" id="top">
      <a href="#main" className="rx-skip">Skip to content</a>
      <Interactions>
        <Nav
          brand={settings.brandName}
          location={settings.coordinates}
          items={nav.map((item) => ({ label: item.label, href: item.href }))}
          overlay={["/", "/portfolio"]}
          icon={{ href: settings.footerCtaUrl || "/contact", label: settings.footerCtaLabel || "Let's talk" }}
        />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer
          lineOne={settings.brandName}
          lineTwo={settings.brandSuffix}
          headline={settings.footerHeadline}
          cta={{ label: settings.footerCtaLabel, href: settings.footerCtaUrl }}
          socials={socials.map((s) => ({ label: s.label, href: s.url }))}
          image={media(settings.footerImage, ART.footer)}
          badge={{ text: settings.badgeText, href: settings.footerCtaUrl, label: settings.footerCtaLabel }}
          credits={<><span>{settings.credits}</span><span>{settings.brandName} {settings.brandSuffix} ©{year}</span></>}
          links={[{ label: "Forma Portfolio", href: "~/" }, { label: "Template", href: "/template" }, { label: "Create yours", href: "/register" }]}
        />
      </Interactions>
      <div className="float-banner">Forma template demo <Button href="/register" variant="white">Create yours</Button></div>
    </div>
  );
}
