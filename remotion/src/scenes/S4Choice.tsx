import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Bg } from "../components/Bg";
import { Shot } from "../components/Shot";
import { C } from "../theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

const ROWS = [
  { t: "AIRDROP FARMING", d: 0 },
  { t: "LAUNCHPAD SNIPES", d: 7 },
  { t: "PERPS & LIQUIDATIONS", d: 14 },
  { t: "RUGS, SCAMS, DRAINERS", d: 21 },
];

export const S4Choice: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <Bg tint={C.purple} />
      <div style={{ position: "absolute", top: 130, left: 70, right: 70 }}>
        <div style={{ fontFamily: mono, fontSize: 34, letterSpacing: "0.24em", color: C.purple2, opacity: head }}>// ONE CHOICE. NO UNDO.</div>
        <div style={{ fontFamily: display, fontWeight: 800, fontSize: 96, color: C.text, marginTop: 16, clipPath: `inset(0 ${interpolate(head, [0, 1], [100, 0])}% 0 0)` }}>
          60+ REAL<br /><span style={{ color: C.gold }}>DECISIONS.</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: 620, left: -60, right: -60, height: 700, overflow: "hidden", borderRadius: 22, opacity: interpolate(f, [6, 22], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Shot src="img/s_ov0_decision-overlay.png" from={1.3} to={1.44} y={-60} dur={dur} />
      </div>

      <div style={{ position: "absolute", top: 1400, left: 80, right: 80 }}>
        {ROWS.map((r, i) => {
          const s = spring({ frame: f - 30 - r.d, fps, config: { damping: 18, stiffness: 130 } });
          return (
            <div key={r.t} style={{
              display: "flex", alignItems: "center", gap: 22, marginBottom: 26,
              transform: `translateX(${interpolate(s, [0, 1], [-70, 0])}px)`, opacity: s,
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: i % 2 ? C.purple : C.gold, boxShadow: `0 0 24px ${i % 2 ? C.purple : C.gold}` }} />
              <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 52, color: C.text, letterSpacing: "0.04em" }}>{r.t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
