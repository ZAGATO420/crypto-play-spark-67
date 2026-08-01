import React from "react";
import { AbsoluteFill, Img, staticFile, Series, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/Archivo";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { Bg } from "../components/Bg";
import { C } from "../theme";

const { fontFamily: display } = loadDisplay("normal", { weights: ["800"], subsets: ["latin"] });
const { fontFamily: mono } = loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BEATS = [
  { img: "img/hist-blackthursday.png", tag: "MAR 2020", line: "BTC −50% IN 24H", tint: C.red, dur: 46 },
  { img: "img/hist-luna.png", tag: "MAY 2022", line: "$60B GONE", tint: C.purple, dur: 46 },
  { img: "img/hist-ftx.png", tag: "NOV 2022", line: "EXCHANGE TAKES 35%", tint: C.gold, dur: 52 },
];

const Beat: React.FC<{ img: string; tag: string; line: string; tint: string; dur: number }> = ({ img, tag, line, tint, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 16, stiffness: 140 } });
  const sc = interpolate(s, [0, 1], [1.14, 1.02]);
  const shake = f < 8 ? Math.sin(f * 3.4) * (8 - f) * 1.6 : 0;
  const out = interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bg tint={tint} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${sc}) translateX(${shake}px)`, width: 980, borderRadius: 24, overflow: "hidden", border: `2px solid ${tint}55`, boxShadow: `0 40px 100px rgba(0,0,0,.7), 0 0 80px ${tint}33` }}>
          <Img src={staticFile(img)} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ marginTop: 60, textAlign: "center", transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)` }}>
          <div style={{ fontFamily: mono, fontSize: 34, letterSpacing: "0.26em", color: tint }}>{tag}</div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 92, color: C.text, marginTop: 10, clipPath: `inset(0 ${interpolate(s, [0, 1], [100, 0])}% 0 0)` }}>{line}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S3Events: React.FC = () => (
  <Series>
    {BEATS.map((b) => (
      <Series.Sequence key={b.tag} durationInFrames={b.dur}>
        <Beat {...b} />
      </Series.Sequence>
    ))}
  </Series>
);
export const S3_DUR = BEATS.reduce((a, b) => a + b.dur, 0);
