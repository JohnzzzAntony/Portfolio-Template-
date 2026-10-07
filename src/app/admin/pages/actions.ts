"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth";
import type { PageState } from "@/lib/admin/state";
import { prisma } from "@/lib/prisma";

const PAGE_FIELDS = [
  "title",
  "metaLeft",
  "metaRight",
  "heroImage",
  "heroImageMobile",
  "seoTitle",
  "seoDescription",
  "ogImage",
] as const;

const SECTION_FIELDS = [
  "label",
  "index",
  "heading",
  "subheading",
  "body",
  "image",
  "ctaLabel",
  "ctaUrl",
] as const;

/**
 * Saves the page's own fields plus every one of its sections in one submit.
 * Section inputs are namespaced `section.<id>.<field>` so the whole editor is a
 * single form — matching how an editor thinks about a page.
 */
export async function savePage(
  pageId: string,
  _prev: PageState,
  formData: FormData,
): Promise<PageState> {
  await requireSession();

  const pageData: Record<string, string> = {};
  for (const key of PAGE_FIELDS) {
    pageData[key] = String(formData.get(key) ?? "").trim();
  }

  const sections = new Map<string, Record<string, string | boolean>>();
  for (const [key, value] of formData.entries()) {
    const match = /^section\.([^.]+)\.(.+)$/.exec(key);
    if (!match) continue;

    const [, id, field] = match;
    if (field !== "visible" && !SECTION_FIELDS.includes(field as never)) continue;

    const entry = sections.get(id) ?? {};
    entry[field] = field === "visible" ? true : String(value);
    sections.set(id, entry);
  }

  // Unchecked checkboxes submit nothing, so default every section to hidden and
  // let the loop above flip the ones that were checked.
  for (const id of formData.getAll("sectionId").map(String)) {
    const entry = sections.get(id) ?? {};
    if (!("visible" in entry)) entry.visible = false;
    sections.set(id, entry);
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.page.update({ where: { id: pageId }, data: pageData });
      for (const [id, data] of sections) {
        await tx.section.update({ where: { id }, data });
      }
    });
  } catch {
    return { status: "error", message: "Could not save the page." };
  }

  revalidatePath("/", "layout");
  return { status: "saved", message: "Page saved." };
}
