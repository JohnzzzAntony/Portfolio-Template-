# Forma Portfolio

A reusable portfolio platform: register, purchase once through Stripe, edit a private draft, and publish your own portfolio.

## Included

- Forma landing page and preview of the actual customer template.
- Email/password registration and sign-in with signed httpOnly sessions.
- One-time hosted Stripe Checkout, signed webhooks, reconciliation and refund/dispute revocation.
- Separate customer portfolios, draft previews and public addresses (`/p/your-name`).
- Editor for branding, biography, projects, services, contacts, social links and images. Draft, publish and unpublish controls.
- Raster image uploads and protected unpublished assets.
- Responsive editorial design, local font, metadata, sitemap and health check.
- Database migration, regression tests and deployment validation.

Target: **one Node.js instance** (e.g. Railway) with **PostgreSQL** (Neon) and **S3-compatible storage** for uploads. Not configured for multiple replicas.

## Local setup

Use Node.js 22.18+ or 24 LTS. Copy `.env.example` to `.env`, set the PostgreSQL URLs (Neon, or `npm run db:up` for a local Docker database), generate a strong `AUTH_SECRET`, and optionally the object-storage variables.

```sh
npm ci
npm run setup
npm run dev
```

Setup is for a fresh database only: it applies migrations and seeds the demo content. Create the operator with `ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create`. Never reseed a live deployment. Template artwork is committed in `public/images` (`npm run art:generate` rebuilds it). Stripe settings may remain blank for preview; purchases stay disabled until configured.

| Route | Purpose |
| --- | --- |
| `/`, `/template` | Product and customer template preview |
| `/register`, `/login` | Customer authentication |
| `/dashboard` | Purchase status and workspace |
| `/dashboard/editor`, `/dashboard/preview` | Paid editor and private preview |
| `/p/[slug]` | Published customer portfolio |
| `/api/stripe/webhook`, `/api/health` | Payment events and health check |
| `/demo`, `/admin` | Retained multi-page demonstration and operator-only CMS |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for activation and hosting and [AUDIT.md](./AUDIT.md) for verification. The Overused Grotesk font (SIL OFL 1.1) license is in `src/app/fonts/OverusedGrotesk-OFL.txt`.
