type IconProps = { className?: string };

const base = { fill: "none", stroke: "currentColor", "aria-hidden": true } as const;

/** Four-point spark that flanks button labels. */
export function Spark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 0c.35 4.1 3.9 7.65 8 8-4.1.35-7.65 3.9-8 8-.35-4.1-3.9-7.65-8-8 4.1-.35 7.65-3.9 8-8Z" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.8}>
      <path d="M7 17 17 7M8.5 7H17v8.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowDownRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.6}>
      <path d="M7 7l10 10M17 8.5V17H8.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowUp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2}>
      <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="square" />
    </svg>
  );
}

export function Globe({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.4}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5S9.6 5.9 12 3.5Z" />
    </svg>
  );
}

/** Rotating burst at the end of the nav. */
export function Burst({ className }: IconProps) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 15);
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      {rays.map((r) => (
        <rect key={r} x="11.3" y="1" width="1.4" height="22" rx=".7" transform={`rotate(${r} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden="true">
      <rect width="5" height="5" rx="1" /><rect x="7" width="5" height="5" rx="1" />
      <rect y="7" width="5" height="5" rx="1" /><rect x="7" y="7" width="5" height="5" rx="1" />
    </svg>
  );
}

export function ListIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden="true">
      <rect width="12" height="2.4" rx="1" /><rect y="4.8" width="12" height="2.4" rx="1" /><rect y="9.6" width="12" height="2.4" rx="1" />
    </svg>
  );
}

export function Mail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.5}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </svg>
  );
}

export function Pin({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.5}>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.8" r="2.3" />
    </svg>
  );
}

export function Phone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={1.5}>
      <path d="M5 4h4l1.5 4-2.2 1.4a11 11 0 0 0 6.3 6.3L16 13.5l4 1.5v4a1.5 1.5 0 0 1-1.6 1.5C10.6 20 4 13.4 3.5 5.6A1.5 1.5 0 0 1 5 4Z" />
    </svg>
  );
}
