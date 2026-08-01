import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

export const Shot: React.FC<{
  src: string; from: number; to: number; x?: number; y?: number; dur: number;
}> = ({ src, from, to, x = 0, y = 0, dur }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [0, dur], [0, y], { extrapolateRight: "clamp" });
  const tx = interpolate(f, [0, dur], [0, x], { extrapolateRight: "clamp" });
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        transform: `scale(${s}) translate(${tx}px, ${ty}px)`,
        borderRadius: 18,
      }}
    />
  );
};
