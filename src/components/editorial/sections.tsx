import { cn } from "@/lib/utils";

import { Mail } from "./icons";
import { CtaRow, type ProjectItem } from "./cards";
import { PortfolioTabs } from "./PortfolioTabs";
import { A, Button, CircleLink, Frame, Marquee, ScrollDown, SectionHead } from "./ui";

export { CtaRow, ProjectCard, type ProjectItem } from "./cards";

type Cta = { label: string; href: string };

/* ------------------------------------------------------------------ hero */

function HeroLetters({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  return (
    <>
      {words.map((word, w) => (
        <span key={w}>
          <span className="hero-word">{Array.from(word).map((ch, i) => <span key={i} className="hero-char">{ch}</span>)}</span>
          {w < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}

/**
 * Full-viewport hero: a wordmark that flips in letter by letter in 3D, a strip of
 * disciplines, an intro with a call to action and captions on either side.
 */
// Advance widths (em) of Overused Grotesk SemiBold capitals, so the wordmark can
// be sized to one line on the server instead of measuring after paint.
const GLYPH: Record<string, number> = {
  A: 0.663, B: 0.626, C: 0.677, D: 0.664, E: 0.562, F: 0.562, G: 0.687, H: 0.635, I: 0.219, J: 0.353, K: 0.611, L: 0.544, M: 0.812,
  N: 0.645, O: 0.705, P: 0.611, Q: 0.701, R: 0.607, S: 0.601, T: 0.609, U: 0.634, V: 0.642, W: 0.987, X: 0.608, Y: 0.608, Z: 0.587,
  "0": 0.596, "1": 0.357, "2": 0.552, "3": 0.558, "4": 0.572, "5": 0.558, "6": 0.578, "7": 0.541, "8": 0.558, "9": 0.578,
  " ": 0.199, "&": 0.655, ".": 0.219, ",": 0.219, "-": 0.398, "'": 0.211, "/": 0.449, "+": 0.567,
};

/** Hero size in vw: the source's 15.09vw, reduced only when the title would not fit on one line. */
function heroSize(title: string) {
  const chars = Array.from(title.toUpperCase());
  const em = chars.reduce((sum, ch) => sum + (GLYPH[ch] ?? 0.62) - 0.03025, 0);
  return Math.min(15.09, 97 / Math.max(em, 0.1));
}

export function Hero({ title, services = [], text, cta, captionLeft, image, imageMobile, scrollLabel }: { title: string; services?: string[]; text?: string; cta?: Cta; captionLeft?: string; image: string; imageMobile?: string; scrollLabel?: string }) {
  const size = heroSize(title.replace(/\s+/g, " ").trim());
  const scale = size < 15.09 ? { fontSize: `${size.toFixed(3)}vw` } : undefined;
  return (
    <section className="hero" data-hero>
      <div data-hero-shift="5">
        <div className="hero-top">
          <div className="container-fluid">
            <div className="hero-heading-wrap">
              <div className="hero-rotation">
                <div className="hero-front">
                  <h1 className="hero-heading" style={scale} aria-label={title}><span aria-hidden="true"><HeroLetters text={title} /></span></h1>
                </div>
                <div className="hero-back" aria-hidden="true">
                  <div className="hero-heading" style={scale}><HeroLetters text={title} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {services.length > 0 && (
        <div className="hero-middle" data-hero-shift="5">
          <div className="container-fluid opacity-80">
            <div className="hero-services" data-ix="fade-up-long" data-ix-delay="0.3">
              {services.map((service) => <div key={service} data-ix="chars" data-ix-delay="0.5">{service}</div>)}
            </div>
          </div>
        </div>
      )}

      <div className="hero-bottom">
        <div className="container-fluid opacity-80">
          <div className="grid-12">
            <div className="hero-caption-first" data-hero-shift="-5">
              <div className="hero-caption" data-ix="fade-up" data-ix-delay="1.3">{captionLeft}</div>
            </div>
            <div className="hero-text" data-hero-shift="5">
              <div data-ix="fade-up" data-ix-delay="1.45">
                {text && <p className="paragraph-small no-indent caps mb-small">{text}</p>}
                {cta && <Button href={cta.href} variant="white">{cta.label}</Button>}
              </div>
            </div>
            <div className="hero-caption-third" data-hero-shift="-5">
              <div data-ix="fade-up" data-ix-delay="1.6"><ScrollDown label={scrollLabel} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-image" aria-hidden="true">
        <div className="hero-image-inner" data-hero-image>
          {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
          <img src={image} alt="" className="desktop" fetchPriority="high" />
          {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
          <img src={imageMobile || image} alt="" className="mobile" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- about */

export function StoryMarquee({ heading, index, className }: { heading: string; index?: string; className?: string }) {
  return (
    <div className={className}>
      <Marquee itemClassName="large-gap" duration={62}>
        <h2 className="marquee-heading">{heading}</h2>
        {index && <div className="marquee-number">{index}</div>}
      </Marquee>
    </div>
  );
}

export function AboutSection({ label = "(About)", body, cta, images, marquee, className }: { label?: string; body: string; cta?: Cta; images: [string, string?]; marquee?: { heading: string; index?: string }; className?: string }) {
  return (
    <section className={cn("section", className)} id="about">
      <div className="container-fluid">
        <div className="about-grid">
          <div className="about-copy">
            <div className="about-content">
              <div className="mb-medium relative">
                <div className="about-caption"><h2 className="section-title" data-ix="fade">{label}</h2></div>
                <p className="paragraph-large" data-ix="lines"><span className="indent-large" />{body}</p>
              </div>
              {cta && <div data-ix="fade-up" data-ix-delay="0.2"><Button href={cta.href}>{cta.label}</Button></div>}
            </div>
          </div>
          <div className="about-images">
            <div className="about-image-one"><Frame src={images[0]} ix="unmask" /></div>
            {images[1] && <div className="about-image-two"><Frame src={images[1]} ix="unmask" /></div>}
          </div>
        </div>
      </div>
      {marquee && <StoryMarquee heading={marquee.heading} index={marquee.index} className="about-marquee" />}
    </section>
  );
}

/* --------------------------------------------------- services carousel */

export type ServiceCard = { index: string; title: string; text: string; image?: string; tags?: string[] };

export function ServicesCarousel({ label = "(Services)", index, body, items, id = "services" }: { label?: string; index?: string; body?: string; items: ServiceCard[]; id?: string }) {
  return (
    <section className="section shadow" id={id}>
      <div className="mb-large">
        <div className="container-fluid">
          <SectionHead label={label} index={index}>
            {body && <p className="paragraph-large" data-ix="lines">{body}</p>}
          </SectionHead>
        </div>
      </div>
      <div className="carousel" data-carousel data-cursor="Drag" data-ix="fade-up" data-ix-delay="0.2">
        <div className="carousel-inner" data-carousel-inner>
          {items.map((item) => (
            <article key={item.index + item.title} className="service-card">
              <div className="service-card-content">
                <div className="number-wrapper"><div className="block-number">{item.index}</div></div>
                <div className="mb-small"><h3 className="heading-small">{item.title}</h3></div>
                <div className="service-card-bottom"><p className="paragraph-small">{item.text}</p></div>
              </div>
              <div className="service-card-thumb">
                <div className="service-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
                  {item.image && <img src={item.image} alt="" loading="lazy" draggable={false} />}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="service-card-tags">{item.tags.map((tag) => <div key={tag} className="tag-blur">{tag}</div>)}</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- mission split scene */

export function SplitMission({ label = "(Our Mission)", eyebrow, words, sup, text, index, image, circle }: { label?: string; eyebrow?: string; words: [string, string, string]; sup?: string; text: string; index?: string; image: string; circle?: { href: string; text: string; label: string } }) {
  return (
    <section className="split shadow" data-split>
      <div className="split-sticky">
        <div className="split-bg" data-split-part="bg" />
        <div className="split-image" data-split-part="img">
          {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
          <img src={image} alt="" loading="lazy" />
          {circle && (
            <div className="split-cta">
              <div data-split-part="cta"><CircleLink href={circle.href} text={circle.text} label={circle.label} /></div>
            </div>
          )}
        </div>
        <div className="split-content">
          <div className="split-top">
            <div className="grid-12 sm">
              <div className="span-l7" data-split-part="fade"><div className="section-title" style={{ whiteSpace: "pre-line" }}>{eyebrow}</div></div>
              <div className="span-r7 align-right" data-split-part="fade"><h2 className="section-title">{label}</h2></div>
            </div>
          </div>
          <div className="split-middle" aria-label={words.join(" ")} role="heading" aria-level={3}>
            <div className="split-line"><div data-split-part="l1" aria-hidden="true"><span className="heading-large">{words[0]}{sup && <span className="sup">{sup}</span>}</span></div></div>
            <div className="split-line two"><div data-split-part="l2" aria-hidden="true"><span className="heading-large">{words[1]}</span></div></div>
            <div className="split-line three"><div data-split-part="l3" aria-hidden="true"><span className="heading-large">{words[2]}</span></div></div>
          </div>
          <div className="split-bottom">
            <div className="grid-12 sm">
              <div className="span-l10" data-split-part="fade"><div className="split-text"><p className="paragraph-small">{text}</p></div></div>
              <div className="span-r10 align-right" data-split-part="fade"><div className="section-title">{index}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- portfolio */

export function PortfolioSection({ label = "(Portfolio)", index, heading, projects, cta, id = "work" }: { label?: string; index?: string; heading: string; projects: ProjectItem[]; cta?: Cta & { body?: string }; id?: string }) {
  return (
    <section className="section shadow" id={id}>
      <div className="container-fluid">
        <div className="mb-large">
          <SectionHead label={label} index={index}>
            {heading.length > 32
              ? <p className="paragraph-large" data-ix="lines">{heading.replace(/\n/g, " ")}</p>
              : <h3 className="heading-medium" data-ix="lines" style={{ whiteSpace: "pre-line" }}>{heading}</h3>}
          </SectionHead>
        </div>
        <PortfolioTabs projects={projects} cta={cta} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------- sticky benefits */

export type BenefitItem = { index: string; title: string; text: string; image?: string; links?: { label: string; href: string; icon?: React.ReactNode }[] };

export function BenefitCard({ item, className }: { item: BenefitItem; className?: string }) {
  return (
    <div className={cn("benefit-card", className)}>
      <div className="number-wrapper"><div className="block-number" data-ix="fade">{item.index}</div></div>
      <div className="benefit-top">
        <div className="benefit-title"><h3 className="heading-small" data-ix="lines" style={{ whiteSpace: "pre-line" }}>{item.title}</h3></div>
        <div className="benefit-text"><p className="paragraph-small no-indent" data-ix="lines">{item.text}</p></div>
        {item.links && item.links.length > 0 && (
          <div className="benefit-links">{item.links.map((link) => <A key={link.href} href={link.href} className="icon-link">{link.icon ?? <Mail />}<span className="text-link">{link.label}</span></A>)}</div>
        )}
      </div>
      {item.image && (
        <div className="benefit-bottom">
          <div className="benefit-image" data-ix="fade" data-ix-delay="0.5"><Frame src={item.image} ix="scale-out" /></div>
        </div>
      )}
    </div>
  );
}

export function BenefitsSection({ label = "(Benefits)", index, headingOne, headingTwo, items, image = "/images/art/benefits.webp", grid = false, defaultPadding = false }: { label?: string; index?: string; headingOne?: string; headingTwo?: string; items: BenefitItem[]; image?: string; grid?: boolean; defaultPadding?: boolean }) {
  return (
    <section className="section no-p">
      <div className={cn("bg-section", defaultPadding && "default-padding")}>
        <div className="bg-wrapper" aria-hidden={!headingOne && !label ? true : undefined}>
          <div className="bg-sticky">
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop */}
            <img src={image} alt="" loading="lazy" />
            <div className="bg-overlay" />
            <div className="bg-content">
              <div className="bg-grid">
                {headingOne && <div className="bg-heading-one"><h2 className="heading-small" style={{ whiteSpace: "pre-line" }}>{headingOne}</h2></div>}
                {index && <div className="bg-index section-title">{index}</div>}
                <div className="bg-label"><h2 className="section-title">{label}</h2></div>
                {headingTwo && <div className="bg-heading-two"><div className="heading-small" style={{ whiteSpace: "pre-line" }}>{headingTwo}</div></div>}
              </div>
            </div>
          </div>
        </div>
        <div className="benefits">
          <div className="container-fluid">
            {grid ? (
              <div className="grid-12"><div className="benefits-grid" data-scrub="benefits">{items.map((item, i) => <BenefitCard key={item.index + item.title} item={item} className={i % 2 ? "two" : undefined} />)}</div></div>
            ) : (
              <div className="benefits-list" data-scrub="benefits">{items.map((item, i) => <BenefitCard key={item.index + item.title} item={item} className={i === 1 ? "two" : undefined} />)}</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ blog */

export type PostItem = { href: string; title: string; date: string; dateTime?: string; image?: string };

export function BlogCard({ post, delay }: { post: PostItem; delay?: number }) {
  return (
    <div className="blog-item" data-ix="fade-left" data-ix-delay={delay ? String(delay) : undefined}>
      <A href={post.href} className="blog-card">
        {post.image && <div className="blog-thumb"><Frame src={post.image} /></div>}
        <div className="blog-intro-wrap">
          <div className="blog-intro">
            <span className="blog-dot" />
            <h3 className="blog-title">{post.title}</h3>
            <time className="blog-date" dateTime={post.dateTime}>{post.date}</time>
          </div>
        </div>
      </A>
    </div>
  );
}

export function BlogSection({ label = "(Blog)", index, body, posts, cta, heading }: { label?: string; index?: string; body?: string; heading?: string; posts: PostItem[]; cta?: Cta & { body?: string } }) {
  return (
    <section className="section">
      <div className="overflow-hidden">
        <div className="container-fluid">
          <div className="mb-large">
            <SectionHead label={label} index={index} wide={!!heading}>
              {heading ? <h3 className="heading-medium" data-ix="lines" style={{ whiteSpace: "pre-line" }}>{heading}</h3> : body ? <p className="paragraph-large" data-ix="lines">{body}</p> : null}
            </SectionHead>
          </div>
          <div className={cn("grid-3", cta && "mb-large")}>{posts.map((post, i) => <BlogCard key={post.href} post={post} delay={i * 0.15} />)}</div>
          {cta && <CtaRow cta={cta} />}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ playground */

const PLAYGROUND_DELAYS = [1.15, 0.75, 0.95, 1.35, 1.05, 0.85, 1.25];

export function PlaygroundSection({ label = "(Playground)", index, heading, cta, images }: { label?: string; index?: string; heading: string; cta?: Cta; images: { src: string; alt?: string }[] }) {
  const cards = images.slice(0, 7);
  return (
    <section className="playground" aria-label={heading}>
      <div className="playground-sticky">
        <div className="playground-inner">
          <div className="playground-grid">
            <div className="container-fluid relative" style={{ zIndex: 1 }}>
              <div className="grid-12 zero">
                <div className="span-l7"><h2 className="section-title" data-ix="fade">{label}</h2></div>
                <div className="span-r7 align-right"><div className="section-title" data-ix="fade">{index}</div></div>
              </div>
            </div>
            <div className="playground-heading">
              <div className="container-fluid">
                <div className="mb-medium"><h3 className="heading-large" data-ix="lines">{heading}</h3></div>
                {cta && <div data-ix="fade-up" data-ix-delay="0.3"><Button href={cta.href}>{cta.label}</Button></div>}
              </div>
            </div>
            <div />
          </div>
        </div>
      </div>
      <div className="playground-images" data-playground data-cursor="Drag">
        {cards.map((image, i) => (
          <div key={image.src + i} className={`playground-card p${i + 1}`} data-playground-item data-ix-delay={String(PLAYGROUND_DELAYS[i])}>
            <Frame src={image.src} alt={image.alt} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- inner page top */

export function PageTop({ title, pill, captions, image, small = false, children }: { title: string; pill?: string; captions: [React.ReactNode, React.ReactNode?]; image?: string; small?: boolean; children?: React.ReactNode }) {
  return (
    <section className="page-top">
      <div className="container-fluid">
        <div className={cn("page-title-wrap", small && "small")}>
          {pill && (
            <div className="page-pill-wrap">
              <div className="page-pill" data-ix="fade-scale"><Marquee duration={24} repeat={3} itemClassName="tiny-gap"><div className="section-caption">{pill}</div></Marquee></div>
            </div>
          )}
          <div className="page-title-inner">
            <h1 className={small ? "page-title-small" : "page-title"} data-ix="lines">{title}</h1>
          </div>
        </div>
        <div className="mb-medium">
          <div className="caption-grid">
            <div data-ix="fade-up" data-ix-delay="0.2"><div className="hero-caption">{captions[0]}</div></div>
            <div data-ix="fade-up" data-ix-delay="0.3"><div className="hero-caption">{captions[1]}</div></div>
            <div data-ix="fade-up" data-ix-delay="0.4"><ScrollDown /></div>
          </div>
        </div>
        {image && <ParallaxImage src={image} />}
        {children}
      </div>
    </section>
  );
}

export function ParallaxImage({ src, alt = "", children }: { src: string; alt?: string; children?: React.ReactNode }) {
  return (
    <div className="parallax-frame" data-ix="fade" data-ix-delay="0.5">
      <div className="parallax-inner" data-ix="parallax">
        {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
        <img src={src} alt={alt} loading="eager" />
      </div>
      {children}
    </div>
  );
}

/* --------------------------------------------------- contact call to action */

export function CallToAction({ heading = "Contact Us", index, text, cta }: { heading?: string; index?: string; text: string; cta: Cta }) {
  return (
    <section className="section">
      <div className="mb-large"><StoryMarquee heading={heading} index={index} /></div>
      <div className="container">
        <div className="mb-medium"><div className="divider" data-ix="divider" /></div>
        <div className="call-action">
          <div><p className="paragraph-medium no-indent" data-ix="lines">{text}</p></div>
          <div data-ix="fade-up"><Button href={cta.href}>{cta.label}</Button></div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ about page */

export function Achievements({ items }: { items: { value: string; label: string; image?: string }[] }) {
  return (
    <div className="carousel" data-carousel data-cursor="Drag" data-ix="fade-up" data-ix-delay="0.5">
      <div className="carousel-inner" data-carousel-inner>
        {items.map((item) => (
          <div key={item.label} className="achievement">
            {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
            {item.image && <img src={item.image} alt="" loading="lazy" draggable={false} />}
            <div className="achievement-content">
              <div className="achievement-number">{item.value}</div>
              <div className="section-caption">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardsGrid({ items, parallax = false, small = false }: { items: { number: string; title: string; text: string }[]; parallax?: boolean; small?: boolean }) {
  return (
    <div className="cards-grid" data-scrub={parallax ? "approach" : undefined}>
      {items.map((item, i) => (
        <div key={item.number + item.title} className={cn("card-item", i === 1 && "two", i === 2 && "three")} data-ix={parallax ? undefined : "fade-up"} data-ix-delay={parallax ? undefined : String((i % 3) * 0.15)}>
          <div className={cn("card-number", small && "small")}>{item.number}</div>
          {small ? <h3 className="card-title">{item.title}</h3> : <div className="mb-extra-small"><h3 className="card-title-large">{item.title}</h3></div>}
          <p className="card-text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function AwardsList({ items }: { items: { title: string; category: string; year: string; url?: string }[] }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.title + item.year} className="awards-row">
          <div className="divider" data-ix="divider" style={{ position: "absolute", top: 0, left: 0, width: "100%" }} />
          <div className="awards-cols" data-ix="fade-up">
            <div>{item.url ? <A href={item.url} className="text-link">{item.title}</A> : item.title}</div>
            <div className="muted">{item.category}</div>
            <div />
            <div>{item.year}</div>
          </div>
        </div>
      ))}
      <div className="divider" data-ix="divider" />
    </div>
  );
}

export function TeamGrid({ members }: { members: { name: string; role: string; photo?: string; links: { label: string; href: string }[] }[] }) {
  return (
    <div className="grid-3">
      {members.map((member, i) => (
        <div key={member.name} data-ix="fade-up" data-ix-delay={String((i % 3) * 0.15)}>
          <div className="team-image">
            {/* eslint-disable-next-line @next/next/no-img-element -- owner/CMS supplied */}
            {member.photo && <img src={member.photo} alt={member.name} loading="lazy" className="cover" />}
            {member.links.length > 0 && <div className="team-links">{member.links.map((link) => <A key={link.href} href={link.href} className="team-link">{link.label}</A>)}</div>}
          </div>
          <h3 className="team-title">{member.name}</h3>
          <div className="team-role">{member.role}</div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------------------- services page */

export function ServicesGalleryHero({ background, images }: { background: string; images: string[] }) {
  return (
    <ParallaxImage src={background}>
      <div className="services-gallery">
        <div className="services-gallery-rot">
          <div className="services-gallery-inner" data-scrub="gallery">
            {images.map((src, i) => <div key={src + i} className="services-gallery-item"><Frame src={src} /></div>)}
          </div>
        </div>
      </div>
    </ParallaxImage>
  );
}

export function ServiceStackItem({ title, text, tags, image, thumb }: { title: string; text: string; tags: string[]; image?: string; thumb?: string }) {
  return (
    <div className="service-item" data-scrub="service">
      <div data-service-inner>
        <div className="container-fluid">
          <div className="grid-12">
            <div className="service-copy">
              <div className="mb-small"><h3 className="service-title" data-ix="lines">{title}</h3></div>
              <div className="mb-extra-small"><p className="paragraph-small no-indent" style={{ maxWidth: "36rem" }} data-ix="lines">{text}</p></div>
              {tags.length > 0 && <div className="service-tags mb-medium" data-ix="fade-up">{tags.map((tag) => <span key={tag} className="service-tag">{tag}</span>)}</div>}
              {thumb && <div className="service-thumb" data-ix="fade-up"><Frame src={thumb} /></div>}
            </div>
            {image && <div className="service-media service-image"><Frame src={image} ix="unmask" /></div>}
          </div>
        </div>
      </div>
      <div className="service-overlay" />
    </div>
  );
}

/* --------------------------------------------------------- contact page */

export function ContactLines({ items }: { items: { label: string; href: string; icon: React.ReactNode; index: string }[] }) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.href} className="contact-line">
          <div className="divider top" data-ix="divider" />
          <div className="grid-12 zero" data-ix="fade-up">
            <div><A href={item.href} className="contact-big-link">{item.icon}<span className="text-link">{item.label}</span></A></div>
            <div className="block-number">{item.index}</div>
          </div>
          <div className="divider bottom" data-ix="divider" />
        </div>
      ))}
    </div>
  );
}
