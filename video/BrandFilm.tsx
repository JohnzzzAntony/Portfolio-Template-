import React from "react";
import { AbsoluteFill, Composition, Img, interpolate, registerRoot, staticFile, useCurrentFrame, Easing } from "remotion";

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

const Root = () => (
  <>
    <Composition id="BrandHero" component={BrandHero} durationInFrames={HERO_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ slugs: [] as string[] }} />
    <Composition id="BrandReel" component={BrandReel} durationInFrames={REEL_EACH} fps={FPS} width={1600} height={900} defaultProps={{ slugs: [] as string[] }}
      calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, props.slugs.length) * REEL_EACH })} />
  </>
);
registerRoot(Root);
