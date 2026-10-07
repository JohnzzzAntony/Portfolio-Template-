"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** Seconds for one full pass. Larger = slower. */
  speed?: number;
  reverse?: boolean;
  repeat?: number;
  className?: string;
  itemClassName?: string;
};

/**
 * Infinite horizontal marquee. Duplicates its children and translates the track
 * by exactly one copy's width, so the loop is seamless at any content length.
 */
export function Marquee({
  children,
  speed = 26,
  reverse = false,
  repeat = 4,
  className,
  itemClassName,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // The track holds two identical halves; shifting by -50% lands exactly on
      // the start of the second half, which looks identical to frame zero.
      gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        {
          xPercent: reverse ? 0 : -50,
          duration: speed,
          ease: "none",
          repeat: -1,
        },
      );
    }, track);

    return () => ctx.revert();
  }, [speed, reverse]);

  const copies = Array.from({ length: repeat });

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      aria-hidden="true"
    >
      <div ref={trackRef} className="flex w-max flex-nowrap">
        {/* two halves — each half is `repeat` copies of the content */}
        {[0, 1].map((half) => (
          <div key={half} className="flex w-max flex-nowrap">
            {copies.map((_, i) => (
              <div key={i} className={cn("shrink-0", itemClassName)}>
                {children}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
