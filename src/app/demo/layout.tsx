import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getNav, getSettings, getSocials } from "@/lib/cms";
export async function generateMetadata(): Promise<Metadata> {
 const settings = await getSettings();
 return { title: { default: settings.metaTitle, template: `%s — ${settings.brandName} ${settings.brandSuffix}` }, description: settings.metaDescription, robots: { index: false }, openGraph: { title: settings.metaTitle, description: settings.metaDescription, images: settings.ogImage ? [settings.ogImage] : undefined, type: 'website' }, icons: settings.favicon ? { icon: settings.favicon } : undefined };
}
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
 const [settings,nav,socials] = await Promise.all([getSettings(),getNav(),getSocials()]);
 return <SmoothScroll><div className="demo-platform-banner"><Link href="/">Forma template preview</Link><Link href="/register">Create your portfolio ↗</Link></div><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">Skip to content</a><span id="top" /><Header brandName={settings.brandName} brandSuffix={settings.brandSuffix} coordinates={settings.coordinates} items={nav} /><main id="main" tabIndex={-1}>{children}</main><Footer brandName={settings.brandName} brandSuffix={settings.brandSuffix} headline={settings.footerHeadline} ctaLabel={settings.footerCtaLabel} ctaUrl={settings.footerCtaUrl} backgroundImage={settings.footerImage} badgeText={settings.badgeText} credits={settings.credits} copyright={settings.copyright} socials={socials} /></SmoothScroll>;
}
