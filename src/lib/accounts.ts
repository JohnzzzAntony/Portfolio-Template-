import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const account = cache(async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "ADMIN") redirect("/admin");
  return session;
});
export const paidAccount = cache(async () => {
  const session = await account();
  const purchase = await prisma.purchase.findFirst({ where: { userId: session.sub, status: "PAID" } });
  if (!purchase) redirect("/dashboard");
  return session;
});
export async function ownedPortfolio() {
  const user = await paidAccount();
  const portfolio = await prisma.portfolio.findUnique({ where: { ownerId: user.sub } });
  if (!portfolio) throw new Error("Portfolio not found.");
  return portfolio;
}
