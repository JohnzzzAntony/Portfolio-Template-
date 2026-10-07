/** Public site origin from NEXT_PUBLIC_SITE_URL; accepts a bare host such as "app.up.railway.app". */
export function siteUrl(fallback = "http://localhost:3000") {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback;
  return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
}
