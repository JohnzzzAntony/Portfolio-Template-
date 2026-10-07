"use client";

import { Button } from "@/components/ui/Button";

/** Per-route boundary for the public site — keeps the shell and design intact. */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-[var(--m-medium)] px-[var(--page-x)] text-center">
      <h1 className="t-page-title">Error</h1>
      <p className="t-para-md max-w-[40ch]">
        Something went wrong loading this page.
      </p>
      {error.digest && (
        <p className="t-caption text-muted">Reference: {error.digest}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="secondary" spark={false}>
          Back to home
        </Button>
      </div>
    </section>
  );
}
