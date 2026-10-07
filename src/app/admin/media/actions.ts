"use server";

import { randomUUID } from "node:crypto";
import path from "node:path";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth";
import type { UploadState } from "@/lib/admin/state";
import { prisma } from "@/lib/prisma";
import { imageType } from "@/lib/image-type";
import { deleteObject, putObject } from "@/lib/storage";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 8 * 1024 * 1024;

export async function uploadMedia(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  await requireSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choose a file to upload." };
  }

  if (file.size > MAX_BYTES) {
    return { status: "error", message: "File is larger than 8 MB." };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const detected = imageType(bytes);
  if (!detected) return { status: "error", message: "Unsupported image. Use JPG, PNG, WebP, AVIF or GIF. SVG uploads are not accepted." };
  const { extension, mime } = detected;

  const stem = slugify(path.parse(file.name).name) || "asset";
  const filename = `${stem}-${randomUUID().slice(0, 8)}.${extension}`;

  try {
    await putObject(`media/${filename}`, bytes, mime);

    await prisma.media.create({
      data: {
        url: `/files/${filename}`,
        filename,
        alt: String(formData.get("alt") ?? "").trim(),
        mime,
        size: file.size,
      },
    });
  } catch {
    await deleteObject(`media/${filename}`).catch(() => {});
    return { status: "error", message: "Upload failed." };
  }

  revalidatePath("/admin/media");
  return { status: "saved", message: "Uploaded." };
}

export async function deleteMedia(id: string) {
  await requireSession();

  const record = await prisma.media.findUnique({ where: { id } });
  if (!record) return;

  // Only objects this manager stored are removed; legacy /media files are left alone.
  if (record.url.startsWith("/files/")) await deleteObject(`media/${path.basename(record.filename)}`).catch(() => {});

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
