# Deploy Johns Antony's portfolio

Supported target: one always-on Node.js 22.18+ or 24 LTS instance (e.g. Railway) behind HTTPS, with **PostgreSQL** (Neon) and **S3-compatible object storage** (Neon storage). The app filesystem can be ephemeral: content lives in Postgres and uploads in the bucket. Run a single instance — the sign-in and contact rate limits are held in process memory.

## Environment

Copy `.env.example` locally. On the host, use private environment settings (Railway → service → Variables).

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (`…-pooler…`) |
| `DIRECT_URL` | Neon **direct** connection string, used for migrations |
| `AUTH_SECRET` | Random signing secret of at least 32 characters |
| `NEXT_PUBLIC_SITE_URL` | Your public origin (a bare host is accepted; HTTPS is assumed) |
| `AWS_ENDPOINT_URL_S3` | Storage endpoint, e.g. `https://br-….storage….neon.tech` |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Storage credential |
| `AWS_REGION` | e.g. `ap-southeast-1` |
| `S3_BUCKET` | Bucket name; defaults to `media` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Owner account; only while running `npm run admin:create` |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Do not commit secrets. If a credential is ever pasted into chat, email or a ticket, rotate it.

`npm start` validates the environment and runs `prisma migrate deploy` before starting, so schema changes apply on each release. The build prerenders the public pages, so the database must be reachable at build time.

## Fresh deployment

```sh
npm ci
npm run db:deploy        # apply migrations (also runs on every start)
npm run db:seed          # the content snapshot — empty installations only
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run admin:create
npm run lint && npm run typecheck && npm test && npm run build
npm start
```

`npm run db:seed` refuses to run when the database already has content, so a live site cannot be wiped by accident; `SEED_FORCE=1` overrides that deliberately. `npm run admin:create` only creates the owner or resets its password; remove `ADMIN_PASSWORD` from the environment afterwards.

## Storage

Uploads go to `media/<name>.<ext>` in the bucket, served publicly at `/files/<name>` and cached immutably. Objects are never public in the bucket itself. Without the storage variables, uploads fall back to `storage/media` on local disk — fine for development, lost on container redeploys. Only raster images are accepted, and filenames are validated before they reach storage.

## Operation and limits

- `/api/health` verifies database connectivity without exposing data.
- All editing happens at `/admin`. Middleware checks the session cookie, and every page and action re-checks with `requireSession()`; middleware alone is not treated as an authorization boundary.
- Sign-in allows 8 attempts per 10 minutes per client; the contact form 5 submissions per 10 minutes.
- Uploads are capped at 8 MB each and identified by magic bytes, so SVG and other non-raster files are rejected.
- Single instance only: rate limits are per process. The reverse proxy must overwrite `x-forwarded-for` and apply request-size and abuse limits.
- Neon provides point-in-time restore; keep bucket versioning or periodic copies for uploads, and restore both together.
- Password recovery, additional editors, custom domains and scheduled publishing are not implemented.

## Verification

```sh
npm test                          # helper and policy tests
npm run lint
npm run typecheck
npm run build
npx tsx scripts/verify-seed.mts   # snapshot vs database, replayed and rolled back
npm run test:smoke                # HTTP checks against a running server (TEST_URL)
```
