"use client";

import { useEffect, useRef, useState } from "react";

/** Project showreel rendered by scripts/render-brand-films.mjs from the live-site banners. */
export function PortfolioMotion() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden && !reduced.matches && !paused) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.2 });
    observer.observe(video);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); video.pause(); };
  }, [paused]);
  return (
    <section className="portfolio-motion" aria-label="Project showreel">
      <video ref={ref} loop muted playsInline preload="none" poster="/images/brand/brand-reel-poster.webp" aria-label="Showreel of project banners: Shopify storefronts, websites and business apps by Johns Antony.">
        <source src="/videos/brand-reel.mp4" type="video/mp4" />
      </video>
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}</button>
    </section>
  );
}
