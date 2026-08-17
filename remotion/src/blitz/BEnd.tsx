import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Letterbox, Grain, Flash } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

/** Closing card: play now + October token launch. */
export const BEnd: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 14, stiffness: 190 } });
  const s2 = spring({ frame: f - 16, fps, config: { damping: 200 } });
  const s3 = spring({ frame: f - 34, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(f / 8) * 0.01;
  const apeS = interpolate(f, [0, 90], [1.1, 1.02]);
  return (
    <AbsoluteFill style={{ background: "#04050a", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(980px 640px at 50% 48%, ${C.gold}26, transparent 72%)` }} />
      <Img
        src={staticFile("img/ape.png")}
        style={{ position: "absolute", height: 720, opacity: 0.3, transform: `scale(${apeS})`, filter: "contrast(1.14) brightness(.85)" }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,5,10,.45), rgba(4,5,10,.88))" }} />
      <div style={{ zIndex: 6, textAlign: "center" }}>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 24, letterSpacing: "0.4em", color: C.green, opacity: s }}>
          FREE · NO WALLET · PLAY IN THE BROWSER
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 138,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: C.text,
            transform: `scale(${interpolate(s, [0, 1], [1.14, 1]) * pulse})`,
            textShadow: `0 26px 100px rgba(0,0,0,.95), 0 0 80px ${C.gold}38`,
          }}
        >
          THE CRYPTO
          <br />
          <span style={{ color: C.gold }}>FINAL BOSS</span>
        </div>
        <div
          style={{
            marginTop: 30,
            opacity: s2,
            transform: `translateY(${interpolate(s2, [0, 1], [16, 0])}px)`,
            display: "inline-block",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.1em",
            color: C.text,
            border: `1px solid ${C.gold}77`,
            borderRadius: 14,
            padding: "16px 34px",
            background: "linear-gradient(150deg, rgba(20,15,6,.94), rgba(6,6,8,.96))",
          }}
        >
          thecryptofinalboss.app
        </div>
        <div
          style={{
            marginTop: 26,
            opacity: s3,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.24em",
            color: C.gold2,
          }}
        >
          $TCFB LAUNCHES OCTOBER
        </div>
      </div>
      <Grain opacity={0.07} />
      <Flash at={0} color={C.gold} />
      <Letterbox />
    </AbsoluteFill>
  );
};
