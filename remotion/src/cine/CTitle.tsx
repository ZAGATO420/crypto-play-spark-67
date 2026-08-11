import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Letterbox, Grain } from "./CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

/** Full-frame typographic beat — short, loud, readable in under a second. */
export const CTitle: React.FC<{
  kick?: string;
  line: React.ReactNode;
  size?: number;
  tint?: string;
  dur: number;
}> = ({ kick, line, size = 118, tint = C.gold, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 18, stiffness: 190 } });
  const drift = interpolate(f, [0, dur], [1.02, 1.08]);
  const o = interpolate(f, [dur - 5, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#04050a", alignItems: "center", justifyContent: "center", opacity: o }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 520px at 50% 52%, ${tint}22, transparent 70%)`,
          transform: `scale(${drift})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.9) 0px, rgba(255,255,255,.9) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div style={{ textAlign: "center", zIndex: 5 }}>
        {kick ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "0.4em",
              color: tint,
              opacity: interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
              marginBottom: 22,
            }}
          >
            {kick}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: size,
            lineHeight: 0.94,
            letterSpacing: "-0.045em",
            color: C.text,
            transform: `scale(${interpolate(s, [0, 1], [0.92, 1])}) translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
            textShadow: `0 24px 90px rgba(0,0,0,.95), 0 0 60px ${tint}30`,
          }}
        >
          {line}
        </div>
      </div>
      <Grain opacity={0.07} />
      <Letterbox />
    </AbsoluteFill>
  );
};