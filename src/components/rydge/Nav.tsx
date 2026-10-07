"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Burst, Globe } from "./icons";
import { A, SlideText } from "./ui";

export type NavItem = { label: string; href: string };

/**
 * Logo, live coordinates, slide-up links and a rotating burst. Over a dark hero
 * it floats transparently in white; elsewhere it sits in the flow in black.
 */
export function Nav({ brand, location, items, overlay: overlayProp = false, icon, base = "" }: { brand: string; location?: string; items: NavItem[]; overlay?: boolean | string[]; icon?: { href: string; label: string }; base?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = pathname.replace(/^\/demo(?=\/|$)/, "") || "/";
  const overlay = Array.isArray(overlayProp) ? overlayProp.includes(current) : overlayProp;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => {
    if (!href.startsWith("/")) return false;
    const path = href.split("#")[0];
    return path === "/" ? current === "/" : current.startsWith(path);
  };

  return (
    <header className={cn("nav", overlay && "overlay")} data-ix={overlay ? "fade-down" : undefined} data-ix-delay={overlay ? "1.2" : undefined}>
      <div className="container-fluid">
        <div className="nav-inner">
          <A href={base || "/"} className="nav-logo" aria-label={`${brand} home`}>{brand}<span>.</span></A>
          {location && (
            <div className="nav-location"><Globe />{location}</div>
          )}
          <nav id="site-menu" className={cn("nav-menu", open && "is-open")} aria-label="Primary">
            {items.map((item) => (
              <A key={item.href + item.label} href={item.href} className="nav-link" aria-current={active(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>
                <SlideText>{item.label}</SlideText>
              </A>
            ))}
            {icon && (
              <A href={icon.href} className="nav-icon" aria-label={icon.label} onClick={() => setOpen(false)}>
                <Burst /><span className="nav-icon-text">{icon.label}</span>
              </A>
            )}
          </nav>
          <button type="button" className="menu-button" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            <span className="menu-icon"><span /><span /><span /></span>
          </button>
        </div>
      </div>
    </header>
  );
}
