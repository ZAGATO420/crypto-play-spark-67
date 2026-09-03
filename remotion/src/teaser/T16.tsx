import React from "react";
import {
  AbsoluteFill,
  Video,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  random,
} from "remotion";

export const TC = {
  bg: "#050705",
  acid: "#b6ff3c",
  gold: "#f0b429",
  red: "#ff4d5e",
  text: "#f6fff2",
};

import { display as DISPLAY, mono as MONO } from "../wide/fonts";

export const Grain: React.FC<{ o?: number }> = ({ o = 0.1 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  const dots = new Array(90).fill(0).map((_, i) => {
    const x = random(`x${seed}${i}`) * 100;
    const y = random(`y${seed}${i}`) * 100;
    const s = 1 + random(`s${seed}${i}`) * 2.4;
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.5) 0, rgba(255,255,255,0) ${s}px)`;
  });
  return (
    <AbsoluteFill
      style={{ opacity: o, backgroundImage: dots.join(","), mixBlendMode: "screen" }}
    />
  );
};

export const Vig: React.FC = () => (
  <AbsoluteFill
    style={{
      boxShadow: "inset 0 0 420px 130px rgba(2,4,2,.9)",
      pointerEvents: "none",
    }}
  />
);

export const Bars: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 46, background: TC.bg }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 46, background: TC.bg }} />
  </>
);

/** One trailer shot: video push-in + scrim + giant caption. */
export const T16: React.FC<{
  dur: number;
  src: string;
  kick: string;
  line: React.ReactNode;
  size?: number;
  tint?: string;
  from?: number;
  to?: number;
  fx?: number;
  fy?: number;
  align?: "left" | "center";
  bright?: number;
}> = ({
  dur,
  src,
  kick,
  line,
  size = 122,
  tint = TC.acid,
  from = 1.04,
  to = 1.16,
  fx = 50,
  fy = 50,
  align = "left",
  bright = 1.06,
}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const s = interpolate(p, [0, 1], [from, to]);
  const inO = interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  const ty = interpolate(f, [2, 16], [46, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const tO = interpolate(f, [2, 14], [0, 1], { extrapolateRight: "clamp" });
  const clip = interpolate(f, [1, 15], [0, 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: TC.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: inO }}>
        <Video
          src={staticFile(src)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${fx}% ${fy}%`,
            transform: `scale(${s})`,
            filter: `brightness(${bright}) saturate(1.08) contrast(1.1)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            align === "center"
              ? "radial-gradient(ellipse at 50% 55%, rgba(2,4,2,.5) 0%, rgba(2,4,2,.86) 78%)"
              : "linear-gradient(90deg, rgba(2,4,2,.9) 0%, rgba(2,4,2,.72) 42%, rgba(2,4,2,.12) 88%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(0deg, rgba(2,4,2,.92) 0%, rgba(2,4,2,0) 46%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: align === "center" ? 0 : 108,
          right: align === "center" ? 0 : undefined,
          bottom: 150,
          width: align === "center" ? "100%" : 1340,
          textAlign: align,
          opacity: tO,
          transform: `translateY(${ty}px)`,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 27,
            letterSpacing: 7,
            color: tint,
            marginBottom: 22,
            textShadow: `0 0 26px ${tint}66`,
          }}
        >
          {kick}
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: size,
            lineHeight: 0.95,
            letterSpacing: -2,
            color: TC.text,
            textTransform: "uppercase",
            textShadow: "0 18px 60px rgba(0,0,0,.95)",
            clipPath: `inset(0 ${100 - clip}% 0 0)`,
          }}
        >
          {line}
        </div>
      </div>
      <Vig />
      <Grain />
      <Bars />
    </AbsoluteFill>
  );
};

/** Final logo / CTA card over the boss still. */
export const T16CTA: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], { extrapolateRight: "clamp" });
  const s = interpolate(p, [0, 1], [1.1, 1.02]);
  const o = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const l = interpolate(f, [6, 26], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const u = interpolate(f, [22, 40], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  return (
    <AbsoluteFill style={{ background: TC.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: o * 0.9 }}>
        <Img
          src={staticFile("img/ad_boss_cta.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${s})`,
            filter: "brightness(.72) saturate(1.05)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(2,4,2,.35) 0%, rgba(2,4,2,.93) 72%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: 10,
            color: TC.gold,
            opacity: l,
          }}
        >
          FREE TO PLAY · NO WALLET
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 154,
            lineHeight: 0.92,
            letterSpacing: -3,
            color: TC.text,
            marginTop: 20,
            textTransform: "uppercase",
            transform: `scale(${interpolate(l, [0, 1], [0.92, 1])})`,
            opacity: l,
            textShadow: `0 0 90px ${TC.acid}33`,
          }}
        >
          THE CRYPTO
          <br />
          <span style={{ color: TC.acid }}>FINAL BOSS</span>
        </div>
        <div
          style={{
            marginTop: 34,
            fontFamily: MONO,
            fontSize: 34,
            letterSpacing: 4,
            color: TC.text,
            opacity: u,
            borderTop: `2px solid ${TC.acid}55`,
            paddingTop: 22,
          }}
        >
          THECRYPTOFINALBOSS.APP
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 8,
            color: TC.gold,
            opacity: u,
          }}
        >
          $TCFB — OCTOBER
        </div>
      </AbsoluteFill>
      <Vig />
      <Grain o={0.08} />
      <Bars />
    </AbsoluteFill>
  );
};
