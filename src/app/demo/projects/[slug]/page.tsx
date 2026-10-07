import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Button } from "@/components/ui/Button";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProject, getProjects, getRelatedProjects } from "@/lib/cms";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.overview.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/demo/projects/${encodeURIComponent(project.slug)}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 2);
  const serviceNames = project.services.map((s) => s.title);

  return (
    <article>
      {/* ------------------------------------------------------------ hero */}
      <header className="relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden px-[var(--page-x)] pb-[var(--section-y-sm)] pt-[calc(var(--nav-h)+var(--page-title-y))] on-dark">
        {project.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
          <img
            src={project.coverImage}
            alt=""
            className="absolute inset-0 -z-10 size-full object-cover opacity-70"
          />
        )}

        <h1 className="t-page-title">{project.title}</h1>

        <div className="hairline mt-[var(--m-medium)] flex flex-wrap items-baseline justify-between gap-4 pt-[var(--m-xs)]">
          <span className="t-caption">{serviceNames.join(" / ")}</span>
          {project.year && <span className="t-caption">(©{project.year})</span>}
          <ScrollCue className="ml-auto" />
        </div>
      </header>

      {/* -------------------------------------------------- overview block */}
      <Marquee speed={24} repeat={4} itemClassName="pr-[2vw]">
        <span className="text-[length:var(--fs-heading-medium)] font-semibold uppercase leading-[var(--lh-3)] tracking-[var(--ls-2)]">
          Overview
        </span>
      </Marquee>

      <section className="section shell grid gap-[var(--gutter-x)] lg:grid-cols-[1.5fr_1fr]">
        <SplitText
          as="p"
          by="line"
          text={project.overview}
          className="text-[length:var(--fs-overview)] leading-[var(--lh-7)] tracking-[var(--ls-6)]"
        />

        <Reveal className="flex flex-col gap-[var(--m-base)]">
          <Meta label="Year" value={project.year && `©${project.year}`} />
          <Meta label="Client" value={project.client} />
          <Meta label="Services" value={serviceNames.join(" / ")} />

          {project.viewUrl && (
            <Button href={project.viewUrl} className="self-start">
              View Online
            </Button>
          )}
        </Reveal>
      </section>

      {/* --------------------------------------------------------- gallery */}
      {project.images.length > 0 && (
        <Reveal as="ul" stagger className="shell grid gap-[var(--gutter-x)]">
          {project.images.map((image) => (
            <li key={image.id}>
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                className="w-full object-cover"
              />
            </li>
          ))}
        </Reveal>
      )}

      {/* ------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="section shell">
          <SectionHeader label="(Related Projects)" index={`©${project.year}`} />
          <h2 className="t-display mt-[var(--m-large)] uppercase">Explore more Works</h2>
          <ul className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] md:grid-cols-2">
            {related.map((item) => (
              <li key={item.id}>
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

function Meta({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="hairline pt-[var(--m-xs)]">
      <span className="t-caption block text-muted">{label}</span>
      <span className="mt-1 block text-[length:var(--fs-body)]">{value}</span>
    </div>
  );
}
