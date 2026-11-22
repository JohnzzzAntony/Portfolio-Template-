import React from "react";
import { AbsoluteFill, Composition, Img, interpolate, registerRoot, staticFile, useCurrentFrame, Easing } from "remotion";

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
    <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 20%, ${accent}55, #0d0d0c 60%)`, fontFamily: "Georgia, serif", color: "#f4f1ea" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: titleOpacity, flexDirection: "column" }}>
        <div style={{ fontFamily: "Segoe UI, sans-serif", fontSize: 18, letterSpacing: 6, textTransform: "uppercase", opacity: 0.7 }}>{category}</div>
        <div style={{ fontSize: 96, marginTop: 12 }}>{title}</div>
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: browserOpacity, transform: `translateY(${browserIn}px)` }}>
        <div style={{ width: browserW, borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.55)", background: "#1c1c1b" }}>
          <div style={{ height: 34, display: "flex", alignItems: "center", gap: 8, padding: "0 14px", background: "#232322" }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: 6, background: c }} />)}
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
