"use server";
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { starterContent } from "@/lib/portfolio-content";
const schema = z.object({
  name: z.string().trim().min(2).max(80), email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(12, "Use at least 12 characters.").refine(v => Buffer.byteLength(v) <= 72, "Use at most 72 bytes."),
});
export type RegistrationState = { error: string };
export async function register(_state: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000).ok) return { error: "Too many registrations. Please try again in an hour." };
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // Validate configuration before storing the account so a missing secret cannot strand registration.
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) return { error: "Registration is temporarily unavailable." };
  let user;
  try {
    user = await prisma.user.create({ data: {
      name: parsed.data.name, email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password), role: "EDITOR",
      portfolio: { create: { slug: `portfolio-${randomUUID().slice(0, 12)}`, content: JSON.stringify(starterContent) } },
    } });
  } catch { return { error: "Could not create an account. Try signing in if you already registered." }; }
  await createSession({ sub: user.id, name: user.name, email: user.email, role: user.role });
  redirect("/dashboard");
}
