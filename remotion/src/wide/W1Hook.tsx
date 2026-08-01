import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { WBg } from "./WBg";
import { Ticker } from "./Ticker";
import { display, mono } from "./fonts";
import { C } from "../theme";

export const W1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f - 3, fps, config: { damping: 13, stiffness: 95, mass: 1.3 } });
  const float = Math.sin(f / 24) * 12;
  const blur = interpolate(f, [0, 18], [22, 0], { extrapolateRight: "clamp" });
  const push = interpolate(f, [0, 108], [1, 1.06]);

  return (
    <AbsoluteFill>
      <WBg tint={C.purple} />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        <div style={{ position: "absolute", left: 96, top: 0, bottom: 0, width: 820, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Row delay={10} text="JANUARY 2020." size={112} color={C.text} />
          <Row delay={22} text="YOU HAVE $5,000." size={112} color={C.gold} />
          <Sequence from={38}>
            <div style={{ fontFamily: mono, fontSize: 44, letterSpacing: "0.16em", color: C.purple2, marginTop: 26, opacity: interpolate(f - 38, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
              84 MONTHS TO SURVIVE
            </div>
          </Sequence>
        </div>
        <div style={{ position: "absolute", right: 40, bottom: -60, transform: `translateY(${float}px) scale(${interpolate(ape, [0, 1], [0.68, 1])})` }}>
          <div style={{ position: "absolute", inset: -90, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}3a, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 860, filter: `drop-shadow(0 40px 90px rgba(0,0,0,.75)) blur(${blur}px)` }} />
        </div>
      </AbsoluteFill>
      <Ticker y={26} color={C.purple2} />
      <Ticker y={1010} dir={-1} />
    </AbsoluteFill>
  );
};

const Row: React.FC<{ delay: number; text: string; size: number; color: string }> = ({ delay, text, size, color }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontFamily: display, fontWeight: 900, fontSize: size, color, lineHeight: 1.04, letterSpacing: "-0.03em",
        clipPath: `inset(0 ${interpolate(s, [0, 1], [100, 0])}% 0 0)`,
        transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px)`,
        textShadow: `0 0 46px ${color}44`,
      }}
    >
      {text}
    </div>
  );
};