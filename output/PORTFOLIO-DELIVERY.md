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
