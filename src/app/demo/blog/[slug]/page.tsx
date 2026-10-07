import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { getPost, getPosts, getSettings } from "@/lib/cms";
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
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSettings()]);
  if (!post) notFound();

  return (
    <article>
      <header className="px-[var(--page-x)] pb-[var(--section-y-md)] pt-[calc(var(--nav-h)+var(--page-title-y))]">
        <h1 className="t-display uppercase">{post.title}</h1>

        <div className="hairline mt-[var(--m-medium)] flex flex-wrap items-baseline justify-between gap-4 pt-[var(--m-xs)]">
          <time dateTime={post.publishedAt.toISOString()} className="t-caption">
            {formatDate(post.publishedAt)}
          </time>
          {post.author && <span className="t-caption">{post.author}</span>}
          <ScrollCue className="ml-auto" />
        </div>
      </header>

      {post.coverImage && (
        <figure className="px-[var(--page-x)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
          <img
            src={post.coverImage}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </figure>
      )}

      <Reveal className="shell section-md mx-auto max-w-[68ch]">
        {post.body.split("\n\n").map((paragraph, i) => (
          <p key={i} className="mb-[var(--m-rich)] text-[length:var(--fs-body)] leading-[var(--lh-8)]">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <section className="section-md">
        <Marquee speed={28} repeat={3} itemClassName="pr-[3vw]">
          <span className="text-[length:var(--fs-marquee)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
            {settings.brandName} {settings.brandSuffix}
          </span>
        </Marquee>

        <Reveal className="shell mt-[var(--m-large)] flex justify-center">
          <Button href="/blog">Back to all posts</Button>
        </Reveal>
      </section>
    </article>
  );
}
