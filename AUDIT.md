# Delivery audit — Johns Antony portfolio

This is a single-owner personal portfolio. There is no registration, no purchase, no checkout and no customer accounts: one ADMIN user owns the content and the public site is CMS-driven. The owner CMS lives at `/admin`.

## What changed

- **Selling platform removed.** `/register`, `/login`, `/dashboard`, `/template`, `/p/[slug]` and `/uploads/[owner]/[filename]`, the Stripe webhook, `lib/payments.ts`, `lib/payment-policy.ts`, `lib/accounts.ts`, `lib/portfolio-content.ts`, the platform components and their tests are gone, along with the `stripe` dependency, the `STRIPE_*` environment variables and the account stylesheet.
- **Personal site moved to the root.** The CMS site now serves `/`, `/about`, `/services`, `/portfolio`, `/blog`, `/contact` and the detail routes instead of `/demo/*`. Canonical URLs, the sitemap, robots directives, internal links and the navigation overlay list follow the move.
- **Database.** `Portfolio`, `Purchase` and `PaymentEvent` were dropped by migration `20261015000000_remove_purchase_platform`. All three were verified empty (0 rows) beforehand, so nothing was lost. `Role` still contains `EDITOR` — removing an enum value changes the auth schema, so it was left deliberately; nothing can create a non-admin user.
- **Seeding.** The Forma studio demo content was replaced by a snapshot of this site's own content (`prisma/seed-data.json`) applied by `prisma/seed.ts`. Seeding now refuses to run against a populated database.
- **Cleanup.** The leftover one-shot content script (which held a plaintext password) and the orphaned `.platform-*`/`.auth-*`/`.editor-*` stylesheet were deleted.

## Security boundaries

- Every admin read and write derives identity from the verified session cookie. `requireSession()` requires the ADMIN role and throws `FORBIDDEN` otherwise.
- Middleware gates `/admin/*` by verifying the JWT, but it is not the authorization boundary — each page and action re-checks server-side.
- Sessions are httpOnly, `sameSite=lax`, `secure` in production, signed HS256 with `AUTH_SECRET`, and are invalidated when the account's password changes.
- Sign-in rate limits by client, always runs a password compare against a dummy hash so timing does not reveal which emails exist, and returns a deliberately vague error.
- Uploads are identified by magic bytes, not the submitted filename or MIME type; SVG, scripts and truncated files are rejected, sizes are capped at 8 MB, and public filenames must match a strict pattern before storage is touched.
- The contact form validates with zod, silently discards honeypot submissions, rate limits by client, and stores nothing when validation or storage fails.
- Security headers (nosniff, SAMEORIGIN, referrer policy, permissions policy, HSTS) are set in `next.config.ts`; `/media/*` responses add a sandbox CSP.

## Verification

- `npm test` — 6 passing tests: image magic-byte sniffing (including SVG and script rejection), media fallbacks, slug/counter formatting, site URL normalisation, and a policy test that fails if the selling platform returns as routes, Prisma models, the Stripe dependency or `STRIPE_*` references.
- `npm run lint`, `npm run typecheck` and `npm run build` pass. The production build emits only the public routes, `/admin/*`, `/files/[filename]` and `/api/health`.
- `npx tsx scripts/verify-seed.mts` — the snapshot matches the database across all 13 collections, and replaying the seed inside a transaction that is then rolled back leaves the database unchanged.
- `npm run db:seed` on the populated database exits non-zero and changes nothing.
- HTTP checks over a local production server and a browser pass over the public pages and the admin sign-in.

## Acceptance limits

- No public deployment, custom domain or database restore was performed.
- Unused uploads are not cleaned up automatically; that is still manual through `/admin/media`.
- Project and service imagery still uses the committed placeholder artwork where the CMS has no image.
