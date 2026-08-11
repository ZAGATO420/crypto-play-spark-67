import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";

/** 2.39:1 letterbox bars — the single strongest "this is cinema" cue. */
export const Letterbox: React.FC<{ open?: boolean; dur?: number }> = ({ open = false, dur = 24 }) => {
  const f = useCurrentFrame();
  const target = 138;
  const h = open ? interpolate(f, [0, dur], [540, target], { extrapolateRight: "clamp" }) : target;
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 40 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: "#000", zIndex: 40 }} />
    </>
  );
};

/** Animated film grain (deterministic per frame). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(random(`g${f}`) * 1000);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", zIndex: 30, pointerEvents: "none" }}>
      <svg width="1920" height="1080" viewBox="0 0 480 270" preserveAspectRatio="none">
        <filter id={`n${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="480" height="270" filter={`url(#n${f})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Deep vignette + subtle warm halation for a graded, filmic image. */
export const Grade: React.FC<{ tint?: string }> = ({ tint = "#f0b429" }) => (
  <>
    <AbsoluteFill
      style={{
        zIndex: 20,
        background: `radial-gradient(120% 100% at 50% 50%, transparent 38%, rgba(0,0,0,.62) 88%, rgba(0,0,0,.9) 100%)`,
      }}
    />
    <AbsoluteFill style={{ zIndex: 21, background: `linear-gradient(180deg, ${tint}0d, transparent 40%, rgba(4,6,14,.55))` }} />
  </>
);

/** One-frame-ish light flash used on hard cuts. */
export const Flash: React.FC<{ at?: number; color?: string }> = ({ at = 0, color = "#fff" }) => {
  const f = useCurrentFrame();
  const o = interpolate(f - at, [0, 2, 7], [0.55, 0.16, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: o, zIndex: 35 }} />;
};