/**
 * Form state shapes and their initial values.
 *
 * These live outside the `"use server"` action files on purpose: such a file
 * may only export async functions, so a plain `const` initial state has to be
 * imported from a normal module.
 */

export type FormState = {
  status: "idle" | "error";
  message: string;
  errors?: Record<string, string>;
};

export const emptyState: FormState = { status: "idle", message: "" };

export type SettingsState = {
  status: "idle" | "saved" | "error";
  message: string;
};

export const initialSettingsState: SettingsState = { status: "idle", message: "" };

export type PageState = { status: "idle" | "saved" | "error"; message: string };

export const initialPageState: PageState = { status: "idle", message: "" };

export type UploadState = { status: "idle" | "saved" | "error"; message: string };

export const initialUploadState: UploadState = { status: "idle", message: "" };
