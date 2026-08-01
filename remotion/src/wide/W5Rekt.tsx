import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "./WBg";
import { display, mono } from "./fonts";
import { C } from "../theme";

const WORDS = ["REKT.", "SURVIVED.", "BURNED OUT."];
const COLORS = [C.red, C.green, C.gold];

export const W5Rekt: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const step = Math.min(WORDS.length - 1, Math.floor(f / 18));
  const local = f - step * 18;
  const s = spring({ frame: local, fps, config: { damping: 11, stiffness: 190 } });
  const zoom = interpolate(f, [0, dur], [1, 1.12]);
  const tag = spring({ frame: f - 44, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <WBg tint={COLORS[step]} flash />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${zoom})` }}>
        <div
          style={{
            fontFamily: display, fontWeight: 900, fontSize: 210, letterSpacing: "-0.05em",
            color: COLORS[step], textShadow: `0 0 90px ${COLORS[step]}66`,
            transform: `scale(${interpolate(s, [0, 1], [0.82, 1])}) skewX(${interpolate(s, [0, 1], [-9, 0])}deg)`,
          }}
        >
          {WORDS[step]}
        </div>
        <div style={{ fontFamily: mono, fontSize: 40, letterSpacing: "0.22em", color: C.muted, marginTop: 18, opacity: tag }}>
          THREE WAYS OUT. ONE LEADERBOARD.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};