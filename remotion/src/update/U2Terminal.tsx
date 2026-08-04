import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Clip } from "./Clip";
import { Kicker, BigLine, Callout } from "./Type";
import { C } from "../theme";

export const U2Terminal: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const rev = interpolate(f, [0, 16], [100, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <WBg tint={C.purple} />
      <div style={{ position: "absolute", right: 70, top: 120, width: 1140, height: 700, clipPath: `inset(0 0 ${rev}% 0)` }}>
        <Clip src="clips/terminal.webm" dur={dur} from={1.05} to={1.16} y={-24} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg} 26%, transparent 52%)` }} />
      <div style={{ position: "absolute", left: 90, top: 250, width: 720 }}>
        <Kicker text="// TERMINAL REBUILT" color={C.purple2} />
        <div style={{ marginTop: 16 }}>
          <BigLine delay={6} text={<>ONE SCREEN.<br /><span style={{ color: C.gold }}>ZERO NOISE.</span></>} size={96} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          <Callout delay={26} label="STICKY HUD" value="ALWAYS ON" accent={C.purple2} />
          <Callout delay={36} label="LIVE P&L" value="TICK BY TICK" accent={C.green} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
