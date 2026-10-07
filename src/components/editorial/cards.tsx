import { cn } from "@/lib/utils";

import { A, ArrowDisc, Button } from "./ui";

type Cta = { label: string; href: string };

export type ProjectItem = { title: string; href?: string; image?: string; alt?: string; labels: string[]; description?: string };

export function ProjectCard({ project, full = false, ix = "fade-up-long" }: { project: ProjectItem; full?: boolean; ix?: string }) {
  const body = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
      {project.image && <img src={project.image} alt={project.alt ?? ""} loading="lazy" />}
      <div className="project-content">
        <div className="project-header">
          <div className="project-title-wrap">
            <h4 className="project-title">{project.title}</h4>
            <div className="project-title" aria-hidden="true">{project.title}</div>
          </div>
          {project.href && <ArrowDisc />}
        </div>
        {project.labels.length > 0 && (
          <div className="project-labels">{project.labels.map((label) => <div key={label} className="project-label">{label}</div>)}</div>
        )}
      </div>
    </>
  );
  return project.href
    ? <A href={project.href} className={cn("project-card", full && "full")} data-ix={ix}>{body}</A>
    : <div className={cn("project-card", full && "full")} data-ix={ix}>{body}</div>;
}

export function CtaRow({ cta, center = false }: { cta: Cta & { body?: string }; center?: boolean }) {
  return (
    <div className={cn("cta-row", center && "center")}>
      <div className="container-small">
        {cta.body && <div className="mb-small"><p className="paragraph-small" data-ix="lines">{cta.body}</p></div>}
        <div data-ix="fade-up"><Button href={cta.href}>{cta.label}</Button></div>
      </div>
    </div>
  );
}

