# Johns Antony portfolio

Updated project: `C:/Users/johns/Videos/Projects/johns-antony-portfolio`

Local preview: http://localhost:3108

## Completed

- Original portraits in the hero, about, approach, experience, services, contact and footer.
- Product imagery in the services, snapshot, products, screens, skills and process sections.
- Only Finora, Nexora, Invitara, CertGuard and WorkFlow Hub in the product showcase.
- Removed retailer/client project listings and their gallery references.
- Five product detail pages with overview, features, three screenshots and email enquiries.
- Responsive layouts, descriptive image alternatives and visible keyboard focus.

## Verification

- Source ESLint passed.
- TypeScript passed.
- Production build passed; home and five product routes prerendered.
- Six page HTTP checks passed; 20 image URLs returned valid images.
- Unknown product returns 404.
- No horizontal overflow at 375, 768, 1024 and 1440 pixels.
- All five WebP portraits match the source PNG pixels exactly.

## Photos

Production photos: `public/images/owner/{dubai,motion,portrait,casual,workspace}.webp`.
Lossless conversion only; face, body, clothing and expression unchanged.

Optional generated variant: `public/images/owner/portrait-background-edit.png`.
Created with built-in imagegen, not used on the site because generative editing cannot guarantee exact subject pixels.

Prompt: Edit the supplied gray-sweatshirt portrait; change only the black background to a warm ivory studio backdrop, extend the canvas leftwards, place the unchanged original subject on the right, leave the left half empty. Preserve face, hair, glasses, expression, skin, body, hands, pose, clothing and proportions; no retouching, text, logos or new people. Landscape 1536×1024.

## Run

Extract the final ZIP, run `npm ci`, then `npm run dev -- --port 3108`.
Production: `npm run build`, then `npm start`.

No public deployment was performed. Configure the production metadata base URL when the final domain is known; Next.js currently falls back to localhost for absolute social image URLs.

## Project media edition · 23 November 2026

![Project device mockups](../public/media/project-edition/contact-sheet.jpg)

The retail reel opens with Karji and moves through the eight storefronts. The digital reel follows the fashion, coffee, manufacturing, education and software projects, ending with momentsiz. Both are silent H.264 films at 1280 × 800 and 24 fps.

[Retail reel · 18 seconds](../public/media/project-edition/retail.mp4) · [Digital projects reel · 24.75 seconds](../public/media/project-edition/digital.mp4)

### Project index

Each device composition uses three independently sized browser views. Product names follow the public pages, including HALE on the new-fashion deployment and momentsiz on the Invitara deployment. App captures show the screen available on entry.

