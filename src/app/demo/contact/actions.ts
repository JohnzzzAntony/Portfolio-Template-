"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  message: z.string().trim().min(10, "Please tell us a little more.").max(5000),
  // Honeypot — real users never fill this.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    // A filled honeypot means a bot: report success without storing anything.
    if (flat.company) return { status: "success", message: "Thank you! Your submission has been received." };

    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
    return { status: "error", message: "Too many messages. Please try again in ten minutes." };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      },
    });
  } catch {
    return {
      status: "error",
      message: "Oops! Something went wrong while submitting the form.",
    };
  }

  return {
    status: "success",
    message: "Thank you! Your submission has been received.",
  };
}
