import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

import { imageType } from "../src/lib/image-type.ts";
import { ART, media } from "../src/lib/media.ts";
import { siteUrl } from "../src/lib/site-url.ts";
import { counter, slugify } from "../src/lib/utils.ts";

const ROOT = path.resolve(import.meta.dirname, "..");

const pad = (head) => Uint8Array.from([...head, ...new Array(Math.max(0, 12 - head.length)).fill(0)]);
const ascii = (text) => Uint8Array.from(Buffer.from(text));

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

test("media() treats legacy placeholders and retired screenshots as unset", () => {
  assert.equal(media(undefined), "");
  assert.equal(media(null, ART.hero), ART.hero);
  assert.equal(media("", ART.hero), ART.hero);
  assert.equal(media("/media/og.svg", ART.hero), ART.hero);
  assert.equal(media("/images/work/shot.webp", ART.hero), ART.hero);
  assert.equal(media("/files/uploaded.png"), "/files/uploaded.png");
  assert.equal(media(ART.mission), ART.mission);
});

test("slugify() and counter() format CMS input", () => {
  assert.equal(slugify("  Hello, World!  "), "hello-world");
  assert.equal(slugify("Mechaura — Shopify  Rebuild"), "mechaura-shopify-rebuild");
  assert.equal(slugify(""), "");
  assert.equal(counter(1), "/01");
  assert.equal(counter(7, 3), "/007");
});

test("imageType() trusts magic bytes, not the filename or MIME type", () => {
  assert.deepEqual(imageType(pad([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), { mime: "image/png", extension: "png" });
  assert.deepEqual(imageType(pad([0xff, 0xd8, 0xff, 0xe0])), { mime: "image/jpeg", extension: "jpg" });
  assert.deepEqual(imageType(pad(ascii("GIF89a"))), { mime: "image/gif", extension: "gif" });
  assert.deepEqual(imageType(pad([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")])), { mime: "image/webp", extension: "webp" });
  assert.deepEqual(imageType(pad([0, 0, 0, 0, ...ascii("ftyp"), ...ascii("avif")])), { mime: "image/avif", extension: "avif" });
});

test("imageType() rejects scripts, SVG and truncated files", () => {
  assert.equal(imageType(ascii("<svg xmlns=\"http://www.w3.org/2000/svg\"><script/></svg>")), null);
  assert.equal(imageType(ascii("<?xml version=\"1.0\"?><svg/>")), null);
  assert.equal(imageType(ascii("#!/bin/sh\nrm -rf /")), null);
  assert.equal(imageType(Uint8Array.from([0xff, 0xd8, 0xff])), null);
  assert.equal(imageType(new Uint8Array(0)), null);
});

test("siteUrl() normalises the configured origin", () => {
  const saved = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    assert.equal(siteUrl().origin, "http://localhost:3000");
    process.env.NEXT_PUBLIC_SITE_URL = "johnsantony.com";
    assert.equal(siteUrl().origin, "https://johnsantony.com");
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3100";
    assert.equal(siteUrl().origin, "http://localhost:3100");
  } finally {
    if (saved === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = saved;
  }
});

test("the selling platform cannot come back", () => {
  for (const route of ["register", "login", "dashboard", "template", "p", "uploads", "demo"]) {
    assert.equal(existsSync(path.join(ROOT, "src/app", route)), false, `src/app/${route} must not exist`);
  }

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert.equal(pkg.dependencies.stripe, undefined, "stripe must not be a dependency");
  assert.equal(pkg.scripts["test:integration"], undefined, "payment integration tests are gone");

  const schema = readFileSync(path.join(ROOT, "prisma/schema.prisma"), "utf8");
  for (const model of ["Portfolio", "Purchase", "PaymentEvent"]) {
    assert.doesNotMatch(schema, new RegExp(`model ${model}\\b`), `${model} must not be in the schema`);
  }

  const files = [...walk(path.join(ROOT, "src")), path.join(ROOT, "scripts/check-env.mjs")].filter((file) =>
    /\.(ts|tsx|mjs|mts)$/.test(file),
  );
  const offenders = files.filter((file) =>
    /STRIPE_|sk_test_|checkout\.session|\/dashboard\b|\/register\b/.test(readFileSync(file, "utf8")),
  );
  assert.deepEqual(offenders, [], `selling references remain in: ${offenders.join(", ")}`);
});
