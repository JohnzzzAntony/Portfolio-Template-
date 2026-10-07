import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PlatformShell } from "@/components/platform/Chrome";
import { RegisterForm } from "./RegisterForm";
export const metadata = { title: "Create an account — Forma", robots: { index: false } };
export default async function RegisterPage() {
 if (await getSession()) redirect("/dashboard");
 return <PlatformShell><div className="auth-shell"><div className="auth-intro"><p className="platform-kicker" data-ix="fade">/01 — Your next chapter</p><h1 className="platform-title" data-ix="lines">Your work. Your space.</h1><p className="platform-lede" data-ix="fade-up">Create an account, unlock the template with a one-time payment, and make it yours.</p><div data-ix="fade-up" data-ix-delay="0.2"><Link href="/template" className="platform-link">Explore the template ↗</Link></div></div><section className="auth-card" data-ix="fade-up" data-ix-delay="0.2"><h2>Start with an account.</h2><RegisterForm /><p className="platform-muted">Already registered? <Link href="/login" className="text-link">Sign in</Link></p></section></div></PlatformShell>;
}
