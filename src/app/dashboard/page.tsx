import Link from "next/link";
import { account } from "@/lib/accounts";
import { prisma } from "@/lib/prisma";
import { fulfillCheckout, paymentsConfigured, stripeClient } from "@/lib/payments";
import { PlatformHeader } from "@/components/platform/Chrome";
import { logout } from "@/app/admin/login/actions";
import { checkout } from "./actions";
export const metadata = { title: "Your workspace — Forma", robots: { index: false, follow: false } };
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ checkout?: string; notice?: string }> }) {
 const user = await account(); const query = await searchParams;
 let pending = false;
 if (query.checkout?.startsWith("cs_") && query.checkout.length < 300) {
   try { pending = !(await fulfillCheckout(query.checkout, user.sub)); } catch { pending = true; }
 }
 const [paid, portfolio] = await Promise.all([
  prisma.purchase.findFirst({ where: { userId: user.sub, status: "PAID" } }),
  prisma.portfolio.findUnique({ where: { ownerId: user.sub } }),
 ]);
 let priceLabel = "Review price at checkout";
 if (!paid && paymentsConfigured()) { try {
   const price = await stripeClient().prices.retrieve(process.env.STRIPE_PRICE_ID!);
   if (price.unit_amount !== null) priceLabel = new Intl.NumberFormat("en", { style: "currency", currency: price.currency }).format(price.unit_amount / (['bif','clp','djf','gnf','jpy','kmf','krw','mga','pyg','rwf','ugx','vnd','vuv','xaf','xof','xpf'].includes(price.currency) ? 1 : 100)) + " · one-time";
 } catch { /* Checkout will show a service error if configuration is invalid. */ } }
 const notices: Record<string,string> = { pending: "Your payment is processing. Refresh shortly before attempting another payment.", cancelled: "Checkout cancelled. You have not unlocked the editor yet. You can try again when ready.", unavailable: "Checkout is temporarily unavailable. Please try again later.", rate: "Please wait a minute before trying checkout again." };
 return <div className="platform"><PlatformHeader /><main className="platform-section dashboard-shell"><div className="section-top"><div><p className="platform-kicker">Your workspace</p><h1>Make your<br/>next move.</h1></div><form action={logout}><button className="text-link">Sign out ↗</button></form></div><p className="platform-muted">Signed in as {user.email}</p>
 {query.notice && notices[query.notice] && <p role="status" className="platform-notice">{notices[query.notice]}</p>}
 {pending && !paid && <p role="status" className="platform-notice">Your payment is still being confirmed. Refresh this page shortly. Do not pay again while confirmation is pending.</p>}
 <section className="workspace-card"><div><p className="platform-kicker">{paid ? 'Unlocked / Yours to shape' : 'Forma / Portfolio template'}</p><h2>{paid ? 'Your portfolio starts here.' : 'A single payment. A space of your own.'}</h2><p>{paid ? 'Save a private draft, preview your changes, then publish when ready.' : 'Unlock your personal editor, add your work, and publish your own portfolio.'}</p>{portfolio && <p className="platform-muted">{portfolio.published ? 'Published' : 'Private draft'} · /p/{portfolio.slug}</p>}</div><div className="workspace-actions">{paid ? <><Link className="platform-button" href="/dashboard/editor">Open editor ↗</Link><Link className="text-link" href="/dashboard/preview">Preview draft</Link>{portfolio?.published && <Link className="text-link" href={`/p/${portfolio.slug}`}>View public portfolio ↗</Link>}</> : <><strong className="price-label">{priceLabel}</strong><form action={checkout}><button className="platform-button" disabled={!paymentsConfigured() || pending}>Unlock with Stripe ↗</button></form>{!paymentsConfigured() && <p className="platform-muted">Purchases open soon. Your account is ready.</p>}<Link href="/template" className="text-link">Explore before you buy</Link></>}</div></section>
 {user.role === "ADMIN" && <p className="mt-8"><Link className="text-link" href="/admin">Platform demo administration ↗</Link></p>}
 </main></div>;
}
