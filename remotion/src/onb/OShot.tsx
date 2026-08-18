import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { Grain, Flash } from "../cine/CineFx";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export type OShotProps = {
  dur: number;
  src: string;
  step?: string;
  label?: string;
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
  tint?: string;
};

/** Gameplay shot for the onboarding trailer: full-bleed screen recording, slow push-in,
 * one step chip top-left and one loud caption at the bottom. */
export const OShot: React.FC<OShotProps> = ({
  dur,
  src,
  step,
  label,
  kick,
  kickColor,
  line,
  size = 70,
  note,
  align = "left",
  fx = 50,
  fy = 50,
  from = 1.15,
  to = 1.26,
  startFrom = 0,
  tint = C.gold,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(f, [0, dur], [from, to]);
  const s = spring({ frame: f - 3, fps, config: { damping: 200 }, durationInFrames: 18 });
  const inset = interpolate(s, [0, 1], [100, 0]);
  const chip = spring({ frame: f - 2, fps, config: { damping: 16, stiffness: 200 } });
  const kickO = interpolate(f, [4, 12], [0, 1], { extrapolateRight: "clamp" });
  const noteO = interpolate(f, [18, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(f, [dur - 6, dur], [1, 0.92], { extrapolateLeft: "clamp" });
  const kc = kickColor ?? tint;
  return (
    <AbsoluteFill style={{ background: "#04050a" }}>
      <AbsoluteFill style={{ overflow: "hidden", opacity: outO }}>
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
      </AbsoluteFill>
      {/* grade */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 105% at ${fx}% ${fy}%, transparent 34%, rgba(0,0,0,.6) 86%, rgba(0,0,0,.9) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,5,10,.72) 0%, transparent 26%, transparent 52%, rgba(4,5,10,.9) 100%)` }} />

      {/* step chip */}
      {step ? (
        <div
          style={{
            position: "absolute",
            top: 62,
            left: 78,
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `translateY(${interpolate(chip, [0, 1], [-24, 0])}px)`,
            opacity: chip,
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.22em",
              color: "#05060e",
              background: tint,
              borderRadius: 8,
              padding: "8px 14px",
            }}
          >
            {step}
          </div>
          {label ? (
            <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 22, letterSpacing: "0.3em", color: C.text, opacity: 0.9 }}>
              {label}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* caption */}
      <div
        style={{
          position: "absolute",
          zIndex: 45,
          bottom: 86,
          left: align === "left" ? 78 : undefined,
          right: align === "right" ? 78 : undefined,
          width: 1050,
          textAlign: align,
        }}
      >
        {kick ? (
          <div
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 23,
              letterSpacing: "0.34em",
              color: kc,
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
              marginTop: 10,
              fontFamily: display,
              fontWeight: 900,
              fontSize: size,
              lineHeight: 0.98,
              letterSpacing: "-0.042em",
              color: C.text,
              clipPath: align === "left" ? `inset(0 ${inset}% 0 0)` : `inset(0 0 0 ${inset}%)`,
              textShadow: "0 14px 50px rgba(0,0,0,.96)",
            }}
          >
            {line}
          </div>
        ) : null}
        {note ? (
          <div
            style={{
              marginTop: 14,
              opacity: noteO,
              display: "inline-block",
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 21,
              letterSpacing: "0.18em",
              color: C.text,
              border: `1px solid ${tint}66`,
              background: "rgba(4,6,12,.74)",
              borderRadius: 10,
              padding: "10px 18px",
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
