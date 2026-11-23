"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

export type StackItem = { title: string; href: string; image: string; alt: string; category: string; tags: string[] };

/**
 * Project cards that pin one after another and stack as the page scrolls; each
 * card eases back and dims while the next one slides over it. Sticky positioning
 * does the stacking, so without JavaScript (or with reduced motion) the cards
 * still stack, just without the scale.
 */
export function StackCards({ items }: { items: StackItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const cards = gsap.utils.toArray<HTMLElement>(".stack-card", root);
    const ctx = gsap.context(() => {
      cards.slice(0, -1).forEach((card, i) => {
        // Explicit start values: GSAP reads an unset `filter` as brightness(0).
        gsap.fromTo(card.querySelector(".stack-card-inner"), { scale: 1, filter: "brightness(1)" }, {
          scale: 0.9 + i * 0.01,
          filter: "brightness(0.94)",
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top+=96", scrub: true },
        });
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div className="stack-cards" ref={ref}>
      {items.map((item, i) => (
        <a key={item.href} href={item.href} className="stack-card" style={{ "--i": i } as React.CSSProperties}>
          <div className="stack-card-inner">
            <div className="stack-media">
              {/* eslint-disable-next-line @next/next/no-img-element -- generated project media */}
              <img src={item.image} alt={item.alt} loading={i < 2 ? "eager" : "lazy"} />
            </div>
            <div className="stack-info">
              <span className="stack-num">{`/${String(i + 1).padStart(2, "0")}`}</span>
              <h4>{item.title}</h4>
              <p>{item.category}</p>
              <ul>{item.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}</ul>
              <span className="stack-view">View case study <span aria-hidden="true">↗</span></span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
