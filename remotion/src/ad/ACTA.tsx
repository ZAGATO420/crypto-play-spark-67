import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { AC } from "./palette";

/** Closing card: boss silhouette, title, free-to-play CTA and the October token beat. */
export const ACTA: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [1.02, 1.12]);
  const s1 = spring({ frame: f - 4, fps, config: { damping: 200 }, durationInFrames: 18 });
  const s2 = spring({ frame: f - 24, fps, config: { damping: 200 }, durationInFrames: 16 });
  const s3 = spring({ frame: f - 46, fps, config: { damping: 14, stiffness: 190 } });
  const pulse = 1 + 0.02 * Math.sin(f / 6);

  return (
    <AbsoluteFill style={{ background: AC.bg, overflow: "hidden" }}>
      <AbsoluteFill>
        <Img
          src={staticFile("img/ad_boss_cta.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: "linear-gradient(0deg, rgba(3,5,3,.97) 6%, rgba(3,5,3,.5) 40%, transparent 68%)" }}
      />

      <div style={{ position: "absolute", left: 64, top: 1170, width: 952 }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 104,
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
            color: AC.text,
            opacity: s1,
            transform: `translateY(${interpolate(s1, [0, 1], [30, 0])}px)`,
            textShadow: "0 18px 60px rgba(0,0,0,.95)",
          }}
        >
          THE CRYPTO
          <br />
          <span style={{ color: AC.gold }}>FINAL BOSS</span>
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: "0.2em",
            color: AC.acid,
            opacity: s2,
          }}
        >
          84 MONTHS · REAL PRICES · ONE LIFE
        </div>

        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            transform: `scale(${interpolate(s3, [0, 1], [0.9, 1]) * pulse})`,
            transformOrigin: "0% 50%",
            fontFamily: display,
            fontWeight: 900,
            fontSize: 52,
            letterSpacing: "-0.02em",
            color: "#050705",
            background: `linear-gradient(90deg, ${AC.gold}, ${AC.acid})`,
            borderRadius: 18,
            padding: "22px 44px",
            boxShadow: `0 24px 70px ${AC.acid}44`,
          }}
        >
          PLAY FREE
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: "0.1em",
            color: AC.text,
            opacity: s2,
          }}
        >
          thecryptofinalboss.app
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: mono,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.24em",
            color: AC.gold,
            opacity: s3,
          }}
        >
          $TCFB — OCTOBER
        </div>
      </div>
      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
