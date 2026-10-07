import { cn } from "@/lib/utils";

/**
 * The parenthesised eyebrow + "/0N" counter that opens every major section.
 * Load-bearing to the aesthetic, not decoration.
 */
export function SectionHeader({
  label,
  index,
  className,
}: {
  label?: string | null;
  index?: string | null;
  className?: string;
}) {
  if (!label && !index) return null;

  return (
    <div
      className={cn(
        "hairline flex items-baseline justify-between gap-4 pt-[var(--m-xs)]",
        className,
      )}
    >
      <span className="t-caption">{label}</span>
      {index && <span className="t-caption tabular-nums">{index}</span>}
    </div>
  );
}
