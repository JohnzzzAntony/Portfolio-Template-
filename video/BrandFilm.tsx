import React from "react";
import { AbsoluteFill, Composition, Img, interpolate, registerRoot, staticFile, useCurrentFrame, Easing, delayRender, continueRender } from "remotion";

// Manrope is the brand's only typeface; hold rendering until it has loaded.
const fontHandle = delayRender("Manrope");
new FontFace("Manrope", `url(${staticFile("fonts/manrope-vf.woff2")})`, { weight: "200 800" })
  .load().then((font) => { document.fonts.add(font); continueRender(fontHandle); });

/**
 * Brand films on the light canvas (Brand Book 01–04):
 *  - BrandHero: a seamless loop of the real project mockups drifting in three
 *    columns on the right; the hero copy sits over the quiet left side.
 *  - BrandReel: project banners in sequence with a slow push-in and cross-fade.
 */
type Props = { slugs: string[] };

const FPS = 30;
const HERO_FRAMES = 16 * FPS;
const CARD_W = 470;
const CARD_H = Math.round(CARD_W * 0.625);
const GAP = 34;

function Column({ slugs, x, speed, offset }: { slugs: string[]; x: number; speed: number; offset: number }) {
  const frame = useCurrentFrame();
  const span = slugs.length * (CARD_H + GAP);
  // One full span per loop (times `speed`), so frame 0 and the last frame line up.
  const travel = (frame / HERO_FRAMES) * span * speed + offset;
  const y = -(((travel % span) + span) % span);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: CARD_W }}>
      {[...slugs, ...slugs, ...slugs].map((slug, i) => (
        <div key={i} style={{ height: CARD_H, marginBottom: GAP, borderRadius: 20, overflow: "hidden", border: "1px solid #dfb6b2", boxShadow: "0 30px 60px -34px rgba(43,18,76,.45)", background: "#fbe4d8" }}>
          <Img src={staticFile(`images/projects/${slug}/devices.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
    </div>
  );
}

function BrandHero({ slugs }: Props) {
  const frame = useCurrentFrame();
  const drift = Math.sin((frame / HERO_FRAMES) * Math.PI * 2);
  const cols = [0, 1, 2].map((c) => slugs.filter((_, i) => i % 3 === c));
  return (
    <AbsoluteFill style={{ background: "#fffaf8", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${78 + drift * 4}% ${14 + drift * 3}%, #dfb6b2b3, transparent 50%), radial-gradient(circle at 30% 80%, #fbe4d8, transparent 60%)` }} />
      <div style={{ position: "absolute", inset: 0, transform: "rotate(-8deg) translate(80px, -120px)", transformOrigin: "70% 50%" }}>
        <Column slugs={cols[0]} x={760} speed={1} offset={0} />
        <Column slugs={cols[1]} x={760 + CARD_W + GAP} speed={-1} offset={CARD_H * 0.6} />
        <Column slugs={cols[2]} x={760 + (CARD_W + GAP) * 2} speed={1} offset={CARD_H * 1.3} />
      </div>
    </AbsoluteFill>
  );
}

const REEL_EACH = 3 * FPS;
const FADE = 18;

function BrandReel({ slugs }: Props) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#fffaf8" }}>
      {slugs.map((slug, i) => {
        const start = i * REEL_EACH;
        const local = frame - start;
        if (local < -FADE || local > REEL_EACH + FADE) return null;
        const opacity = interpolate(local, [-FADE, 0, REEL_EACH, REEL_EACH + FADE], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const scale = interpolate(local, [-FADE, REEL_EACH + FADE], [1, 1.06], { easing: Easing.out(Easing.quad) });
        return (
          <AbsoluteFill key={slug} style={{ opacity }}>
            <Img src={staticFile(`images/projects/${slug}/banner.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})`, transformOrigin: "60% 50%" }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
}

const LOOP = 12 * FPS;
const PLUM = "#190019", ORCHID = "#522b5b", MAUVE = "#854f6c", BLUSH = "#dfb6b2", IVORY = "#fbe4d8", CANVAS = "#fffaf8";

/** Tools orbiting the core in three rings; one full turn per loop so it repeats seamlessly. */
const RINGS = [
  { r: 175, dir: 1, tools: ["Shopify", "Liquid", "Metaobjects", "GraphQL", "Custom Pixels"] },
  { r: 285, dir: -1, tools: ["Figma", "Next.js", "React", "TypeScript", "Tailwind", "GSAP", "Node.js"] },
  { r: 385, dir: 1, tools: ["GA4", "GTM", "Merchant Center", "Tabby", "Tamara", "Apple Pay", "n8n", "cPanel", "SSL"] },
];

function SkillsFilm() {
  const frame = useCurrentFrame();
  const turn = (frame / LOOP) * Math.PI * 2;
  const pulse = 1 + Math.sin(turn * 2) * 0.03;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${IVORY}, ${CANVAS} 62%)`, fontFamily: "Manrope, sans-serif" }}>
      <svg width={1280} height={800} style={{ position: "absolute", inset: 0 }}>
        {RINGS.map(({ r }) => <ellipse key={r} cx={640} cy={400} rx={r} ry={r * 0.82} fill="none" stroke={BLUSH} strokeWidth={1.5} strokeDasharray="4 8" />)}
      </svg>
      <div style={{ position: "absolute", left: 540, top: 300, width: 200, height: 200, borderRadius: "50%", background: ORCHID, color: "#fff", display: "grid", placeItems: "center", textAlign: "center", transform: `scale(${pulse})`, boxShadow: `0 0 0 18px ${BLUSH}66, 0 30px 60px -20px #2b124c88` }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: "-0.03em", lineHeight: 1.05 }}>Johns<br />Antony</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: IVORY }}>E-commerce stack</div>
        </div>
      </div>
      {RINGS.flatMap(({ r, dir, tools }, ring) => tools.map((tool, i) => {
        const a = turn * dir + (i / tools.length) * Math.PI * 2;
        const x = 640 + Math.cos(a) * r;
        const y = 400 + Math.sin(a) * r * 0.82;
        const lit = Math.sin(turn * 3 + i + ring) > 0.6;
        return (
          <div key={`${ring}-${tool}`} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", padding: "10px 18px", borderRadius: 999, background: lit ? ORCHID : "#fff", border: `1.5px solid ${lit ? ORCHID : BLUSH}`, color: lit ? "#fff" : ring === 0 ? ORCHID : PLUM, fontWeight: ring === 0 ? 800 : 700, fontSize: ring === 0 ? 22 : 19, whiteSpace: "nowrap", boxShadow: "0 14px 30px -18px #2b124c66" }}>{tool}</div>
        );
      }))}
    </AbsoluteFill>
  );
}

/** The draft-first workflow: two seconds per step, with the live store selling throughout. */
const STEPS = ["Discovery", "Plan & quote", "Build on a draft", "Preview & test", "Publish", "Support"];

function Window({ title, badge, badgeColor, children, style }: { title: string; badge: string; badgeColor: string; children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 470, height: 330, borderRadius: 20, background: "#fff", border: `1.5px solid ${BLUSH}`, boxShadow: "0 30px 60px -34px #2b124c77", overflow: "hidden", ...style }}>
      <div style={{ height: 44, background: IVORY, display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
        {[BLUSH, MAUVE, ORCHID].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}
        <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 16, color: PLUM }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "#fff", background: badgeColor, padding: "4px 10px", borderRadius: 999 }}>{badge}</span>
      </div>
      <div style={{ padding: 18 }}>{children}</div>
    </div>
  );
}

const Bar = ({ w, h = 16, c = IVORY }: { w: number; h?: number; c?: string }) => <div style={{ width: w, height: h, borderRadius: 8, background: c, marginBottom: 12 }} />;

function ProcessFilm() {
  const frame = useCurrentFrame();
  const per = LOOP / STEPS.length;
  const step = Math.floor(frame / per);
  const local = (frame % per) / per;
  const ease = Easing.bezier(0.33, 1, 0.68, 1);
  const blocks = step < 2 ? 0 : step === 2 ? Math.max(1, Math.ceil(ease(local) * 4)) : 4;
  const published = step >= 4;
  const lift = step === 4 ? ease(Math.min(1, local * 1.6)) : step > 4 ? 1 : 0;
  const progress = Math.min(1, (step + local) / (STEPS.length - 1));
  const green = "#2f8f5b";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 85% 10%, ${BLUSH}aa, transparent 50%), ${CANVAS}`, fontFamily: "Manrope, sans-serif", color: PLUM }}>
      <div style={{ position: "absolute", top: 56, left: 90, right: 90, height: 90 }}>
        <div style={{ position: "absolute", top: 19, left: 20, right: 20, height: 3, background: BLUSH }} />
        <div style={{ position: "absolute", top: 19, left: 20, height: 3, width: `calc((100% - 40px) * ${progress})`, background: ORCHID }} />
        {STEPS.map((label, i) => (
          <div key={label} style={{ position: "absolute", left: `calc((100% - 40px) * ${i / (STEPS.length - 1)})`, width: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, display: "grid", placeItems: "center", fontWeight: 800, background: i <= step ? ORCHID : "#fff", color: i <= step ? "#fff" : MAUVE, border: `2px solid ${i <= step ? ORCHID : BLUSH}`, transform: `scale(${i === step ? 1.15 : 1})` }}>{i + 1}</div>
            <div style={{ marginTop: 12, fontSize: 17, fontWeight: i === step ? 800 : 600, whiteSpace: "nowrap", color: i === step ? PLUM : MAUVE }}>{label}</div>
          </div>
        ))}
      </div>
      <Window title="Live store" badge="Selling" badgeColor={green} style={{ left: 110, top: 240 }}>
        <Bar w={434} h={120} c={BLUSH} /><Bar w={380} /><Bar w={260} />
        <div style={{ fontWeight: 800, fontSize: 22, marginTop: 8 }}>{published ? "New theme is live" : "Orders keep coming in"}</div>
      </Window>
      <Window title={published ? "Published theme" : "Draft theme"} badge={published ? "Live" : step >= 3 ? "Preview" : "Draft"} badgeColor={published ? green : ORCHID}
        style={{ left: 700, top: 240 - lift * 12, borderColor: published ? green : BLUSH }}>
        {step === 0 && <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.3, marginTop: 30 }}>Goals, products,<br />payments, audience</div>}
        {step === 1 && <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.3, marginTop: 30 }}>Scope · timeline ·<br />fixed price</div>}
        {Array.from({ length: blocks }).map((_, i) => <div key={i} style={{ height: 44, borderRadius: 10, background: i % 2 ? IVORY : BLUSH, marginBottom: 12 }} />)}
      </Window>
      {step === 3 && ["Mobile", "Desktop", "Safari"].map((d, i) => (
        <div key={d} style={{ position: "absolute", left: 700 + i * 160, top: 610, padding: "10px 18px", borderRadius: 999, background: local * 3 > i ? ORCHID : "#fff", color: local * 3 > i ? "#fff" : MAUVE, border: `1.5px solid ${ORCHID}`, fontWeight: 700, fontSize: 18 }}>✓ {d}</div>
      ))}
      {step === 5 && <div style={{ position: "absolute", left: 700, top: 610, fontWeight: 800, fontSize: 22, color: ORCHID, opacity: ease(Math.min(1, local * 2)) }}>Monthly updates, campaigns & fixes</div>}
    </AbsoluteFill>
  );
}

const Root = () => (
  <>
    <Composition id="BrandHero" component={BrandHero} durationInFrames={HERO_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ slugs: [] as string[] }} />
    <Composition id="BrandReel" component={BrandReel} durationInFrames={REEL_EACH} fps={FPS} width={1600} height={900} defaultProps={{ slugs: [] as string[] }}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.slugs.length) * REEL_EACH })} />
    <Composition id="SkillsFilm" component={SkillsFilm} durationInFrames={LOOP} fps={FPS} width={1280} height={800} />
    <Composition id="ProcessFilm" component={ProcessFilm} durationInFrames={LOOP} fps={FPS} width={1280} height={800} />
  </>
);
registerRoot(Root);
