import Link from "@/components/layout/SiteLink";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "dark";
type Size = "md" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-[0.6em] " +
  "rounded-[var(--radius-pill)] uppercase whitespace-nowrap " +
  "transition-colors duration-300 ease-out";

const variants: Record<Variant, string> = {
  primary: "bg-paper text-ink hover:bg-ink hover:text-paper",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  light:
    "bg-transparent text-paper border border-paper hover:bg-paper hover:text-ink",
  dark: "bg-ink text-paper hover:bg-paper hover:text-ink border border-ink",
};

const sizes: Record<Size, string> = {
  md: "h-[var(--btn-h)] px-[var(--btn-px)] py-[var(--btn-py)]",
  sm: "h-[var(--btn-h-sm)] px-[var(--btn-px-sm)]",
};

/**
 * The label is rendered twice inside a clipped box: the visible copy slides up
 * and out on hover while the duplicate slides in from below. This is the
 * source's signature button interaction.
 */
function SlidingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block overflow-hidden leading-[1.4em]">
      <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}

function Spark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-[0.9em] shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0c.3 3.9 4.1 7.7 8 8-3.9.3-7.7 4.1-8 8-.3-3.9-4.1-7.7-8-8 3.9-.3 7.7-4.1 8-8Z" />
    </svg>
  );
}

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  spark?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  href,
  variant = "secondary",
  size = "md",
  spark = true,
  className,
  type = "button",
  disabled,
  onClick,
}: Props) {
  const content = (
    <>
      {spark && <Spark className="transition-transform duration-500 group-hover:rotate-180" />}
      <SlidingLabel>{children}</SlidingLabel>
      {spark && <Spark className="transition-transform duration-500 group-hover:-rotate-180" />}
    </>
  );

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    "text-[length:var(--fs-button)] font-medium tracking-[var(--ls-8)]",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}

/** Circular arrow button used on project cards and the mission block. */
export function ArrowButton({
  className,
  size = 44,
  dark = false,
}: {
  className?: string;
  size?: number;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-transform duration-500 ease-out group-hover:rotate-45",
        dark ? "bg-ink text-paper" : "bg-paper text-ink",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-[45%]" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="square" />
      </svg>
    </span>
  );
}
