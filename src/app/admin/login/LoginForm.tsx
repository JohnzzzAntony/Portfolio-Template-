"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "./actions";

const initial: LoginState = { error: "" };

export function LoginForm() {
  const [state, action] = useActionState(login, initial);

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="h-11 rounded border border-white/25 bg-transparent px-3 text-base outline-none focus:border-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Password
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded border border-white/25 bg-transparent px-3 text-base outline-none focus:border-white"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded bg-[var(--color-error-bg)] px-3 py-2 text-sm text-[var(--color-error)]">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 h-11 rounded bg-paper text-sm font-medium uppercase tracking-wide text-ink disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
