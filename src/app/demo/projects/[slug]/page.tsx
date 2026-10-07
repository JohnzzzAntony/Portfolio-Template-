import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaRow, PageTop, ProjectCard } from "@/components/rydge/sections";
import { Button, Marquee, SectionHead } from "@/components/rydge/ui";
import { getProject, getProjects, getRelatedProjects } from "@/lib/cms";
import { projectItem } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";

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
    openGraph: { title, description, type: "article", images: [media(project.coverImage, ART.hero)] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 2);
  const services = project.services.map((s) => s.title);
  const overview = project.overview.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const meta = [
    ["Year", project.year],
    ["Client", project.client],
    ["Services", services.join(", ")],
  ].filter(([, value]) => value);

  return (
    <article>
      <PageTop
        title={project.title}
        captions={[services.join(" / "), project.year ? `(${project.year})` : undefined]}
        image={media(project.coverImage, ART.dark[0])}
      />

      <section className="section no-pb">
        <div className="container-fluid">
          <div className="grid-12 sm">
            <div className="span-l6 overflow-hidden">
              <Marquee duration={30} repeat={3}><div className="heading-medium">Overview</div></Marquee>
            </div>
            <div className="span-r7s">
              <div className="mb-medium">
                {overview.map((paragraph, i) => (
                  <p key={i} className="paragraph-small" style={{ fontSize: "var(--r-fs-overview)", lineHeight: 1.25, marginBottom: "1rem" }} data-ix="lines">{paragraph}</p>
                ))}
              </div>
              <div className="meta-list mb-medium">
                {meta.map(([label, value]) => (
                  <div key={label} className="meta-row" data-ix="fade-up">
                    <div className="divider" data-ix="divider" />
                    <span>{label}</span>
                    <span style={{ textAlign: "right" }}>{value}</span>
                  </div>
                ))}
                <div className="divider" data-ix="divider" />
              </div>
              {project.viewUrl && <div data-ix="fade-up"><Button href={project.viewUrl} external>View Online</Button></div>}
            </div>
          </div>
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="section no-pb">
          <div className="container-fluid">
            <div className="project-gallery">
              {project.images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element -- CMS supplied
                <img key={image.id} src={media(image.url, ART.dark[1])} alt={image.alt} loading="lazy" data-ix="fade-up" />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="container-fluid">
            <div className="mb-large">
              <SectionHead label="(Related Projects)" index={`©${new Date().getUTCFullYear()}`} wide>
                <h3 className="heading-medium" data-ix="lines" style={{ whiteSpace: "pre-line" }}>{"Explore more\nWorks"}</h3>
              </SectionHead>
            </div>
            <div className="mb-large">
              <div className="projects-grid">{related.map((p, i) => <ProjectCard key={p.id} project={projectItem(p, i)} />)}</div>
            </div>
            <CtaRow cta={{ body: "Discover how creativity turns ideas into products people actually use.", label: "View all projects", href: "/portfolio" }} />
          </div>
        </section>
      )}
    </article>
  );
}
