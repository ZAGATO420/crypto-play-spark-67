import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { WBg } from "../wide/WBg";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const VCTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 150 } });
  const s2 = spring({ frame: f - 16, fps, config: { damping: 200 } });
  const s3 = spring({ frame: f - 34, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(f / 8) * 0.012;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <WBg tint={C.gold} flash />
      <div
        style={{
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: "0.34em",
          color: C.green,
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
        }}
      >
        // 84 MONTHS · 2020 → 2026
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 138,
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          textAlign: "center",
          color: C.text,
          marginTop: 22,
          transform: `scale(${interpolate(s, [0, 1], [0.9, 1]) * pulse})`,
          textShadow: `0 20px 80px rgba(0,0,0,.9), 0 0 70px ${C.gold}35`,
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
          transform: `translateY(${interpolate(s2, [0, 1], [22, 0])}px)`,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: "0.12em",
          color: C.text,
          border: `1px solid ${C.gold}66`,
          borderRadius: 16,
          padding: "18px 34px",
          background: "linear-gradient(150deg, rgba(18,14,6,.92), rgba(6,6,8,.96))",
          boxShadow: `0 26px 70px rgba(0,0,0,.7), 0 0 40px ${C.gold}22`,
        }}
      >
        thecryptofinalboss.app
      </div>
      <div
        style={{
          marginTop: 26,
          opacity: s3,
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: "0.26em",
          color: C.muted,
        }}
      >
        $TCFB · OCTOBER · PUMP.FUN · @CryptoBossFInal
      </div>
    </AbsoluteFill>
  );
};