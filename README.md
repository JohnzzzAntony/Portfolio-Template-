# Johns Antony — portfolio

My personal portfolio and the CMS behind it. One owner, no accounts, no
checkout: the public site reads from the database, and I edit it at `/admin`.

## What's in here

- Editorial home page plus `/about`, `/services`, `/portfolio`, `/blog` and `/contact`.
- Project and article detail pages generated from the CMS.
- Owner-only CMS at `/admin`: site settings, page sections, projects, posts, services, lists, media uploads and contact submissions.
- Contact form with validation, a honeypot and rate limiting.
- Local Overused Grotesk font, metadata, canonical URLs, sitemap, robots and a health check.
- One PostgreSQL database (Neon) and S3-compatible storage for uploads.

## Local setup

Use Node.js 22.18+ or 24 LTS. Copy `.env.example` to `.env`, set the PostgreSQL
URLs, generate a strong `AUTH_SECRET`, and optionally the object-storage
variables.

```sh
npm ci
npm run setup        # prisma generate + migrate deploy + seed
npm run dev
```

`npm run db:seed` is a fresh-install step: it replaces every content collection,
so it refuses to run when the database already has content. Set `SEED_FORCE=1`
only if you mean to replace it. The content it writes lives in
`prisma/seed-data.json`, and `npx tsx scripts/verify-seed.mts` checks that the
snapshot still matches the database.

The owner account is created separately, so a fresh install never depends on a
secret being present:

```sh
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run admin:create
```

Then sign in at `/admin/login`. Remove `ADMIN_PASSWORD` from the environment
afterwards.

| Route | Purpose |
| --- | --- |
| `/`, `/about`, `/services`, `/portfolio`, `/blog`, `/contact` | Public site (CMS-driven) |
| `/projects/[slug]`, `/blog/[slug]` | Project and article pages |
| `/admin`, `/admin/login` | Owner-only CMS |
| `/files/[filename]` | Uploaded images |
| `/api/health` | Database health check |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for hosting and [AUDIT.md](./AUDIT.md) for
verification. The Overused Grotesk font (SIL OFL 1.1) license is in
`src/app/fonts/OverusedGrotesk-OFL.txt`.
