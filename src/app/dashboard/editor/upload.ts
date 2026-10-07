"use server";
import { randomUUID } from "node:crypto";
import { paidAccount } from "@/lib/accounts";
import { imageType } from "@/lib/image-type";
import { countObjects, putObject } from "@/lib/storage";
export async function uploadPortfolioImage(form: FormData): Promise<{ url?: string; error?: string }> {
  const user = await paidAccount();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024) return { error: "Choose an image up to 8 MB." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const detected = imageType(bytes);
  if (!detected) return { error: "Use JPG, PNG, WebP, AVIF or GIF. SVG uploads are not accepted." };
  try {
    if ((await countObjects(`uploads/${user.sub}/`, 100)) >= 100) return { error: "Your 100-image allowance is full. Contact the site operator to remove unused images." };
    const filename = `${randomUUID()}.${detected.extension}`;
    await putObject(`uploads/${user.sub}/${filename}`, bytes, detected.mime);
    return { url: `/uploads/${user.sub}/${filename}` };
  } catch { return { error: "Image upload failed. Please try again." }; }
}
