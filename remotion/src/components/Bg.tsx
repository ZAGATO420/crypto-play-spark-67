import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const Bg: React.FC<{ tint?: string }> = ({ tint = C.purple }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 60;
  const drift2 = Math.cos(f / 70) * 50;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${520 + drift}px ${520 + drift2}px, ${tint}33, transparent 70%),
                       radial-gradient(800px 800px at ${620 - drift}px ${1500 - drift2}px, ${C.gold}22, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 45%, black, transparent 75%)",
          transform: `translateY(${(f % 72) * -1}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: interpolate(f % 40, [0, 2, 4, 40], [0, 0.05, 0, 0]),
          background: tint,
        }}
      />
    </AbsoluteFill>
  );
};
