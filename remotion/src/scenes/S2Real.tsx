import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Bg } from "../components/Bg";
import { Shot } from "../components/Shot";
import { C } from "../theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const S2Real: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const card = spring({ frame: f - 34, fps, config: { damping: 13, stiffness: 120 } });

  return (
    <AbsoluteFill>
      <Bg tint={C.green} />
      <div style={{ position: "absolute", top: 150, left: 70, right: 70 }}>
        <div style={{ fontFamily: mono, fontSize: 34, letterSpacing: "0.24em", color: C.green, opacity: head }}>// REAL MARKET DATA</div>
        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: C.text, marginTop: 18,
          clipPath: `inset(0 ${interpolate(head, [0, 1], [100, 0])}% 0 0)`,
        }}>EVERY PRICE<br /><span style={{ color: C.gold }}>IS HISTORICAL.</span></div>
      </div>

      <div style={{ position: "absolute", top: 560, left: -220, right: -220, overflow: "hidden", opacity: interpolate(f, [8, 26], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Shot src="img/s_late.png" from={1.22} to={1.4} y={-120} dur={dur} />
      </div>

      <div style={{
        position: "absolute", top: 1360, left: 90, right: 90,
        transform: `scale(${interpolate(card, [0, 1], [0.86, 1])}) rotate(${interpolate(card, [0, 1], [-3, -1.4])}deg)`,
        opacity: card,
        background: "linear-gradient(150deg, rgba(16,22,38,.97), rgba(6,9,18,.99))",
        border: `2px solid ${C.green}66`, borderRadius: 26, padding: "34px 40px",
        boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 60px ${C.green}22`,
      }}>
        <div style={{ fontFamily: mono, fontSize: 30, color: C.muted, letterSpacing: "0.2em" }}>BTC // JAN 2020</div>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 120, color: C.green, marginTop: 6 }}>$7,218</div>
        <div style={{ fontFamily: mono, fontSize: 32, color: C.gold2, marginTop: 8 }}>not simulated. remembered.</div>
      </div>
    </AbsoluteFill>
  );
};
