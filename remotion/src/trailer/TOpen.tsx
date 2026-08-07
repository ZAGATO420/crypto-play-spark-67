import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Screen } from "./Screen";
import { display, mono } from "../wide/fonts";
import { C } from "../theme";

const WORDS = ["84 MONTHS.", "REAL PRICES.", "ONE STACK."];

export const TOpen: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = interpolate(f, [6, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grade = interpolate(f, [0, 26], [1, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <WBg tint={C.gold} />
      <AbsoluteFill style={{ opacity: reveal }}>
        <Screen src="v5/01_start.png" dur={dur} from={1.22} to={1.05} fy={44} fy2={52} bright={1.22} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#03050c", opacity: grade }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(3,5,12,.96) 0%, rgba(3,5,12,.35) 46%, rgba(3,5,12,.7) 100%)" }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          {WORDS.map((w, i) => {
            const s = spring({ frame: f - 16 - i * 12, fps, config: { damping: 200 } });
            return (
              <div
                key={w}
                style={{
                  fontFamily: display,
                  fontWeight: 900,
                  fontSize: 128,
                  lineHeight: 1.0,
                  letterSpacing: "-0.045em",
                  color: i === 2 ? C.gold : C.text,
                  clipPath: `inset(0 ${interpolate(s, [0, 1], [100, 0])}% 0 0)`,
                  transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`,
                  textShadow: `0 14px 60px rgba(0,0,0,.9)`,
                }}
              >
                {w}
              </div>
            );
          })}
          <div
            style={{
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: "0.36em",
              color: C.purple2,
              marginTop: 30,
              opacity: interpolate(f, [56, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            2020 &nbsp;→&nbsp; 2026
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};