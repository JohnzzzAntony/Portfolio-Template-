import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaRow, PageTop, ProjectCard } from "@/components/editorial/sections";
import { Button, Marquee, SectionHead } from "@/components/editorial/ui";
import { getProject, getProjects, getRelatedProjects } from "@/lib/cms";
import { projectItem } from "@/lib/presenters";
import { ART, media } from "@/lib/media";

type Params = { params: Promise<{ slug: string }> };

/** Body copy and lists are stored as newline-separated text in the CMS. */
const toLines = (value: string) => value.split(/\n+/).map((line) => line.trim()).filter(Boolean);

const bodyStyle: React.CSSProperties = { fontSize: "var(--r-fs-overview)", lineHeight: 1.25, marginBottom: "1rem" };

/** Case-study block: heading in the left column, copy in the right, like the overview. */
function Block({ heading, body, children }: { heading: string; body?: string | null; children?: React.ReactNode }) {
  const paragraphs = body ? toLines(body) : [];
  if (!paragraphs.length && !children) return null;
  return (
    <div className="grid-12 sm mb-large">
      <div className="span-l6">
        <div className="heading-medium" data-ix="fade-up">{heading}</div>
      </div>
      <div className="span-r7s">
        {paragraphs.map((paragraph, i) => (
          <p key={i} className="paragraph-small" style={bodyStyle} data-ix="lines">{paragraph}</p>
        ))}
        {children}
      </div>
    </div>
  );
}

/** Feature and step lists: the meta-list rhythm with a `/001`-style index. */
function Rows({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="meta-list mb-medium">
      {items.map((item, i) => (
        <div key={item} className="meta-row" data-ix="fade-up">
          <div className="divider" data-ix="divider" />
          <span>{`/${String(i + 1).padStart(3, "0")}`}</span>
          <span style={{ textAlign: "right", maxWidth: "72%" }}>{item}</span>
        </div>
      ))}
      <div className="divider" data-ix="divider" />
    </div>
  );
}

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
    alternates: { canonical: `/projects/${encodeURIComponent(project.slug)}` },
    openGraph: { title, description, type: "article", images: [media(project.coverImage, ART.hero)] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 2);
  const services = project.services.map((s) => s.title);
  const overview = toLines(project.overview);
  const features = toLines(project.features);
  const steps = toLines(project.steps);
  const meta = [
    ["Year", project.year],
    ["Client", project.client],
    ["Category", project.category],
    ["Stack", project.stack],
    ["Services", services.join(", ")],
  ].filter(([, value]) => value);
  const mockups = project.images.filter((image) => !image.url.includes("/screens/"));
  const screens = project.images.filter((image) => image.url.includes("/screens/"));

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
                  <p key={i} className="paragraph-small" style={bodyStyle} data-ix="lines">{paragraph}</p>
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

      <section className="section no-pb">
        <div className="container-fluid">
          <Block heading="Key features"><Rows items={features} /></Block>
          <Block heading="How it works" body={project.journey} />
          <Block heading="Engineering focus" body={project.engineering} />
          <Block heading="Scope & delivery" body={project.scope} />
          <Block heading="Similar projects" body={project.approach}><Rows items={steps} /></Block>
        </div>
      </section>

      {mockups.length > 0 && (
        <section className="section no-pb">
          <div className="container-fluid">
            <div className="project-gallery">
              {mockups.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element -- CMS supplied
                <img key={image.id} src={media(image.url, ART.dark[1])} alt={image.alt} loading="lazy" data-ix="fade-up" />
              ))}
            </div>
          </div>
        </section>
      )}

      {screens.length > 0 && (
        <section className="section no-pb">
          <div className="container-fluid">
            <div className="mb-large">
              <div className="grid-12 sm">
                <div className="span-l6">
                  <div className="heading-medium" data-ix="fade-up">Screens</div>
                </div>
                <div className="span-r7s">
                  <p className="paragraph-small" style={bodyStyle} data-ix="lines">
                    Pages captured from a local build of {project.title}. The device mockups above are composed from these screens.
                  </p>
                </div>
              </div>
            </div>
            <div className="project-gallery">
              {screens.map((image) => (
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
