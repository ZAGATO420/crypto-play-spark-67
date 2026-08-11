import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Letterbox, Grain, Flash } from "./CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

/** Closing card: url, token, handle. Nothing moves fast, everything is legible. */
export const CEnd: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 160 } });
  const s2 = spring({ frame: f - 18, fps, config: { damping: 200 } });
  const s3 = spring({ frame: f - 38, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(f / 9) * 0.008;
  return (
    <AbsoluteFill style={{ background: "#04050a", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(1000px 640px at 50% 50%, ${C.gold}22, transparent 72%)` }} />
      <Img
        src={staticFile("img/ape.png")}
        style={{ position: "absolute", height: 700, opacity: 0.22, filter: "grayscale(.4) brightness(.8)" }}
      />
      <div style={{ zIndex: 6, textAlign: "center" }}>
        <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: "0.4em", color: C.green, opacity: s }}>
          2020 → 2026 · 84 MONTHS · ONE RUN
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 128,
            lineHeight: 0.93,
            letterSpacing: "-0.05em",
            color: C.text,
            transform: `scale(${interpolate(s, [0, 1], [0.92, 1]) * pulse})`,
            textShadow: `0 24px 96px rgba(0,0,0,.95), 0 0 70px ${C.gold}30`,
          }}
        >
          CAN YOU
          <br />
          <span style={{ color: C.gold }}>SURVIVE IT?</span>
        </div>
        <div
          style={{
            marginTop: 34,
            opacity: s2,
            transform: `translateY(${interpolate(s2, [0, 1], [18, 0])}px)`,
            display: "inline-block",
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 38,
            letterSpacing: "0.12em",
            color: C.text,
            border: `1px solid ${C.gold}66`,
            borderRadius: 14,
            padding: "16px 32px",
            background: "linear-gradient(150deg, rgba(18,14,6,.92), rgba(6,6,8,.96))",
          }}
        >
          thecryptofinalboss.app
        </div>
        <div style={{ marginTop: 24, opacity: s3, fontFamily: mono, fontSize: 24, letterSpacing: "0.28em", color: C.muted }}>
          $TCFB · OCTOBER · PUMP.FUN · @CryptoBossFInal
        </div>
      </div>
      <Grain opacity={0.07} />
      <Flash at={0} color={C.gold} />
      <Letterbox />
    </AbsoluteFill>
  );
};