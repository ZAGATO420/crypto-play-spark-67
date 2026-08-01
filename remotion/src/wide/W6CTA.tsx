import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "./WBg";
import { Ticker } from "./Ticker";
import { display, mono } from "./fonts";
import { C } from "../theme";

export const W6CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f, fps, config: { damping: 14, stiffness: 105, mass: 1.25 } });
  const title = spring({ frame: f - 10, fps, config: { damping: 200 } });
  const url = spring({ frame: f - 26, fps, config: { damping: 13, stiffness: 150 } });
  const handle = spring({ frame: f - 42, fps, config: { damping: 200 } });
  const float = Math.sin(f / 22) * 10;
  const pulse = 1 + Math.sin(f / 11) * 0.015;

  return (
    <AbsoluteFill>
      <WBg tint={C.gold} />
      <div style={{ position: "absolute", left: 90, top: 0, bottom: 0, width: 700, display: "flex", alignItems: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${float}px) scale(${interpolate(ape, [0, 1], [0.72, 1])})` }}>
          <div style={{ position: "absolute", inset: -80, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}40, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 680, filter: "drop-shadow(0 30px 80px rgba(0,0,0,.75))" }} />
        </div>
      </div>

      <div style={{ position: "absolute", right: 96, top: 250, width: 950, textAlign: "right" }}>
        <div
          style={{
            fontFamily: display, fontWeight: 900, fontSize: 116, lineHeight: 1.0, letterSpacing: "-0.04em",
            background: `linear-gradient(100deg, ${C.gold2}, ${C.purple2})`, WebkitBackgroundClip: "text", color: "transparent",
            clipPath: `inset(0 0 0 ${interpolate(title, [0, 1], [100, 0])}%)`,
          }}
        >
          THE CRYPTO<br />FINAL BOSS
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 46 }}>
          <div
            style={{
              transform: `scale(${interpolate(url, [0, 1], [0.82, 1]) * pulse})`, opacity: url,
              padding: "24px 50px", borderRadius: 999,
              background: `linear-gradient(100deg, ${C.gold}, ${C.purple})`,
              boxShadow: `0 24px 70px ${C.purple}55`,
            }}
          >
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 48, color: "#0a0713" }}>thecryptofinalboss.app</div>
          </div>
        </div>

        <div style={{ marginTop: 34, opacity: handle, fontFamily: mono, fontSize: 36, color: C.muted, letterSpacing: "0.18em" }}>
          FREE • NO WALLET • <span style={{ color: C.gold }}>@TCFB_game</span>
        </div>
      </div>
      <Ticker y={1008} dir={-1} color={C.gold} />
    </AbsoluteFill>
  );
};