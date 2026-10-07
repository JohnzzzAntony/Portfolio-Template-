import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogSection, PageTop } from "@/components/rydge/sections";
import { getPost, getPosts } from "@/lib/cms";
import { postItem } from "@/lib/demo-content";
import { ART, media } from "@/lib/media";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `/demo/blog/${encodeURIComponent(post.slug)}` },
    openGraph: { title, description, type: "article", publishedTime: post.publishedAt.toISOString(), images: [media(post.coverImage, ART.hero)] },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const paragraphs = post.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article>
      <PageTop
        small
        title={post.title}
        captions={[<time key="d" dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>, `(${post.author || "©"})`]}
        image={media(post.coverImage, ART.light[0])}
      />
      <div className="section no-pt">
        <div className="container-medium">
          <div className="rich-text" data-ix="fade-up">
            {paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <BlogSection
          label="(Related Articles)"
          index={`©${new Date().getUTCFullYear()}`}
          heading={"Explore more\nArticles"}
          posts={related.map(postItem)}
          cta={{ body: "Writing on design systems, motion and the parts of the process that usually go undocumented.", label: "View All Articles", href: "/blog" }}
        />
      )}
    </article>
  );
}