| Project | Focus | Browser captures | Device composition |
| --- | --- | --- | --- |
| [The House of Karji](https://karjistore.com/) | Fragrance & accessories | [Desktop](../public/media/project-edition/karjistore/desktop.jpg) · [Tablet](../public/media/project-edition/karjistore/tablet.jpg) · [Mobile](../public/media/project-edition/karjistore/mobile.jpg) | [Mockup](../public/media/project-edition/karjistore/devices.webp) |
| [Daima](https://daima.ae/) | Fine food & gifting | [Desktop](../public/media/project-edition/daima/desktop.jpg) · [Tablet](../public/media/project-edition/daima/tablet.jpg) · [Mobile](../public/media/project-edition/daima/mobile.jpg) | [Mockup](../public/media/project-edition/daima/devices.webp) |
| [Flower District](https://flowerdistrict.ae/) | Floral design | [Desktop](../public/media/project-edition/flowerdistrict/desktop.jpg) · [Tablet](../public/media/project-edition/flowerdistrict/tablet.jpg) · [Mobile](../public/media/project-edition/flowerdistrict/mobile.jpg) | [Mockup](../public/media/project-edition/flowerdistrict/devices.webp) |
| [Touch of Oud](https://touchofoud.com/) | Oud & home fragrance | [Desktop](../public/media/project-edition/touchofoud/desktop.jpg) · [Tablet](../public/media/project-edition/touchofoud/tablet.jpg) · [Mobile](../public/media/project-edition/touchofoud/mobile.jpg) | [Mockup](../public/media/project-edition/touchofoud/devices.webp) |
| [Atelier Perfumery](https://atelierperfumery.com/) | Niche perfumery | [Desktop](../public/media/project-edition/atelierperfumery/desktop.jpg) · [Tablet](../public/media/project-edition/atelierperfumery/tablet.jpg) · [Mobile](../public/media/project-edition/atelierperfumery/mobile.jpg) | [Mockup](../public/media/project-edition/atelierperfumery/devices.webp) |
| [Juvenis Paris](https://juvenisparis.com/) | Fragrance collections | [Desktop](../public/media/project-edition/juvenisparis/desktop.jpg) · [Tablet](../public/media/project-edition/juvenisparis/tablet.jpg) · [Mobile](../public/media/project-edition/juvenisparis/mobile.jpg) | [Mockup](../public/media/project-edition/juvenisparis/devices.webp) |
| [The Exceptional Parfums](https://theexceptionalparfums.com/) | Fine fragrance | [Desktop](../public/media/project-edition/theexceptionalparfums/desktop.jpg) · [Tablet](../public/media/project-edition/theexceptionalparfums/tablet.jpg) · [Mobile](../public/media/project-edition/theexceptionalparfums/mobile.jpg) | [Mockup](../public/media/project-edition/theexceptionalparfums/devices.webp) |
| [Saleel Parfums](https://saleelparfums.com/) | Fine fragrance | [Desktop](../public/media/project-edition/saleelparfums/desktop.jpg) · [Tablet](../public/media/project-edition/saleelparfums/tablet.jpg) · [Mobile](../public/media/project-edition/saleelparfums/mobile.jpg) | [Mockup](../public/media/project-edition/saleelparfums/devices.webp) |
| [NexPixels](https://nexpixels.com/) | Digital studio | TLS error during capture | — |
| [HALE](https://new-fashion-production.up.railway.app/) | Fashion | [Desktop](../public/media/project-edition/new-fashion-production/desktop.jpg) · [Tablet](../public/media/project-edition/new-fashion-production/tablet.jpg) · [Mobile](../public/media/project-edition/new-fashion-production/mobile.jpg) | [Mockup](../public/media/project-edition/new-fashion-production/devices.webp) |
| [El Moretto](https://elmoretto-production.up.railway.app/) | Coffee storytelling | [Desktop](../public/media/project-edition/elmoretto-production/desktop.jpg) · [Tablet](../public/media/project-edition/elmoretto-production/tablet.jpg) · [Mobile](../public/media/project-edition/elmoretto-production/mobile.jpg) | [Mockup](../public/media/project-edition/elmoretto-production/devices.webp) |
| [Torque Moulds Factory](https://torque-production-51b4.up.railway.app/) | Industrial tooling | [Desktop](../public/media/project-edition/torque-production-51b4/desktop.jpg) · [Tablet](../public/media/project-edition/torque-production-51b4/tablet.jpg) · [Mobile](../public/media/project-edition/torque-production-51b4/mobile.jpg) | [Mockup](../public/media/project-edition/torque-production-51b4/devices.webp) |
| [Koshys Nursing Study](https://db-production-8accfce3.up.railway.app/) | Nursing education | [Desktop](../public/media/project-edition/db-production-8accfce3/desktop.jpg) · [Tablet](../public/media/project-edition/db-production-8accfce3/tablet.jpg) · [Mobile](../public/media/project-edition/db-production-8accfce3/mobile.jpg) | [Mockup](../public/media/project-edition/db-production-8accfce3/devices.webp) |
| [NexEcoms](https://ecommerce-production-f437.up.railway.app/) | Fashion commerce | [Desktop](../public/media/project-edition/ecommerce-production-f437/desktop.jpg) · [Tablet](../public/media/project-edition/ecommerce-production-f437/tablet.jpg) · [Mobile](../public/media/project-edition/ecommerce-production-f437/mobile.jpg) | [Mockup](../public/media/project-edition/ecommerce-production-f437/devices.webp) |
| [Maylaa Assets](https://assetmanager-production-59c3.up.railway.app/) | IT asset management | [Desktop](../public/media/project-edition/assetmanager-production-59c3/desktop.jpg) · [Tablet](../public/media/project-edition/assetmanager-production-59c3/tablet.jpg) · [Mobile](../public/media/project-edition/assetmanager-production-59c3/mobile.jpg) | [Mockup](../public/media/project-edition/assetmanager-production-59c3/devices.webp) |
| [CertGuard](https://domssl-production.up.railway.app/) | Domains & SSL | [Desktop](../public/media/project-edition/domssl-production/desktop.jpg) · [Tablet](../public/media/project-edition/domssl-production/tablet.jpg) · [Mobile](../public/media/project-edition/domssl-production/mobile.jpg) | [Mockup](../public/media/project-edition/domssl-production/devices.webp) |
| [Nexora](https://nexora-ticketing-1a23.up.railway.app/) | Service ticketing | [Desktop](../public/media/project-edition/nexora-ticketing-1a23/desktop.jpg) · [Tablet](../public/media/project-edition/nexora-ticketing-1a23/tablet.jpg) · [Mobile](../public/media/project-edition/nexora-ticketing-1a23/mobile.jpg) | [Mockup](../public/media/project-edition/nexora-ticketing-1a23/devices.webp) |
| [Finora](https://books-production-9f40.up.railway.app/) | Business accounting | [Desktop](../public/media/project-edition/books-production-9f40/desktop.jpg) · [Tablet](../public/media/project-edition/books-production-9f40/tablet.jpg) · [Mobile](../public/media/project-edition/books-production-9f40/mobile.jpg) | [Mockup](../public/media/project-edition/books-production-9f40/devices.webp) |
| [WorkFlow Hub](https://work-manager-production-1c98.up.railway.app/) | Work assignments | [Desktop](../public/media/project-edition/work-manager-production-1c98/desktop.jpg) · [Tablet](../public/media/project-edition/work-manager-production-1c98/tablet.jpg) · [Mobile](../public/media/project-edition/work-manager-production-1c98/mobile.jpg) | [Mockup](../public/media/project-edition/work-manager-production-1c98/devices.webp) |
| [momentsiz](https://invitara-production.up.railway.app/) | Digital invitations | [Desktop](../public/media/project-edition/invitara-production/desktop.jpg) · [Tablet](../public/media/project-edition/invitara-production/tablet.jpg) · [Mobile](../public/media/project-edition/invitara-production/mobile.jpg) | [Mockup](../public/media/project-edition/invitara-production/devices.webp) |

### Supporting artwork

Use the brass ribbon between retail case studies and the blue orbit beside systems work. Both are editable SVG line studies with transparent backgrounds.

[Brass ribbon](../public/media/project-edition/ribbon.svg) · [Blue orbit](../public/media/project-edition/orbit.svg)

Flower District product thumbnails, sourced from the storefront on 23 November 2026, suit a small detail strip on its case study.

[Dragée](../public/media/project-edition/flowerdistrict/dragee-01.jpg) · [Mignonne](../public/media/project-edition/flowerdistrict/mignonne-01.jpg) · [Source storefront](https://flowerdistrict.ae/)

![Amber perfume, dahlia and brass on travertine](../public/media/project-edition/commerce-still.webp)

Original editorial artwork for the commerce section. The amber still life leaves space on the left for the introduction.
