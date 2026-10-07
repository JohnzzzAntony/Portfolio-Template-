"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const pathname = usePathname();
  const scoped = typeof href === "string" && pathname.startsWith("/demo") && /^\/(?:$|about|services|portfolio|blog|projects|contact)/.test(href) ? `/demo${href === "/" ? "" : href}` : href;
  return <NextLink href={scoped} {...props} />;
}
