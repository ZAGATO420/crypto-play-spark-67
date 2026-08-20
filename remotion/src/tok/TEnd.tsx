import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain, Flash } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

/** Vertical closing card with the October token launch line. */
export const TEnd: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 190 } });
  const s2 = spring({ frame: f - 14, fps, config: { damping: 200 } });
  const s3 = spring({ frame: f - 28, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(f / 8) * 0.012;
  return (
    <AbsoluteFill style={{ background: "#04050a", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(760px 760px at 50% 42%, ${C.gold}2b, transparent 72%)` }} />
      <Img
        src={staticFile("img/ape.png")}
        style={{
          position: "absolute",
          height: 1180,
          opacity: 0.34,
          transform: `scale(${interpolate(f, [0, 80], [1.08, 1.0])})`,
          filter: "contrast(1.14) brightness(.86)",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,5,10,.5), rgba(4,5,10,.9))" }} />
      <div style={{ zIndex: 6, textAlign: "center", padding: "0 60px" }}>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 28, letterSpacing: "0.3em", color: C.green, opacity: s }}>
          FREE · NO WALLET · IN BROWSER
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 132,
            lineHeight: 0.88,
            letterSpacing: "-0.05em",
            color: C.text,
            transform: `scale(${interpolate(s, [0, 1], [1.12, 1]) * pulse})`,
            textShadow: `0 26px 100px rgba(0,0,0,.95), 0 0 80px ${C.gold}38`,
          }}
        >
          THE CRYPTO
          <br />
          <span style={{ color: C.gold }}>FINAL BOSS</span>
        </div>
        <div
          style={{
            marginTop: 40,
            opacity: s2,
            transform: `translateY(${interpolate(s2, [0, 1], [18, 0])}px)`,
            display: "inline-block",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: "0.06em",
            color: C.text,
            border: `1px solid ${C.gold}77`,
            borderRadius: 16,
            padding: "18px 32px",
            background: "linear-gradient(150deg, rgba(20,15,6,.94), rgba(6,6,8,.96))",
          }}
        >
          thecryptofinalboss.app
        </div>
        <div style={{ marginTop: 30, opacity: s3, fontFamily: mono, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", color: C.gold2 }}>
          $TCFB · OCTOBER
        </div>
      </div>
      <Grain opacity={0.07} />
      <Flash at={0} color={C.gold} />
    </AbsoluteFill>
  );
};
