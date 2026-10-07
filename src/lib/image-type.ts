/** Identify supported raster formats from bytes, never the submitted MIME type. */
export function imageType(bytes: Uint8Array): { mime: string; extension: string } | null {
  const hex = (count: number) => Buffer.from(bytes.subarray(0, count)).toString("hex");
  const text = (start: number, end: number) => Buffer.from(bytes.subarray(start, end)).toString("ascii");
  if (bytes.length < 12) return null;
  if (hex(3) === "ffd8ff") return { mime: "image/jpeg", extension: "jpg" };
  if (hex(8) === "89504e470d0a1a0a") return { mime: "image/png", extension: "png" };
  if (["GIF87a", "GIF89a"].includes(text(0, 6))) return { mime: "image/gif", extension: "gif" };
  if (text(0, 4) === "RIFF" && text(8, 12) === "WEBP") return { mime: "image/webp", extension: "webp" };
  if (text(4, 8) === "ftyp" && ["avif", "avis"].includes(text(8, 12))) return { mime: "image/avif", extension: "avif" };
  return null;
}
