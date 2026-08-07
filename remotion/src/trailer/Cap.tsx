import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const Kick: React.FC<{ text: string; color?: string; delay?: number; size?: number }> = ({
  text,
  color = C.gold,
  delay = 0,
  size = 26,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - delay, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x = interpolate(f - delay, [0, 14], [-22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        fontFamily: mono,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.3em",
        color,
        opacity: o,
        transform: `translateX(${x}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Line: React.FC<{
  text: React.ReactNode;
  delay?: number;
  size?: number;
  color?: string;
  align?: "left" | "right";
}> = ({ text, delay = 0, size = 96, color = C.text, align = "left" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200 } });
  const inset = interpolate(s, [0, 1], [100, 0]);
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: "-0.035em",
        color,
        textAlign: align,
        clipPath: align === "left" ? `inset(0 ${inset}% 0 0)` : `inset(0 0 0 ${inset}%)`,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
        textShadow: `0 10px 50px rgba(0,0,0,.85), 0 0 46px ${color}30`,
      }}
    >
      {text}
    </div>
  );
};

export const Chip: React.FC<{ label: string; value: string; delay: number; accent?: string }> = ({
  label,
  value,
  delay,
  accent = C.gold,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 160 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [24, 0])}px) scale(${interpolate(s, [0, 1], [0.93, 1])})`,
        background: "linear-gradient(150deg, rgba(15,20,36,.94), rgba(6,9,18,.97))",
        border: `1px solid ${accent}55`,
        borderRadius: 14,
        padding: "14px 20px",
        minWidth: 210,
        boxShadow: `0 20px 54px rgba(0,0,0,.65), 0 0 34px ${accent}18`,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: "0.22em", color: C.muted }}>{label}</div>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: accent, marginTop: 4 }}>{value}</div>
    </div>
  );
};

/** Soft dark scrim so type always stays readable over gameplay. */
export const Scrim: React.FC<{ side?: "left" | "right" | "bottom"; strength?: number }> = ({
  side = "left",
  strength = 0.94,
}) => {
  const dir = side === "left" ? "90deg" : side === "right" ? "270deg" : "0deg";
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(${dir}, rgba(3,5,12,${strength}) 0%, rgba(3,5,12,${strength * 0.72}) 34%, transparent 68%)`,
      }}
    />
  );
};