"use server";
import { redirect } from "next/navigation";
import { account } from "@/lib/accounts";
import { prisma } from "@/lib/prisma";
import { acquireCheckoutLock, fulfillCheckout, paymentsConfigured, siteOrigin, stripeClient } from "@/lib/payments";
import { rateLimit } from "@/lib/rate-limit";

export async function checkout() {
  const user = await account();
  if (await prisma.purchase.findFirst({ where: { userId: user.sub, status: "PAID" } })) redirect("/dashboard/editor");
  if (!paymentsConfigured()) redirect("/dashboard?notice=unavailable");
  if (!rateLimit(`checkout:${user.sub}`, 5, 60000).ok) redirect("/dashboard?notice=rate");
  let destination: string | null = null;
  const release = await acquireCheckoutLock(user.sub);
  try {
    const stripe = stripeClient();
    const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!);
    if (!price.active || price.type !== "one_time" || !price.unit_amount || price.unit_amount < 1) throw new Error("Configure an active, positive one-time price.");
    let purchase = await prisma.purchase.findFirst({ where: { userId: user.sub, status: "PENDING", priceId: price.id }, orderBy: { createdAt: "desc" } });
    if (purchase?.checkoutId) {
      const session = await stripe.checkout.sessions.retrieve(purchase.checkoutId);
      if (session.status === "open" && session.url) destination = session.url;
      else if (session.status === "complete") {
        destination = await fulfillCheckout(session.id, user.sub) ? "/dashboard/editor" : "/dashboard?notice=pending";
      }
      else purchase = null;
    }
    if (!destination) {
      // A deterministic attempt id makes concurrent requests reuse the same
      // Stripe idempotency key on this one-instance deployment.
      if (!purchase) {
        const attempt = await prisma.purchase.count({ where: { userId: user.sub, priceId: price.id } });
        const id = `checkout-${user.sub}-${price.id}-${attempt}`;
        purchase = await prisma.purchase.upsert({ where: { id }, create: { id, userId: user.sub, priceId: price.id }, update: {} });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "payment", client_reference_id: user.sub, customer_email: user.email,
        line_items: [{ price: price.id, quantity: 1 }], metadata: { product: "forma-portfolio", purchaseId: purchase.id },
        success_url: `${siteOrigin()}/dashboard?checkout={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteOrigin()}/dashboard?notice=cancelled`,
      }, { idempotencyKey: `forma:${purchase.id}` });
      await prisma.purchase.update({ where: { id: purchase.id }, data: { checkoutId: session.id } });
      destination = session.url;
    }
  } catch { redirect("/dashboard?notice=unavailable"); }
  finally { release(); }
  if (!destination) redirect("/dashboard?notice=unavailable");
  redirect(destination);
}
