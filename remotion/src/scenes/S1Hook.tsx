import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Bg } from "../components/Bg";
import { C } from "../theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500"], subsets: ["latin"] });

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const apeIn = spring({ frame: f - 4, fps, config: { damping: 14, stiffness: 90, mass: 1.4 } });
  const apeScale = interpolate(apeIn, [0, 1], [0.62, 1]);
  const float = Math.sin(f / 26) * 14;
  const glow = 0.35 + Math.sin(f / 18) * 0.15;
  const blur = interpolate(f, [0, 22], [26, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Bg tint={C.purple} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
        <div style={{ position: "relative", transform: `translateY(${float - 140}px) scale(${apeScale})` }}>
          <div style={{ position: "absolute", inset: -80, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}${Math.round(glow * 90).toString(16)}, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 720, filter: `drop-shadow(0 30px 70px rgba(0,0,0,.7)) blur(${blur}px)` }} />
        </div>
      </AbsoluteFill>

      <Sequence from={26}>
        <Line y={1180} delay={0} text="JANUARY 2020." size={104} color={C.text} />
        <Line y={1320} delay={9} text="YOU HAVE $5,000." size={104} color={C.gold} />
        <Line y={1490} delay={22} text="84 MONTHS TO SURVIVE" size={62} color={C.purple2} monoFont />
      </Sequence>
    </AbsoluteFill>
  );
};

const Line: React.FC<{ y: number; delay: number; text: string; size: number; color: string; monoFont?: boolean }> = ({ y, delay, text, size, color, monoFont }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200 } });
  const clip = interpolate(s, [0, 1], [100, 0]);
  const ty = interpolate(s, [0, 1], [40, 0]);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center" }}>
      <div style={{
        fontFamily: monoFont ? mono : display, fontWeight: 800, fontSize: size, color,
        letterSpacing: monoFont ? "0.14em" : "-0.02em",
        clipPath: `inset(0 ${clip}% 0 0)`, transform: `translateY(${ty}px)`,
        textShadow: `0 0 40px ${color}55`,
      }}>{text}</div>
    </div>
  );
};
