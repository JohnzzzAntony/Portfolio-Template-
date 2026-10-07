import { ScrollCue } from "@/components/ui/ScrollCue";

/**
 * The opening block every inner page shares: oversized page title, a left meta
 * line, a right copyright, and the scroll cue.
 */
export function PageHero({
  title,
  metaLeft,
  metaRight,
  image,
}: {
  title: string;
  metaLeft?: string;
  metaRight?: string;
  image?: string;
}) {
  return (
    <section className="px-[var(--page-x)] pb-[var(--section-y-md)] pt-[calc(var(--nav-h)+var(--page-title-y))]">
      <h1 className="t-page-title whitespace-pre-line">{title}</h1>

      <div className="hairline mt-[var(--m-medium)] flex flex-wrap items-baseline justify-between gap-4 pt-[var(--m-xs)]">
        {metaLeft && <span className="t-caption">{metaLeft}</span>}
        {metaRight && <span className="t-caption">{metaRight}</span>}
        <ScrollCue className="ml-auto" />
      </div>

      {image && (
        <figure className="bleed mt-[var(--section-y-md)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
          <img src={image} alt="" className="h-[60vh] w-full object-cover" />
        </figure>
      )}
    </section>
  );
}
