import type { Prisma } from "@prisma/client";

/**
 * Config-driven admin. Each entry describes one collection: which Prisma model
 * backs it, how rows are listed, and which fields the editor renders. One set
 * of pages and server actions then serves every collection.
 */

export type FieldType =
  | "text"
  | "slug"
  | "textarea"
  | "longtext"
  | "number"
  | "boolean"
  | "date"
  | "image"
  | "url"
  | "list"
  | "services";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  /** Derive a slug from this field when the slug is left blank. */
  from?: string;
};

export type Resource = {
  /** Prisma model accessor, e.g. prisma.project */
  model: keyof Pick<
    Prisma.TypeMap["model"],
    | "Project"
    | "Post"
    | "Service"
    | "TeamMember"
    | "Award"
    | "Benefit"
    | "Achievement"
    | "ApproachItem"
    | "PlaygroundImage"
    | "NavItem"
    | "SocialLink"
  >;
  /** Property name on the PrismaClient instance. */
  delegate: string;
  label: string;
  singular: string;
  /** Field shown as the row title in the list view. */
  titleField: string;
  /** Optional secondary column in the list view. */
  subtitleField?: string;
  orderBy: Record<string, "asc" | "desc">;
  /** Collections with an `order` column get up/down reordering. */
  sortable: boolean;
  fields: Field[];
};

export const RESOURCES = {
  projects: {
    model: "Project",
    delegate: "project",
    label: "Projects",
    singular: "Project",
    titleField: "title",
    subtitleField: "client",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", from: "title", help: "Leave blank to generate from the title." },
      { name: "client", label: "Client", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "services", label: "Services", type: "services" },
      { name: "overview", label: "Overview", type: "longtext" },
      { name: "coverImage", label: "Cover image", type: "image", help: "Used on the project page hero." },
      { name: "previewImage", label: "Preview image", type: "image", help: "Used on cards and list rows." },
      { name: "viewUrl", label: "Live URL", type: "url" },
      { name: "featured", label: "Featured", type: "boolean", help: "Shown in the Featured Project slot." },
      { name: "published", label: "Published", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
      { name: "seoTitle", label: "SEO title", type: "text" },
      { name: "seoDescription", label: "SEO description", type: "textarea" },
    ],
  },

  posts: {
    model: "Post",
    delegate: "post",
    label: "Blog posts",
    singular: "Post",
    titleField: "title",
    subtitleField: "author",
    orderBy: { publishedAt: "desc" },
    sortable: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", from: "title" },
      { name: "excerpt", label: "Excerpt", type: "textarea" },
      { name: "body", label: "Body", type: "longtext", help: "Separate paragraphs with a blank line." },
      { name: "coverImage", label: "Cover image", type: "image" },
      { name: "author", label: "Author", type: "text" },
      { name: "tags", label: "Tags", type: "list" },
      { name: "publishedAt", label: "Publish date", type: "date" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "seoTitle", label: "SEO title", type: "text" },
      { name: "seoDescription", label: "SEO description", type: "textarea" },
    ],
  },

  services: {
    model: "Service",
    delegate: "service",
    label: "Services",
    singular: "Service",
    titleField: "title",
    subtitleField: "index",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Slug", type: "slug", from: "title" },
      { name: "index", label: "Index", type: "text", help: 'The "/001" counter shown beside the title.' },
      { name: "description", label: "Description", type: "longtext" },
      { name: "image", label: "Image", type: "image" },
      { name: "capabilities", label: "Capabilities", type: "list" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  team: {
    model: "TeamMember",
    delegate: "teamMember",
    label: "Team",
    singular: "Team member",
    titleField: "name",
    subtitleField: "role",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "photo", label: "Photo", type: "image" },
      { name: "linkedinUrl", label: "LinkedIn", type: "url" },
      { name: "instagramUrl", label: "Instagram", type: "url" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  awards: {
    model: "Award",
    delegate: "award",
    label: "Awards",
    singular: "Award",
    titleField: "title",
    subtitleField: "category",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "title", label: "Awarding body", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "year", label: "Year", type: "text" },
      { name: "url", label: "Link", type: "url" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  benefits: {
    model: "Benefit",
    delegate: "benefit",
    label: "Benefits",
    singular: "Benefit",
    titleField: "title",
    subtitleField: "index",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, help: "Animates in letter-by-letter." },
      { name: "index", label: "Index", type: "text" },
      { name: "description", label: "Description", type: "longtext" },
      { name: "image", label: "Image", type: "image" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  achievements: {
    model: "Achievement",
    delegate: "achievement",
    label: "Achievements",
    singular: "Achievement",
    titleField: "value",
    subtitleField: "label",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "value", label: "Value", type: "text", required: true, help: 'e.g. "75+", "2019", "99%"' },
      { name: "label", label: "Label", type: "text" },
      { name: "image", label: "Image", type: "image" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  approach: {
    model: "ApproachItem",
    delegate: "approachItem",
    label: "Approach",
    singular: "Approach item",
    titleField: "title",
    subtitleField: "letter",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "letter", label: "Letter", type: "text", help: 'A, B, C…' },
      { name: "description", label: "Description", type: "longtext" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  playground: {
    model: "PlaygroundImage",
    delegate: "playgroundImage",
    label: "Playground",
    singular: "Playground image",
    titleField: "alt",
    subtitleField: "url",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "url", label: "Image", type: "image", required: true },
      { name: "alt", label: "Alt text", type: "text", help: "Describe the image for screen readers." },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  navigation: {
    model: "NavItem",
    delegate: "navItem",
    label: "Navigation",
    singular: "Nav item",
    titleField: "label",
    subtitleField: "href",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "href", label: "Link", type: "text", required: true },
      { name: "visible", label: "Visible", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
    ],
  },

  socials: {
    model: "SocialLink",
    delegate: "socialLink",
    label: "Social links",
    singular: "Social link",
    titleField: "label",
    subtitleField: "url",
    orderBy: { order: "asc" },
    sortable: true,
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "url", label: "URL", type: "url", required: true },
      { name: "order", label: "Order", type: "number" },
    ],
  },
} satisfies Record<string, Resource>;

export type ResourceKey = keyof typeof RESOURCES;

export function isResourceKey(value: string): value is ResourceKey {
  return Object.hasOwn(RESOURCES, value);
}
