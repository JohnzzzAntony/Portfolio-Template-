import "server-only";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { paymentMatches } from "@/lib/payment-policy";
import { siteUrl } from "@/lib/site-url";

export function stripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Payments are not configured.");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2 });
}
export function siteOrigin() {
  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) throw new Error("Set NEXT_PUBLIC_SITE_URL.");
  const url = siteUrl();
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("Production requires HTTPS.");
  return url.origin;
}
export const paymentsConfigured = () => !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID && process.env.STRIPE_WEBHOOK_SECRET);

const checkoutLocks = new Map<string, Promise<void>>();
/** Serialize checkout creation per customer on the supported single instance. */
export async function acquireCheckoutLock(userId: string) {
  const previous = checkoutLocks.get(userId) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>(resolve => { release = resolve; });
  checkoutLocks.set(userId, current);
  await previous;
  return () => {
    release();
    if (checkoutLocks.get(userId) === current) checkoutLocks.delete(userId);
  };
}

/** Used by both signed webhooks and the authenticated return page. Never trusts the URL as proof of payment. */
export async function fulfillCheckout(checkoutId: string, userId?: string) {
  const purchase = await prisma.purchase.findUnique({ where: { checkoutId } });
  if (!purchase || (userId && purchase.userId !== userId)) return false;
  const stripe = stripeClient();
  const session = await stripe.checkout.sessions.retrieve(checkoutId, { expand: ["payment_intent.latest_charge", "line_items"] });
  if (!paymentMatches(session, purchase)) return false;
  const intent = session.payment_intent as Stripe.PaymentIntent | null;
  if (!intent || typeof intent === "string") return false;
  const result = await prisma.purchase.updateMany({
    where: { id: purchase.id, status: { not: "REVOKED" } },
    data: { status: "PAID", paymentIntentId: intent.id },
  });
  return result.count > 0;
}

export async function processStripeEvent(event: Stripe.Event) {
  if (await prisma.paymentEvent.findUnique({ where: { id: event.id } })) return;
  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    // Retry if Stripe delivers before the checkout creation transaction completes.
    if (!(await prisma.purchase.findUnique({ where: { checkoutId: session.id } }))) {
      if (session.metadata?.product === "forma-portfolio") throw new Error("Checkout is not recorded yet.");
    } else await fulfillCheckout(session.id);
  }
  if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
    const object = event.data.object as Stripe.Charge | Stripe.Dispute;
    const intent = typeof object.payment_intent === "string" ? object.payment_intent : object.payment_intent?.id;
    if (intent) await prisma.purchase.updateMany({ where: { paymentIntentId: intent }, data: { status: "REVOKED" } });
  }
  await prisma.paymentEvent.upsert({ where: { id: event.id }, create: { id: event.id, type: event.type }, update: {} });
}
