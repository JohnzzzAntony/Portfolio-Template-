import { z } from "zod";

const copy = (max: number) => z.string().trim().max(max);
const webUrl = z.string().trim().max(2048).refine(value => {
  if (!value) return true;
  try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; }
}, "Use a complete HTTPS URL.");
const imageUrl = z.string().trim().max(2048).refine(value => !value || /^\/(media|images\/(art|work))\/[a-zA-Z0-9._-]+$/.test(value) || /^\/uploads\/[a-z0-9]{20,40}\/[a-f0-9-]{36}\.(jpg|png|webp|avif|gif)$/.test(value) || webUrl.safeParse(value).success, "Upload an image or use an HTTPS image URL.");
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
  name: "Your Studio", role: "Independent creative", headline: "Ideas into\nreal impact.",
  introduction: "A home for your best work. Add your story, your projects and the details that make your practice yours.",
  about: "Introduce yourself here. Share your approach, the people you work with, and what you bring to every project — in your own words, at your own pace.",
  location: "Available worldwide", email: "", heroImage: "", footer: "Have a project in mind?",
  projects: [
    { title: "Your first project", category: "Brand identity, Web", description: "Tell the story behind the work: the challenge, your approach, and what changed.", image: "/images/art/dark-1.webp", url: "" },
    { title: "Your next chapter", category: "Digital experience", description: "Show what you made and the thinking that brought it to life.", image: "/images/art/dark-2.webp", url: "" },
    { title: "A recent launch", category: "Product, Design", description: "Share the outcome and the people who made it possible.", image: "/images/art/dark-3.webp", url: "" },
    { title: "Something you love", category: "Art direction", description: "Every portfolio needs the piece you still think about.", image: "/images/art/light-1.webp", url: "" },
  ],
  services: [
    { title: "Design & direction", description: "Describe what you do, who you do it for, and how you work together." },
    { title: "Brand identity", description: "Explain the outcomes clients can expect and the way you get there." },
    { title: "Digital product", description: "Add as many services as your practice needs — or none at all." },
  ],
  socials: [],
};
export function parseContent(raw: string): PortfolioContent { return portfolioSchema.parse(JSON.parse(raw)); }
