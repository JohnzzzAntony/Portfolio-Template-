# Deploy Forma Portfolio

Supported target: one always-on Node.js 22.18+ or 24 LTS instance (e.g. Railway) behind HTTPS, with **PostgreSQL** (Neon) and **S3-compatible object storage** (Neon storage). The app filesystem can be ephemeral: data lives in Postgres and uploads in the bucket. Run a single instance — checkout serialization and rate limits are in memory.

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
| `STRIPE_SECRET_KEY` | Stripe sandbox secret key (`sk_test_…`) |
| `STRIPE_PRICE_ID` | Active, positive, one-time Price ID |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for this host's webhook |
| `STRIPE_LIVE_MODE` | Leave blank to stay in the Stripe sandbox; `enabled` allows live keys |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Operator account; only while running `npm run admin:create` |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Do not commit secrets. If a credential is ever pasted into chat, email or a ticket, rotate it.

`npm start` validates the environment and runs `prisma migrate deploy` before starting, so schema changes apply on each release. The build prerenders the `/demo` pages, so the database must be reachable at build time.

## Fresh deployment

```sh
npm ci
npm run db:deploy        # apply migrations (also runs on every start)
npm run db:seed          # demo CMS content — empty installations only
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run admin:create
npm run lint && npm test && npm run build
npm start
```

Seed only an empty installation: it replaces the demo CMS collections (it never touches customer accounts, portfolios or purchases). `npm run admin:create` only creates the operator or resets its password; remove `ADMIN_PASSWORD` from the environment afterwards.

## Storage

Uploads go to the bucket under two prefixes: `uploads/<owner>/<uuid>.<ext>` (customer images, private, streamed by `/uploads/…` only to the owner or when published by a paying customer) and `media/<name>.<ext>` (operator CMS images, public at `/files/…`, cached immutably). Objects are never public in the bucket itself. Without storage variables, uploads fall back to `storage/` on local disk — fine for development, lost on container redeploys.

## Stripe activation

1. Create a product and a positive one-time price. Set all three Stripe settings.
2. Register `https://YOUR_HOST/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and `charge.dispute.created`.
3. In test mode, register, complete checkout and verify editing unlocks. Test cancellation, duplicate events, delayed payment, refund and dispute. A return URL alone never unlocks access.
4. Switch to the live secret key, live Price ID and live endpoint signing secret only after acceptance testing, and set `STRIPE_LIVE_MODE=enabled`.

The platform currently runs in the **Stripe sandbox**: only `sk_test_`/`rk_test_` keys are accepted, live-mode webhook events are ignored, and startup fails if a live key is configured without `STRIPE_LIVE_MODE=enabled`. The dashboard labels checkout as a sandbox and lists Stripe's test card `4242 4242 4242 4242` (any future expiry, any CVC). Local webhook testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the printed `whsec_` secret.

All three Stripe values can remain blank for preview-only hosting; checkout is disabled. Partial configuration fails startup. Implementation follows [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment) and [signature verification](https://docs.stripe.com/webhooks/signatures).

Partial/full refunds and disputes revoke access. Dispute resolution requires operator review before reinstatement. Checkout serialization and request limits are in process memory; use one instance. The reverse proxy must overwrite `x-forwarded-for` and apply request-size and abuse limits.

## Operation and limits

- `/api/health` verifies database connectivity without exposing data.
- Customer flow: register → dashboard → Stripe → editor → `/p/{slug}`.
- Customer content, uploads and payments are separate from the operator CMS.
- Uploads: raster images, 8 MB each, 100 files per account. Unpublished assets require the owner's session. Cleanup of unused files is currently manual.
- Neon provides point-in-time restore; keep bucket versioning or periodic copies for uploads, and restore both together.
- Password recovery, email verification, custom domains, multiple templates and subscriptions are not implemented. Establish operator support before accepting paying customers.
- Provide business support details, refund terms and privacy information before live sales. No fabricated legal policy is included.

## Verification

```sh
npm test
npm run lint
npm run build
# Only against a local server and local database:
npm run test:integration
```

Integration tests create/remove synthetic customers and fixture entitlements in the configured database. They do not call Stripe or charge cards. Live checkout and webhook delivery remain an acceptance step using your account.
