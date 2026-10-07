"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSession } from "@/lib/auth";
import { formDataToData, validate } from "@/lib/admin/form";
import { RESOURCES, isResourceKey, type ResourceKey } from "@/lib/admin/resources";
import type { FormState } from "@/lib/admin/state";
import { prisma } from "@/lib/prisma";

/** Narrow accessor for the dynamic model delegates the admin drives. */
type Delegate = {
  create: (args: { data: Record<string, unknown> }) => Promise<{ id: string }>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<{ id: string }>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
  findUnique: (args: {
    where: { id: string };
    include?: Record<string, boolean>;
  }) => Promise<Record<string, unknown> | null>;
  findMany: (args?: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
};

function delegateFor(key: ResourceKey): Delegate {
  const name = RESOURCES[key].delegate;
  return (prisma as unknown as Record<string, Delegate>)[name];
}

/** Every public route reads from the DB, so a write invalidates the whole site. */
function revalidateSite(key: ResourceKey) {
  revalidatePath("/", "layout");
  revalidatePath(`/admin/${key}`);
}

export async function createRecord(
  resourceKey: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  if (!isResourceKey(resourceKey)) return { status: "error", message: "Unknown collection." };

  const resource = RESOURCES[resourceKey];
  const data = formDataToData(resource, formData);
  const errors = validate(resource, data);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  // `set` is an update-only relation op; creates use `connect`.
  const services = (data as { services?: { set: { id: string }[] } }).services;
  if (services) {
    (data as Record<string, unknown>).services = { connect: services.set };
  }

  try {
    await delegateFor(resourceKey).create({ data });
  } catch (error) {
    return { status: "error", message: describe(error) };
  }

  revalidateSite(resourceKey);
  redirect(`/admin/${resourceKey}`);
}

export async function updateRecord(
  resourceKey: string,
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();
  if (!isResourceKey(resourceKey)) return { status: "error", message: "Unknown collection." };

  const resource = RESOURCES[resourceKey];
  const data = formDataToData(resource, formData);
  const errors = validate(resource, data);
  if (Object.keys(errors).length) {
    return { status: "error", message: "Please fix the highlighted fields.", errors };
  }

  try {
    await delegateFor(resourceKey).update({ where: { id }, data });
  } catch (error) {
    return { status: "error", message: describe(error) };
  }

  revalidateSite(resourceKey);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteRecord(resourceKey: string, id: string) {
  await requireSession();
  if (!isResourceKey(resourceKey)) return;

  await delegateFor(resourceKey).delete({ where: { id } });
  revalidateSite(resourceKey);
  redirect(`/admin/${resourceKey}`);
}

/** Swaps a row's `order` with its neighbour in the given direction. */
export async function moveRecord(
  resourceKey: string,
  id: string,
  direction: "up" | "down",
) {
  await requireSession();
  if (!isResourceKey(resourceKey)) return;
  if (!RESOURCES[resourceKey].sortable) return;

  const delegate = delegateFor(resourceKey);
  const rows = (await delegate.findMany({ orderBy: { order: "asc" } })) as {
    id: string;
    order: number;
  }[];

  const i = rows.findIndex((row) => row.id === id);
  const j = direction === "up" ? i - 1 : i + 1;
  if (i === -1 || j < 0 || j >= rows.length) return;

  // Rewrite the whole column from the reordered array. Seeded rows can share
  // `order` values, so a plain two-row swap wouldn't always change anything.
  const reordered = [...rows];
  [reordered[i], reordered[j]] = [reordered[j], reordered[i]];

  await prisma.$transaction(async (tx) => {
    const txDelegate = (tx as unknown as Record<string, Delegate>)[
      RESOURCES[resourceKey].delegate
    ];
    for (const [index, row] of reordered.entries()) {
      await txDelegate.update({ where: { id: row.id }, data: { order: index } });
    }
  });

  revalidateSite(resourceKey);
}

function describe(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Unique constraint")) {
    return "That slug is already taken — choose a different one.";
  }
  return "Could not save. Check the values and try again.";
}
