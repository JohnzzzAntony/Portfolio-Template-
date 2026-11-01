"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { A } from "./ui";

type StatementLine = { text: string; accent?: boolean };

export function StatementSection({
  label = "(Vision)",
  lines,
  subText,
  ctaLabel,
  ctaHref,
}: {
  label?: string;
  lines: StatementLine[];
  subText?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      lineRefs.current.forEach((inner, i) => {
        if (!inner) return;
        gsap.from(inner, {
          yPercent: 110,
          duration: 1.1,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: { trigger: inner.parentElement ?? section, start: "top 78%", once: true },
        });
      });

      // Accent line reveal
      const accentLine = section.querySelector<HTMLElement>(".cs-accent-line");
      if (accentLine) {
        gsap.from(accentLine, {
          scaleY: 0,
          transformOrigin: "50% 0%",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });
      }

      // Sub-text fade
      const sub = section.querySelector<HTMLElement>(".cs-sub");
      if (sub) {
        gsap.from(sub, {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          delay: lines.length * 0.1 + 0.2,
          scrollTrigger: { trigger: sub, start: "top 85%", once: true },
        });
      }

      // Floating numbers parallax
      for (const float of Array.from(section.querySelectorAll<HTMLElement>(".cs-float"))) {
        gsap.to(float, {
          yPercent: -25,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [lines]);

  return (
    <section ref={sectionRef} className="cs-section cinematic" aria-label="Statement">
      {/* Grain texture */}
      <div className="cs-grain" aria-hidden="true" />
      {/* Accent bar */}
      <div className="cs-accent-line" aria-hidden="true" />
      {/* Decorative floats */}
      <div className="cs-floats" aria-hidden="true">
        <span className="cs-float one">01</span>
        <span className="cs-float two">02</span>
      </div>

      <div className="cs-content">
        <span className="cs-label" data-ix="fade">{label}</span>
        <p className="cs-headline" aria-label={lines.map((l) => l.text).join(" ")}>
          {lines.map((line, i) => (
            <span key={i} className="cs-line">
              <span
                ref={(el) => { lineRefs.current[i] = el; }}
                className={`cs-line-inner${line.accent ? " cs-accent" : ""}`}
              >
                {line.text}
              </span>
            </span>
          ))}
        </p>
        {(subText || ctaHref) && (
          <div className="cs-sub">
            {subText && <p className="cs-sub-text">{subText}</p>}
            {ctaHref && ctaLabel && (
              <div className="cs-sub-cta" data-ix="fade-up">
                <A
                  href={ctaHref}
                  className="button ghost-light"
                >
                  {ctaLabel}
                </A>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
