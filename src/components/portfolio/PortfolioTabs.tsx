"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import { ProjectCard, type ProjectSummary } from "./ProjectCard";
import { ProjectList } from "./ProjectList";

type View = "grid" | "list";

/** Grid ⇄ List switcher used on the home and portfolio pages. */
export function PortfolioTabs({ projects }: { projects: ProjectSummary[] }) {
  const [view, setView] = useState<View>("grid");
  const id = useId();

  return (
    <div>
      <div
        role="tablist"
        aria-label="Portfolio layout"
        className="mb-[var(--m-base)] flex justify-end gap-2"
      >
        {(["grid", "list"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            tabIndex={view === value ? 0 : -1}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? "grid" : event.key === "End" ? "list" : view === "grid" ? "list" : "grid";
              setView(next);
              document.getElementById(`${id}-${next}-tab`)?.focus();
            }}
            id={`${id}-${value}-tab`}
            aria-selected={view === value}
            aria-controls={`${id}-${value}-panel`}
            onClick={() => setView(value)}
            className={cn(
              "t-caption min-h-11 inline-flex items-center gap-2 rounded-[var(--radius-full)] border px-[var(--btn-px-sm)] py-[0.45rem] transition-colors duration-300",
              view === value
                ? "border-ink bg-ink text-paper"
                : "border-hairline text-muted hover:border-ink hover:text-ink",
            )}
          >
            {value === "grid" ? <GridIcon /> : <ListIcon />}
            {value}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-grid-panel`}
        aria-labelledby={`${id}-grid-tab`}
        hidden={view !== "grid"}
      >
        <div className="grid gap-[var(--gutter-x)] md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${id}-list-panel`}
        aria-labelledby={`${id}-list-tab`}
        hidden={view !== "list"}
      >
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-[1em]" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="7" height="7" />
      <rect x="9" y="0" width="7" height="7" />
      <rect x="0" y="9" width="7" height="7" />
      <rect x="9" y="9" width="7" height="7" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-[1em]" fill="currentColor" aria-hidden="true">
      <rect x="0" y="1" width="16" height="2" />
      <rect x="0" y="7" width="16" height="2" />
      <rect x="0" y="13" width="16" height="2" />
    </svg>
  );
}
