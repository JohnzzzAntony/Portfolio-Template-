"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { initialUploadState } from "@/lib/admin/state";

import { uploadMedia } from "./actions";

export function UploadForm() {
  const [state, action] = useActionState(uploadMedia, initialUploadState);

  return (
    <form
      action={action}
      className="flex flex-wrap items-end gap-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        File
        <input
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="text-sm file:mr-3 file:rounded file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:text-paper"
        />
      </label>

      <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
        Alt text
        <input
          name="alt"
          type="text"
          placeholder="Describe the image"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
      </label>

      <Submit />

      {state.status !== "idle" && (
        <p
          role="status"
          className={
            state.status === "saved"
              ? "w-full text-sm text-green-700"
              : "w-full text-sm text-red-700"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
    >
      {pending ? "Uploading…" : "Upload"}
    </button>
  );
}
