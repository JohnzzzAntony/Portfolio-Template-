# Deploy Forma Portfolio

Supported target: one always-on Node.js 22.18+ or 24 LTS instance with a persistent disk, behind HTTPS. SQLite and local uploads require persistent storage. Do not use an ephemeral serverless filesystem or multiple replicas.

## Environment

Copy `.env.example` locally. On the host, use private environment settings.

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Absolute SQLite URL, e.g. `file:/var/lib/forma/forma.db` |
| `AUTH_SECRET` | Random signing secret of at least 32 characters |
| `NEXT_PUBLIC_SITE_URL` | Your HTTPS public origin |
| `UPLOAD_DIR` | Persistent absolute directory, e.g. `/var/lib/forma/uploads` |
| `STRIPE_SECRET_KEY` | Your Stripe secret key; test mode first |
| `STRIPE_PRICE_ID` | Active, positive, one-time Price ID |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for this host's webhook |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Initial operator credentials; seeding only |

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Initial admin password must be unique and at least 12 characters. Do not commit secrets or ship database backups.

## Fresh deployment

```sh
npm ci
npm run db:generate
npm run db:deploy
npm run db:seed
npm run assets:generate
npm run lint
npm test
npm run build
npm start
```

Seed only an empty installation. It replaces demo CMS collections. Never seed on routine releases. Remove the initial admin password from the environment after provisioning. The build needs a populated database for the retained demo's prerendered pages.

Later releases: back up the database and uploads, install locked dependencies, generate Prisma, apply migrations, build and restart. Keep `public/media` if using the legacy operator media manager; customer uploads use `UPLOAD_DIR`. The Procfile starts the app, and `npm start` validates settings first.

The existing local database is already upgraded and migration `20261007000000_initial` baselined. For an older database, back it up, apply the additive schema update, verify it matches, then baseline using `npx prisma migrate resolve --applied 20261007000000_initial`. Do not baseline an empty database.

## Stripe activation

1. Create a product and a positive one-time price. Set all three Stripe settings.
2. Register `https://YOUR_HOST/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, and `charge.dispute.created`.
3. In test mode, register, complete checkout and verify editing unlocks. Test cancellation, duplicate events, delayed payment, refund and dispute. A return URL alone never unlocks access.
4. Switch to the live secret key, live Price ID and live endpoint signing secret only after acceptance testing.

All three Stripe values can remain blank for preview-only hosting; checkout is disabled. Partial configuration fails startup. Implementation follows [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment) and [signature verification](https://docs.stripe.com/webhooks/signatures).

Partial/full refunds and disputes revoke access. Dispute resolution requires operator review before reinstatement. Checkout serialization and request limits are in process memory; use one instance. The reverse proxy must overwrite `x-forwarded-for` and apply request-size and abuse limits.

## Operation and limits

- `/api/health` verifies database connectivity without exposing data.
- Customer flow: register → dashboard → Stripe → editor → `/p/{slug}`.
- Customer content, uploads and payments are separate from the operator CMS.
- Uploads: raster images, 8 MB each, 100 files per account. Unpublished assets require the owner's session. Cleanup of unused files is currently manual.
- Back up SQLite using its online backup tool or pause writes while copying. Restore the database and upload directory together.
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

Integration tests create/remove synthetic customers and fixture entitlements. They do not call Stripe or charge cards. Live checkout and webhook delivery remain an acceptance step using your account.
