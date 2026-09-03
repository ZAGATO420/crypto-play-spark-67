import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain, Flash } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { AC } from "./palette";

export type AShotProps = {
  dur: number;
  src: string;
  chip?: string;
  kick?: string;
  line?: React.ReactNode;
  size?: number;
  note?: string;
  /** focus point of the push-in, in percent */
  fx?: number;
  fy?: number;
  from?: number;
  to?: number;
  rate?: number;
  tint?: string;
  /** put the caption block at the top instead of the lower third */
  top?: boolean;
};

/** Full-bleed vertical gameplay shot (1080x1920) with a slow push-in and one loud caption. */
export const AShot: React.FC<AShotProps> = ({
  dur,
  src,
  chip,
  kick,
  line,
  size = 104,
  note,
  fx = 50,
  fy = 50,
  from = 1.04,
  to = 1.16,
  rate = 0.55,
  tint = AC.acid,
  top = false,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [from, to]);
  const rev = spring({ frame: f - 2, fps, config: { damping: 200 }, durationInFrames: 13 });
  const inset = interpolate(rev, [0, 1], [100, 0]);
  const chipS = spring({ frame: f - 3, fps, config: { damping: 16, stiffness: 210 } });
  const kickO = interpolate(f, [3, 12], [0, 1], { extrapolateRight: "clamp" });
  const noteO = interpolate(f, [13, 23], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const capTop = top ? 190 : 1330;

  return (
    <AbsoluteFill style={{ background: AC.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Video
          src={staticFile(src)}
          loop
          muted
          playbackRate={rate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: `${fx}% ${fy}%`,
            filter: "contrast(1.07) saturate(1.16) brightness(1.05)",
          }}
        />
      </AbsoluteFill>

      {/* legibility scrims */}
      <AbsoluteFill
        style={{
          background: top
            ? "linear-gradient(180deg, rgba(3,5,3,.97) 0%, rgba(3,5,3,.93) 22%, rgba(3,5,3,.7) 34%, transparent 56%)"
            : "linear-gradient(0deg, rgba(3,5,3,.98) 0%, rgba(3,5,3,.93) 22%, rgba(3,5,3,.7) 34%, transparent 58%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,.55) 92%)`,
        }}
      />

      {chip ? (
        <div
          style={{
            position: "absolute",
            top: top ? 1660 : 96,
            left: 64,
            transform: `translateY(${interpolate(chipS, [0, 1], [-26, 0])}px)`,
            opacity: chipS,
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "0.2em",
              color: "#050705",
              background: tint,
              borderRadius: 10,
              padding: "10px 20px",
            }}
          >
            {chip}
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", zIndex: 45, top: capTop, left: 64, width: 952 }}>
        {kick ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 29,
              letterSpacing: "0.26em",
              color: tint,
              opacity: kickO,
              textShadow: "0 4px 22px rgba(0,0,0,.95)",
            }}
          >
            {kick}
          </div>
        ) : null}
        {line ? (
          <div
            style={{
              marginTop: 14,
              fontFamily: display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.92,
              letterSpacing: "-0.045em",
              color: AC.text,
              clipPath: `inset(0 ${inset}% 0 0)`,
              textShadow: "0 18px 56px rgba(0,0,0,.97)",
            }}
          >
            {line}
          </div>
        ) : null}
        {note ? (
          <div
            style={{
              marginTop: 20,
              opacity: noteO,
              display: "inline-block",
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: "0.14em",
              color: AC.text,
              border: `1px solid ${tint}66`,
              background: "rgba(4,7,4,.78)",
              borderRadius: 12,
              padding: "12px 20px",
            }}
          >
            {note}
          </div>
        ) : null}
      </div>

      <Grain opacity={0.07} />
      <Flash at={0} color={tint} />
    </AbsoluteFill>
  );
};
