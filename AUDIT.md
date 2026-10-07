# Forma delivery audit

Public branding is now Forma Portfolio. Personal branding was removed from public CMS content. Existing operator credentials were preserved. Customer accounts are explicitly EDITOR and cannot access the operator CMS.

Customer flow: registration → one-time purchase → personal editor → private preview → publication at `/p/{slug}`. The advertised template and customer renderer share a component and starter content. Customers edit branding, biography, projects, services, contacts, social links and images. The legacy multi-page CMS is a separate operator demonstration at `/demo`.

Design: warm editorial minimalism, oversized local Geist typography, ivory/ink surfaces, a restrained pale green accent, sharp divisions and a prominent Forma wordmark. Responsive layouts include readable type floors and visible focus states.

## Security boundaries

- Every customer read/write/upload derives ownership from the verified session.
- Paid access is checked server-side for editing and public visibility.
- Stripe payment mode/status, customer reference, price, quantity and refund/dispute state are verified.
- Webhook events are recorded idempotently; checkout returns use the same fulfillment logic.
- Draft and published snapshots are separate. Revision checks reject stale concurrent saves.
- Raster upload signature checks, size limits and protected unpublished assets.

## Verification

Production build passed after upgrading Next.js to 16.4.0. Production dependency audit reported zero vulnerabilities. Payment tests cover valid and mismatched purchases, unpaid sessions, refunds, disputes, revoked purchases, unsafe URLs and tampered/stale Stripe signatures.

Local integration tests passed for routes/branding, unpaid blocking, paid owner access, customer isolation, operator isolation, private drafts, publication, revocation and forged webhooks. Tests use temporary synthetic entitlements and remove fixture accounts.

## Acceptance limits

No live payment was made. Real checkout and webhook delivery need private Stripe keys and a one-time Price ID. Public deployment, domain setup and restore testing were not performed. Password recovery and email verification are not included. Hosting requires a single persistent Node.js instance; see DEPLOYMENT.md.
