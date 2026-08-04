import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Ticker } from "../wide/Ticker";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const U1Cold: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f - 2, fps, config: { damping: 13, stiffness: 95, mass: 1.3 } });
  const badge = spring({ frame: f - 26, fps, config: { damping: 12, stiffness: 160 } });
  const float = Math.sin(f / 22) * 10;
  const glitch = f < 26 ? Math.sin(f * 2.4) * (26 - f) * 0.5 : 0;
  const push = interpolate(f, [0, 84], [1.04, 1]);

  return (
    <AbsoluteFill>
      <WBg tint={C.purple} flash />
      <AbsoluteFill style={{ transform: `scale(${push})`, alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `translateY(${float}px) scale(${interpolate(ape, [0, 1], [0.6, 1])})` }}>
          <div style={{ position: "absolute", inset: -80, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}3a, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 420, filter: "drop-shadow(0 30px 80px rgba(0,0,0,.8))" }} />
        </div>
        <div style={{ position: "relative", marginTop: 10 }}>
          <div style={{ position: "absolute", inset: 0, transform: `translateX(${glitch}px)`, fontFamily: display, fontWeight: 900, fontSize: 118, letterSpacing: "-0.04em", color: C.red, opacity: f < 26 ? 0.55 : 0 }}>
            UPDATE
          </div>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 118, letterSpacing: "-0.04em", background: `linear-gradient(100deg, ${C.gold2}, ${C.purple2})`, WebkitBackgroundClip: "text", color: "transparent" }}>
            UPDATE
          </div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 34, letterSpacing: "0.34em", color: C.muted, marginTop: 6 }}>
          THE CRYPTO FINAL BOSS · V3
        </div>
        <div
          style={{
            marginTop: 34, opacity: badge, transform: `scale(${interpolate(badge, [0, 1], [0.85, 1])})`,
            padding: "14px 34px", borderRadius: 999, border: `1px solid ${C.gold}66`,
            fontFamily: mono, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.gold,
            background: "rgba(240,180,41,.07)",
          }}
        >
          PERPS × LEVERAGE IS LIVE
        </div>
      </AbsoluteFill>
      <Ticker y={30} color={C.purple2} />
      <Ticker y={1006} dir={-1} />
    </AbsoluteFill>
  );
};
