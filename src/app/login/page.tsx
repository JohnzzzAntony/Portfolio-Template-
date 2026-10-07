import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PlatformShell } from "@/components/platform/Chrome";
import { LoginForm } from "@/app/admin/login/LoginForm";
export const metadata = { title: "Sign in — Forma", robots: { index: false } };
export default async function LoginPage() {
 if (await getSession()) redirect("/dashboard");
 return <PlatformShell><div className="auth-shell"><div className="auth-intro"><p className="platform-kicker" data-ix="fade">(Welcome back)</p><h1 className="platform-title" data-ix="lines">Keep making your mark.</h1><p className="platform-lede" data-ix="fade-up">Your portfolio is waiting right where you left it.</p></div><section className="auth-card auth-dark" data-ix="fade-up" data-ix-delay="0.2"><h2>Sign in to Forma.</h2><LoginForm /><p className="mt-6 platform-muted">New here? <Link href="/register" className="text-link">Create an account</Link></p></section></div></PlatformShell>;
}
