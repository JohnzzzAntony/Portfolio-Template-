"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { authenticate, createSession, destroySession } from "@/lib/auth";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).refine(value => Buffer.byteLength(value) <= 72),
});

export type LoginState = { error: string };

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

/** Best-effort client identity for rate limiting. */
async function clientKey() {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || list.get("x-real-ip") || "unknown";
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const key = `login:${await clientKey()}`;
  const limit = rateLimit(key, MAX_ATTEMPTS, WINDOW_MS);

  if (!limit.ok) {
    const minutes = Math.ceil(limit.retryAfter / 60);
    return {
      error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // Deliberately vague: never reveal whether the email exists.
  if (!parsed.success) return { error: "Invalid email or password." };

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return { error: "Invalid email or password." };

  resetRateLimit(key);

  await createSession({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
