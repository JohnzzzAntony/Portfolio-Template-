"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

export type CinematicProject = {
  title: string;
  category: string;
  year: string;
  href?: string;
  image?: string;
  video?: string;
  number?: string;
};

function ArrowSVG() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 12.5L12.5 3.5M12.5 3.5H5.5M12.5 3.5V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GalleryCard({
  project,
  index,
  cardRef,
}: {
  project: CinematicProject;
  index: number;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const num = project.number ?? `/${String(index + 1).padStart(2, "0")}`;
  const isVideo = Boolean(project.video);

  return (
    <div
      className="cg-card"
      data-cin-card={String(index)}
      data-cursor="View"
      ref={cardRef}
    >
      {/* Invisible full-size link for accessibility */}
      {project.href && (
        <a
          href={project.href}
          className="cg-card-link"
          aria-label={`View project: ${project.title}`}
          style={{ position: "absolute", inset: 0, display: "block", zIndex: 4 }}
        />
      )}

      {/* Media */}
      <div className="cg-card-media">
        {isVideo ? (
          <video src={project.video} autoPlay loop muted playsInline preload="none" />
        ) : project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.image} alt="" loading="lazy" />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "var(--c-surface)" }} />
        )}
      </div>

      {/* Dark dim overlay — removed for active/hovered states via CSS */}
      <div className="cg-card-dim" aria-hidden="true" />
      {/* Gradient overlay */}
      <div className="cg-card-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="cg-card-content">
        <div className="cg-card-meta">
          <span>{project.category}</span>
          <span className="cg-card-meta-sep">·</span>
          <span>{project.year}</span>
        </div>
        <h3 className="cg-card-title">{project.title}</h3>
        <div className="cg-card-footer">
          <span className="cg-card-number">{num}</span>
          <span className="cg-card-view">
            View Project&nbsp;
            <ArrowSVG />
          </span>
        </div>
      </div>

      {/* Corner markers */}
      <div className="cg-card-corners" aria-hidden="true">
        <div className="cg-card-corner tl" />
        <div className="cg-card-corner tr" />
        <div className="cg-card-corner bl" />
        <div className="cg-card-corner br" />
      </div>
    </div>
  );
}

export function CinematicGallery({
  projects,
  label = "(Selected Work)",
  title,
  ctaLabel = "View all projects",
  ctaHref = "/portfolio",
}: {
  projects: CinematicProject[];
  label?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      cards.forEach((card) => {
        card.style.transform = "none";
        card.style.opacity = "1";
      });
      return;
    }

    const clamp = (val: number, lo: number, hi: number) =>
      Math.min(hi, Math.max(lo, val));

    function updateCards() {
      const vpCy = window.innerHeight * 0.42;
      let closestNorm = Infinity;
      let closestIdx = 0;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCy = rect.top + rect.height / 2;
        const dist = cardCy - vpCy;
        const normDist = dist / window.innerHeight;
        const absNorm = Math.abs(normDist);

        const rotX = clamp(normDist * 28, -22, 30);
        const scale = clamp(1 - absNorm * 0.18, 0.76, 1);
        const opacity = clamp(1 - absNorm * 0.65, 0.2, 1);
        const tz = clamp(-absNorm * 60, -80, 0);

        card.style.transform = `perspective(1200px) rotateX(${rotX}deg) scale(${scale}) translateZ(${tz}px)`;
        card.style.opacity = String(opacity);

        card.classList.remove("is-active", "is-above", "is-below", "is-far");
        if (absNorm < 0.18) {
          card.classList.add("is-active");
        } else if (normDist < 0) {
          card.classList.add(absNorm < 0.55 ? "is-above" : "is-far");
        } else {
          card.classList.add(absNorm < 0.55 ? "is-below" : "is-far");
        }

        if (absNorm < closestNorm) {
          closestNorm = absNorm;
          closestIdx = i;
        }
      });

      if (activeRef.current !== closestIdx) {
        activeRef.current = closestIdx;
        dotRefs.current.forEach((dot, di) => {
          if (!dot) return;
          dot.classList.toggle("is-active", di === closestIdx);
        });
      }
    }

    let ticking = false;
    let rafId: number;
    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          updateCards();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateCards();

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.07,
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
            once: true,
          },
          onComplete: updateCards,
        });
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  function scrollToCard(index: number) {
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section
      ref={sectionRef}
      className="cg-section cinematic"
      aria-label="Project gallery"
    >
      {/* Section header */}
      <div className="cg-head">
        <span className="cg-head-label">{label}</span>
        {title && (
          <h2 className="cg-head-title">
            {title.split("\n").map((line, i) => (
              <span key={i} style={{ display: "block" }}>{line}</span>
            ))}
          </h2>
        )}
        <a href={ctaHref} className="cg-head-cta">
          {ctaLabel}&nbsp;
          <ArrowSVG />
        </a>
      </div>

      {/* 3D perspective track */}
      <div className="cg-track-wrap">
        <div ref={trackRef} className="cg-track">
          {projects.map((project, i) => (
            <GalleryCard
              key={`${project.title}-${i}`}
              project={project}
              index={i}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      {projects.length > 1 && (
        <nav className="cg-nav" aria-label="Gallery navigation">
          {projects.map((p, i) => (
            <button
              key={`dot-${i}`}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className={`cg-nav-dot${i === 0 ? " is-active" : ""}`}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to project: ${p.title}`}
            />
          ))}
        </nav>
      )}
    </section>
  );
}
