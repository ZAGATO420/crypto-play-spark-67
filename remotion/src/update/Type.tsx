import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const Kicker: React.FC<{ delay?: number; text: string; color?: string; size?: number }> = ({
  delay = 0, text, color = C.gold, size = 28,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = interpolate(f - delay, [0, 14], [-18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ fontFamily: mono, fontSize: size, letterSpacing: "0.26em", color, opacity: o, transform: `translateX(${tx}px)`, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

export const BigLine: React.FC<{ delay?: number; text: React.ReactNode; size?: number; color?: string; glow?: boolean }> = ({
  delay = 0, text, size = 92, color = C.text, glow = true,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontFamily: display, fontWeight: 900, fontSize: size, color, lineHeight: 1.02, letterSpacing: "-0.03em",
        clipPath: `inset(0 ${interpolate(s, [0, 1], [100, 0])}% 0 0)`,
        transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        textShadow: glow ? `0 0 48px ${color}3a` : undefined,
      }}
    >
      {text}
    </div>
  );
};

export const Callout: React.FC<{ delay: number; label: string; value: string; accent?: string }> = ({
  delay, label, value, accent = C.gold,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 14, stiffness: 150 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
        background: "linear-gradient(150deg, rgba(14,19,34,.95), rgba(6,9,18,.98))",
        border: `1px solid ${accent}55`, borderRadius: 16, padding: "16px 22px", minWidth: 250,
        boxShadow: `0 22px 60px rgba(0,0,0,.6), 0 0 40px ${accent}18`,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 20, letterSpacing: "0.2em", color: C.muted }}>{label}</div>
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 40, color: accent, marginTop: 4 }}>{value}</div>
    </div>
  );
};
