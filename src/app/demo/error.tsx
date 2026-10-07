"use client";

import { Button } from "@/components/editorial/ui";

/** Per-route boundary for the demo site — keeps the shell and design intact. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="section align-center">
      <div className="container-fluid">
        <div className="page-title-wrap"><h1 className="page-title">Error</h1></div>
        <div className="mb-medium"><p className="paragraph-medium no-indent">Something went wrong loading this page.</p></div>
        {error.digest && <p className="section-caption muted mb-small">Reference: {error.digest}</p>}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="button black" onClick={reset}><span className="button-clip"><span className="button-inner"><span className="button-label"><span>Try again</span><span aria-hidden="true">Try again</span></span></span></span></button>
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}
