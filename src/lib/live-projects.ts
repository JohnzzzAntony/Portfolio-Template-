import catalog from "./project-catalog.json";
import captureReport from "../../public/images/projects/live/capture-report.json";
import type { ProjectItem } from "@/components/editorial/cards";

type Capture = { slug: string; status: string; captures: Partial<Record<"desktop" | "tablet" | "mobile", { image: string }>>; mockup?: string };
const captures = captureReport.projects as Capture[];

/** Only a successful three-viewport capture can become project imagery. */
export function liveProjectImage(slug: string): string | undefined {
  const capture = captures.find(item => item.slug === slug && item.status === "captured");
  if (!capture || !["desktop", "tablet", "mobile"].every(device => capture.captures[device as keyof Capture["captures"]]?.image.startsWith(`/images/projects/live/${slug}/`))) return undefined;
  return capture.mockup || capture.captures.desktop?.image;
}

export const liveProjects = catalog.map(project => ({ ...project, image: liveProjectImage(project.slug) }));

export function liveProjectItem(project: (typeof liveProjects)[number]): ProjectItem {
  return { title: project.title, href: project.url, image: project.image,
    alt: `${project.title} — captured from the live website`,
    labels: [new URL(project.url).hostname], description: project.summary };
}

/** CMS case studies may use captured imagery only when their actual URL matches. */
export function cmsProjectImage(project: { slug: string; viewUrl?: string }): string | undefined {
  if (project.viewUrl) {
    try {
      const host = new URL(project.viewUrl).hostname.replace(/^www\./, "");
      const match = liveProjects.find(item => new URL(item.url).hostname.replace(/^www\./, "") === host);
      return match?.image;
    } catch { return undefined; }
  }
  return liveProjectImage(project.slug);
}
