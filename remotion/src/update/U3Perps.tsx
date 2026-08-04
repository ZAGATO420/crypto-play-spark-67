import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Clip } from "./Clip";
import { Kicker, BigLine, Callout } from "./Type";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

const LEVS = ["2x", "5x", "10x", "20x", "35x", "50x"];

const LevChips: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const active = Math.min(LEVS.length - 1, Math.floor(f / 7));
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {LEVS.map((l, i) => {
        const s = spring({ frame: f - i * 5, fps, config: { damping: 13, stiffness: 190 } });
        const on = i === active;
        return (
          <div
            key={l}
            style={{
              opacity: s, transform: `translateY(${interpolate(s, [0, 1], [22, 0])}px) scale(${on ? 1.1 : 1})`,
              fontFamily: mono, fontWeight: 700, fontSize: 32, padding: "12px 22px", borderRadius: 12,
              color: on ? "#0a0713" : C.muted,
              background: on ? `linear-gradient(100deg, ${C.gold}, ${C.gold2})` : "rgba(255,255,255,.04)",
              border: `1px solid ${on ? C.gold : "rgba(255,255,255,.09)"}`,
              boxShadow: on ? `0 16px 40px ${C.gold}44` : "none",
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

export const U3Perps: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame: f - 4, fps, config: { damping: 11, stiffness: 210 } });
  return (
    <AbsoluteFill>
      <WBg tint={C.gold} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Clip src="clips/perps.mp4" dur={dur} from={1.18} to={1.34} y={-40} x={-30} radius={0} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(3,5,12,.55) 0%, rgba(3,5,12,.15) 40%, rgba(3,5,12,.9) 100%)" }} />

      <div style={{ position: "absolute", left: 90, top: 150 }}>
        <Kicker text="// NEW SYSTEM" color={C.gold} />
        <div
          style={{
            fontFamily: display, fontWeight: 900, fontSize: 150, letterSpacing: "-0.05em", color: C.text, marginTop: 8,
            transform: `scale(${interpolate(slam, [0, 1], [1.3, 1])}) skewX(${interpolate(slam, [0, 1], [-8, 0])}deg)`,
            opacity: slam, textShadow: `0 0 70px ${C.gold}44`,
          }}
        >
          PERP DESK
        </div>
        <div style={{ marginTop: -6 }}>
          <BigLine delay={20} text="MARGIN · SIZE · FUNDING" size={54} color={C.gold2} />
        </div>
      </div>

      <Sequence from={34}>
        <div style={{ position: "absolute", left: 92, bottom: 250 }}>
          <LevChips />
        </div>
      </Sequence>

      <Sequence from={62}>
        <div style={{ position: "absolute", right: 90, bottom: 240, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-end" }}>
          <Callout delay={0} label="LEVERAGE" value="2x → 50x" accent={C.gold} />
          <Callout delay={12} label="MAX POSITIONS" value="3 OPEN" accent={C.purple2} />
          <Callout delay={24} label="FUNDING" value="MONTHLY" accent={C.green} />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
