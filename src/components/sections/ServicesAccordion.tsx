"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Service = {
  id: string;
  index: string;
  title: string;
  description: string;
  image: string;
  capabilities: string[];
};

/**
 * Expertise list. One row open at a time, revealing the description, image and
 * capability pills. Uses buttons + aria-expanded so it is keyboard operable.
 */
export function ServicesAccordion({
  services,
  className,
}: {
  services: Service[];
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(services[0]?.id ?? null);

  return (
    <div className={cn("flex flex-col", className)}>
      {services.map((service) => {
        const expanded = open === service.id;
        const panelId = `service-panel-${service.id}`;

        return (
          <div key={service.id} className="hairline">
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : service.id)}
                className="group flex w-full items-baseline gap-[var(--gutter-x)] py-[var(--m-base)] text-left"
              >
                <span className="t-caption shrink-0 text-muted">{service.index}</span>
                <span className="text-[length:var(--fs-services-title)] font-semibold uppercase leading-[var(--lh-3)] tracking-[var(--ls-2)]">
                  {service.title}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "ml-auto grid size-10 shrink-0 place-items-center rounded-full border border-current transition-transform duration-500",
                    expanded && "rotate-45",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 5v14M5 12h14" strokeLinecap="square" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              hidden={!expanded}
              className="grid gap-[var(--gutter-x)] pb-[var(--m-medium)] lg:grid-cols-[1fr_1fr]"
            >
              {service.image && (
                <figure className="order-2 lg:order-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- CMS-supplied, may be remote */}
                  <img
                    src={service.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </figure>
              )}

              <div className="order-1 flex flex-col justify-between gap-[var(--m-medium)] lg:order-2">
                <p className="text-[length:var(--fs-services-text)] leading-[var(--lh-7)] tracking-[var(--ls-5)]">
                  {service.description}
                </p>

                {service.capabilities.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {service.capabilities.map((capability) => (
                      <li
                        key={capability}
                        className="rounded-[var(--radius-full)] border border-hairline px-[0.75rem] py-[0.3rem] text-[length:var(--fs-caption)]"
                      >
                        {capability}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
