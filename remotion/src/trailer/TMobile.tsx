import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Phone } from "./Screen";
import { Kick, Line, Chip } from "./Cap";
import { C } from "../theme";

export const TMobile: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <WBg tint={C.green} />
      <div style={{ position: "absolute", right: 190, top: 90, opacity: o }}>
        <Phone src="v5/15_mobile_game.png" dur={dur} />
      </div>
      <div style={{ position: "absolute", left: 96, top: 300, width: 820 }}>
        <Kick text="// FITS IN YOUR POCKET" color={C.green} />
        <div style={{ marginTop: 18 }}>
          <Line text={<>TRADE ANYWHERE.<br /><span style={{ color: C.gold }}>NO SCROLLING.</span></>} delay={6} size={88} />
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          <Chip label="MOBILE UI" value="ONE SCREEN" accent={C.green} delay={26} />
          <Chip label="TABS" value="DOCKED" accent={C.purple2} delay={36} />
        </div>
      </div>
    </AbsoluteFill>
  );
};