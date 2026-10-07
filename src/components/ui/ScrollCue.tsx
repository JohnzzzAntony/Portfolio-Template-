import { cn } from "@/lib/utils";

export function ScrollCue({ className }: { className?: string }) {
  return (
    <span className={cn("t-caption inline-flex items-center gap-2", className)}>
      Scroll Down
      <svg
        viewBox="0 0 24 24"
        className="size-[1em] animate-[nudge_1.8s_ease-in-out_infinite]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M7 7l10 10M17 9v8H9" strokeLinecap="square" />
      </svg>
    </span>
  );
}
