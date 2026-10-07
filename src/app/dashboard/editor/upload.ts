"use server";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { paidAccount } from "@/lib/accounts";
import { imageType } from "@/lib/image-type";
export async function uploadPortfolioImage(form: FormData): Promise<{ url?: string; error?: string }> {
  const user = await paidAccount();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024) return { error: "Choose an image up to 8 MB." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const detected = imageType(bytes);
  if (!detected) return { error: "Use JPG, PNG, WebP, AVIF or GIF. SVG uploads are not accepted." };
  const directory = path.join(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || path.join(process.cwd(), "storage", "uploads"), user.sub);
  try {
    await mkdir(directory, { recursive: true });
    if ((await readdir(/*turbopackIgnore: true*/ directory)).length >= 100) return { error: "Your 100-image allowance is full. Contact the site operator to remove unused images." };
    const filename = `${randomUUID()}.${detected.extension}`;
    await writeFile(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ directory, filename), bytes, { flag: "wx" });
    return { url: `/uploads/${user.sub}/${filename}` };
  } catch { return { error: "Image upload failed. Please try again." }; }
}
