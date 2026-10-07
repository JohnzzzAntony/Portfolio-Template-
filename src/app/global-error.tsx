"use client";

/**
 * Last-resort boundary: catches errors thrown in the root layout itself, so it
 * has to render its own <html>/<body>. Deliberately dependency-free and
 * inline-styled — the stylesheet may be the thing that failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#000",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "clamp(2rem, 8vw, 5rem)", margin: 0, letterSpacing: "-0.04em" }}>
            Something broke
          </h1>
          <p style={{ opacity: 0.7, marginTop: "1rem" }}>
            An unexpected error stopped this page from loading.
          </p>
          {error.digest && (
            <p style={{ opacity: 0.45, fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              borderRadius: "999px",
              border: 0,
              background: "#fff",
              color: "#000",
              font: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
