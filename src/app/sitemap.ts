import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const base = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
 const portfolios = await prisma.portfolio.findMany({ where: { published: true, owner: { purchases: { some: { status: 'PAID' } } } }, select: { slug: true, updatedAt: true } });
 return [{ url: base }, { url: `${base}/template` }, ...portfolios.map(p=>({url:`${base}/p/${p.slug}`,lastModified:p.updatedAt}))];
}
