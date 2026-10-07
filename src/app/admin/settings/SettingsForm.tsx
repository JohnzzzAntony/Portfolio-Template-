"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { FieldInput } from "@/components/admin/Fields";

import { initialSettingsState } from "@/lib/admin/state";

import { saveSettings } from "./actions";
import { GROUPS } from "./fields";

export function SettingsForm({ settings }: { settings: Record<string, unknown> }) {
  const [state, action] = useActionState(saveSettings, initialSettingsState);

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-6">
      {state.status !== "idle" && (
        <p
          role="status"
          className={
            state.status === "saved"
              ? "rounded-md bg-green-50 px-4 py-3 text-sm text-green-800"
              : "rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
          }
        >
          {state.message}
        </p>
      )}

      {GROUPS.map((group) => (
        <section
          key={group.title}
          className="rounded-lg border border-neutral-200 bg-white p-6"
        >
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {group.title}
          </h2>
          <div className="grid gap-5">
            {group.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={settings[field.name]}
              />
            ))}
          </div>
        </section>
      ))}

      <Save />
    </form>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center self-start rounded-md bg-ink px-5 text-sm font-medium text-paper disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save settings"}
    </button>
  );
}
