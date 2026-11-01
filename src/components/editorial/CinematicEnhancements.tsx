"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";

/**
 * Small client layer that rides on top of the interaction engine: a thin scroll
 * progress line and the condensed glass nav once the page has moved.
 */
export function CinematicEnhancements({ children }: { children: React.ReactNode }) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressBarRef.current;
    const nav = document.querySelector<HTMLElement>(".nav");
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      gsap.set(bar, { scaleX: docH > 0 ? scrollTop / docH : 0 });
      nav?.classList.toggle("is-scrolled", scrollTop > 40);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {children}
      <div className="cin-progress" aria-hidden="true">
        <div ref={progressBarRef} className="cin-progress-bar" />
      </div>
    </>
  );
}
