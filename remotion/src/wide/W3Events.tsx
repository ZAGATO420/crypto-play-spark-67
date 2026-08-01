import React from "react";
import { AbsoluteFill, Img, staticFile, Series, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "./WBg";
import { display, mono } from "./fonts";
import { C } from "../theme";

const BEATS = [
  { img: "img/hist-blackthursday.png", tag: "MAR 2020 · BLACK THURSDAY", line: "BTC −50%", sub: "IN 24 HOURS", tint: C.red, dur: 40, side: "left" as const },
  { img: "img/hist-luna.png", tag: "MAY 2022 · LUNA", line: "$60B GONE", sub: "IN 72 HOURS", tint: C.purple, dur: 40, side: "right" as const },
  { img: "img/hist-ftx.png", tag: "NOV 2022 · FTX", line: "ACCOUNT FROZEN", sub: "EXCHANGE TAKES 35%", tint: C.gold, dur: 46, side: "left" as const },
];

const Beat: React.FC<(typeof BEATS)[number]> = ({ img, tag, line, sub, tint, dur, side }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 15, stiffness: 150 } });
  const sc = interpolate(f, [0, dur], [1.12, 1.2]);
  const shake = f < 9 ? Math.sin(f * 3.6) * (9 - f) * 1.8 : 0;
  const out = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imgLeft = side === "left";

  return (
    <AbsoluteFill style={{ opacity: out }}>
      <WBg tint={tint} flash />
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, width: 1150, overflow: "hidden",
          [imgLeft ? "left" : "right"]: -60,
          transform: `translateX(${shake}px)`,
        }}
      >
        <Img src={staticFile(img)} style={{ width: "100%", transform: `scale(${sc})`, filter: "brightness(.9) saturate(1.1)" }} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(${imgLeft ? "270deg" : "90deg"}, ${C.bg} 32%, ${C.bg}cc 46%, transparent 68%)` }} />

      <div style={{ position: "absolute", top: 330, [imgLeft ? "right" : "left"]: 96, width: 720, textAlign: imgLeft ? "right" : "left" } as React.CSSProperties}>
        <div style={{ fontFamily: mono, fontSize: 28, letterSpacing: "0.26em", color: tint, opacity: interpolate(s, [0, 1], [0, 1]) }}>{tag}</div>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 110, color: C.text, marginTop: 12, letterSpacing: "-0.03em", clipPath: `inset(0 ${imgLeft ? "" : ""}${interpolate(s, [0, 1], [100, 0])}% 0 0)`, textShadow: `0 0 60px ${tint}55` }}>{line}</div>
        <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 42, color: tint, marginTop: 10, transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px)`, opacity: s }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

export const W3Events: React.FC = () => (
  <Series>
    {BEATS.map((b) => (
      <Series.Sequence key={b.tag} durationInFrames={b.dur}>
        <Beat {...b} />
      </Series.Sequence>
    ))}
  </Series>
);
export const W3_DUR = BEATS.reduce((a, b) => a + b.dur, 0);