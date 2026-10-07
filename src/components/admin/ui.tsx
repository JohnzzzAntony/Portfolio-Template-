import Link from "next/link";

import { cn } from "@/lib/utils";

export function PageTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 max-w-prose text-sm text-neutral-600">{description}</p>
        )}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-neutral-200 bg-white", className)}>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  href,
  type = "button",
  variant = "primary",
  name,
  value,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  name?: string;
  value?: string;
  className?: string;
}) {
  const classes = cn(
    "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
    variant === "primary" && "bg-ink text-paper hover:bg-neutral-800",
    variant === "ghost" && "border border-neutral-300 bg-white hover:bg-neutral-50",
    variant === "danger" && "border border-red-300 text-red-700 hover:bg-red-50",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} name={name} value={value} className={classes}>
      {children}
    </button>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
      {message}
    </p>
  );
}
