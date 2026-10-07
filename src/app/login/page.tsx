import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PlatformHeader } from "@/components/platform/Chrome";
import { LoginForm } from "@/app/admin/login/LoginForm";
export const metadata = { title: "Sign in — Forma", robots: { index: false } };
export default async function LoginPage() {
 if (await getSession()) redirect("/dashboard");
 return <div className="platform"><PlatformHeader /><main className="auth-shell"><div><p className="platform-kicker">Welcome back</p><h1>Keep making<br/>your mark.</h1><p>Your portfolio is waiting right where you left it.</p></div><section className="auth-card auth-dark"><h2>Sign in to Forma.</h2><LoginForm /><p className="mt-6">New here? <Link href="/register" className="underline">Create an account</Link></p></section></main></div>;
}
