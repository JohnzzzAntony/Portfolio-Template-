import "server-only";

import type { Metadata } from "next";

import { getPage, getSettings, type PageKey } from "@/lib/cms";

/** Builds page metadata from CMS fields, falling back to site-wide defaults. */
export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(key), getSettings()]);
  if (!page) return {};

  const title = page.seoTitle || page.title.replace(/\n/g, " ");
  const description = page.seoDescription || settings.metaDescription;
  const image = page.ogImage || settings.ogImage;

  return {
    title,
    description,
    alternates: { canonical: key === "home" ? "/demo" : `/demo/${key}` },
    openGraph: {
      title,
      description,
      images: image ? [image] : undefined,
      type: "website",
    },
  };
}
