import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { requireSession } from "@/lib/auth";
import { imageType } from "@/lib/image-type";
import { prisma } from "@/lib/prisma";
import { deleteObject, putObject } from "@/lib/storage";
import { slugify } from "@/lib/utils";

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB to accommodate short videos

export async function POST(req: NextRequest) {
  try {
    await requireSession();

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ error: "File exceeds 50 MB limit" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    let detected = imageType(bytes);

    // Fallback detection by filename extension if magic bytes fail
    let extension = detected?.extension;
    let mime = detected?.mime;

    if (!detected) {
      const extMatch = path.extname(file.name).toLowerCase().replace(".", "");
      if (["mp4", "webm", "mov", "m4v"].includes(extMatch)) {
        extension = extMatch === "mov" || extMatch === "m4v" ? "mp4" : extMatch;
        mime = `video/${extension}`;
      } else if (["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(extMatch)) {
        extension = extMatch === "jpeg" ? "jpg" : extMatch;
        mime = `image/${extension}`;
      } else {
        return Response.json(
          { error: "Unsupported file type. Use JPG, PNG, WebP, AVIF, GIF, MP4, or WebM." },
          { status: 400 }
        );
      }
    }

    const stem = slugify(path.parse(file.name).name) || "asset";
    const filename = `${stem}-${randomUUID().slice(0, 8)}.${extension}`;

    try {
      await putObject(`media/${filename}`, bytes, mime!);

      await prisma.media.create({
        data: {
          url: `/files/${filename}`,
          filename,
          alt: file.name,
          mime: mime!,
          size: file.size,
        },
      });

      return Response.json({ url: `/files/${filename}`, filename });
    } catch (err) {
      await deleteObject(`media/${filename}`).catch(() => {});
      console.error("Storage upload error:", err);
      return Response.json({ error: "Storage upload failed" }, { status: 500 });
    }
  } catch (authErr) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
