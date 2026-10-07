"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { Draggable, gsap, prefersReducedMotion, ScrollTrigger, SplitText } from "@/lib/gsap";

/*
 * One interaction engine for every page built on the template, in the spirit of
 * Webflow's IX: server components describe motion with data attributes and this
 * client root wires them to GSAP. The page subtree is keyed by pathname so text
 * split into spans is always discarded with its page, never reconciled by React.
 *
 *   data-ix="fade | fade-up | fade-up-long | fade-down | fade-left | fade-scale |
 *            scale-in | scale-out | unmask | divider | slide-up | lines | chars |
 *            parallax"            + optional data-ix-delay="0.7"
 *   data-hero, data-hero-image, data-hero-shift="5|-5"   home hero
 *   data-split, data-split-part="img|bg|fade|l1|l2|l3|cta" mission scroll scene
 *   data-carousel / data-carousel-inner                   momentum drag strip
 *   data-playground / data-playground-item                free-drag cards
 *   data-cursor="Drag"                                    floating cursor label
 *   data-scrub="approach|benefits|gallery|service"        scroll-linked parallax
 */

// CSS easing names from the source mapped onto GSAP's: quart = power3.
const OUT_QUART = "power3.out";
const EASE = "power1.inOut";

export function Interactions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;
    if (!root) return;
    if (prefersReducedMotion()) {
      html.classList.add("ix-off", "ix-ready");
      return;
    }

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        reveals(root);
        hero(root, cleanups);
        marquees(root, cleanups);
        split(root);
        scrubs(root);
        carousels(root, cleanups);
        playground(root);
        cursor(root, cursorRef.current, cleanups);
      }, root);
      html.classList.add("ix-ready");
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
    };
  }, [pathname]);

  return (
    <>
      <div ref={rootRef} key={pathname} className="rx-page">
        {children}
      </div>
      <div ref={cursorRef} className="cursor" aria-hidden="true">
        <div className="cursor-inner" />
        <div className="cursor-text" />
      </div>
    </>
  );
}

const all = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
const delayOf = (el: HTMLElement) => parseFloat(el.dataset.ixDelay || "0") || 0;
const once = (trigger: Element, start = "top bottom") => ({ trigger, start, once: true });

function reveals(root: HTMLElement) {
  for (const el of all(root, "[data-ix]")) {
    const delay = delayOf(el);
    const st = once(el);
    switch (el.dataset.ix) {
      case "fade":
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, ease: EASE, delay, scrollTrigger: st });
        break;
      case "fade-up":
        gsap.fromTo(el, { opacity: 0, y: "2rem" }, { opacity: 1, y: 0, duration: 1, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "fade-up-long":
        gsap.fromTo(el, { opacity: 0, y: "6rem" }, { opacity: 1, y: 0, duration: 1.25, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "fade-down":
        gsap.fromTo(el, { opacity: 0, y: "-2rem" }, { opacity: 1, y: 0, duration: 1, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "fade-left":
        gsap.fromTo(el, { opacity: 0, x: "2.8rem" }, { opacity: 1, x: 0, duration: 1.25, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "fade-scale":
        gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.25, ease: OUT_QUART, delay: 0.65 + delay, scrollTrigger: st });
        break;
      case "scale-in":
        gsap.fromTo(el, { opacity: 1, scale: 0 }, { scale: 1, duration: 1, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "scale-out":
        gsap.fromTo(el, { opacity: 1, scale: 1.25 }, { scale: 1, duration: 1, ease: OUT_QUART, delay: 0.5 + delay, scrollTrigger: st });
        break;
      case "slide-up":
        gsap.fromTo(el, { opacity: 1, yPercent: 100 }, { yPercent: 0, duration: 1, ease: OUT_QUART, delay, scrollTrigger: once(el.parentElement ?? el) });
        break;
      case "divider":
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: OUT_QUART, delay, scrollTrigger: st });
        break;
      case "unmask": {
        const img = el.querySelector("img");
        const tl = gsap.timeline({ delay, scrollTrigger: st });
        tl.fromTo(el, { opacity: 1, scale: 0.8, yPercent: 18 }, { scale: 1, yPercent: 0, duration: 1.5, ease: "circ.out" }, 0);
        if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.5, ease: "circ.out" }, 0);
        break;
      }
      case "lines": {
        // SplitText measures with inline-block words, which would each inherit
        // text-indent; move the indent into a leading spacer instead.
        const indent = getComputedStyle(el).textIndent;
        if (parseFloat(indent)) {
          const spacer = document.createElement("span");
          spacer.style.cssText = `display:inline-block;width:${indent}`;
          spacer.setAttribute("aria-hidden", "true");
          el.style.textIndent = "0";
          el.prepend(spacer);
        }
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "ix-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, { yPercent: 105, duration: 1.1, ease: OUT_QUART, stagger: 0.08, delay, scrollTrigger: once(el) });
          },
        });
        break;
      }
      case "chars":
        SplitText.create(el, {
          type: "words,chars",
          mask: "words",
          charsClass: "ix-char",
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.chars, { yPercent: 110, duration: 0.9, ease: OUT_QUART, stagger: 0.018, delay, scrollTrigger: once(el) });
          },
        });
        break;
      case "parallax":
        gsap.fromTo(el, { yPercent: -14 }, { yPercent: 14, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
        break;
    }
  }
}

