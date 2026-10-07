"use client";
import { useState, useTransition } from "react";
import { uploadPortfolioImage } from "@/app/dashboard/editor/upload";
export function ImageUpload({ onUpload, label = "Upload image" }: { onUpload: (url: string) => void; label?: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return <div><label className="upload-control">{pending ? "Uploading…" : label}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={pending} onChange={event => {
    const file = event.target.files?.[0]; if (!file) return;
    const form = new FormData(); form.set("file", file); setError("");
    start(async () => { try { const result = await uploadPortfolioImage(form); if (result.url) onUpload(result.url); else setError(result.error || "Upload failed."); } catch { setError("Upload failed. Please sign in and try again."); } });
    event.target.value = "";
  }} /></label><p className="platform-muted">Raster images, up to 8 MB.</p>{error && <p role="alert" className="platform-error">{error}</p>}</div>;
}
