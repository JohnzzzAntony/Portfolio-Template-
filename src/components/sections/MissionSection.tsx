import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Full-bleed dark section: giant stacked headline over a background image,
 * with the mission copy set small alongside it.
 */
export function MissionSection({
  label,
  index,
  heading,
  body,
  image,
  eyebrow,
  ctaLabel,
  ctaUrl,
}: {
  label?: string;
  index?: string;
  heading?: string;
  body?: string;
  image?: string;
  eyebrow?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden px-[var(--page-x)] py-[var(--section-y)] on-dark">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote
        <img
          src={image}
          alt=""
          className="absolute inset-0 -z-10 size-full object-cover opacity-55"
        />
      )}

      <SectionHeader label={label} index={index} />

      {eyebrow && (
        <p className="t-caption mt-[var(--m-medium)] opacity-70">{eyebrow}</p>
      )}

      {heading && (
        <SplitText
          as="h2"
          by="line"
          text={heading}
          className="t-display mt-[var(--m-small)] uppercase"
        />
      )}

      <div className="mt-[var(--m-large)] grid gap-[var(--gutter-x)] lg:grid-cols-[1fr_1fr]">
        <div />
        <Reveal className="flex flex-col items-start gap-[var(--m-medium)]">
          {body && <p className="t-para-md">{body}</p>}
          {ctaUrl && (
            <Button href={ctaUrl} variant="light">
              {ctaLabel || "View our services"}
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
