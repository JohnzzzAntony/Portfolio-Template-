"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitContact, type ContactState } from "@/app/demo/contact/actions";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle", message: "" };

export function ContactForm({ note }: { note?: string }) {
  const [state, action] = useActionState(submitContact, initial);

  return (
    <form action={action} className="flex flex-col" noValidate>
      <Field
        label="Name:"
        name="name"
        type="text"
        autoComplete="name"
        error={state.fieldErrors?.name}
      />
      <Field
        label="Email:"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
      />
      <Field
        label="Message:"
        name="message"
        textarea
        error={state.fieldErrors?.message}
      />

      {/* honeypot */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {note && (
        <p className="mt-[var(--m-small)] flex items-start gap-2 text-[length:var(--fs-caption)] text-muted">
          <svg viewBox="0 0 24 24" className="mt-[0.15em] size-[1em] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 7.5v.5" strokeLinecap="round" />
          </svg>
          {note}
        </p>
      )}

      <Submit />

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mt-[var(--m-small)] px-[var(--field-px)] py-[var(--field-py)] text-[length:var(--fs-caption)]",
          state.status === "idle" && "hidden",
          state.status === "success" && "bg-[var(--color-success-bg)] text-[var(--color-success)]",
          state.status === "error" && "bg-[var(--color-error-bg)] text-[var(--color-error)]",
        )}
      >
        {state.message}
      </p>
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-[var(--m-medium)] inline-flex h-[var(--field-h)] items-center justify-between gap-6 self-start rounded-[var(--radius-full)] bg-ink pl-[1.6em] pr-[1.2em] text-[length:var(--fs-form-button)] text-paper transition-opacity disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send Message"}
      <svg viewBox="0 0 24 24" className="size-[1em] transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="square" />
      </svg>
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  autoComplete,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const shared =
    "w-full border-0 border-b border-hairline bg-transparent px-0 py-[var(--field-py)] " +
    "text-[length:var(--fs-form)] tracking-[var(--ls-5)] outline-none " +
    "placeholder:text-[var(--color-placeholder)] focus:border-ink";

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="t-caption pt-[var(--m-base)] text-muted">
        {label}
      </label>

      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(shared, "resize-none", error && "border-[var(--color-error)]")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(shared, "h-[var(--field-h)]", error && "border-[var(--color-error)]")}
        />
      )}

      {error && (
        <span id={`${name}-error`} className="pt-2 text-[length:var(--fs-caption)] text-[var(--color-error)]">
          {error}
        </span>
      )}
    </div>
  );
}
