import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Screen } from "./Screen";
import { Kick, Line, Chip, Scrim } from "./Cap";
import { C } from "../theme";

export type BeatProps = {
  dur: number;
  src: string;
  kick: string;
  kickColor?: string;
  line: React.ReactNode;
  size?: number;
  side?: "left" | "right";
  chips?: { label: string; value: string; accent?: string }[];
  fx?: number;
  fy?: number;
  fx2?: number;
  fy2?: number;
  from?: number;
  to?: number;
  tint?: string;
};

/** A generic trailer beat: gameplay push-in + scrim + kinetic caption stack. */
export const Beat: React.FC<BeatProps> = ({
  dur,
  src,
  kick,
  kickColor = C.gold,
  line,
  size = 92,
  side = "left",
  chips = [],
  fx = 50,
  fy = 50,
  fx2,
  fy2,
  from,
  to,
  tint = C.purple,
}) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <WBg tint={tint} />
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <Screen src={src} dur={dur} fx={fx} fy={fy} fx2={fx2} fy2={fy2} from={from} to={to} />
      </AbsoluteFill>
      <Scrim side={side} />
      <div
        style={{
          position: "absolute",
          top: 232,
          left: side === "left" ? 92 : undefined,
          right: side === "right" ? 92 : undefined,
          width: 860,
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
              marginTop: 46,
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