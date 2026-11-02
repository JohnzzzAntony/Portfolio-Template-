import React from "react";
import { AbsoluteFill, Composition, Img, registerRoot, staticFile, useCurrentFrame } from "remotion";

function HeroFilm() {
  const frame = useCurrentFrame();
  const wave = (1 - Math.cos(frame / 240 * Math.PI * 2)) / 2;
  return <AbsoluteFill style={{ backgroundColor: "#171716", overflow: "hidden" }}>
    <Img src={staticFile("images/premium/hero.webp")} style={{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${1 + wave * .045})`,transformOrigin:"70% 50%"}} />
  </AbsoluteFill>;
}
const Root = () => <Composition id="HeroFilm" component={HeroFilm} durationInFrames={240} fps={30} width={1600} height={900} />;
registerRoot(Root);
