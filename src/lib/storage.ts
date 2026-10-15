import "server-only";

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Object storage for the site's own images. Uses any S3-compatible bucket when
 * the AWS_* variables are set (Neon storage in production) and falls back to
 * storage/media on local disk for development.
 */

const KEY = /^media\/[a-z0-9-]{1,120}\.(jpg|png|webp|avif|gif)$/;

const configured = () =>
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

/** The local fallback mirrors the remote layout: storage/media/<file>. */
const localPath = (key: string) =>
  path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", ...key.split("/"));

function assertKey(key: string) {
  if (!KEY.test(key)) throw new Error("Invalid storage key.");
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  assertKey(key);
  if (configured()) {
    await s3().send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
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
    if (configured()) {
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
  if (configured()) {
    await s3().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    return;
  }
  await unlink(/*turbopackIgnore: true*/ localPath(key)).catch(() => {});
}

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};
export const contentTypeFor = (filename: string) =>
  TYPES[filename.split(".").pop() ?? ""] ?? "application/octet-stream";
