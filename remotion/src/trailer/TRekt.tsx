import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Screen } from "./Screen";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

export const TRekt: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 10, stiffness: 200 } });
  const sub = spring({ frame: f - 26, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill>
      <WBg tint={C.red} flash />
      <AbsoluteFill style={{ opacity: interpolate(f, [0, 10], [0, 0.55], { extrapolateRight: "clamp" }) }}>
        <Screen src="v5/13_end.png" dur={dur} from={1.1} to={1.26} fy={38} bright={1.1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(3,5,12,.5)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 240,
            letterSpacing: "-0.06em",
            color: C.red,
            textShadow: `0 0 110px ${C.red}66`,
            transform: `scale(${interpolate(s, [0, 1], [0.78, 1])}) skewX(${interpolate(s, [0, 1], [-10, 0])}deg)`,
          }}
        >
          REKT.
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 38,
            letterSpacing: "0.24em",
            color: C.text,
            marginTop: 6,
            opacity: sub,
          }}
        >
          MOST DEGENS DIE BEFORE MONTH 20.
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 30,
            letterSpacing: "0.24em",
            color: C.gold2,
            marginTop: 14,
            opacity: interpolate(f - 42, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          THINK YOU CAN BEAT THE BOSS?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};