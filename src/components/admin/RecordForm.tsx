"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { emptyState, type FormState } from "@/lib/admin/state";
import type { Field } from "@/lib/admin/resources";

import { FieldInput } from "./Fields";

type Props = {
  fields: Field[];
  record: Record<string, unknown>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  cancelHref: string;
  serviceOptions?: { id: string; label: string }[];
  selectedServices?: string[];
  /** Rendered outside the form — delete is its own form and can't nest. */
  onDelete?: React.ReactNode;
};

export function RecordForm({
  fields,
  record,
  action,
  cancelHref,
  serviceOptions,
  selectedServices,
  onDelete,
}: Props) {
  const [state, formAction] = useActionState(action, emptyState);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-6">
        {state.status === "error" && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        )}

        <div className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-6">
          {fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={record[field.name]}
              error={state.errors?.[field.name]}
              options={serviceOptions}
              selected={selectedServices}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Save />
          <Link
            href={cancelHref}
            className="inline-flex h-9 items-center rounded-md border border-neutral-300 bg-white px-3 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>

      {onDelete && (
        <div className="flex justify-end border-t border-neutral-200 pt-6">
          {onDelete}
        </div>
      )}
    </div>
  );
}

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
