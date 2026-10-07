# DESIGN.md: Rydge Studio (studio-rydge.webflow.io)

## Source
- URL: https://studio-rydge.webflow.io/
- Capture date: 2026-09-16
- Evidence: Firecrawl `branding` scrape, full-page screenshot (1920×16720), raw HTML, the site's compiled stylesheet (`:root` custom properties — exact values, not inferred), and markdown for all 7 page types.
- Artifacts: `.firecrawl/rydge-branding.json`, `.firecrawl/rydge-screenshot.png`, `.firecrawl/source-tokens.css`

> **Attribution / licensing.** The source is *Rydge*, a commercial Webflow template by Bestlooker. This document records the **design language** so it can be rebuilt. The original photography, logo, brand name and marketing copy are licensed assets and are **not** reproduced here. This project ships its own placeholder imagery and copy.

## Reference Screenshot
![Full-page screenshot of Rydge Studio](./.firecrawl/rydge-screenshot.png)

Use this screenshot as the visual source of truth for layout, hierarchy, density, and feel. Note it was captured mid-scroll, so several scroll-triggered sections appear in their pre-animation state (text not yet revealed) — that is itself evidence of the motion system described below.

## Design Summary

A high-contrast, editorial **Swiss-brutalist portfolio**. Pure black and pure white, zero chrome: no shadows, no gradients, no rounded cards. All visual energy comes from **type scale** and **motion**.

The defining move is **viewport-relative display type** — the hero wordmark is `15.09vw` and page titles are `11.46vw`, so headlines always span edge-to-edge at any viewport. Tight tracking (down to `-0.0425em`) and sub-1 line-heights (as low as `0.7`) pack these into dense slabs. Body copy stays small and calm (`1.125rem`) by contrast, creating a huge typographic jump that carries the whole hierarchy.

Sections are separated by generous vertical rhythm (`12.5vw`) and numbered editorially — `/01`, `/02`, `(About)`, `(Services)` — like a print contents page. Full-bleed imagery is interrupted by white sections. The only rounded elements are pills: buttons (`80px`/`1000px` radius) and tags.

Motion is the product: horizontal marquees, per-character text reveals, drag-to-scroll galleries, hover image-follow, circular rotating text, and smooth scroll throughout.

## Design Tokens

All values below are **observed** from the source stylesheet's `:root` unless marked *inferred*.

### Colors

| Role | Value | Notes |
|---|---|---|
| `--background-primary` | `#FFFFFF` | Page default |
| `--primary` | `#000000` | Text + inverted section backgrounds |
| `--white` | `#FFFFFF` | Text on dark sections |
| `--text-muted` | `#737577` | Secondary copy, meta |
| `--border-muted` | `#E0E0E0` | Hairlines, card borders |
| `--form-placeholder` | `#A7A7A7` | Input placeholders |
| `--section-box-shadow` | `#0000000D` | The single 5%-black shadow used |
| `--error` / `--error-bg` | `#751515` / `#FFC5C5` | Form validation |
| `--success` / `--success-bg` | `#114C09` / `#ABE9A3` | Form success |
| `--link` | `#0082F3` | *Browser default; the design overrides links to inherit* |

There is no brand accent colour. Colour enters **only through photography**. Keep the UI monochrome.

### Typography

**Family:** `Overused-Grotesk`, fallback `Arial, sans-serif`. A neo-grotesk with tight apertures. Closest free substitutes: *General Sans*, *Neue Haas Grotesk*, or `Inter` with tracking tightened — mark any substitution as *inferred*.

**Weights:** 100 / 200 / 300 / 400 / 500 (medium, the workhorse) / 600 (semibold, headings) / 700 / 800 / 900.

**Fluid display scale** (viewport-relative — these are the signature):

| Token | Size | Line height | Tracking |
|---|---|---|---|
| `hero-heading` | `15.09vw` | `0.75` | `-0.0425em` |
| `footer-heading` | `14.5vw` | `0.7` | `-0.0425em` |
| `marquee-heading` | `14.875vw` | `0.7` | `-0.0425em` |
| `page-title` | `11.4625vw` | `0.7` | `-0.0425em` |
| `heading-large` | `11.4625vw` | `0.7` | `-0.0425em` |
| `card-number` | `11.4625vw` | `0.7` | `-0.0425em` |
| `heading-medium` | `7.5vw` | `0.8` | `-0.038em` |
| `services-section-title` | `7.25vw` | `0.8` | `-0.038em` |
| `achievement-number` | `5.625vw` | `0.8` | `-0.03025em` |
| `heading-small` | `5vw` | `0.8` | `-0.03025em` |
| `paragraph-large` | `2.8525vw` | `1.087` | `-0.025em` |
| `card-title-large` | `2.852vw` | `1.087` | `-0.025em` |
| `card-title` | `1.875vw` | `1.205` | `-0.025em` |
| `services-section-text` | `1.875vw` | `1.25` | `-0.02em` |
| `paragraph-medium` | `1.7vw` | `1.25` | `-0.02em` |
| `form-input` / `form-label` | `1.7vw` | `1.25` | `-0.02em` |
| `project-overview-text` | `1.38vw` | `1.25` | `-0.016em` |

