import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PlatformHeader } from "@/components/platform/Chrome";
import { RegisterForm } from "./RegisterForm";
export const metadata = { title: "Create an account — Forma", robots: { index: false } };
export default async function RegisterPage() {
 if (await getSession()) redirect("/dashboard");
 return <div className="platform"><PlatformHeader /><main className="auth-shell"><div><p className="platform-kicker">/01 — Your next chapter</p><h1>Your work.<br/>Your space.</h1><p>Create an account, unlock the template with a one-time payment, and make it yours.</p><Link href="/template" className="text-link">Explore the template ↗</Link></div><section className="auth-card"><h2>Start with an account.</h2><RegisterForm /><p className="platform-muted">Already registered? <Link href="/login">Sign in</Link></p></section></main></div>;
}
