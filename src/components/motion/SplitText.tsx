"use client";

import { useEffect, useMemo, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  /** "char" reproduces the source's letter-by-letter headings. */
  by?: "char" | "word" | "line";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
};

/**
 * Splits a string into spans and staggers them in on scroll. `by="char"` is the
 * signature treatment on benefit and support headings; `by="line"` handles the
 * intro paragraphs, which the source breaks one line per element.
 */
export function SplitText({
  text,
  className,
  by = "char",
  as: Tag = "h2",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const parts = useMemo(() => {
    if (by === "line") return text.split("\n");
    if (by === "word") return text.split(/(\s+)/);
    return Array.from(text);
  }, [text, by]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-part]"),
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: by === "char" ? 0.6 : 0.85,
          delay,
          ease: "power3.out",
          stagger: by === "char" ? 0.018 : 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [by, delay, parts]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, i) =>
          by === "line" ? (
            <span key={i} className="block overflow-hidden">
              <span data-part className="inline-block">
                {part}
              </span>
            </span>
          ) : (
            <span key={i} className="inline-block overflow-hidden align-bottom">
              <span data-part className="inline-block">
                {part === " " ? " " : part}
              </span>
            </span>
          ),
        )}
      </span>
    </Tag>
  );
}
