import { Button, SectionHead } from "@/components/editorial/ui";
import { CountUp, LoopVideo } from "@/components/editorial/Motion";

/**
 * Client-winning homepage sections, written from the portfolio brief.
 * Each reads an optional home-page Section (edit in /admin → Pages → Home) whose
 * body holds one item per line as "Title | text"; without it the defaults below show.
 */
type SectionCopy = { label?: string; heading?: string; subheading?: string; body?: string; ctaLabel?: string; ctaUrl?: string } | undefined;

const rows = (copy: SectionCopy, fallback: [string, string][]): [string, string][] => {
  const lines = (copy?.body || "").split("\n").map((line) => line.split("|").map((part) => part.trim())).filter(([title]) => title);
  return lines.length ? lines.map(([title, text = ""]) => [title, text]) : fallback;
};

const SKILLS: [string, string][] = [
  ["E-commerce", "Shopify, Liquid, Online Store 2.0, Metafields, Metaobjects, Admin GraphQL API, Custom Pixels, WordPress"],
  ["Front-end", "HTML5, CSS3, JavaScript, React, Next.js, Tailwind CSS, TypeScript, GSAP, Three.js"],
  ["Back-end", "Node.js, Express, Prisma ORM, REST APIs, JWT authentication, SQL databases"],
  ["Design", "Figma, Figma-to-code, mobile-first responsive design, UI motion"],
  ["Analytics & Marketing", "GA4, Google Tag Manager, dataLayer, Merchant Center, Google Ads, TikTok Ads, Meta catalogue, Google Business Profile, SEO"],
  ["Payments", "Tabby, Tamara, Shopify Payments, Google Pay, Apple Pay, Shop Pay, payment links, network terminals"],
  ["Automation", "n8n, Google Sheets API, Serper, Google Maps Places API, AI agents"],
  ["Hosting & Infrastructure", "cPanel/WHM, DNS, domains, SSL, Vercel, Railway, GitHub, business email"],
  ["Quality Assurance", "Selenium, Appium, Jira, Trello, regression, cross-browser and mobile testing"],
];
const PROCESS: [string, string][] = [
  ["Discovery call", "Your business, products, audience, payment methods and goals — with a requirements questionnaire if needed."],
  ["Plan & quote", "A clear scope, timeline and a fixed price or hourly estimate before any work starts."],
  ["Build on a draft", "All work happens on a duplicate theme or staging site. Your live store keeps selling."],
  ["Preview & test", "You review a preview link; I test on mobile, desktop and Safari."],
  ["Publish & handover", "Go live, a short walkthrough of the theme-editor settings, and documentation."],
  ["Support", "Optional monthly retainer for updates, campaigns and fixes."],
];
const WHY: [string, string][] = [
  ["UAE e-commerce experience", "AED pricing, emirate-based delivery, Tabby/Tamara, WhatsApp-first customers, Arabic & English audiences."],
  ["Luxury retail focus", "Perfume, oud, flowers, watches and lifestyle brands."],
  ["Code and business together", "Themes, payments, ads, tracking, feeds and domains in one person."],
  ["No-risk workflow", "Drafts and previews before anything touches your live store."],
  ["Editable results", "Settings exposed in the Shopify theme editor, so small changes never wait on a developer."],
  ["QA-tested delivery", "A software-testing background means fewer bugs after launch."],
  ["Dubai time zone", "Easy collaboration across the GCC, Europe and South Asia."],
];
const FAQ: [string, string][] = [
  ["Do you work as a freelance Shopify developer in Dubai?", "Yes. I take on freelance Shopify development, theme customisation and e-commerce projects for businesses in Dubai, the wider UAE, the GCC and internationally — remotely or on-site in Dubai."],
  ["Can you convert my Figma design into a Shopify theme?", "Yes. I build mobile-first Shopify themes directly from Figma, including animations and hover effects, with sections editable in the theme editor."],
  ["Can you add Tabby and Tamara to my Shopify store?", "Yes. I’ve added and styled Tabby and Tamara widgets on multiple UAE stores, placed correctly on product pages without breaking the layout."],
  ["Can you set up GA4 and Google Tag Manager tracking?", "Yes — a full GA4 e-commerce dataLayer through GTM from product views to add-to-cart, plus a Shopify Custom Pixel for checkout and purchase."],
  ["Can you create product feeds for Google, Meta and TikTok?", "Yes. I build XML product feeds and set up Google Merchant Center so your products qualify for Shopping ads and free listings."],
  ["Will you edit my live store directly?", "No. I work on a duplicate theme, share a preview link, and publish only after you approve."],
  ["Do you build websites outside Shopify?", "Yes — custom websites and web apps with Next.js, React, Node.js and Prisma, including admin panels, plus WordPress and static sites."],
];

