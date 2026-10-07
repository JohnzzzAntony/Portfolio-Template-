"use server";

import { revalidatePath } from "next/cache";

import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleRead(id: string, read: boolean) {
  await requireSession();
  await prisma.contactSubmission.update({ where: { id }, data: { read } });
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}

export async function deleteSubmission(id: string) {
  await requireSession();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
