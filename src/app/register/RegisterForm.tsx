"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "./actions";
function Submit() { const { pending } = useFormStatus(); return <button className="platform-button" disabled={pending}>{pending ? "Creating account…" : "Create account →"}</button>; }
export function RegisterForm() {
 const [state, action] = useActionState(register, { error: "" });
 return <form action={action} className="platform-form">
  <label>Your name<input name="name" autoComplete="name" required minLength={2} maxLength={80} /></label>
  <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
  <label>Password<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} aria-describedby="password-note" /></label>
  <p id="password-note" className="platform-muted">At least 12 characters. Use a unique password.</p>
  {state.error && <p role="alert" className="platform-error">{state.error}</p>}<Submit />
 </form>;
}
