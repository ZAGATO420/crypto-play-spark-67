import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain, Flash } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export type TShotProps = {
  dur: number;
  src: string;
  chip?: string;
  kick?: string;
  line?: React.ReactNode;
  size?: number;
  note?: string;
  fx?: number;
  fy?: number;
  from?: number;
  to?: number;
  startFrom?: number;
  tint?: string;
};

/** Vertical (1080x1920) gameplay shot: full-bleed screen capture cropped to portrait,
 *  slow push-in, one chip on top and one loud caption in the lower third. */
export const TShot: React.FC<TShotProps> = ({
  dur,
  src,
  chip,
  kick,
  line,
  size = 96,
  note,
  fx = 50,
  fy = 50,
  from = 1.0,
  to = 1.08,
  startFrom = 0,
  tint = C.gold,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [from, to]);
  const s = spring({ frame: f - 2, fps, config: { damping: 200 }, durationInFrames: 14 });
  const inset = interpolate(s, [0, 1], [100, 0]);
  const chipS = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 200 } });
  const kickO = interpolate(f, [3, 11], [0, 1], { extrapolateRight: "clamp" });
  const noteO = interpolate(f, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#04050a" }}>
      {/* blurred full-bleed backdrop */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Video
          src={staticFile(src)}
          startFrom={startFrom}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale * 1.5})`,
            transformOrigin: "50% 50%",
            filter: "blur(46px) brightness(.5) saturate(1.3)",
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(900px 900px at 50% 42%, ${tint}1c, transparent 70%)` }} />

      {/* sharp 16:9 gameplay band, framed */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 0,
          width: 1080,
          height: 608,
          overflow: "hidden",
          borderTop: `2px solid ${tint}55`,
          borderBottom: `2px solid ${tint}55`,
          boxShadow: "0 40px 120px rgba(0,0,0,.85)",
          zIndex: 10,
        }}
      >
        <Video
          src={staticFile(src)}
          startFrom={startFrom}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
            transformOrigin: `${fx}% ${fy}%`,
            filter: "contrast(1.08) saturate(1.14) brightness(1.06)",
          }}
        />
      </div>

      {chip ? (
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 64,
            display: "flex",
            gap: 14,
            transform: `translateY(${interpolate(chipS, [0, 1], [-28, 0])}px)`,
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
              color: "#05060e",
              background: tint,
              borderRadius: 10,
              padding: "10px 18px",
            }}
          >
            {chip}
          </div>
        </div>
      ) : null}

      <div style={{ position: "absolute", zIndex: 45, top: 1160, left: 64, width: 952 }}>
        {kick ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "0.26em",
              color: tint,
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
              marginTop: 14,
              fontFamily: display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.94,
              letterSpacing: "-0.045em",
              color: C.text,
              clipPath: `inset(0 ${inset}% 0 0)`,
              textShadow: "0 16px 54px rgba(0,0,0,.96)",
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
              fontSize: 27,
              letterSpacing: "0.14em",
              color: C.text,
              border: `1px solid ${tint}66`,
              background: "rgba(4,6,12,.76)",
              borderRadius: 12,
              padding: "12px 20px",
            }}
          >
            {note}
          </div>
        ) : null}
      </div>
      <Grain opacity={0.06} />
      <Flash at={0} color={tint} />
    </AbsoluteFill>
  );
};
