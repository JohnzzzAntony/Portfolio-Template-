"use client";

import { useState } from "react";

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked; the filename is still visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-7 items-center rounded border border-neutral-300 px-2 text-xs hover:bg-neutral-50"
    >
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}
