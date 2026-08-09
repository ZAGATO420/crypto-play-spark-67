import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { WBg } from "../wide/WBg";
import { Kick, Line, Chip, Scrim } from "../trailer/Cap";
import { C } from "../theme";

export type VBeatProps = {
  dur: number;
  clip: string;
  kick: string;
  kickColor?: string;
  line: React.ReactNode;
  size?: number;
  side?: "left" | "right";
  chips?: { label: string; value: string; accent?: string }[];
  fx?: number;
  fy?: number;
  from?: number;
  to?: number;
  tint?: string;
  startFrom?: number;
  playbackRate?: number;
};

/** A trailer beat driven by real gameplay footage with a slow push-in and kinetic captions. */
export const VBeat: React.FC<VBeatProps> = ({
  dur,
  clip,
  kick,
  kickColor = C.gold,
  line,
  size = 92,
  side = "left",
  chips = [],
  fx = 50,
  fy = 50,
  from = 1.08,
  to = 1.2,
  tint = C.gold,
  startFrom = 0,
  playbackRate = 1,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [dur - 8, dur], [1, 0.86], { extrapolateLeft: "clamp" });
  const scale = interpolate(f, [0, dur], [from, to]);
  const s = spring({ frame: f, fps, config: { damping: 200 }, durationInFrames: 22 });
  const bracket = interpolate(s, [0, 1], [0, 1]);
  return (
    <AbsoluteFill>
      <WBg tint={tint} />
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut, overflow: "hidden" }}>
        <Video
          src={staticFile(`v16/${clip}`)}
          startFrom={startFrom}
          playbackRate={playbackRate}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: `${fx}% ${fy}%`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.9) 0px, rgba(255,255,255,.9) 1px, transparent 1px, transparent 4px)",
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 240px 80px rgba(0,0,0,.78)" }} />
      <Scrim side={side} strength={0.9} />
      {/* tactical corner brackets */}
      {[
        { top: 46, left: 46, bt: 1, bl: 1 },
        { top: 46, right: 46, bt: 1, br: 1 },
        { bottom: 46, left: 46, bb: 1, bl: 1 },
        { bottom: 46, right: 46, bb: 1, br: 1 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 74,
            height: 74,
            opacity: bracket * 0.8,
            top: (p as any).top,
            left: (p as any).left,
            right: (p as any).right,
            bottom: (p as any).bottom,
            borderTop: (p as any).bt ? `2px solid ${C.gold}80` : undefined,
            borderBottom: (p as any).bb ? `2px solid ${C.gold}80` : undefined,
            borderLeft: (p as any).bl ? `2px solid ${C.gold}80` : undefined,
            borderRight: (p as any).br ? `2px solid ${C.gold}80` : undefined,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: side === "left" ? 96 : undefined,
          right: side === "right" ? 96 : undefined,
          width: 880,
          textAlign: side,
        }}
      >
        <Kick text={kick} color={kickColor} />
        <div style={{ marginTop: 18 }}>
          <Line text={line} delay={6} size={size} align={side} />
        </div>
        {chips.length ? (
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 44,
              justifyContent: side === "right" ? "flex-end" : "flex-start",
              flexWrap: "wrap",
            }}
          >
            {chips.map((c, i) => (
              <Chip key={c.label} label={c.label} value={c.value} accent={c.accent} delay={26 + i * 9} />
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};