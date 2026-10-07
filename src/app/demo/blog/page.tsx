import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogCard, CallToAction, PageTop } from "@/components/editorial/sections";
import { getPage, getPosts, getSettings, sectionMap } from "@/lib/cms";
import { postItem } from "@/lib/demo-content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("blog");
}

export default async function BlogPage() {
  const page = await getPage("blog");
  if (!page) notFound();

  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  const s = sectionMap(page.sections);

  return (
    <>
      <PageTop title={page.title} pill={settings.tagline} captions={[page.metaLeft, page.metaRight]}>
        <div className="grid-3" style={{ paddingTop: "var(--r-section-y-md)" }}>
          {posts.map((post, i) => <BlogCard key={post.id} post={postItem(post, i)} delay={(i % 3) * 0.15} />)}
        </div>
      </PageTop>

      {s.cta && (
        <CallToAction
          heading={s.cta.heading || "Contact Us"}
          index={s.cta.index || "/01"}
          text={s.cta.body}
          cta={{ label: s.cta.ctaLabel || "Reach out to us", href: s.cta.ctaUrl || "/contact" }}
        />
      )}
    </>
  );
}
