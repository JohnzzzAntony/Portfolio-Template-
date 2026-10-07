import { z } from "zod";

const copy = (max: number) => z.string().trim().max(max);
const webUrl = z.string().trim().max(2048).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Use a complete HTTPS URL.");
const imageUrl = z.string().trim().max(2048).refine(value => !value || /^\/media\/[a-zA-Z0-9._-]+$/.test(value) || /^\/uploads\/[a-z0-9]{20,40}\/[a-f0-9-]{36}\.(jpg|png|webp|avif|gif)$/.test(value) || webUrl.safeParse(value).success, "Upload an image or use an HTTPS image URL.");
export const portfolioSchema = z.object({
  name: copy(50).min(1, "Enter your portfolio name."),
  role: copy(100).min(1, "Enter your discipline."),
  headline: copy(100).min(1),
  introduction: copy(500),
  about: copy(3000),
  location: copy(100),
  email: z.string().trim().email().max(200).or(z.literal("")),
  heroImage: imageUrl,
  footer: copy(160),
  projects: z.array(z.object({ title: copy(100).min(1), category: copy(100), description: copy(1500), image: imageUrl, url: webUrl })).max(24),
  services: z.array(z.object({ title: copy(100).min(1), description: copy(1000) })).max(12),
  socials: z.array(z.object({ label: copy(40).min(1), url: webUrl.refine(value => !!value, "Enter a URL.") })).max(8),
});
export type PortfolioContent = z.infer<typeof portfolioSchema>;
export const starterContent: PortfolioContent = {
  name: "Your Studio", role: "Independent creative", headline: "Ideas into\nimpact.",
  introduction: "A home for your best work. Add your story, your projects, and the details that make your practice yours.",
  about: "Introduce yourself here. Share your approach, the people you work with, and what you bring to every project.",
  location: "Available worldwide", email: "", heroImage: "/media/hero.svg", footer: "Have something in mind?",
  projects: [
    { title: "Your first project", category: "Brand identity", description: "Tell the story behind the work: the challenge, your approach, and what changed.", image: "/media/project-1.svg", url: "" },
    { title: "Your next chapter", category: "Digital experience", description: "Show what you made and the thinking that brought it to life.", image: "/media/project-2.svg", url: "" },
  ],
  services: [{ title: "Design & direction", description: "Describe what you do, who you do it for, and how you work together." }],
  socials: [],
};
export function parseContent(raw: string): PortfolioContent { return portfolioSchema.parse(JSON.parse(raw)); }
