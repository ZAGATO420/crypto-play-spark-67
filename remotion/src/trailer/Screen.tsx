import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

/**
 * Cropped Ken-Burns shot of a gameplay still. `fx`/`fy` are the focal point in
 * percent so we can push in on a specific panel of the UI instead of the centre.
 */
export const Screen: React.FC<{
  src: string;
  dur: number;
  from?: number;
  to?: number;
  fx?: number;
  fy?: number;
  fx2?: number;
  fy2?: number;
  bright?: number;
}> = ({ src, dur, from = 1.06, to = 1.2, fx = 50, fy = 50, fx2, fy2, bright = 1.32 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const s = interpolate(p, [0, 1], [from, to]);
  const px = interpolate(p, [0, 1], [fx, fx2 ?? fx]);
  const py = interpolate(p, [0, 1], [fy, fy2 ?? fy]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${px}% ${py}%`,
          transform: `scale(${s})`,
          filter: `brightness(${bright}) saturate(1.14) contrast(1.06)`,
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 80px rgba(3,5,12,.78)" }} />
    </AbsoluteFill>
  );
};

/** Phone mockup for the mobile beat. */
export const Phone: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const rot = interpolate(p, [0, 1], [-7, -2.5]);
  const y = interpolate(p, [0, 1], [40, -26]);
  return (
    <div
      style={{
        width: 430,
        height: 900,
        borderRadius: 54,
        padding: 12,
        background: "linear-gradient(160deg, #23263a, #0a0c16)",
        border: `1px solid ${C.gold}44`,
        boxShadow: `0 60px 140px rgba(0,0,0,.8), 0 0 90px ${C.purple}22`,
        transform: `rotate(${rot}deg) translateY(${y}px)`,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 44,
          filter: "brightness(1.3) saturate(1.14)",
        }}
      />
    </div>
  );
};