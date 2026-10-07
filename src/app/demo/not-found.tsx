import { Button } from "@/components/ui/Button";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-[var(--m-medium)] px-[var(--page-x)] text-center">
      <h1 className="t-page-title">404</h1>
      <p className="t-para-md max-w-[36ch]">
        That page doesn&rsquo;t exist — it may have moved, or never shipped.
      </p>
      <Button href="/">Back to home</Button>
    </section>
  );
}
