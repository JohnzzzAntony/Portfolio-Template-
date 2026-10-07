import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");

  return (
    <main className="grid min-h-svh place-items-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <h1 className="text-[2rem] font-semibold tracking-[var(--ls-3)]">
          Studio admin
        </h1>
        <p className="mt-2 text-sm opacity-60">
          Sign in to edit the site content.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
