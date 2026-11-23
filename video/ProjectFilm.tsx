import React from "react";
import { AbsoluteFill, Composition, Img, interpolate, registerRoot, staticFile, useCurrentFrame, Easing, delayRender, continueRender } from "remotion";

// Manrope is the brand's only typeface; hold rendering until it has loaded.
const fontHandle = delayRender("Manrope");
new FontFace("Manrope", `url(${staticFile("fonts/manrope-vf.woff2")})`, { weight: "200 800" })
  .load().then((font) => { document.fonts.add(font); continueRender(fontHandle); });

type Props = { slug: string; title: string; category: string; accent: string; pageHeight: number };

const W = 1280;
const H = 720;
const FPS = 30;
const DURATION = 8 * FPS;

/** Title card, then the live site scrolls inside a browser frame, then the device trio. */
function ProjectFilm({ slug, title, category, accent, pageHeight }: Props) {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  const browserW = 1000;
  const viewportH = 540;
  // full.webp is 1440 wide; scale to the browser width to know how far we can scroll.
  const scaledH = (pageHeight * browserW) / 1440;
  const maxScroll = Math.max(0, Math.min(scaledH - viewportH, 4200));
  const scroll = interpolate(frame, [45, 190], [0, maxScroll], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const titleOpacity = interpolate(frame, [0, 12, 40, 55], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const browserIn = interpolate(frame, [30, 60], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const browserOpacity = interpolate(frame, [30, 55, 195, 210], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const devicesOpacity = interpolate(frame, [200, 218], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const devicesScale = interpolate(frame, [200, DURATION], [1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 82% 12%, #dfb6b2c0, transparent 55%), radial-gradient(circle at 8% 96%, ${accent}29, transparent 60%), #fffaf8`, fontFamily: "Manrope, sans-serif", color: "#190019" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: titleOpacity, flexDirection: "column" }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#854f6c" }}>{category}</div>
        <div style={{ fontSize: title.length > 18 ? 72 : 96, fontWeight: 800, letterSpacing: "-0.045em", marginTop: 12 }}>{title}</div>
        <div style={{ width: 80, height: 4, borderRadius: 4, background: "#522b5b", marginTop: 24 }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: browserOpacity, transform: `translateY(${browserIn}px)` }}>
        <div style={{ width: browserW, borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(43,18,76,.45)", background: "#fbe4d8", border: "2px solid #dfb6b2" }}>
          <div style={{ height: 34, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#fbe4d8" }}>
            {["#dfb6b2", "#854f6c", "#522b5b"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
          </div>
          <div style={{ height: viewportH, overflow: "hidden", position: "relative" }}>
            <Img src={staticFile(`images/projects/${slug}/full.webp`)} style={{ width: browserW, position: "absolute", top: -scroll, left: 0 }} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: devicesOpacity, transform: `scale(${devicesScale})` }}>
        <Img src={staticFile(`images/projects/${slug}/devices.webp`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const defaults: Props = { slug: "karji", title: "Karji", category: "Shopify", accent: "#b08d57", pageHeight: 6000 };
const Root = () => (
  <Composition id="ProjectFilm" component={ProjectFilm} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={defaults} />
);
registerRoot(Root);
