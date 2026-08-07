import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const TCTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f, fps, config: { damping: 15, stiffness: 110 } });
  const t1 = spring({ frame: f - 12, fps, config: { damping: 200 } });
  const t2 = spring({ frame: f - 26, fps, config: { damping: 200 } });
  const url = spring({ frame: f - 44, fps, config: { damping: 14, stiffness: 150 } });
  const tok = interpolate(f - 66, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(f / 22) * 8;

  return (
    <AbsoluteFill>
      <WBg tint={C.gold} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile("img/ape.png")}
          style={{
            width: 300,
            opacity: ape,
            transform: `scale(${interpolate(ape, [0, 1], [0.8, 1])}) translateY(${float}px)`,
            filter: `drop-shadow(0 26px 70px ${C.gold}44)`,
          }}
        />
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 118,
            letterSpacing: "-0.04em",
            color: C.text,
            marginTop: 12,
            clipPath: `inset(0 ${interpolate(t1, [0, 1], [100, 0])}% 0 0)`,
          }}
        >
          THE CRYPTO <span style={{ color: C.gold }}>FINAL BOSS</span>
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 34,
            letterSpacing: "0.3em",
            color: C.purple2,
            marginTop: 16,
            opacity: t2,
          }}
        >
          SURVIVE 84 MONTHS OF CRYPTO
        </div>
        <div
          style={{
            marginTop: 44,
            padding: "20px 54px",
            borderRadius: 18,
            background: `linear-gradient(90deg, ${C.gold}, ${C.purple})`,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: "0.12em",
            color: "#0a0710",
            opacity: url,
            transform: `scale(${interpolate(url, [0, 1], [0.9, 1])})`,
            boxShadow: `0 26px 70px rgba(0,0,0,.7), 0 0 60px ${C.gold}33`,
          }}
        >
          THECRYPTOFINALBOSS.APP
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 26,
            letterSpacing: "0.26em",
            color: C.gold2,
            marginTop: 28,
            opacity: tok,
          }}
        >
          FREE TO PLAY &nbsp;·&nbsp; GLOBAL LEADERBOARD &nbsp;·&nbsp; $TCFB THIS OCTOBER
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};