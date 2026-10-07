import type { Field } from "@/lib/admin/resources";

/**
 * Grouped so the form reads like the site: identity, contact, footer, SEO.
 * Every name here maps 1:1 to a column on the single SiteSettings row, and the
 * save action writes only these keys.
 */
export const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "Identity",
    fields: [
      { name: "brandName", label: "Brand name", type: "text" },
      {
        name: "brandSuffix",
        label: "Brand suffix",
        type: "text",
        help: 'The second word in the footer wordmark, e.g. "Studio".',
      },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "logoLight", label: "Logo (on dark)", type: "image" },
      { name: "logoDark", label: "Logo (on light)", type: "image" },
      { name: "favicon", label: "Favicon", type: "image" },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "coordinates", label: "Header coordinates", type: "text" },
      { name: "email", label: "General email", type: "text" },
      { name: "supportEmail", label: "Support email", type: "text" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "address", label: "Address", type: "text" },
      { name: "addressUrl", label: "Map link", type: "url" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { name: "footerHeadline", label: "Headline", type: "text" },
      { name: "footerCtaLabel", label: "CTA label", type: "text" },
      { name: "footerCtaUrl", label: "CTA link", type: "text" },
      { name: "footerImage", label: "Background image", type: "image" },
      {
        name: "badgeText",
        label: "Rotating badge text",
        type: "text",
        help: "Repeats around the circle — end it with a separator.",
      },
      { name: "credits", label: "Credits", type: "text" },
      { name: "copyright", label: "Copyright", type: "text" },
    ],
  },
  {
    title: "SEO defaults",
    fields: [
      { name: "metaTitle", label: "Meta title", type: "text" },
      { name: "metaDescription", label: "Meta description", type: "textarea" },
      { name: "ogImage", label: "Social share image", type: "image" },
    ],
  },
];
