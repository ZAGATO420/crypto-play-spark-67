import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const WBg: React.FC<{ tint?: string; flash?: boolean }> = ({ tint = C.purple, flash }) => {
  const f = useCurrentFrame();
  const dx = Math.sin(f / 80) * 90;
  const dy = Math.cos(f / 62) * 70;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 700px at ${420 + dx}px ${300 + dy}px, ${tint}30, transparent 70%),
                       radial-gradient(1200px 800px at ${1520 - dx}px ${840 - dy}px, ${C.gold}1f, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.13,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "84px 84px",
          maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent 78%)",
          transform: `translate(${(f % 84) * -1}px, ${(f % 84) * -1}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.9) 0px, rgba(255,255,255,.9) 1px, transparent 1px, transparent 4px)",
        }}
      />
      {flash ? (
        <AbsoluteFill style={{ background: tint, opacity: interpolate(f, [0, 3, 9], [0.5, 0.14, 0], { extrapolateRight: "clamp" }) }} />
      ) : null}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 90px rgba(0,0,0,.85)" }} />
    </AbsoluteFill>
  );
};