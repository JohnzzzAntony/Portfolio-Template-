import type { PostItem, ProjectItem } from "@/components/rydge/sections";
import { ART, media } from "@/lib/media";
import { formatDate } from "@/lib/utils";

/** "Design®\nWith\npurpose" → three lines, with a trailing ® or ™ lifted into a superscript. */
export function missionWords(heading?: string | null): [string, string, string, string | undefined] {
  const lines = (heading || "Design®\nWith\npurpose").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  while (lines.length < 3) lines.push("");
  const rest = lines.slice(2).join(" ");
  const match = lines[0].match(/^(.*?)([®™])$/);
  return [match ? match[1] : lines[0], lines[1], rest, match?.[2]];
}

type ProjectRecord = { slug: string; title: string; coverImage: string; previewImage: string; services: { title: string }[] };

export function projectItem(project: ProjectRecord, i = 0): ProjectItem {
  return {
    title: project.title,
    href: `/projects/${project.slug}`,
    image: media(project.previewImage || project.coverImage, ART.dark[i % 3]),
    alt: project.title,
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
