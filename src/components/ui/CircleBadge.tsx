import { cn } from "@/lib/utils";

/**
 * Rotating circular text with an arrow in the middle — the footer's "LET'S TALK
 * · SAY HELLO" badge. Characters are laid out around the circle with per-glyph
 * rotation so no SVG textPath is needed.
 */
export function CircleBadge({
  text,
  size = 150,
  className,
}: {
  text: string;
  size?: number;
  className?: string;
}) {
  const chars = Array.from(text);
  const step = 360 / chars.length;

  return (
    <span
      className={cn(
        "relative grid place-items-center rounded-full bg-ink text-paper",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 animate-[spin-slow_18s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 origin-[0_var(--r)] text-[0.6875rem] uppercase tracking-[0.06em]"
            style={
              {
                "--r": `${size / 2}px`,
                transform: `rotate(${i * step}deg)`,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        ))}
      </span>

      <svg
        viewBox="0 0 24 24"
        className="size-6 transition-transform duration-500 group-hover:rotate-45"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden="true"
      >
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="square" />
      </svg>
    </span>
  );
}