/** Home hero: per-character 3D flip, image settle, scroll drift and mouse drift. */
function hero(root: HTMLElement, cleanups: Array<() => void>) {
  const section = root.querySelector<HTMLElement>("[data-hero]");
  if (!section) return;

  const front = all(section, ".hero-front .hero-char");
  const back = all(section, ".hero-back .hero-char");
  if (front.length && back.length) {
    const flip = { duration: 0.75, delay: 0.325, stagger: 0.0625, ease: "power2.out" };
    gsap.set(back, { opacity: 0, yPercent: 136, rotationX: -90, transformOrigin: "50% 0%" });
    gsap.set(front, { opacity: 0, yPercent: 36 });
    ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(back, { opacity: 1, yPercent: 0, rotationX: 0, ...flip });
        gsap.to(front, { opacity: 1, yPercent: -100, rotationX: 90, transformOrigin: "50% 100%", ...flip });
      },
    });
  }

  const image = section.querySelector<HTMLElement>("[data-hero-image]");
  if (image) {
    gsap.fromTo(image.querySelectorAll("img"), { scale: 1.2085 }, { scale: 1, duration: 1.5, delay: 0.7, ease: EASE });
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
    tl.fromTo(image, { scale: 1 }, { scale: 1.125, ease: "none" }, 0);
    for (const el of all(section, "[data-hero-shift]")) {
      tl.fromTo(el, { y: 0 }, { y: `${el.dataset.heroShift}vw`, ease: "none" }, 0);
    }

    if (window.matchMedia("(hover: hover)").matches) {
      const x = gsap.quickTo(image, "x", { duration: 0.8, ease: "power2.out" });
      const y = gsap.quickTo(image, "y", { duration: 0.8, ease: "power2.out" });
      const move = (e: MouseEvent) => {
        x(((e.clientX / window.innerWidth) - 0.5) * window.innerWidth * 0.01);
        y(((e.clientY / window.innerHeight) - 0.5) * window.innerWidth * 0.01);
      };
      section.addEventListener("mousemove", move);
      cleanups.push(() => section.removeEventListener("mousemove", move));
    }
  }
}

/** CSS marquees run only while visible, matching the source's start/pause. */
function marquees(root: HTMLElement, cleanups: Array<() => void>) {
  const items = all(root, ".marquee");
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      (entry.target as HTMLElement).toggleAttribute("data-paused", !entry.isIntersecting);
    }
  });
  items.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/** "Design with purpose": image shrinks to 42%, panel wipes in, words rise. */
function split(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>("[data-split]");
  if (!section) return;
  const part = (name: string) => all(section, `[data-split-part="${name}"]`);
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    // Durations are percentages of the section's scroll-in-view range, so the
    // timeline reads like the source's keyframe table.
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.4 } });
    tl.fromTo(part("img"), { width: "100%" }, { width: "42%", duration: 27 }, 3)
      .fromTo(part("bg"), { scaleX: 0 }, { scaleX: 1, duration: 27 }, 3)
      .fromTo(part("fade"), { opacity: 0 }, { opacity: 1, duration: 4.5 }, 28)
      .fromTo(part("l1"), { yPercent: 100 }, { yPercent: 0, duration: 7 }, 33.5)
      .fromTo(part("l2"), { yPercent: 100 }, { yPercent: 0, duration: 7 }, 37.5)
      .fromTo(part("l3"), { yPercent: 100 }, { yPercent: 0, duration: 7 }, 41.5)
      .fromTo(part("cta"), { y: "2.8rem", opacity: 0 }, { y: 0, opacity: 1, duration: 6 }, 56)
      .to({}, { duration: 38 }, 62);
  });
  mm.add("(max-width: 991px)", () => {
    for (const el of [...part("fade"), ...part("cta")]) {
      gsap.fromTo(el, { opacity: 0, y: "2rem" }, { opacity: 1, y: 0, duration: 1, ease: OUT_QUART, scrollTrigger: once(el) });
    }
    for (const el of [...part("l1"), ...part("l2"), ...part("l3")]) {
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: OUT_QUART, scrollTrigger: once(el.parentElement ?? el) });
    }
  });
}

