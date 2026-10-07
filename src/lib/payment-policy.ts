import type Stripe from "stripe";

/** This policy only accepts a Session retrieved server-side from Stripe. */
export function paymentMatches(session: Stripe.Checkout.Session, purchase: { userId: string; priceId: string; status: string }) {
  if (purchase.status === "REVOKED" || session.mode !== "payment" || session.payment_status !== "paid" || session.client_reference_id !== purchase.userId) return false;
  const lines = session.line_items?.data;
  if (lines?.length !== 1 || lines[0].price?.id !== purchase.priceId || lines[0].quantity !== 1) return false;
  const intent = session.payment_intent;
  if (!intent || typeof intent === "string") return false;
  const charge = intent.latest_charge;
  return !!charge && typeof charge !== "string" && !charge.refunded && charge.amount_refunded === 0 && !charge.disputed;
}
