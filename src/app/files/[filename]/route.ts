import { contentTypeFor, getObject } from "@/lib/storage";
export const runtime = "nodejs";
/** Public CMS images uploaded through /admin/media. Names are unique, so they cache forever. */
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-z0-9-]{1,120}\.(jpg|png|webp|avif|gif)$/.test(filename)) return new Response(null, { status: 404 });
  const bytes = await getObject(`media/${filename}`);
  if (!bytes) return new Response(null, { status: 404 });
  return new Response(Buffer.from(bytes), { headers: { "Content-Type": contentTypeFor(filename), "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=31536000, immutable", "Content-Security-Policy": "sandbox" } });
}
