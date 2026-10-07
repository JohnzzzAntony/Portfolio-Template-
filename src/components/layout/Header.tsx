"use client";

import Link from "@/components/layout/SiteLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string; href: string };

/**
 * Fixed nav, transparent over the hero. Routes whose hero is dark render white
 * text until the user scrolls past it, matching the source's inversion.
 */
export function Header({
  brandName,
  brandSuffix,
  coordinates,
  items,
}: {
  brandName: string;
  brandSuffix: string;
  coordinates: string;
  items: NavItem[];
}) {
  const pathname = usePathname().replace(/^\/demo(?=\/|$)/, "") || "/";
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const darkHero = pathname === "/" || pathname.startsWith("/projects/");
  const inverted = darkHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const background = [document.querySelector("main"), document.querySelector("footer")];
    background.forEach((el) => el?.setAttribute("inert", ""));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuRef.current?.focus(); }
      if (event.key !== "Tab") return;
      const links = headerRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      const visible = Array.from(links ?? []).filter((el) => el.getClientRects().length);
      const first = visible[0], last = visible[visible.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = previous;
      background.forEach((el) => el?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[var(--nav-h)] items-center justify-between",
        "px-[var(--page-x)] transition-colors duration-500",
        open ? "bg-ink text-paper" : inverted ? "text-paper" : "bg-paper/95 text-ink",
        scrolled && !open && "bg-paper/95 backdrop-blur-md",
      )}
    >
      <Link href="/" onClick={() => setOpen(false)} className="flex items-baseline gap-[0.15em]" aria-label={`${brandName} home`}>
        <span className="text-[1.375rem] font-semibold tracking-[var(--ls-3)]">
          {brandName}
        </span>
        <span className="text-[1.375rem] font-semibold leading-none">.</span>
      </Link>

      <span className="t-caption hidden items-center gap-2 md:inline-flex">
        <svg viewBox="0 0 24 24" className="size-[1em]" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        </svg>
        {coordinates}
      </span>

      <nav className="hidden items-center gap-[1.75vw] lg:flex" aria-label="Primary">
        {items.map((item) => (
          <NavLink key={item.id} {...item} active={isActive(pathname, item.href)} />
        ))}
      </nav>

      <button
        type="button"
        ref={menuRef}
        className="t-caption min-h-11 min-w-11 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-[var(--nav-h)] z-40 flex flex-col gap-2 bg-ink px-[var(--page-x)] pt-[var(--m-medium)] overflow-y-auto text-paper lg:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setOpen(false)}
            className="t-display-sm py-3 uppercase"
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <span className="t-caption mt-auto pb-[var(--m-medium)] opacity-60">
          {brandName} {brandSuffix} — {coordinates}
        </span>
      </div>
    </header>
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({
  label,
  href,
  active,
}: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="group relative block overflow-hidden text-[length:var(--fs-nav)] uppercase tracking-[var(--ls-8)]"
    >
      <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </Link>
  );
}
