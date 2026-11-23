import replacedMedia from "./replaced-media.json" with { type: "json" };

/** Committed artwork used whenever content leaves an image empty. */
export const ART = {
  hero: "/images/brand/brand-hero-poster.webp",
  heroMobile: "/images/brand/brand-hero-poster.webp",
  portrait: "/images/brand/web.webp",
  pill: "/images/brand/systems.webp",
  mission: "/images/brand/systems.webp",
  benefits: "/images/brand/web.webp",
  footer: "/images/brand/brand-hero-poster.webp",
  page: "/images/brand/web.webp",
  dark: ["/images/brand/systems.webp", "/images/brand/commerce.webp", "/images/brand/systems.webp"],
  light: ["/images/brand/web.webp", "/images/brand/commerce.webp", "/images/brand/commerce.webp"],
};

/** Original service illustrations replace the seeded project screenshots. */
export const SERVICE_ART: Record<string, string> = {
  "E-commerce & Shopify": "/images/portfolio-art/fields/storefront.svg",
  "Payments & POS": "/images/portfolio-art/fields/payments.svg",
  "Web Delivery": "/images/portfolio-art/fields/web.svg",
  "Marketing & Tracking": "/images/portfolio-art/fields/analytics.svg",
  "QA & Testing": "/images/portfolio-art/fields/qa.svg",
  "IT Systems & Infrastructure": "/images/portfolio-art/fields/infra.svg",
  "Automation": "/images/portfolio-art/fields/automation.svg",
  "Figma to Shopify": "/images/portfolio-art/fields/figma.svg",
  "Corporate Websites": "/images/portfolio-art/fields/web.svg",
  "Domain, DNS & SSL": "/images/portfolio-art/fields/infra.svg",
  "Deployment Support": "/images/portfolio-art/fields/launch.svg"
};

export function serviceArt(title: string, image: string, fallback: string) {
  const illustration = SERVICE_ART[title] || fallback;
  return image.startsWith("/images/projects/") ? illustration : media(image, illustration);
}

/** Content-matched project showcase images for benefits */
export const BENEFIT_ART: Record<string, string> = {
  "One point of contact": "/images/projects/workflow-hub/mockup-2.webp",
  "Built to hand over": "/images/projects/drec-pms/screens/reports-desktop.webp",
  "A QA mindset": "/images/projects/certguard/screens/reports-desktop.webp",
  "Client\nSupport": "/images/projects/certguard/screens/servers-desktop.webp",
  "Office\nLocation": "/images/projects/carter-studio/mockup-1.webp",
};

/** Playground showcase images */
export const PLAYGROUND_ART = [
  { alt: "Finora Multi-currency Accounting System", url: "/images/projects/finora/mockup-1.webp" },
  { alt: "Nexora Enterprise SaaS Dashboard", url: "/images/projects/nexora/mockup-2.webp" },
  { alt: "House of Karji Luxury E-commerce Architecture", url: "/images/projects/house-of-karji/mockup-1.webp" },
  { alt: "WorkFlow Hub Custom Business Automation", url: "/images/projects/workflow-hub/mockup-3.webp" },
  { alt: "CertGuard Security & SSL Monitor", url: "/images/projects/certguard/mockup-1.webp" },
  { alt: "DREC Commercial PMS Platform", url: "/images/projects/drec-pms/mockup-2.webp" },
  { alt: "Mino B2B Supply Portal & Logistics", url: "/images/projects/mino-suppliers/mockup-1.webp" },
];

/**
 * Resolves an image URL:
 * - Empty, null, undefined, or old SVG placeholders (/media/*.svg) fall back.
 * - Retired /images/work/* paths fall back.
 * - Valid uploads from CMS (/files/*), external URLs, or local public paths (/images/*) are returned.
 */
export function media(src: string | null | undefined, fallback = "/images/brand/systems.webp"): string {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (!trimmed || /^\/media\/[\w-]+\.svg$/.test(trimmed) || trimmed.startsWith("/images/work/")) {
    return fallback;
  }
  return LEGACY_ART[trimmed] || (replacedMedia as Record<string, string>)[trimmed] || trimmed;
}


/** Retired decorative artwork is replaced even when saved in the CMS. */
const LEGACY_ART: Record<string, string> = {
  "/files/architectbuildingdigitalsyste20261018175623-432891a6.mp4": "/videos/brand-hero.mp4",
  "/files/architectbuildingdigitalsyste20261018175623-dd3c8a1d.mp4": "/videos/brand-hero.mp4",
  "/files/cinematicneonhaloportraitpng2k20261018005649-9a079cc6.jpg": "/images/brand/web.webp",
  "/files/whatsapp-image-2026-11-01-at-75624-am-e1d2291c.jpg": "/images/brand/brand-hero-poster.webp",
  "/files/01-ecommerce-solutions-aeb1dba9.png": "/images/brand/commerce.webp",
  "/files/02-pos-payment-solutions-6f18ab3a.png": "/images/brand/commerce.webp",
  "/files/03-web-software-development-69ff2f70.png": "/images/brand/systems.webp",
  "/files/04-marketing-analytics-bd13a284.png": "/images/brand/commerce.webp",
  "/files/05-quality-assurance-testing-303ee344.png": "/images/brand/systems.webp",
  "/files/06-cloud-it-infrastructure-b28ec0f9.png": "/images/brand/systems.webp",
  "/images/current-work/shopify-theme-customization.webp": "/images/brand/commerce.webp",
  "/images/current-work/seo-product-feeds.webp": "/images/brand/commerce.webp",
  "/images/current-work/flower-district-store-locations.webp": "/images/brand/web.webp",
  "/images/current-work/daima-market-expansion.webp": "/images/brand/commerce.webp",
  "/images/current-work/lead-generation-workflow.webp": "/images/brand/systems.webp",
  "/images/current-work/commerce-payment-methods.webp": "/images/brand/commerce.webp",
  "/images/current-work/finora-accounting-concept.webp": "/images/projects/finora/mockup-1.webp",
  "/images/art/hero.webp": "/images/brand/brand-hero-poster.webp",
  "/images/art/hero-mobile.webp": "/images/brand/brand-hero-poster.webp",
  "/images/art/silk-portrait.webp": "/images/brand/web.webp",
  "/images/art/silk-pill.webp": "/images/brand/systems.webp",
  "/images/art/mission.webp": "/images/brand/systems.webp",
  "/images/art/benefits.webp": "/images/brand/web.webp",
  "/images/art/footer.webp": "/images/brand/brand-hero-poster.webp",
  "/images/art/page.webp": "/images/brand/web.webp",
  "/images/art/dark-1.webp": "/images/brand/systems.webp",
  "/images/art/dark-2.webp": "/images/brand/commerce.webp",
  "/images/art/dark-3.webp": "/images/brand/systems.webp",
  "/images/art/light-1.webp": "/images/brand/web.webp",
  "/images/art/light-2.webp": "/images/brand/commerce.webp",
  "/images/art/light-3.webp": "/images/brand/commerce.webp",
  "/images/art/01-ecommerce-solutions.png": "/images/brand/commerce.webp",
  "/images/art/02-pos-payment-solutions.png": "/images/brand/commerce.webp",
  "/images/art/03-web-software-development.png": "/images/brand/systems.webp",
  "/images/art/04-marketing-analytics.png": "/images/brand/commerce.webp",
  "/images/art/05-quality-assurance-testing.png": "/images/brand/systems.webp",
  "/images/art/06-cloud-it-infrastructure.png": "/images/brand/systems.webp"
};
