import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { contentTypeFor, getObject } from "@/lib/storage";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ owner: string; filename: string }> }) {
  const { owner, filename } = await params;
  if (!/^[a-z0-9]{20,40}$/.test(owner) || !/^[a-f0-9-]{36}\.(jpg|png|webp|avif|gif)$/.test(filename)) return new Response(null, { status: 404 });
  const portfolio = await prisma.portfolio.findUnique({ where: { ownerId: owner } });
  const url = `/uploads/${owner}/${filename}`;
  const paid = await prisma.purchase.findFirst({ where: { userId: owner, status: "PAID" } });
  if (!paid || !portfolio) return new Response(null, { status: 404 });
  const isPublished = portfolio.published && portfolio.publishedContent?.includes(url);
  if (!isPublished && (await getSession())?.sub !== owner) return new Response(null, { status: 404 });
  const bytes = await getObject(`uploads/${owner}/${filename}`);
  if (!bytes) return new Response(null, { status: 404 });
  return new Response(Buffer.from(bytes), { headers: { "Content-Type": contentTypeFor(filename), "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store", "Content-Security-Policy": "sandbox" } });
}
