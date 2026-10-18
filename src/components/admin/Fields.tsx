"use client";

import { useState } from "react";

import type { Field } from "@/lib/admin/resources";
import { cn } from "@/lib/utils";

type Props = {
  field: Field;
  value: unknown;
  error?: string;
  /** Options for relation pickers (currently the services multi-select). */
  options?: { id: string; label: string }[];
  selected?: string[];
};

const inputBase =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none " +
  "focus:border-ink focus:ring-1 focus:ring-ink";

export function FieldInput({ field, value, error, options, selected }: Props) {
  const id = `field-${field.name}`;
  const describedBy = [
    field.help ? `${id}-help` : null,
    error ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <Control
        id={id}
        field={field}
        value={value}
        options={options}
        selected={selected}
        invalid={!!error}
        describedBy={describedBy || undefined}
      />

      {field.help && (
        <p id={`${id}-help`} className="text-xs text-neutral-500">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function Control({
  id,
  field,
  value,
  options,
  selected,
  invalid,
  describedBy,
}: {
  id: string;
  field: Field;
  value: unknown;
  options?: { id: string; label: string }[];
  selected?: string[];
  invalid: boolean;
  describedBy?: string;
}) {
  const cls = cn(inputBase, invalid && "border-red-500");

  switch (field.type) {
    case "boolean":
      return (
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={Boolean(value)}
          aria-describedby={describedBy}
          className="size-4 self-start accent-black"
        />
      );

    case "number":
      return (
        <input
          id={id}
          name={field.name}
          type="number"
          defaultValue={Number(value ?? 0)}
          aria-describedby={describedBy}
          className={cls}
        />
      );

    case "date":
      return (
        <input
          id={id}
          name={field.name}
          type="date"
          defaultValue={toDateInput(value)}
          aria-describedby={describedBy}
          className={cls}
        />
      );

    case "textarea":
      return (
        <textarea
          id={id}
          name={field.name}
          rows={3}
          defaultValue={String(value ?? "")}
          aria-describedby={describedBy}
          className={cn(cls, "resize-y")}
        />
      );

    case "longtext":
      return (
        <textarea
          id={id}
          name={field.name}
          rows={8}
          defaultValue={String(value ?? "")}
          aria-describedby={describedBy}
          className={cn(cls, "resize-y font-mono text-[13px]")}
        />
      );

    case "list":
      return (
        <textarea
          id={id}
          name={field.name}
          rows={5}
          defaultValue={Array.isArray(value) ? value.join("\n") : ""}
          aria-describedby={describedBy}
          placeholder="One item per line"
          className={cn(cls, "resize-y")}
        />
      );

    case "image":
      return (
        <ImageField id={id} name={field.name} value={String(value ?? "")} describedBy={describedBy} invalid={invalid} />
      );

    case "services":
      return (
        <fieldset
          id={id}
          className="flex flex-wrap gap-2 rounded-md border border-neutral-300 bg-white p-3"
        >
          <legend className="sr-only">{field.label}</legend>
          {options?.length ? (
            options.map((option) => (
              <label
                key={option.id}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.id}
                  defaultChecked={selected?.includes(option.id)}
                  className="size-3.5 accent-black"
                />
                {option.label}
              </label>
            ))
          ) : (
            <span className="text-sm text-neutral-500">
              No services yet — add some under Collections → Services.
            </span>
          )}
        </fieldset>
      );

    default:
      return (
        <input
          id={id}
          name={field.name}
          type={field.type === "url" ? "url" : "text"}
          defaultValue={String(value ?? "")}
          aria-describedby={describedBy}
          className={cls}
        />
      );
  }
}

/** URL input with direct file upload and live image/video preview. */
function ImageField({
  id,
  name,
  value,
  describedBy,
  invalid,
}: {
  id: string;
  name: string;
  value: string;
  describedBy?: string;
  invalid: boolean;
}) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const isVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <input
            id={id}
            name={name}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/files/example.webp, .mp4 or https://…"
            aria-describedby={describedBy}
            className={cn(inputBase, invalid && "border-red-500")}
          />
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-neutral-300 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-200">
              <span>{uploading ? "Uploading…" : "📁 Upload Image / Video"}</span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-neutral-500 hover:text-red-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded border border-neutral-200 bg-neutral-900">
          {url ? (
            isVideo ? (
              <video
                src={url}
                className="size-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary preview URL
              <img src={url} alt="" className="size-full object-cover" />
            )
          ) : (
            <span className="text-[10px] text-neutral-400">none</span>
          )}
        </span>
      </div>

      {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
    </div>
  );
}

function toDateInput(value: unknown) {
  if (!value) return "";
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