**Fixed scale** (rem — stops scaling so small text stays readable):

| Token | Size |
|---|---|
| `heading-1` … `heading-6` | `3.1` / `2.5` / `1.75` / `1.36` / `1.1` / `0.95` rem |
| `body`, `paragraph-small` | `1.125rem` |
| `navigation-bar` | `1.0625rem` |
| `caption` | `1.0625rem` |
| `blockquote` | `1.25rem` |
| `button` | `1rem` |
| `form-button` | `1.75rem` |
| `project-card-title` | `2rem` |
| `project-card-tag` | `1.25rem` |
| `project-list-title` / `-text` | `1.5rem` |
| `footer-widget` | `1.375rem` |
| `footer-credits` | `1.1875rem` |

**Line-height ladder:** `0.7` · `0.75` · `0.8` · `1` · `1.087` · `1.205` · `1.25` · `1.5`
**Tracking ladder:** `-0.0425em` · `-0.038em` · `-0.03025em` · `-0.025em` · `-0.02em` · `-0.016em` · `-0.01em` · `+0.01em`

Rule: **the larger the type, the tighter the tracking and the shorter the line-height.**

### Spacing And Layout

- **Base unit:** `4px`.
- **Page gutter:** `--page-padding-x: 3.125vw` (left/right on every section).
- **Section rhythm:** `--section-padding-y: 12.5vw`; medium `6.5vw`; small `3.125vw`. Page titles use `9.375vw`.
- **Grid gutters:** x `1.875vw`, y `6.25rem`; fixed `1.875rem`; small-y `3.125rem`; benefits-y `6.25vw`.
- **Margins:** tiny `0.36rem` · `0.65rem` · extra-small `1.5rem` · small `2.36rem` · rich-text `2rem` · medium `3rem` · large `7.5vw`.
- **Card padding:** default `2.5vw`; project card `1.875rem`; achievements `2.5vw`; inner `10px`.
- **Border radius:** `0` default · `2px` small · `5px` medium · `80px` buttons · `1000px` large pills · `100%` circles.
- **Shadows:** effectively none. One `#0000000D` section shadow. Do not add elevation.

Full-bleed is the default for media; content sits inside the `3.125vw` gutter.

## Components

