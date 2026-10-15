import type { MetadataRoute } from "next";

import { getNav, getPosts, getProjects } from "@/lib/cms";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/** The site's own pages, plus every published project and post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl().origin;
  const [nav, projects, posts] = await Promise.all([getNav(), getProjects(), getPosts()]);

  const pages = [
    ...new Set(nav.map((item) => item.href.split("#")[0]).filter((href) => href.startsWith("/"))),
  ];

  return [
    ...pages.map((href) => ({ url: href === "/" ? base : `${base}${href}` })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, lastModified: project.updatedAt })),
    ...posts.map((post) => ({ url: `${base}/blog/${post.slug}`, lastModified: post.updatedAt })),
  ];
}
