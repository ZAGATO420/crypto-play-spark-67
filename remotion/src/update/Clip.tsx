import React from "react";
import { Video, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

export const Clip: React.FC<{
  src: string;
  dur: number;
  from?: number;
  to?: number;
  x?: number;
  y?: number;
  startFrom?: number;
  radius?: number;
}> = ({ src, dur, from = 1.02, to = 1.12, x = 0, y = 0, startFrom = 0, radius = 22 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, dur], [0, x], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, dur], [0, y], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: radius }}>
      <Video
        src={staticFile(src)}
        startFrom={startFrom}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${s}) translate(${tx}px, ${ty}px)`,
          filter: "brightness(1.22) saturate(1.12) contrast(1.04)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 200px 60px rgba(3,5,12,.72)` }} />
      <div style={{ position: "absolute", inset: 0, border: `1px solid ${C.gold}22`, borderRadius: radius }} />
    </div>
  );
};
