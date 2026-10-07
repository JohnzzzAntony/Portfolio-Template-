import "server-only";

import { slugify } from "@/lib/utils";

import type { Field, Resource } from "./resources";

/**
 * Converts a submitted FormData into a Prisma `data` object using the
 * resource's field definitions. Anything not declared as a field is ignored,
 * so a crafted request can't write to columns the editor doesn't expose.
 */
export function formDataToData(resource: Resource, formData: FormData) {
  const data: Record<string, unknown> = {};
  let relations: { services?: { set: { id: string }[] } } = {};

  for (const field of resource.fields) {
    const raw = formData.get(field.name);

    switch (field.type) {
      case "boolean":
        // Unchecked checkboxes submit nothing.
        data[field.name] = formData.get(field.name) === "on";
        break;

      case "number":
        data[field.name] = Number(raw ?? 0) || 0;
        break;

      case "date": {
        const value = String(raw ?? "").trim();
        data[field.name] = value ? new Date(value) : new Date();
        break;
      }

      case "list":
        // Stored as a JSON-encoded string — SQLite has no native array type.
        data[field.name] = JSON.stringify(
          String(raw ?? "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        );
        break;

      case "services": {
        const ids = formData.getAll(field.name).map(String).filter(Boolean);
        relations = { services: { set: ids.map((id) => ({ id })) } };
        break;
      }

      case "slug": {
        const value = String(raw ?? "").trim();
        const source = field.from ? String(formData.get(field.from) ?? "") : "";
        data[field.name] = slugify(value || source);
        break;
      }

      default:
        data[field.name] = String(raw ?? "").trim();
    }
  }

  return { ...data, ...relations };
}

/**
 * Parses a fetched record's JSON-encoded "list" fields back into arrays so
 * the edit form can pre-fill them (the DB column stores a JSON string).
 */
export function deserializeRecord(resource: Resource, record: Record<string, unknown>) {
  const out = { ...record };
  for (const field of resource.fields) {
    if (field.type !== "list") continue;
    const raw = out[field.name];
    if (typeof raw !== "string") continue;
    try {
      out[field.name] = JSON.parse(raw);
    } catch {
      out[field.name] = [];
    }
  }
  return out;
}

export function validate(resource: Resource, data: Record<string, unknown>) {
  const errors: Record<string, string> = {};

  for (const field of resource.fields) {
    if (!field.required) continue;
    const value = data[field.name];
    if (typeof value === "string" && value.trim() === "") {
      errors[field.name] = `${field.label} is required.`;
    }
  }

  return errors;
}

export function defaultsFor(fields: Field[]) {
  return Object.fromEntries(
    fields.map((field) => {
      switch (field.type) {
        case "boolean":
          return [field.name, field.name === "published" || field.name === "visible"];
        case "number":
          return [field.name, 0];
        case "list":
          return [field.name, []];
        case "date":
          return [field.name, new Date()];
        default:
          return [field.name, ""];
      }
    }),
  );
}
