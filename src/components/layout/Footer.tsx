import Link from "@/components/layout/SiteLink";

import { Marquee } from "@/components/motion/Marquee";
import { Button } from "@/components/ui/Button";
import { CircleBadge } from "@/components/ui/CircleBadge";

type Social = { id: string; label: string; url: string };

export function Footer({
  brandName,
  brandSuffix,
  headline,
  ctaLabel,
  ctaUrl,
  backgroundImage,
  badgeText,
  credits,
  copyright,
  socials,
}: {
  brandName: string;
  brandSuffix: string;
  headline: string;
  ctaLabel: string;
  ctaUrl: string;
  backgroundImage: string;
  badgeText: string;
  credits: string;
  copyright: string;
  socials: Social[];
}) {
  const half = Math.ceil(socials.length / 2);
  const columns = [socials.slice(0, half), socials.slice(half)];

  return (
    <footer className="relative isolate overflow-hidden on-dark">
      {backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element -- decorative backdrop, not content
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover opacity-70"
        />
      )}

      <div className="grid gap-[var(--m-medium)] px-[var(--page-x)] py-[var(--section-y-sm)] md:grid-cols-4 md:items-start">
        <div className="flex flex-col items-start gap-[var(--m-small)]">
          <span className="t-caption">{headline}</span>
          <Button href={ctaUrl} variant="primary" size="sm" spark={false}>
            {ctaLabel}
          </Button>
        </div>

        {columns.map((column, i) => (
          <ul key={i} className="flex flex-col gap-1">
            {column.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="t-caption transition-opacity hover:opacity-60"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        ))}

        <Link href="#top" className="group t-caption inline-flex items-center gap-2 md:justify-self-end">
          <span className="grid size-7 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:-translate-y-1">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="square" />
            </svg>
          </span>
          Back to top
        </Link>
      </div>

      <div className="relative py-[var(--section-y-sm)]">
        <Marquee speed={34} repeat={2} itemClassName="pr-[0.12em]">
          <span className="block text-[length:var(--fs-footer-heading)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
            {brandName}
          </span>
          <span className="block text-[length:var(--fs-footer-heading)] font-semibold uppercase leading-[var(--lh-1)] tracking-[var(--ls-1)]">
            {brandSuffix}
          </span>
        </Marquee>

        <Link
          href={ctaUrl}
          className="group absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          aria-label={ctaLabel}
        >
          <CircleBadge text={badgeText} />
        </Link>
      </div>

      <div className="hairline flex flex-wrap items-center justify-between gap-4 px-[var(--page-x)] py-[var(--m-base)] text-[length:var(--fs-footer-credits)]">
        <span>{credits}</span>
        <span className="opacity-70">
          {brandName} {brandSuffix} {copyright}
        </span>
      </div>
    </footer>
  );
}
