import catalog from "./project-catalog.json";
import captureReport from "../../public/images/projects/live/capture-report.json";

type Capture = { slug: string; status: string; captures: Partial<Record<"desktop" | "tablet" | "mobile", { image: string }>>; mockup?: string };
const captures = captureReport.projects as Capture[];

/** Banners, mockups and screens made by scripts/build-project-media.mjs from the live site. */
export const isLiveCapture = (url?: string) => Boolean(url && /^\/images\/projects\/[\w-]+\/(banner|devices|desktop|tablet|mobile|screens\/0\d)\.webp$/.test(url));

/** Only a successful three-viewport capture can become project imagery. */
export function liveProjectImage(slug: string): string | undefined {
  const capture = captures.find(item => item.slug === slug && item.status === "captured");
  if (!capture || !["desktop", "tablet", "mobile"].every(device => capture.captures[device as keyof Capture["captures"]]?.image.startsWith(`/images/projects/live/${slug}/`))) return undefined;
  return capture.mockup || capture.captures.desktop?.image;
}

export const liveProjects = catalog.map(project => ({ ...project, image: liveProjectImage(project.slug) }));

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