function scrubs(root: HTMLElement) {
  const range = (trigger: Element) => ({ trigger, start: "top bottom", end: "bottom top", scrub: true });

  for (const el of all(root, '[data-scrub="approach"]')) {
    const two = el.querySelector(".two");
    const three = el.querySelector(".three");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      if (two) gsap.fromTo(two, { y: "6.5vw" }, { y: "-9vw", ease: "none", scrollTrigger: range(el) });
      if (three) gsap.fromTo(three, { y: "13vw" }, { y: "-18vw", ease: "none", scrollTrigger: range(el) });
    });
  }

  for (const el of all(root, '[data-scrub="benefits"]')) {
    const two = el.querySelector(".two");
    if (two && window.innerWidth > 767) gsap.fromTo(two, { y: "20vw" }, { y: "-20vw", ease: "none", scrollTrigger: range(el) });
    const content = el.closest(".bg-section")?.querySelector(".bg-content");
    const section = el.closest(".bg-section");
    if (content && section) {
      ScrollTrigger.create({
        trigger: section,
        start: "bottom 85%",
        onEnter: () => content.classList.add("is-hidden"),
        onLeaveBack: () => content.classList.remove("is-hidden"),
      });
    }
  }

  for (const el of all(root, '[data-scrub="gallery"]')) {
    gsap.fromTo(el, { xPercent: -8.25 }, { xPercent: 8.25, ease: "none", scrollTrigger: range(el.closest("section") ?? el) });
  }

  for (const el of all(root, '[data-scrub="service"]')) {
    const inner = el.querySelector("[data-service-inner]");
    const overlay = el.querySelector(".service-overlay");
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: range(el) });
    if (inner) tl.fromTo(inner, { y: 0 }, { y: "25vw", duration: 35 }, 65);
    if (overlay) tl.fromTo(overlay, { opacity: 0 }, { opacity: 0.98, duration: 17 }, 65);
    tl.set({}, {}, 0);
  }
}

/** Horizontal strip with momentum and edge resistance. */
function carousels(root: HTMLElement, cleanups: Array<() => void>) {
  for (const wrapper of all(root, "[data-carousel]")) {
    const inner = wrapper.querySelector<HTMLElement>("[data-carousel-inner]");
    if (!inner) continue;
    const bounds = () => ({ minX: Math.min(0, wrapper.clientWidth - inner.scrollWidth), maxX: 0 });
    const [drag] = Draggable.create(inner, {
      type: "x",
      bounds: bounds(),
      inertia: true,
      edgeResistance: 0.85,
      allowContextMenu: false,
      dragClickables: true,
      zIndexBoost: false,
    });
    const ro = new ResizeObserver(() => {
      drag.applyBounds(bounds());
      drag.enabled(inner.scrollWidth > wrapper.clientWidth);
    });
    ro.observe(wrapper);
    ro.observe(inner);
    cleanups.push(() => ro.disconnect());
  }
}

/** Seven cards that can be thrown anywhere; the last one touched comes forward. */
function playground(root: HTMLElement) {
  const wrapper = root.querySelector<HTMLElement>("[data-playground]");
  if (!wrapper) return;
  let z = 1;
  const items = all(wrapper, "[data-playground-item]");
  for (const item of items) {
    Draggable.create(item, {
      type: "x,y",
      inertia: true,
      edgeResistance: 0.98,
      throwResistance: 3000,
      dragResistance: 0.125,
      zIndexBoost: false,
      onPress() { z += 1; gsap.set(item, { zIndex: z }); },
    });
    const delay = parseFloat(item.dataset.ixDelay || "0.75");
    const img = item.querySelector("img");
    gsap.fromTo(item, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.75, delay, ease: OUT_QUART, scrollTrigger: once(wrapper, "top 75%") });
    if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 0.75, delay, ease: OUT_QUART, scrollTrigger: once(wrapper, "top 75%") });
  }
}

/** A blurred disc follows the pointer and announces "Drag" over draggable areas. */
function cursor(root: HTMLElement, el: HTMLDivElement | null, cleanups: Array<() => void>) {
  if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const zones = all(root, "[data-cursor]");
  if (!zones.length) return;
  const text = el.querySelector<HTMLElement>(".cursor-text");
  const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
  const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
  const move = (e: PointerEvent) => { x(e.clientX - el.offsetWidth / 2); y(e.clientY - el.offsetHeight / 2); };
  window.addEventListener("pointermove", move);
  cleanups.push(() => window.removeEventListener("pointermove", move));
  for (const zone of zones) {
    const enter = () => { if (text) text.textContent = zone.dataset.cursor || ""; el.classList.add("is-active"); };
    const leave = () => el.classList.remove("is-active");
    zone.addEventListener("pointerenter", enter);
    zone.addEventListener("pointerleave", leave);
    cleanups.push(() => { zone.removeEventListener("pointerenter", enter); zone.removeEventListener("pointerleave", leave); el.classList.remove("is-active"); });
  }
}