**Primary button** — white fill, black text, `80px` radius, height `2.875rem`, padding `0.25em / 2em`, `1rem` label, uppercase, no shadow. Label wrapped by a small spark/asterisk icon on each side. On hover the label slides up and a duplicate slides in from below (hence every button's text appears twice in scraped markdown).

**Secondary button** — identical geometry, transparent fill, `1px` black border.

**Small button** — height `1.75rem`, padding-x `1em`.

**Tags / pills** — `1000px` radius, white fill on imagery. Project tag: padding `0.35rem` top / `1.00625rem` x / `0.55rem` bottom, `1.25rem` text. Services tag: `0.3rem`/`0.75rem`, `1.0625rem`.

**Project card (grid)** — full-bleed image, `1.875rem` padding, title top-left at `2rem`, circular arrow button top-right, tag pills bottom-left. Hovering swaps the title for a duplicate and rotates the arrow.

**Project row (list)** — `1.5rem` title, comma-separated services, trailing arrow. Hovering inverts the row to black and floats a preview image that follows the cursor.

**Service accordion item** — `/001` index, large heading, paragraph, image, and a capability list. On the services page each expands with its own media.

**Achievement card** — image, `5.625vw` number, small label. Four across.

**Benefit card** — `/001` index, heading revealed character-by-character, paragraph, image.

**Form field** — height `5.125rem`, padding `1rem`/`1.5rem`, `1.7vw` text, bottom hairline only, no fill. Submit button `5.125rem` tall with asymmetric padding (`3.06em` right / `1.6em` left) to seat a trailing arrow.

**Nav bar** — fixed, transparent over the hero. Logo left; live coordinates with a globe icon; centred/right links at `1.0625rem` uppercase; each link duplicates for the slide-up hover. Turns from white to black text on light sections.

**Footer** — full-bleed dark image; "Have a project in mind?" + Let's Talk pill; social columns; back-to-top; then the giant two-line `14.5vw` wordmark marquee with a rotating circular "LET'S TALK · SAY HELLO" badge; credits row last.

## Page Patterns

| Route | Structure |
|---|---|
| `/` | Hero (`15.09vw` wordmark over full-bleed portrait, discipline strip, intro, CTA, scroll cue) → About → "Our Story" marquee → Services accordion → Mission (dark, full-bleed) → Portfolio with **Grid/List tabs** → Benefits → Blog teasers → Playground drag gallery → Footer |
| `/about` | Page title + meta → Achievements (4 stats) → About → Our Story marquee → Approach (A/B/C) → Mission → Awards list → Benefits → Team → Footer |
| `/services` | Page title → three hero images → Expertise accordion (4 services w/ capability lists) → Featured project → Footer |
| `/portfolio` | Page title → hero slider (3 slides) → intro → Grid/List tabs → full project set → Footer |
| `/blog` | Page title → post grid (thumb, title, date) → Contact marquee → Footer |
| `/projects/[slug]` | Title + services + year → hero image → "Overview" marquee → overview copy → meta (year/client/services) → View Online → gallery → Related projects → Footer |
| `/blog-posts/[slug]` | Title + date → hero → rich-text body → Footer |

Every inner page opens with the same block: `11.4625vw` page title, a left meta line, a right `(©2021 — 2026)`, and a "Scroll Down ↘" cue.

**Responsive** (*inferred from the vw-driven system*): the `vw` display sizes are self-scaling, so breakpoints mainly reflow grids — 4-up → 2-up → 1-up — and swap the hero art (the source ships a separate `hero-mobile` image). Below ~991px, nav collapses to a full-screen overlay menu and `1.7vw` form/body sizes need a rem floor so they stay legible.

## Motion And Interaction

This is the half of the design that tokens can't express. Observed:

- **Smooth scroll** (Lenis-style inertia) across every page.
- **Horizontal marquees**: "Our Story /01", "Email Us /03", "Contact Us", "Overview", and the footer wordmark — all infinite, some speed-linked to scroll direction.
- **Per-character reveals**: benefit and support headings render one `<span>` per letter (visible as spaced-out letters in scraped markdown) and stagger in on scroll.
- **Per-word/line reveals**: the About and intro paragraphs break to one line per element and fade up in sequence.
- **Button hover**: label slides up, duplicate slides in from below; icons rotate.
- **List-row hover**: row inverts to black; a preview image follows the cursor.
- **Drag galleries**: hero strip and Playground ("Drag cards") are pointer-draggable with momentum.
- **Grid/List tabs** on portfolio, switching layout in place.
- **Rotating circular text** badge in the footer.
- **Scroll cue** arrow, and a video play/pause control on the mission section.

## Content Style

Lowercase-feeling, confident, short. Section labels are parenthesised — `(About)`, `(Services)`, `(Our Mission)` — and paired with a `/01`-style index; sub-items use `/001`. Headlines are two or three words, often split across lines (`Design® / With / purpose`, `Beyond Just Websites`). Body copy is one tight paragraph, plain-spoken, no jargon. Dates render long-form (`March 20, 2026`); years appear as `©2026` or `(©2021 — 2026)`. CTAs are verb-first: *View Our Works*, *More about us*, *View all projects*, *Let's Talk*.

## Agent Build Instructions

1. **Set the tokens first.** Put every value from *Design Tokens* into CSS custom properties on `:root` before writing components. Name them exactly as above. Never hardcode a size or colour in a component.
2. **Use `vw` for display type, `rem` for reading type.** This is the single most important rule — it is what makes the design feel like the source. Add a `clamp()` floor on the `1.7vw` body-ish tokens so they don't collapse on mobile.
3. **Stay monochrome.** Black, white, and the two greys. All colour comes from photography. Add no accent, no gradient, no shadow.
4. **Radius is binary.** `0` for everything structural; full pills for buttons and tags.
5. **Number your sections.** Every major section gets a `(Label)` and an `/0N` index. This is load-bearing to the aesthetic, not decoration.
6. **Build motion as a layer, not an afterthought.** Smooth scroll + scroll-triggered reveals + marquees + hover duplicates. Wrap every reveal in `prefers-reduced-motion` guards.
7. **Duplicate hover labels.** Any interactive label needs two copies stacked in a clipped box for the slide-up effect.
8. **Full-bleed media, gutter-bound text.** Images break the `3.125vw` gutter; text never does.
9. **Use your own assets.** Do not hotlink or redistribute the source's photography, logo, or copy.

## Rerun Inputs
```
workflow: firecrawl-website-design-clone
source_url: https://studio-rydge.webflow.io/
target_stack: Next.js 15 (App Router) + TypeScript + Tailwind v4 + Prisma + PostgreSQL
output: DESIGN.md
```
