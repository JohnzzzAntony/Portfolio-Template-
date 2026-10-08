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

/**
 * Older content points at generated /media/*.svg placeholders or the retired
 * /images/work screenshots, neither of which is deployed. Treat them as unset.
 */
export function media(src: string | null | undefined, fallback = ""): string {
  if (!src || /^\/media\/[\w-]+\.svg$/.test(src) || src.startsWith("/images/work/")) return fallback;
  return src;
}
