import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Bg } from "../components/Bg";
import { C } from "../theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const S5CTA: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ape = spring({ frame: f, fps, config: { damping: 15, stiffness: 100, mass: 1.3 } });
  const title = spring({ frame: f - 12, fps, config: { damping: 200 } });
  const url = spring({ frame: f - 30, fps, config: { damping: 14, stiffness: 140 } });
  const handle = spring({ frame: f - 44, fps, config: { damping: 200 } });
  const float = Math.sin(f / 24) * 12;
  const pulse = 1 + Math.sin(f / 12) * 0.015;

  return (
    <AbsoluteFill>
      <Bg tint={C.gold} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 260 }}>
        <div style={{ position: "relative", transform: `translateY(${float}px) scale(${interpolate(ape, [0, 1], [0.7, 1])})` }}>
          <div style={{ position: "absolute", inset: -70, borderRadius: 999, background: `radial-gradient(circle, ${C.gold}44, transparent 70%)` }} />
          <Img src={staticFile("img/ape.png")} style={{ width: 620, filter: "drop-shadow(0 30px 70px rgba(0,0,0,.7))" }} />
        </div>

        <div style={{
          fontFamily: display, fontWeight: 800, fontSize: 88, textAlign: "center", marginTop: 40,
          background: `linear-gradient(100deg, ${C.gold2}, ${C.purple2})`, WebkitBackgroundClip: "text",
          color: "transparent", letterSpacing: "-0.02em", lineHeight: 1.05,
          clipPath: `inset(0 ${interpolate(title, [0, 1], [100, 0])}% 0 0)`,
        }}>THE CRYPTO<br />FINAL BOSS</div>

        <div style={{
          marginTop: 54, transform: `scale(${interpolate(url, [0, 1], [0.8, 1]) * pulse})`, opacity: url,
          padding: "26px 54px", borderRadius: 999,
          background: `linear-gradient(100deg, ${C.gold}, ${C.purple})`,
          boxShadow: `0 24px 70px ${C.purple}55`,
        }}>
          <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 50, color: "#0a0713", letterSpacing: "0.02em" }}>thecryptofinalboss.app</div>
        </div>

        <div style={{ marginTop: 46, opacity: handle, fontFamily: mono, fontSize: 40, color: C.muted, letterSpacing: "0.18em" }}>
          FREE • NO WALLET • <span style={{ color: C.gold }}>@TCFB_game</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
