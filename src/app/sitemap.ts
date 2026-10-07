import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site-url";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const base = siteUrl().origin;
 const portfolios = await prisma.portfolio.findMany({ where: { published: true, owner: { purchases: { some: { status: 'PAID' } } } }, select: { slug: true, updatedAt: true } });
 return [{ url: base }, { url: `${base}/template` }, ...portfolios.map(p=>({url:`${base}/p/${p.slug}`,lastModified:p.updatedAt}))];
}
