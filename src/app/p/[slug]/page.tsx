import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseContent } from "@/lib/portfolio-content";
import { CustomerPortfolio } from "@/components/platform/CustomerPortfolio";
export const dynamic = "force-dynamic";
const publicPortfolio = cache(async (slug: string) => {
 const portfolio = await prisma.portfolio.findUnique({ where: { slug } });
 if (!portfolio?.published || !portfolio.publishedContent) notFound();
 if (!(await prisma.purchase.findFirst({ where: { userId: portfolio.ownerId, status: "PAID" } }))) notFound();
 return { portfolio, content: parseContent(portfolio.publishedContent) };
});
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
 const { slug } = await params; const { content } = await publicPortfolio(slug);
 return { title: { absolute: `${content.name} — ${content.role}` }, description: content.introduction, alternates: { canonical: `/p/${slug}` }, openGraph: { title: content.name, description: content.introduction, images: content.heroImage ? [content.heroImage] : [] } };
}
export default async function PortfolioPage({ params }: { params: Promise<{slug:string}> }) { const { content } = await publicPortfolio((await params).slug); return <CustomerPortfolio content={content} />; }
