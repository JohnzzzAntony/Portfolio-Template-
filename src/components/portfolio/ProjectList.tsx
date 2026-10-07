"use client";

import Link from "@/components/layout/SiteLink";
import { useRef, useState } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

import type { ProjectSummary } from "./ProjectCard";

/**
 * List view. Rows invert to black on hover and a preview image tracks the
 * cursor — the source's list-mode interaction.
 */
export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<((v: number) => void) | null>(null);
  const quickY = useRef<((v: number) => void) | null>(null);
  const [active, setActive] = useState<string | null>(null);

  function ensureQuick() {
    if (quickX.current || !previewRef.current) return;
    quickX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    quickY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
  }

  function onMove(event: React.MouseEvent) {
    if (prefersReducedMotion()) return;
    const bounds = wrapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    ensureQuick();
    quickX.current?.(event.clientX - bounds.left);
    quickY.current?.(event.clientY - bounds.top);
  }

  const activeProject = projects.find((p) => p.id === active);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
    >
      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 hidden aspect-[4/3] w-[22vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-0 transition-opacity duration-300 lg:block"
        style={{ opacity: activeProject ? 1 : 0 }}
      >
        {activeProject && (
          // eslint-disable-next-line @next/next/no-img-element -- cursor-follow preview
          <img
            src={activeProject.previewImage || activeProject.coverImage}
            alt=""
            className="size-full object-cover"
          />
        )}
      </div>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.slug}`}
              onMouseEnter={() => setActive(project.id)}
              onFocus={() => setActive(project.id)}
              className="hairline group flex items-center justify-between gap-6 px-[var(--gutter-fixed)] py-[var(--m-base)] transition-colors duration-500 hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper"
            >
              <span className="text-[length:var(--fs-project-list-title)] font-semibold tracking-[var(--ls-5)]">
                {project.title}
              </span>

              <span className="ml-auto hidden text-[length:var(--fs-project-list-text)] opacity-70 md:block">
                {project.services.map((s) => s.title).join(", ")}
              </span>

              <svg
                viewBox="0 0 24 24"
                className="size-6 shrink-0 transition-transform duration-500 group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path d="M7 17 17 7M9 7h8v8" strokeLinecap="square" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
