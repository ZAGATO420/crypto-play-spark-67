import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Letterbox, Grain, Flash } from "./CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

/** The logo hit: hard flash, boss reveal, title slam. */
export const CLogo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 13, stiffness: 210 } });
  const apeS = interpolate(f, [0, dur], [1.14, 1.02]);
  const o = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#04050a", alignItems: "center", justifyContent: "center", opacity: o }}>
      <AbsoluteFill style={{ background: `radial-gradient(820px 620px at 50% 46%, ${C.gold}28, transparent 72%)` }} />
      <Img
        src={staticFile("img/ape.png")}
        style={{
          position: "absolute",
          height: 760,
          opacity: 0.5,
          transform: `scale(${apeS})`,
          filter: "grayscale(.2) contrast(1.15) brightness(.9)",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,5,10,.5), rgba(4,5,10,.86))" }} />
      <div style={{ zIndex: 6, textAlign: "center" }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 152,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: C.text,
            transform: `scale(${interpolate(s, [0, 1], [1.16, 1])})`,
            textShadow: `0 26px 100px rgba(0,0,0,.95), 0 0 80px ${C.gold}38`,
          }}
        >
          THE CRYPTO
          <br />
          <span style={{ color: C.gold }}>FINAL BOSS</span>
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: mono,
            fontSize: 24,
            letterSpacing: "0.42em",
            color: C.green,
            opacity: interpolate(f, [12, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          A 6-YEAR CRYPTO SURVIVAL RUN
        </div>
      </div>
      <Grain opacity={0.08} />
      <Flash at={0} />
      <Letterbox />
    </AbsoluteFill>
  );
};