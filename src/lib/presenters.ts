import type { PostItem, ProjectItem } from "@/components/editorial/sections";
import { ART, media } from "@/lib/media";
import { formatDate } from "@/lib/utils";
import { cmsProjectImage, isLiveCapture } from "@/lib/live-projects";

/** "Design®\nWith\npurpose" → three lines, with a trailing ® or ™ lifted into a superscript. */
export function missionWords(heading?: string | null): [string, string, string, string | undefined] {
  const lines = (heading || "Design®\nWith\npurpose").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  while (lines.length < 3) lines.push("");
  const rest = lines.slice(2).join(" ");
  const match = lines[0].match(/^(.*?)([®™])$/);
  return [match ? match[1] : lines[0], lines[1], rest, match?.[2]];
}

type ProjectRecord = { slug: string; title: string; category?: string; coverImage: string; previewImage: string; viewUrl?: string; services: { title: string }[] };

export function projectItem(project: ProjectRecord): ProjectItem {
  return {
    title: project.title,
    href: `/projects/${project.slug}`,
    // Cards overlay their own title, so they prefer the text-free device mockup over the banner.
    image: [project.previewImage, project.coverImage].find(isLiveCapture) ?? cmsProjectImage(project),
    alt: `${project.title} on desktop, tablet and mobile`,
    labels: project.services.map((s) => s.title),
  };
}

type PostRecord = { slug: string; title: string; publishedAt: Date; coverImage: string };

export function postItem(post: PostRecord, i = 0): PostItem {
  return {
    href: `/blog/${post.slug}`,
    title: post.title,
    date: formatDate(post.publishedAt),
    dateTime: post.publishedAt.toISOString(),
    image: media(post.coverImage, ART.light[i % 3]),
  };
}
