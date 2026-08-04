import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Ticker } from "../wide/Ticker";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const U6CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f, fps, config: { damping: 14, stiffness: 100, mass: 1.2 } });
  const title = spring({ frame: f - 12, fps, config: { damping: 200 } });
  const url = spring({ frame: f - 28, fps, config: { damping: 13, stiffness: 150 } });
  const tag = spring({ frame: f - 44, fps, config: { damping: 200 } });
  const float = Math.sin(f / 22) * 10;
  const pulse = 1 + Math.sin(f / 11) * 0.014;

  return (
    <AbsoluteFill>
      <WBg tint={C.gold} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${float}px) scale(${interpolate(ape, [0, 1], [0.72, 1])})` }}>
          <div style={{ position: "absolute", inset: -70, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}40, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 340, filter: "drop-shadow(0 28px 70px rgba(0,0,0,.75))" }} />
        </div>
        <div
          style={{
            fontFamily: display, fontWeight: 900, fontSize: 96, textAlign: "center", marginTop: 18, letterSpacing: "-0.03em",
            background: `linear-gradient(100deg, ${C.gold2}, ${C.purple2})`, WebkitBackgroundClip: "text", color: "transparent",
            clipPath: `inset(0 ${interpolate(title, [0, 1], [100, 0])}% 0 0)`, lineHeight: 1.02,
          }}
        >
          THE CRYPTO FINAL BOSS
        </div>
        <div
          style={{
            marginTop: 40, opacity: url, transform: `scale(${interpolate(url, [0, 1], [0.84, 1]) * pulse})`,
            padding: "22px 54px", borderRadius: 999,
            background: `linear-gradient(100deg, ${C.gold}, ${C.purple})`, boxShadow: `0 24px 70px ${C.purple}55`,
          }}
        >
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 46, color: "#0a0713" }}>thecryptofinalboss.app</div>
        </div>
        <div style={{ marginTop: 34, opacity: tag, fontFamily: mono, fontSize: 32, color: C.muted, letterSpacing: "0.2em" }}>
          FREE · NO WALLET · <span style={{ color: C.gold }}>@TCFB_game</span>
        </div>
      </AbsoluteFill>
      <Ticker y={30} color={C.purple2} />
      <Ticker y={1006} dir={-1} />
    </AbsoluteFill>
  );
};
