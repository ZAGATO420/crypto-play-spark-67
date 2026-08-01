import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "./WBg";
import { Shot } from "../components/Shot";
import { display, mono } from "./fonts";
import { C } from "../theme";

const ROWS = [
  { t: "AIRDROP FARMING", d: 0 },
  { t: "LAUNCHPAD SNIPES", d: 6 },
  { t: "PERPS & LIQUIDATIONS", d: 12 },
  { t: "RUGS, SCAMS, DRAINERS", d: 18 },
  { t: "WALLET HACKS", d: 24 },
];

export const W4Choice: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame: f, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <WBg tint={C.purple} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1080, overflow: "hidden", opacity: interpolate(f, [4, 20], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Shot src="img/s_ov0_decision-overlay.png" from={2.0} to={2.24} y={-150} dur={dur} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(270deg, ${C.bg} 36%, transparent 66%)` }} />

      <div style={{ position: "absolute", right: 92, top: 190, width: 760, textAlign: "right" }}>
        <div style={{ fontFamily: mono, fontSize: 30, letterSpacing: "0.24em", color: C.purple2, opacity: head }}>// ONE CHOICE. NO UNDO.</div>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 104, color: C.text, marginTop: 14, letterSpacing: "-0.03em", lineHeight: 1.0, clipPath: `inset(0 0 0 ${interpolate(head, [0, 1], [100, 0])}%)` }}>
          60+ REAL<br /><span style={{ color: C.gold }}>DECISIONS.</span>
        </div>

        <div style={{ marginTop: 48 }}>
          {ROWS.map((r, i) => {
            const s = spring({ frame: f - 24 - r.d, fps, config: { damping: 18, stiffness: 140 } });
            return (
              <div key={r.t} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 18, marginBottom: 20, transform: `translateX(${interpolate(s, [0, 1], [70, 0])}px)`, opacity: s }}>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 44, color: C.text, letterSpacing: "0.04em" }}>{r.t}</div>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: i % 2 ? C.purple : C.gold, boxShadow: `0 0 24px ${i % 2 ? C.purple : C.gold}` }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};