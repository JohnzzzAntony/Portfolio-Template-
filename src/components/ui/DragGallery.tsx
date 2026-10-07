"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type Item = { id: string; url: string; alt: string };

/**
 * Pointer-draggable horizontal strip with momentum — the "Drag cards"
 * playground and the hero image rail. Falls back to native horizontal
 * scrolling (and keyboard scrolling) when pointer events aren't used.
 */
export function DragGallery({
  items,
  className,
  itemClassName,
}: {
  items: Item[];
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let velocity = 0;
    let raf = 0;

    const glide = () => {
      velocity *= 0.94;
      if (Math.abs(velocity) < 0.2) return;
      el.scrollLeft -= velocity;
      raf = requestAnimationFrame(glide);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      startX = lastX = e.clientX;
      startScroll = el.scrollLeft;
      velocity = 0;
      cancelAnimationFrame(raf);
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = startScroll - (e.clientX - startX);
      velocity = e.clientX - lastX;
      lastX = e.clientX;
    };

    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
      if (e.type !== "pointercancel" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(glide);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      aria-label="Draggable image gallery"
      className={cn(
        "flex cursor-grab gap-[var(--gutter-x)] overflow-x-auto overscroll-x-contain",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {items.map((item) => (
        <figure
          key={item.id}
          className={cn("shrink-0 select-none", itemClassName)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
          <img
            src={item.url}
            alt={item.alt}
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
