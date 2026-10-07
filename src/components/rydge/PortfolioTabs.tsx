"use client";

import { useEffect, useRef, useState } from "react";

import { ScrollTrigger } from "@/lib/gsap";

import { ArrowUpRight, GridIcon, ListIcon } from "./icons";
import { CtaRow, ProjectCard, type ProjectItem } from "./cards";
import { A, Frame } from "./ui";

/**
 * Grid / list views of the same projects. The switch floats at the bottom of the
 * viewport only while the collection is on screen; the active pill glides
 * between the two options.
 */
export function PortfolioTabs({ projects, cta }: { projects: ProjectItem[]; cta?: { label: string; href: string; body?: string } }) {
  const [tab, setTab] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "-35% 0px -35% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const choose = (next: "grid" | "list") => {
    if (next === tab) return;
    setTab(next);
    setEntering(true);
    window.setTimeout(() => setEntering(false), 1000);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <div className="relative" ref={ref}>
      <div className={`tabs-menu${visible ? " is-visible" : ""}`} data-tab={tab} role="tablist" aria-label="Project layout" style={visible ? undefined : { pointerEvents: "none" }}>
        <div className="tabs-active" aria-hidden="true" />
        <button type="button" role="tab" aria-selected={tab === "grid"} tabIndex={visible ? 0 : -1} onClick={() => choose("grid")}><span><GridIcon />Grid</span></button>
        <button type="button" role="tab" aria-selected={tab === "list"} tabIndex={visible ? 0 : -1} onClick={() => choose("list")}><span><ListIcon />List</span></button>
      </div>

      <div className={`tab-pane${entering && tab === "grid" ? " is-entering" : ""}`} hidden={tab !== "grid"} role="tabpanel" aria-label="Grid">
        <div className={cta ? "mb-large" : undefined}>
          <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div>
        </div>
        {cta && <CtaRow cta={cta} />}
      </div>

      <div className={`tab-pane${entering && tab === "list" ? " is-entering" : ""}`} hidden={tab !== "list"} role="tabpanel" aria-label="List">
        <div className={cta ? "mb-large" : undefined}>
          <div className="projects-list-wrap">
            <div className="projects-list">
              {projects.map((project) => {
                const row = (
                  <>
                    <div className="divider" />
                    <div className="projects-list-inner">
                      <h4 className="projects-list-title">{project.title}</h4>
                      <p className="projects-list-text">{project.description || project.labels.join(", ")}</p>
                      {project.href && <ArrowUpRight className="projects-list-arrow" />}
                    </div>
                    <div className="projects-list-hover" />
                  </>
                );
                return (
                  <div key={project.title} className="projects-list-item">
                    {project.image && <div className="projects-list-preview" aria-hidden="true"><Frame src={project.image} /></div>}
                    {project.href ? <A href={project.href} className="projects-list-link">{row}</A> : <div className="projects-list-link">{row}</div>}
                  </div>
                );
              })}
              <div className="divider" />
            </div>
          </div>
        </div>
        {cta && <CtaRow cta={cta} />}
      </div>
    </div>
  );
}
