"use client";

import { useEffect, useState } from "react";

import { prefersReducedMotion } from "@/lib/gsap";

/** Full-bleed cross-fading project covers behind the portfolio hero. */
export function WorkSlides({ images, interval = 4500 }: { images: string[]; interval?: number }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);
  return (
    <div className="work-slides" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- CMS supplied */}
      {images.map((src, i) => <img key={src + i} src={src} alt="" className={i === active ? "is-active" : undefined} loading={i === 0 ? "eager" : "lazy"} />)}
    </div>
  );
}
