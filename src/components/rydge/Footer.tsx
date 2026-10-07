import { ArrowUp } from "./icons";
import { A, Button, CircleLink, Marquee, SlideText } from "./ui";

type Link = { label: string; href: string };

/**
 * Full-height black footer: parallax artwork, a call to action, social columns
 * and back-to-top, two counter-running wordmark marquees with a rotating
 * "let's talk" disc between them, then credits.
 */
export function Footer({
  lineOne,
  lineTwo,
  headline,
  cta,
  socials,
  image = "/images/art/footer.webp",
  badge,
  credits,
  links = [],
}: {
  lineOne: string;
  lineTwo: string;
  headline: string;
  cta: Link;
  socials: Link[];
  image?: string;
  badge?: { text: string; href: string; label: string };
  credits: React.ReactNode;
  links?: Link[];
}) {
  const half = Math.ceil(socials.length / 2);
  const columns = [socials.slice(0, half), socials.slice(half)].filter((c) => c.length);

  return (
    <footer className="footer" id="contact-footer">
      <div className="footer-bg" aria-hidden="true">
        <div className="parallax-inner" data-ix="parallax">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative backdrop */}
          <img src={image} alt="" loading="lazy" style={{ opacity: 0.55 }} />
        </div>
      </div>
      <div className="footer-rows">
        <div className="footer-top">
          <div className="container-fluid">
            <div className="grid-12">
              <div className="footer-widget cta">
                <div className="mb-tiny">{headline}</div>
                <Button href={cta.href} variant="white" size="small">{cta.label}</Button>
              </div>
              {columns.length > 0 && (
                <div className="footer-widget links">
                  {columns.map((column, i) => (
                    <div key={i} className="footer-links">
                      {column.map((link) => (
                        <A key={link.href + link.label} href={link.href} className="footer-link"><SlideText>{link.label}</SlideText></A>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <div className="footer-widget back">
                <a href="#top" className="back-top">
                  <span className="back-top-icon"><span className="back-top-icon-inner"><ArrowUp /><ArrowUp /></span></span>
                  <span className="back-top-text">Back to top</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="overflow-hidden" aria-label={`${lineOne} ${lineTwo}`} role="img">
            <Marquee duration={62} repeat={2}><span className="footer-heading">{lineOne}</span></Marquee>
            <Marquee reverse duration={42} repeat={2} itemClassName="left-gap"><span className="footer-heading">{lineTwo}</span></Marquee>
          </div>
          {badge && (
            <div className="footer-circle">
              <CircleLink href={badge.href} text={badge.text} label={badge.label} dark data-ix="scale-in" />
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <div className="container-fluid">
            <div className="grid-12">
              <div className="footer-credits">{credits}</div>
              {links.length > 0 && (
                <div className="footer-credits right">
                  {links.map((link) => <A key={link.href + link.label} href={link.href} className="link-inverse">{link.label}</A>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
