import replacedMedia from "./replaced-media.json";

/** Committed artwork used whenever content leaves an image empty. */
export const ART = {
  hero: "/images/realistic/digital-commerce-specialist.webp",
  heroMobile: "/images/realistic/digital-commerce-specialist-mobile.webp",
  portrait: "/images/realistic/digital-commerce-specialist.webp",
  pill: "/images/realistic/ecommerce-storefront.webp",
  mission: "/images/realistic/it-infrastructure.webp",
  benefits: "/images/realistic/qa-testing.webp",
  footer: "/images/realistic/digital-commerce-specialist.webp",
  page: "/images/realistic/digital-commerce-specialist.webp",
  dark: ["/images/realistic/it-infrastructure.webp", "/images/realistic/ecommerce-storefront.webp", "/images/realistic/qa-testing.webp"],
  light: ["/images/realistic/digital-commerce-specialist.webp", "/images/realistic/marketing-analytics.webp", "/images/realistic/payments-pos.webp"],
};

/** Realistic, profession-matched imagery for service fields */
export const SERVICE_ART: Record<string, string> = {
  "E-commerce & Shopify": "/images/realistic/ecommerce-storefront.webp",
  "Payments & POS": "/images/realistic/payments-pos.webp",
  "Web Delivery": "/images/realistic/digital-commerce-specialist.webp",
  "Marketing & Tracking": "/images/realistic/marketing-analytics.webp",
  "QA & Testing": "/images/realistic/qa-testing.webp",
  "IT Systems & Infrastructure": "/images/realistic/it-infrastructure.webp",
  "Automation": "/images/realistic/marketing-analytics.webp",
  "Figma to Shopify": "/images/realistic/ecommerce-storefront.webp",
  "Corporate Websites": "/images/realistic/digital-commerce-specialist.webp",
  "Domain, DNS & SSL": "/images/realistic/it-infrastructure.webp",
  "Deployment Support": "/images/realistic/qa-testing.webp"
};

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
export function media(src: string | null | undefined, fallback = "/images/premium/systems.webp"): string {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (!trimmed || /^\/media\/[\w-]+\.svg$/.test(trimmed) || trimmed.startsWith("/images/work/")) {
    return fallback;
  }
  return LEGACY_ART[trimmed] || (replacedMedia as Record<string, string>)[trimmed] || trimmed;
}


/** Retired decorative artwork is replaced even when saved in the CMS. */
const LEGACY_ART: Record<string, string> = {
  "/files/architectbuildingdigitalsyste20261018175623-432891a6.mp4": "/images/premium/hero.webp",
  "/files/architectbuildingdigitalsyste20261018175623-dd3c8a1d.mp4": "/images/premium/hero.webp",
  "/files/cinematicneonhaloportraitpng2k20261018005649-9a079cc6.jpg": "/images/premium/studio.webp",
  "/files/whatsapp-image-2026-11-01-at-75624-am-e1d2291c.jpg": "/images/premium/hero.webp",
  "/files/01-ecommerce-solutions-aeb1dba9.png": "/images/premium/commerce.webp",
  "/files/02-pos-payment-solutions-6f18ab3a.png": "/images/premium/commerce.webp",
  "/files/03-web-software-development-69ff2f70.png": "/images/premium/systems.webp",
  "/files/04-marketing-analytics-bd13a284.png": "/images/premium/analytics.webp",
  "/files/05-quality-assurance-testing-303ee344.png": "/images/premium/security.webp",
  "/files/06-cloud-it-infrastructure-b28ec0f9.png": "/images/premium/systems.webp",
  "/images/current-work/shopify-theme-customization.webp": "/images/premium/commerce.webp",
  "/images/current-work/seo-product-feeds.webp": "/images/premium/analytics.webp",
  "/images/current-work/flower-district-store-locations.webp": "/images/premium/studio.webp",
  "/images/current-work/daima-market-expansion.webp": "/images/premium/commerce.webp",
  "/images/current-work/lead-generation-workflow.webp": "/images/premium/systems.webp",
  "/images/current-work/commerce-payment-methods.webp": "/images/premium/commerce.webp",
  "/images/current-work/finora-accounting-concept.webp": "/images/projects/finora/mockup-1.webp",
  "/images/art/hero.webp": "/images/realistic/digital-commerce-specialist.webp",
  "/images/art/hero-mobile.webp": "/images/realistic/digital-commerce-specialist-mobile.webp",
  "/images/art/silk-portrait.webp": "/images/realistic/digital-commerce-specialist.webp",
  "/images/art/silk-pill.webp": "/images/realistic/ecommerce-storefront.webp",
  "/images/art/mission.webp": "/images/realistic/it-infrastructure.webp",
  "/images/art/benefits.webp": "/images/realistic/qa-testing.webp",
  "/images/art/footer.webp": "/images/realistic/digital-commerce-specialist.webp",
  "/images/art/page.webp": "/images/realistic/digital-commerce-specialist.webp",
  "/images/art/dark-1.webp": "/images/premium/systems.webp",
  "/images/art/dark-2.webp": "/images/premium/commerce.webp",
  "/images/art/dark-3.webp": "/images/premium/security.webp",
  "/images/art/light-1.webp": "/images/premium/studio.webp",
  "/images/art/light-2.webp": "/images/premium/analytics.webp",
  "/images/art/light-3.webp": "/images/premium/commerce.webp",
  "/images/art/01-ecommerce-solutions.png": "/images/premium/commerce.webp",
  "/images/art/02-pos-payment-solutions.png": "/images/premium/commerce.webp",
  "/images/art/03-web-software-development.png": "/images/premium/systems.webp",
  "/images/art/04-marketing-analytics.png": "/images/premium/analytics.webp",
  "/images/art/05-quality-assurance-testing.png": "/images/premium/security.webp",
  "/images/art/06-cloud-it-infrastructure.png": "/images/premium/systems.webp"
};
