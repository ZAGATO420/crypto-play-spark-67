import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Clip } from "./Clip";
import { Kicker, Callout } from "./Type";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const U4Liq: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = f > 74 && f < 92 ? Math.sin(f * 3.1) * (92 - f) * 0.7 : 0;
  const slam = spring({ frame: f - 74, fps, config: { damping: 10, stiffness: 220 } });
  const bar = interpolate(f, [10, 70], [6, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const col = bar > 85 ? C.red : bar > 50 ? C.gold : C.green;

  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px)` }}>
      <WBg tint={C.red} />
      <div style={{ position: "absolute", left: 90, top: 90, width: 1180, height: 760 }}>
        <Clip src="clips/liq.mp4" dur={dur} from={1.12} to={1.3} y={-40} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(3,5,12,.92) 12%, transparent 46%)" }} />

      <div style={{ position: "absolute", right: 80, top: 190, width: 560 }}>
        <Kicker text="// RISK TO LIQ" color={C.red} />
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 72, color: C.text, marginTop: 12, letterSpacing: "-0.03em" }}>
          THE BAR<br />TELLS YOU<br />THE TRUTH.
        </div>
        <div style={{ marginTop: 34, height: 22, borderRadius: 999, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.09)", overflow: "hidden" }}>
          <div style={{ width: `${bar}%`, height: "100%", background: `linear-gradient(90deg, ${C.green}, ${col})`, boxShadow: `0 0 30px ${col}88` }} />
        </div>
        <div style={{ fontFamily: mono, fontSize: 26, color: col, marginTop: 12, letterSpacing: "0.16em" }}>
          {bar.toFixed(0)}% TO LIQUIDATION
        </div>
        <div style={{ marginTop: 30 }}>
          <Callout delay={30} label="LIQ TRIGGER" value="-92% MARGIN" accent={C.red} />
        </div>
      </div>

      <Sequence from={74}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <AbsoluteFill style={{ background: C.red, opacity: interpolate(f - 74, [0, 3, 14], [0.42, 0.12, 0], { extrapolateRight: "clamp" }) }} />
          <div
            style={{
              fontFamily: display, fontWeight: 900, fontSize: 190, color: C.red, letterSpacing: "-0.05em",
              transform: `scale(${interpolate(slam, [0, 1], [1.5, 1])}) rotate(${interpolate(slam, [0, 1], [-4, -2])}deg)`,
              opacity: slam, textShadow: `0 0 100px ${C.red}77`,
            }}
          >
            LIQUIDATED
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
