/** Committed artwork used whenever content leaves an image empty. */
export const ART = {
  hero: "/images/art/hero.webp",
  heroMobile: "/images/art/hero-mobile.webp",
  portrait: "/images/art/silk-portrait.webp",
  pill: "/images/art/silk-pill.webp",
  mission: "/images/art/mission.webp",
  benefits: "/images/art/benefits.webp",
  footer: "/images/art/footer.webp",
  page: "/images/art/page.webp",
  dark: ["/images/art/dark-1.webp", "/images/art/dark-2.webp", "/images/art/dark-3.webp"],
  light: ["/images/art/light-1.webp", "/images/art/light-2.webp", "/images/art/light-3.webp"],
};

/** High-fidelity, section-matched screenshots for services across all pages */
export const SERVICE_ART: Record<string, string> = {
  "E-commerce & Shopify": "/images/projects/house-of-karji/screens/admin-catalog-desktop.webp",
  "Payments & POS": "/images/projects/finora/screens/banking-desktop.webp",
  "Web Delivery": "/images/projects/nexora/screens/tasks-desktop.webp",
  "Marketing & Tracking": "/images/projects/nexora/screens/reports-desktop.webp",
  "QA & Testing": "/images/projects/certguard/screens/logs-desktop.webp",
  "IT Systems & Infrastructure": "/images/projects/certguard/screens/servers-desktop.webp",
  "Automation": "/images/projects/workflow-hub/screens/notifications-desktop.webp",
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
export function media(src: string | null | undefined, fallback = ""): string {
  if (!src) return fallback;
  const trimmed = src.trim();
  if (!trimmed || /^\/media\/[\w-]+\.svg$/.test(trimmed) || trimmed.startsWith("/images/work/")) {
    return fallback;
  }
  return trimmed;
}

