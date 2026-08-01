import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "./WBg";
import { Shot } from "../components/Shot";
import { display, mono } from "./fonts";
import { C } from "../theme";

export const W2Real: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const card = spring({ frame: f - 26, fps, config: { damping: 12, stiffness: 130 } });
  const count = Math.round(interpolate(f, [26, 60], [0, 7218], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill>
      <WBg tint={C.green} />
      <div style={{ position: "absolute", right: 0, top: 60, width: 1060, height: 960, overflow: "hidden", borderRadius: 20, opacity: interpolate(f, [6, 24], [0, 1], { extrapolateRight: "clamp" }), border: `2px solid ${C.green}33`, boxShadow: "0 50px 120px rgba(0,0,0,.7)" }}>
        <Shot src="img/s_late.png" from={1.12} to={1.24} y={-70} dur={dur} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg} 34%, transparent 62%)` }} />

      <div style={{ position: "absolute", left: 92, top: 200, width: 780 }}>
        <div style={{ fontFamily: mono, fontSize: 30, letterSpacing: "0.26em", color: C.green, opacity: head }}>// REAL MARKET DATA · 2020—2026</div>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 96, lineHeight: 1.0, color: C.text, marginTop: 16, letterSpacing: "-0.03em", clipPath: `inset(0 ${interpolate(head, [0, 1], [100, 0])}% 0 0)` }}>
          EVERY PRICE<br /><span style={{ color: C.gold }}>IS HISTORICAL.</span>
        </div>

        <div
          style={{
            marginTop: 54, opacity: card,
            transform: `translateY(${interpolate(card, [0, 1], [40, 0])}px) rotate(${interpolate(card, [0, 1], [-2.6, -1.2])}deg)`,
            background: "linear-gradient(150deg, rgba(16,22,38,.97), rgba(6,9,18,.99))",
            border: `2px solid ${C.green}55`, borderRadius: 24, padding: "28px 36px",
            boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 60px ${C.green}22`,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 26, color: C.muted, letterSpacing: "0.2em" }}>BTC // JAN 2020</div>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 104, color: C.green, marginTop: 4 }}>${count.toLocaleString("en-US")}</div>
          <div style={{ fontFamily: mono, fontSize: 28, color: C.gold2, marginTop: 6 }}>not simulated. remembered.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};