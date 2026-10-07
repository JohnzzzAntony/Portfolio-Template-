"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { FieldInput } from "@/components/admin/Fields";
import type { Field } from "@/lib/admin/resources";

import { initialPageState } from "@/lib/admin/state";

import { savePage } from "../actions";

type Section = {
  id: string;
  key: string;
  label: string;
  index: string;
  heading: string;
  subheading: string;
  body: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  visible: boolean;
};

type Page = {
  id: string;
  key: string;
  name: string;
  title: string;
  metaLeft: string;
  metaRight: string;
  heroImage: string;
  heroImageMobile: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  sections: Section[];
};

const PAGE_FIELDS: Field[] = [
  {
    name: "title",
    label: "Page title",
    type: "textarea",
    help: "Rendered at the largest size. Use line breaks to control how it wraps.",
  },
  { name: "metaLeft", label: "Meta (left)", type: "text" },
  { name: "metaRight", label: "Meta (right)", type: "text" },
  { name: "heroImage", label: "Hero image", type: "image" },
  { name: "heroImageMobile", label: "Hero image (mobile)", type: "image" },
  { name: "seoTitle", label: "SEO title", type: "text" },
  { name: "seoDescription", label: "SEO description", type: "textarea" },
  { name: "ogImage", label: "Social share image", type: "image" },
];

const SECTION_FIELDS: Field[] = [
  { name: "label", label: "Eyebrow", type: "text", help: 'The parenthesised "(About)" label.' },
  { name: "index", label: "Index", type: "text", help: 'The "/01" counter.' },
  { name: "heading", label: "Heading", type: "textarea" },
  { name: "subheading", label: "Subheading", type: "textarea" },
  { name: "body", label: "Body", type: "longtext", help: "Line breaks become separate animated lines." },
  { name: "image", label: "Image", type: "image" },
  { name: "ctaLabel", label: "CTA label", type: "text" },
  { name: "ctaUrl", label: "CTA link", type: "text" },
];

export function PageEditor({ page }: { page: Page }) {
  const action = savePage.bind(null, page.id);
  const [state, formAction] = useActionState(action, initialPageState);

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
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

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Hero & metadata
        </h2>
        <div className="grid gap-5">
          {PAGE_FIELDS.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={page[field.name as keyof Page]}
            />
          ))}
        </div>
      </section>

      {page.sections.map((section) => (
        <fieldset
          key={section.id}
          className="rounded-lg border border-neutral-200 bg-white p-6"
        >
          <input type="hidden" name="sectionId" value={section.id} />

          <legend className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            {section.key}
          </legend>

          <label className="mb-5 mt-2 inline-flex items-center gap-2 text-sm font-normal normal-case">
            <input
              type="checkbox"
              name={`section.${section.id}.visible`}
              defaultChecked={section.visible}
              className="size-4 accent-black"
            />
            Show this section
          </label>

          <div className="grid gap-5">
            {SECTION_FIELDS.map((field) => (
              <FieldInput
                key={field.name}
                field={{ ...field, name: `section.${section.id}.${field.name}` }}
                value={section[field.name as keyof Section]}
              />
            ))}
          </div>
        </fieldset>
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
      className="sticky bottom-4 inline-flex h-10 items-center self-start rounded-md bg-ink px-5 text-sm font-medium text-paper shadow-lg disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save page"}
    </button>
  );
}
