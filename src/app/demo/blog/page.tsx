import type { Metadata } from "next";
import Link from "@/components/layout/SiteLink";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { getPage, getPosts, sectionMap } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog");
}

export default async function BlogPage() {
  const page = await getPage("blog");
  if (!page) notFound();

  const posts = await getPosts();
  const s = sectionMap(page.sections);

  return (
    <>
      <PageHero
        title={page.title}
        metaLeft={page.metaLeft}
        metaRight={page.metaRight}
      />

      <Reveal
        as="ul"
        stagger
        className="shell section-md grid gap-x-[var(--gutter-x)] gap-y-[var(--gutter-y-sm)] md:grid-cols-3"
      >
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="group block">
              {post.coverImage && (
                <div className="overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
                  <img
                    src={post.coverImage}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                  />
                </div>
              )}
              <h2 className="mt-[var(--m-small)] text-[length:var(--fs-h4)] font-semibold leading-[var(--lh-6)] tracking-[var(--ls-4)]">
                {post.title}
              </h2>
              <time
                dateTime={post.publishedAt.toISOString()}
                className="t-caption mt-2 block text-muted"
              >
                {formatDate(post.publishedAt)}
              </time>
            </Link>
          </li>
        ))}
      </Reveal>

      {s.cta?.heading && (
        <section className="section-md">
          <Marquee speed={28} repeat={3} itemClassName="pr-[3vw]">
            <span className="text-[length:var(--fs-marquee)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
              {s.cta.heading}
            </span>
          </Marquee>

          <Reveal className="shell mt-[var(--m-large)] flex flex-col items-center gap-[var(--m-small)] text-center">
            <p className="t-para-md max-w-[52ch]">{s.cta.body}</p>
            <Button href={s.cta.ctaUrl || "/contact"}>
              {s.cta.ctaLabel || "Reach out to us"}
            </Button>
          </Reveal>
        </section>
      )}
    </>
  );
}
