"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitContact, type ContactState } from "@/app/demo/contact/actions";
import { ArrowUpRight } from "@/components/editorial/icons";

const initial: ContactState = { status: "idle", message: "" };

/** Hairline fields with large type and a pill submit, posting to the CMS inbox. */
export function ContactForm({ note }: { note?: string }) {
  const [state, action] = useActionState(submitContact, initial);

  return (
    <form action={action} className="r-form" noValidate>
      <div className="r-form-row">
        <Field label="Name" name="name" autoComplete="name" placeholder="Your name" error={state.fieldErrors?.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" error={state.fieldErrors?.email} />
      </div>
      <Field label="Message" name="message" textarea placeholder="Tell us about your project" error={state.fieldErrors?.message} />

      {/* honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {note && <p className="muted" style={{ fontSize: "1rem", marginTop: "1.5rem" }}>{note}</p>}
      <Submit />
      {state.status !== "idle" && (
        <p role="status" aria-live="polite" className={state.status === "success" ? "r-notice" : "r-error"} style={{ marginTop: "1.5rem" }}>{state.message}</p>
      )}
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <div style={{ marginTop: "var(--r-m-medium)" }}>
      <button type="submit" disabled={pending} className="button black large">
        <span className="button-clip"><span className="button-inner"><span className="button-label"><span>{pending ? "Sending…" : "Send Message"}</span><span aria-hidden="true">{pending ? "Sending…" : "Send Message"}</span></span><ArrowUpRight className="button-icon" /></span></span>
      </button>
    </div>
  );
}

function Field({ label, name, type = "text", textarea, autoComplete, placeholder, error }: { label: string; name: string; type?: string; textarea?: boolean; autoComplete?: string; placeholder?: string; error?: string }) {
  const described = error ? `${name}-error` : undefined;
  return (
    <div>
      <label className="r-field" htmlFor={name}>
        <span className="r-field-label">{label}</span>
        {textarea
          ? <textarea id={name} name={name} rows={5} required placeholder={placeholder} aria-invalid={!!error} aria-describedby={described} className="r-input" />
          : <input id={name} name={name} type={type} required autoComplete={autoComplete} placeholder={placeholder} aria-invalid={!!error} aria-describedby={described} className="r-input" />}
      </label>
      {error && <span id={described} style={{ display: "block", paddingTop: "0.5rem", color: "#751515", fontSize: "1rem" }}>{error}</span>}
    </div>
  );
}