export function StatsBand({ items }: { items: { value: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="section stats-band" aria-label="At a glance">
      <div className="container-fluid">
        <div className="stats-grid">
          {items.map((item, i) => (
            <div key={item.label} className="stat" data-ix="fade-up" data-ix-delay={String(i * 0.08)}>
              <div className="stat-value"><CountUp value={item.value} /></div>
              <div className="stat-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection({ copy }: { copy: SectionCopy }) {
  const items = rows(copy, SKILLS);
  const tools = items.flatMap(([, text]) => text.split(",").map((tool) => tool.trim())).filter(Boolean);
  return (
    <section className="section skills" id="skills">
      <div className="container-fluid">
        <SectionHead label={copy?.label || "(Skills & Stack)"} index="/03" wide>
          <h3 className="heading-medium" data-ix="lines">{copy?.heading || "The full e-commerce stack, in one person."}</h3>
        </SectionHead>
      </div>
      <div className="skills-marquee" aria-hidden="true">
        {[0, 1].map((row) => (
          <div key={row} className={`skills-track${row ? " reverse" : ""}`}>
            {[...tools, ...tools].map((tool, i) => <span key={i} className="skill-chip">{tool}</span>)}
          </div>
        ))}
      </div>
      <div className="container-fluid">
        <div className="skills-layout">
          <LoopVideo src="/videos/skills-film.mp4" poster="/images/brand/skills-film-poster.webp" label="Animated map of the skills and tools I work with" className="skills-film" />
          <div className="skills-grid">
            {items.map(([area, list], i) => (
              <article key={area} className="skill-card" data-ix="fade-up" data-ix-delay={String((i % 3) * 0.08)}>
                <span className="skill-index">{String(i + 1).padStart(2, "0")}</span>
                <h4>{area}</h4>
                <p>{list}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection({ copy }: { copy: SectionCopy }) {
  const steps = rows(copy, PROCESS);
  return (
    <section className="section process" id="process">
      <div className="container-fluid">
        <SectionHead label={copy?.label || "(How I Work)"} index="/05" wide>
          <h3 className="heading-medium" data-ix="lines">{copy?.heading || "Your live store never stops selling."}</h3>
        </SectionHead>
        <div className="process-layout">
          <ol className="process-steps">
            {steps.map(([title, text], i) => (
              <li key={title} className="process-step" data-ix="fade-up">
                <span className="process-dot">{i + 1}</span>
                <div><h4>{title}</h4><p>{text}</p></div>
              </li>
            ))}
          </ol>
          <LoopVideo src="/videos/process-film.mp4" poster="/images/brand/process-film-poster.webp" label="Animation of the six-step draft-first workflow" className="process-film" />
        </div>
      </div>
    </section>
  );
}

export function WhySection({ copy }: { copy: SectionCopy }) {
  const items = rows(copy, WHY);
  return (
    <section className="section why" id="why">
      <div className="container-fluid">
        <SectionHead label={copy?.label || "(Why Clients Hire Me)"} index="/06" wide>
          <h3 className="heading-medium" data-ix="lines">{copy?.heading || "Built for brands that sell in the UAE."}</h3>
        </SectionHead>
        <div className="why-grid">
          {items.map(([title, text], i) => (
            <article key={title} className="why-card" data-ix="fade-up" data-ix-delay={String((i % 4) * 0.07)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ copy }: { copy: SectionCopy }) {
  const items = rows(copy, FAQ);
  const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return (
    <section className="section faq" id="faq">
      <div className="container-fluid">
        <SectionHead label={copy?.label || "(FAQ)"} index="/07" wide>
          <h3 className="heading-medium" data-ix="lines">{copy?.heading || "Questions clients ask first."}</h3>
        </SectionHead>
        <div className="faq-list">
          {items.map(([question, answer], i) => (
            <details key={question} className="faq-item" data-ix="fade-up" open={i === 0}>
              <summary>{question}<span aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </section>
  );
}

export function HireCta({ copy, email, phone }: { copy: SectionCopy; email: string; phone: string }) {
  const wa = `https://wa.me/${phone.replace(/\D/g, "")}`;
  return (
    <section className="section hire-cta" id="hire">
      <div className="container-fluid">
        <div className="hire-card" data-ix="fade-scale">
          <LoopVideo src="/videos/brand-hero.mp4" poster="/images/brand/brand-hero-poster.webp" label="" className="hire-bg" />
          <div className="hire-copy">
            <p className="hire-kicker">{copy?.label || "Available for freelance projects"}</p>
            <h3 data-ix="lines">{copy?.heading || "Let’s build or grow your online store."}</h3>
            <p className="hire-sub">{copy?.subheading || "Shopify builds and fixes · Figma to Shopify · Tabby & Tamara · GA4 & feeds · Next.js websites · n8n automation · monthly retainers."}</p>
            <div className="hire-actions">
              <Button href={copy?.ctaUrl || "/contact"} variant="white">{copy?.ctaLabel || "Start a project"}</Button>
              <Button href={wa} external>WhatsApp me</Button>
              <Button href={`mailto:${email}`} external>{email}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
