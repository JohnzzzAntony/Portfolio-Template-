import { readFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
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
  try {
    const directory = process.env.UPLOAD_DIR || path.join(process.cwd(), "storage", "uploads");
    const bytes = await readFile(path.join(directory, owner, filename));
    const extensions: Record<string,string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
    return new Response(bytes, { headers: { "Content-Type": extensions[filename.split('.').pop()!], "X-Content-Type-Options": "nosniff", "Cache-Control": "private, no-store", "Content-Security-Policy": "sandbox" } });
  } catch { return new Response(null, { status: 404 }); }
}
