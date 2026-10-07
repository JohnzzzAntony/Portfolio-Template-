"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth";
import type { SettingsState } from "@/lib/admin/state";
import { prisma } from "@/lib/prisma";

import { GROUPS } from "./fields";

export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireSession();

  // Only the declared keys are written — nothing else from the request body.
  const data: Record<string, string> = {};
  for (const group of GROUPS) {
    for (const field of group.fields) {
      data[field.name] = String(formData.get(field.name) ?? "").trim();
    }
  }

  try {
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });
  } catch {
    return { status: "error", message: "Could not save settings." };
  }

  revalidatePath("/", "layout");
  return { status: "saved", message: "Settings saved." };
}
