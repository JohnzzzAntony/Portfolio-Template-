import NextLink from "next/link";

import { cn } from "@/lib/utils";

import { ArrowDownRight, ArrowUpRight, Spark } from "./icons";

const isInternal = (href: string) => href.startsWith("/") && !href.startsWith("//");

/**
 * Internal routes go through the router; everything else is a plain anchor.
 * "~/path" is the CMS's way of writing a root-relative link.
 * Every internal click scrolls immediately to top to reveal the header section.
 */
export function A({ href, children, className, external, onClick, ...rest }: { href: string; children: React.ReactNode; className?: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const target = href.startsWith("~/") ? href.slice(1) : href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }
    onClick?.(e);
  };

  if (isInternal(target) && !external) {
    return (
      <NextLink href={target} scroll={true} className={className} onClick={handleClick} {...rest}>
        {children}
      </NextLink>
    );
  }
  const newTab = external ?? /^https?:/.test(target);
  return <a href={target} className={className} onClick={handleClick} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>{children}</a>;
}

/** Two stacked copies of a label; hovering slides the first out and the second in. */
export function SlideText({ children }: { children: React.ReactNode }) {
  return (
    <span className="slide-link">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

type ButtonProps = {
  children: string;
  href?: string;
  variant?: "outline" | "white" | "black" | "ghost-light";
  size?: "md" | "small" | "large";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  name?: string;
  value?: string;
  external?: boolean;
} & { [key: `data-${string}`]: string | undefined };

/**
 * Pill button. The inner row is wider than the clip: hovering slides it right so
 * a spark enters from the left while the label rolls up to its duplicate.
 */
export function Button({ children, href, variant = "outline", size = "md", className, type = "button", disabled, name, value, external, ...data }: ButtonProps) {
  const classes = cn("button", variant !== "outline" && variant, size !== "md" && size, className);
  const label = (
    <span className="button-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
  const body = size === "md" ? (
    <span className="button-clip">
      <span className="button-inner">
        <Spark className="button-icon back" />
        {label}
        <Spark className="button-icon" />
      </span>
    </span>
  ) : (
    <span className="button-clip"><span className="button-inner">{label}{size === "large" && <ArrowUpRight className="button-icon" />}</span></span>
  );

  if (href) {
    return <A href={href} className={classes} external={external} aria-disabled={disabled || undefined} {...data}>{body}</A>;
  }
  return <button type={type} className={classes} disabled={disabled} name={name} value={value} {...data}>{body}</button>;
}

/** "(Label)" on the left, "/0N" on the right and an optional centred statement. */
export function SectionHead({ label, index, children, wide = false, className }: { label?: string; index?: string; children?: React.ReactNode; wide?: boolean; className?: string }) {
  if (!label && !index && !children) return null;
  return (
    <div className={cn("section-head", wide && "wide", className)}>
      {label && <div className="sh-label section-title-wrapper"><h2 className="section-title" data-ix="fade">{label}</h2></div>}
      {index && <div className="sh-index section-title-wrapper"><div className="section-title" data-ix="fade">{index}</div></div>}
      {children && <div className="sh-body">{children}</div>}
    </div>
  );
}

export function ScrollDown({ label = "Scroll Down" }: { label?: string }) {
  return (
    <span className="scroll-down">
      <span className="hero-caption">{label}</span>
      <ArrowDownRight />
    </span>
  );
}

/**
 * Infinite marquee. Content is rendered twice so the -50% loop is seamless;
 * the copies are hidden from assistive tech.
 */
export function Marquee({ children, reverse = false, duration, repeat = 3, className, itemClassName }: { children: React.ReactNode; reverse?: boolean; duration?: number; repeat?: number; className?: string; itemClassName?: string }) {
  const copies = Array.from({ length: repeat * 2 });
  return (
    <div className={cn("marquee", reverse && "reverse", className)} style={duration ? ({ "--marquee-duration": `${duration}s` } as React.CSSProperties) : undefined}>
      <div className="marquee-track">
        {copies.map((_, i) => (
          <div key={i} className={cn("marquee-item", itemClassName)} aria-hidden={i > 0 || undefined}>{children}</div>
        ))}
      </div>
    </div>
  );
}

/** Text set on a circle, slowly counter-rotating, with an arrow that swaps on hover. */
export function CircleLink({ href, text, label, dark = false, className, ...data }: { href: string; text: string; label: string; dark?: boolean; className?: string } & { [key: `data-${string}`]: string | undefined }) {
  const id = `c${Array.from(text).reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7).toString(36)}`;
  return (
    <A href={href} className={cn("circle-link", dark && "dark", className)} aria-label={label} {...data}>
      <span className="circle-link-bg" />
      <svg className="circle-text" viewBox="0 0 100 100" aria-hidden="true">
        <defs><path id={id} d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0" /></defs>
        <text><textPath href={`#${id}`} textLength="236" lengthAdjust="spacing">{text}</textPath></text>
      </svg>
      <span className="circle-arrow"><ArrowUpRight /><ArrowUpRight /></span>
    </A>
  );
}

/** White disc with an arrow that exits up-right as its twin enters from bottom-left. */
export function ArrowDisc() {
  return (
    <span className="project-arrow" aria-hidden="true">
      <span className="project-arrow-inner"><ArrowUpRight /><ArrowUpRight /></span>
    </span>
  );
}

/** Image or video in a clipped frame; `ratio` is height as a percentage of width. */
export function Frame({ src, alt = "", ratio, className, imgClassName, priority, ix }: { src: string; alt?: string; ratio?: number; className?: string; imgClassName?: string; priority?: boolean; ix?: string }) {
  const isVideo = Boolean(src && /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src));
  return (
    <div className={cn("frame", className)} style={ratio ? { paddingTop: `${ratio}%` } : undefined} data-ix={ix}>
      {isVideo ? (
        <video src={src} autoPlay loop muted playsInline className={cn("cover", imgClassName)} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied images, possibly remote */
        <img src={src} alt={alt} className={imgClassName} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} draggable={false} />
      )}
    </div>
  );
}
