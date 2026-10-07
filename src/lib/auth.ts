import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "forma_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const DUMMY_PASSWORD_HASH = bcrypt.hashSync("forma-nonexistent-account", 12);

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a 64-char hex string in .env",
    );
  }
  return new TextEncoder().encode(value);
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Reads and verifies the session cookie. Returns null when signed out. */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    // Password changes revoke older sessions; role changes apply immediately.
    if (!payload.iat || Math.floor(user.updatedAt.getTime() / 1000) > payload.iat) return null;
    return { sub: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
});

/** Throws if not signed in — use at the top of every admin action. */
export async function requireUser() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function authenticate(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  // Always run a compare so a missing user and a wrong password take the
  // same time — otherwise the response time leaks which emails exist.
  const hash =
    user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const ok = await verifyPassword(password, hash);
  if (!user || !ok) return null;
  return user;
}

/** Platform CMS is never accessible to customer accounts. */
export async function requireSession() {
  const session = await requireUser();
  if (session.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}
