import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { AC } from "./palette";

/** Cold open: boss on the throne, slow push-in, one line of setup. */
export const AOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [1.16, 1.0]);
  const fadeIn = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const s1 = spring({ frame: f - 20, fps, config: { damping: 200 }, durationInFrames: 16 });
  const s2 = spring({ frame: f - 44, fps, config: { damping: 200 }, durationInFrames: 16 });

  return (
    <AbsoluteFill style={{ background: AC.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <Img
          src={staticFile("img/ad_boss_open.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "linear-gradient(0deg, rgba(3,5,3,.96) 2%, rgba(3,5,3,.4) 32%, transparent 60%)" }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(110% 80% at 50% 40%, transparent 42%, rgba(0,0,0,.66) 95%)" }} />

      <div style={{ position: "absolute", left: 64, top: 1290, width: 952 }}>
        <div
          style={{
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.28em",
            color: AC.gold,
            opacity: s1,
            transform: `translateY(${interpolate(s1, [0, 1], [22, 0])}px)`,
          }}
        >
          // JANUARY 2020
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: display,
            fontWeight: 900,
            fontSize: 132,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: AC.text,
            clipPath: `inset(0 ${interpolate(s2, [0, 1], [100, 0])}% 0 0)`,
            textShadow: "0 20px 60px rgba(0,0,0,.95)",
          }}
        >
          YOU HAVE
          <br />
          <span style={{ color: AC.acid }}>$10,000.</span>
        </div>
      </div>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
