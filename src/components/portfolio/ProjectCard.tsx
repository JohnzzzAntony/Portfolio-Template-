import Link from "@/components/layout/SiteLink";

import { ArrowButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  previewImage: string;
  coverImage: string;
  services: { id: string; title: string }[];
};

/**
 * Full-bleed image with the title top-left, arrow top-right, tag pills
 * bottom-left. Hovering swaps the title for its duplicate and rotates the arrow.
 */
export function ProjectCard({
  project,
  className,
}: {
  project: ProjectSummary;
  className?: string;
}) {
  const image = project.previewImage || project.coverImage;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative isolate block aspect-[4/3] overflow-hidden bg-ink text-paper",
        className,
      )}
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
        <img
          src={image}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
        />
      )}

      <div className="flex h-full flex-col justify-between p-[var(--card-p-project)]">
        <div className="flex items-start justify-between gap-4">
          <span className="relative block bg-ink/80 px-2 py-1 overflow-hidden text-[length:var(--fs-project-card-title)] font-semibold leading-[var(--lh-6)] tracking-[var(--ls-4)]">
            <span className="block transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full">
              {project.title}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 block translate-y-full transition-transform duration-[450ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0"
            >
              {project.title}
            </span>
          </span>
          <ArrowButton />
        </div>

        {project.services.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.services.map((service) => (
              <li
                key={service.id}
                className="rounded-[var(--radius-full)] bg-paper px-[var(--gutter-fixed)] py-[0.35rem] text-[length:var(--fs-project-card-tag)] leading-none text-ink"
              >
                {service.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
