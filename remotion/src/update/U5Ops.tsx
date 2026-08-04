import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { WBg } from "../wide/WBg";
import { Clip } from "./Clip";
import { Kicker, BigLine } from "./Type";
import { mono } from "../wide/fonts";
import { C } from "../theme";

const ROWS: [string, string, string][] = [
  ["AIRDROP FARMS", "sybil risk included", C.green],
  ["LAUNCHPAD TIERS", "presales · snipes", C.gold],
  ["DEGEN QUESTS", "58 real events", C.purple2],
  ["SIDE QUEST TICKETS", "1 per quarter", C.gold2],
];

const Row: React.FC<{ i: number; d: [string, string, string] }> = ({ i, d }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 18 - i * 8, fps, config: { damping: 15, stiffness: 150 } });
  return (
    <div
      style={{
        opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-40, 0])}px)`,
        display: "flex", alignItems: "center", gap: 18, padding: "16px 22px",
        borderLeft: `3px solid ${d[2]}`, background: "linear-gradient(90deg, rgba(255,255,255,.045), transparent)",
      }}
    >
      <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: C.text, letterSpacing: "0.06em" }}>{d[0]}</div>
      <div style={{ fontFamily: mono, fontSize: 24, color: d[2], letterSpacing: "0.14em" }}>{d[1]}</div>
    </div>
  );
};

export const U5Ops: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <WBg tint={C.green} />
      <div style={{ position: "absolute", right: 60, top: 60, width: 900, height: 460, opacity: o }}>
        <Clip src="clips/ops.webm" dur={dur} from={1.2} to={1.34} y={-30} />
      </div>
      <div style={{ position: "absolute", right: 60, bottom: 60, width: 900, height: 440, opacity: o }}>
        <Clip src="clips/market.webm" dur={dur} from={1.16} to={1.3} y={30} />
      </div>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${C.bg} 32%, transparent 58%)` }} />
      <div style={{ position: "absolute", left: 90, top: 210, width: 760 }}>
        <Kicker text="// DEGEN OPS" color={C.green} />
        <div style={{ marginTop: 14, marginBottom: 34 }}>
          <BigLine delay={6} text={<>MORE WAYS<br />TO GET <span style={{ color: C.red }}>REKT.</span></>} size={82} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ROWS.map((d, i) => <Row key={d[0]} i={i} d={d} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
