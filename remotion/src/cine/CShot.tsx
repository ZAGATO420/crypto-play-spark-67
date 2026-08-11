import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Letterbox, Grain, Grade, Flash } from "./CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export type CShotProps = {
  dur: number;
  clip: string;
  kick?: string;
  kickColor?: string;
  line?: React.ReactNode;
  size?: number;
  note?: string;
  align?: "left" | "right";
  fx?: number;
  fy?: number;
  from?: number;
  to?: number;
  startFrom?: number;
  playbackRate?: number;
  tint?: string;
  pan?: number;
};

/** A cinematic gameplay shot: locked-off letterbox, slow push-in, one readable caption. */
export const CShot: React.FC<CShotProps> = ({
  dur,
  clip,
  kick,
  kickColor = C.gold,
  line,
  size = 84,
  note,
  align = "left",
  fx = 50,
  fy = 50,
  from = 1.1,
  to = 1.2,
  startFrom = 0,
  playbackRate = 1,
  tint = C.gold,
  pan = 0,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [from, to]);
  const px = interpolate(f, [0, dur], [0, pan]);
  const s = spring({ frame: f - 4, fps, config: { damping: 200 }, durationInFrames: 20 });
  const inset = interpolate(s, [0, 1], [100, 0]);
  const kickO = interpolate(f, [2, 10], [0, 1], { extrapolateRight: "clamp" });
  const noteO = interpolate(f, [16, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(f, [dur - 6, dur], [1, 0.9], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ overflow: "hidden", opacity: outO }}>
        <Video
          src={staticFile(`v16/${clip}`)}
          startFrom={startFrom}
          playbackRate={playbackRate}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${px}px)`,
            transformOrigin: `${fx}% ${fy}%`,
            filter: "contrast(1.1) saturate(1.12) brightness(1.05)",
          }}
        />
      </AbsoluteFill>
      <Grade tint={tint} />
      <Grain />
      <Flash at={0} color={tint} />
      <Letterbox />
      {/* caption block, inside the 2.39 safe area */}
      <div
        style={{
          position: "absolute",
          zIndex: 45,
          bottom: 196,
          left: align === "left" ? 104 : undefined,
          right: align === "right" ? 104 : undefined,
          width: 980,
          textAlign: align,
        }}
      >
        {kick ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "0.36em",
              color: kickColor,
              opacity: kickO,
              textShadow: "0 4px 22px rgba(0,0,0,.9)",
            }}
          >
            {kick}
          </div>
        ) : null}
        {line ? (
          <div
            style={{
              marginTop: 12,
              fontFamily: display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              color: C.text,
              clipPath: align === "left" ? `inset(0 ${inset}% 0 0)` : `inset(0 0 0 ${inset}%)`,
              textShadow: "0 12px 46px rgba(0,0,0,.95)",
            }}
          >
            {line}
          </div>
        ) : null}
        {note ? (
          <div
            style={{
              marginTop: 16,
              opacity: noteO,
              display: "inline-block",
              fontFamily: mono,
              fontSize: 22,
              letterSpacing: "0.2em",
              color: C.text,
              border: `1px solid ${tint}66`,
              background: "rgba(4,6,12,.72)",
              borderRadius: 10,
              padding: "10px 18px",
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};