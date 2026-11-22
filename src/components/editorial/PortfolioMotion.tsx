"use client";

import { useEffect, useRef, useState } from "react";

/** Original brand animation. Project visuals are supplied separately by captures. */
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
    <section className="portfolio-motion" aria-label="Digital craft motion study">
      <video ref={ref} loop muted playsInline preload="none" poster="/images/portfolio-art/orbital-systems.png" aria-label="Chrome sculpture rotating within lime orbital lines. Systems. With soul.">
        <source src="/videos/orbital-systems.webm" type="video/webm" />
        <source src="/videos/orbital-systems.mp4" type="video/mp4" />
      </video>
      <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}</button>
    </section>
  );
}
