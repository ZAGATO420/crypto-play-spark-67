import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Letterbox, Grain } from "./CineFx";
import { mono } from "../wide/fonts";
import { C } from "../theme";

const L1 = "JANUARY 2020.";
const L2 = "YOU HAVE $10,000 AND 84 MONTHS.";

/** Cold open: black frame, typed line, gameplay bleeding in behind. */
export const COpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const n1 = Math.max(0, Math.min(L1.length, Math.floor((f - 4) / 1.1)));
  const n2 = Math.max(0, Math.min(L2.length, Math.floor((f - 26) / 0.9)));
  const reveal = interpolate(f, [30, dur], [0.06, 0.72], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, dur], [1.18, 1.06]);
  const caret = f % 16 < 8 ? "_" : " ";
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ overflow: "hidden", opacity: reveal }}>
        <Video
          src={staticFile("v16/01_start.mp4")}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            filter: "contrast(1.12) saturate(1.1) brightness(1.02)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(110% 90% at 50% 50%, transparent 30%, rgba(0,0,0,.85) 92%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", zIndex: 8 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 54, letterSpacing: "0.22em", color: C.gold }}>
            {L1.slice(0, n1)}
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: mono,
              fontSize: 34,
              letterSpacing: "0.2em",
              color: C.text,
              opacity: interpolate(f, [24, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            {L2.slice(0, n2)}
            {n2 > 0 ? caret : ""}
          </div>
        </div>
      </AbsoluteFill>
      <Grain opacity={0.08} />
      <Letterbox open dur={20} />
    </AbsoluteFill>
  );
};