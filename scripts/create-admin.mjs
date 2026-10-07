/**
 * Creates (or resets the password of) the operator account without touching
 * any content. Reads ADMIN_EMAIL and ADMIN_PASSWORD from the environment.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='…' npm run admin:create
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

try { process.loadEnvFile(); } catch { /* variables may come from the host */ }
const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "";
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Set ADMIN_EMAIL to the operator's email address.");
if (password.length < 12 || password === "ChangeMe123!") throw new Error("Set ADMIN_PASSWORD to a unique password of at least 12 characters.");

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash(password, 12);
await prisma.user.upsert({
  where: { email },
  update: { passwordHash, role: "ADMIN" },
  create: { email, name: "Studio Admin", role: "ADMIN", passwordHash },
});
await prisma.$disconnect();
console.log(`Operator account ready: ${email}. Remove ADMIN_PASSWORD from the environment now.`);
