import "server-only";

import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Object storage for uploaded images. Uses any S3-compatible bucket when the
 * AWS_* variables are set (Neon storage in production) and falls back to a
 * local directory for development. Objects are private; routes stream them
 * after their own access checks.
 */

const KEY = /^(uploads\/[a-z0-9]{20,40}\/[a-f0-9-]{36}|media\/[a-z0-9-]{1,120})\.(jpg|png|webp|avif|gif)$/;

export const objectStorageEnabled = () =>
  !!(process.env.AWS_ENDPOINT_URL_S3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

const bucket = () => process.env.S3_BUCKET || "media";

let client: S3Client | undefined;
function s3() {
  client ??= new S3Client({
    region: process.env.AWS_REGION || "auto",
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID!, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY! },
  });
  return client;
}

/** Local layout matches earlier releases: UPLOAD_DIR/<owner>/<file>, storage/media/<file>. */
function localPath(key: string) {
  const [area, ...rest] = key.split("/");
  const root = area === "uploads"
    ? process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "uploads")
    : path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "media");
  return path.join(/*turbopackIgnore: true*/ root, ...rest);
}

function assertKey(key: string) {
  if (!KEY.test(key)) throw new Error("Invalid storage key.");
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  assertKey(key);
  if (objectStorageEnabled()) {
    await s3().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType, CacheControl: "private, max-age=31536000, immutable" }));
    return;
  }
  const file = localPath(key);
  await mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
  await writeFile(/*turbopackIgnore: true*/ file, body, { flag: "wx" });
}

/** Returns the object's bytes, or null when it does not exist. */
export async function getObject(key: string): Promise<Uint8Array | null> {
  assertKey(key);
  try {
    if (objectStorageEnabled()) {
      const result = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
      return result.Body ? await result.Body.transformToByteArray() : null;
    }
    return await readFile(/*turbopackIgnore: true*/ localPath(key));
  } catch {
    return null;
  }
}

export async function deleteObject(key: string) {
  assertKey(key);
  if (objectStorageEnabled()) {
    await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    return;
  }
  await unlink(/*turbopackIgnore: true*/ localPath(key)).catch(() => {});
}

/** Number of objects under a prefix such as "uploads/<owner>/", capped at `limit`. */
export async function countObjects(prefix: string, limit = 1000) {
  if (!/^uploads\/[a-z0-9]{20,40}\/$/.test(prefix)) throw new Error("Invalid storage prefix.");
  if (objectStorageEnabled()) {
    const result = await s3().send(new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefix, MaxKeys: limit }));
    return result.KeyCount ?? 0;
  }
  try {
    return (await readdir(/*turbopackIgnore: true*/ localPath(prefix.replace(/\/$/, "")))).length;
  } catch {
    return 0;
  }
}

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };
export const contentTypeFor = (filename: string) => TYPES[filename.split(".").pop() ?? ""] ?? "application/octet-stream";
