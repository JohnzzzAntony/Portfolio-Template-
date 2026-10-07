"use server";
import { revalidatePath } from "next/cache";
import { ownedPortfolio } from "@/lib/accounts";
import { prisma } from "@/lib/prisma";
import { portfolioSchema } from "@/lib/portfolio-content";
export type EditorState = { error?: string; message?: string; revision: number };
export async function savePortfolio(_previous: EditorState, formData: FormData): Promise<EditorState> {
 const owned = await ownedPortfolio();
 const revision = Number(formData.get("revision"));
 const fail = (error: string) => ({ error, revision: Number.isSafeInteger(revision) ? revision : -1 });
 const raw = formData.get("content");
 if (typeof raw !== "string" || raw.length > 150000) return fail("Portfolio is too large.");
 let content;
 try { content = portfolioSchema.parse(JSON.parse(raw)); } catch { return fail("Check required fields and use valid HTTPS links for images and projects."); }
 const slug = String(formData.get("slug") || "").trim().toLowerCase();
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 60 || ['demo','admin','forma','support'].includes(slug)) return fail("Use 3–60 lowercase letters, numbers and hyphens for your address.");
 if (!Number.isSafeInteger(revision) || revision !== owned.revision) return { error: "This portfolio changed in another tab. Reload before saving to avoid losing changes.", revision: Number.isSafeInteger(revision) ? revision : -1 };
 const intent = String(formData.get("intent"));
 if (!["save", "publish", "unpublish"].includes(intent)) return fail("Unknown action.");
 if (owned.published && slug !== owned.slug && intent === "save") return fail("Use Publish portfolio to change a live address, or keep the current address when saving a private draft.");
 try {
   const result = await prisma.portfolio.updateMany({
    where: { id: owned.id, ownerId: owned.ownerId, revision },
    data: { slug, content: JSON.stringify(content), revision: { increment: 1 },
      ...(intent === 'publish' ? { published: true, publishedContent: JSON.stringify(content) } : {}),
      ...(intent === 'unpublish' ? { published: false } : {}),
    },
   });
   if (!result.count) return { error: "Another tab saved changes. Reload this page.", revision };
 } catch { return fail("That portfolio address is unavailable. Choose another."); }
 revalidatePath(`/p/${owned.slug}`); revalidatePath(`/p/${slug}`); revalidatePath('/dashboard');
 return { message: intent === 'publish' ? 'Published. Your latest work is live.' : intent === 'unpublish' ? 'Portfolio is now private.' : 'Draft saved. Your published portfolio is unchanged.', revision: revision + 1 };
}
