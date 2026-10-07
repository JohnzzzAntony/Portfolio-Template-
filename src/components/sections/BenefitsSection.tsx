import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Benefit = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
};

/**
 * "The Impact We Deliver". Each card's title animates in character-by-character
 * — the source's most distinctive text treatment.
 */
export function BenefitsSection({
  label,
  index,
  heading,
  subheading,
  benefits,
}: {
  label?: string;
  index?: string;
  heading?: string;
  subheading?: string;
  benefits: Benefit[];
}) {
  return (
    <section className="section shell">
      <SectionHeader label={label} index={index} />

      <div className="mt-[var(--m-large)] flex flex-col gap-[var(--m-xs)]">
        {heading && <h2 className="t-display uppercase">{heading}</h2>}
        {subheading && (
          <h3 className="t-display uppercase text-muted">{subheading}</h3>
        )}
      </div>

      <ul className="mt-[var(--m-large)] grid gap-x-[var(--gutter-x)] gap-y-[var(--gutter-benefits-y)] md:grid-cols-3">
        {benefits.map((benefit) => (
          <li key={benefit.id} className="flex flex-col">
            <span className="t-caption text-muted">{benefit.index}</span>

            <SplitText
              as="h4"
              by="char"
              text={benefit.title}
              className="t-display-sm mt-[var(--m-xs)] uppercase"
            />

            <Reveal delay={0.1} className="mt-[var(--m-small)]">
              <p className="t-para-md">{benefit.description}</p>
            </Reveal>

            {benefit.image && (
              <Reveal as="figure" delay={0.15} className="mt-[var(--m-medium)] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
                <img
                  src={benefit.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
              </Reveal>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
