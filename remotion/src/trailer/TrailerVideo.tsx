import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { Beat } from "./Beat";
import { TOpen } from "./TOpen";
import { TMobile } from "./TMobile";
import { TRekt } from "./TRekt";
import { TCTA } from "./TCTA";
import { C } from "../theme";

const D = {
  open: 96,
  arch: 76,
  term: 88,
  trade: 82,
  hist: 88,
  perp: 88,
  xp: 76,
  mob: 88,
  rekt: 84,
  cta: 132,
};
const T = { a: 12, b: 12, c: 10, d: 12, e: 10, f: 12, g: 12, h: 10, i: 14 };

export const TRAILER_TOTAL =
  Object.values(D).reduce((a, b) => a + b, 0) - Object.values(T).reduce((a, b) => a + b, 0);

const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const TrailerVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.open}>
        <TOpen dur={D.open} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T.a)} />

      <TransitionSeries.Sequence durationInFrames={D.arch}>
        <Beat
          dur={D.arch}
          src="v5/02_archetypes.png"
          kick="// PICK YOUR DEGEN"
          kickColor={C.purple2}
          line={<>SIX WAYS<br /><span style={{ color: C.gold }}>TO GET REKT.</span></>}
          size={94}
          fy={56}
          fy2={48}
          from={1.08}
          to={1.2}
          tint={C.purple}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={spr(T.b)} />

      <TransitionSeries.Sequence durationInFrames={D.term}>
        <Beat
          dur={D.term}
          src="v5/03_terminal.png"
          kick="// THE TERMINAL"
          line={<>ONE SCREEN.<br /><span style={{ color: C.green }}>ZERO NOISE.</span></>}
          side="right"
          fx={62}
          fx2={48}
          from={1.1}
          to={1.22}
          chips={[
            { label: "SEASON STATUS", value: "LIVE RANK", accent: C.purple2 },
            { label: "MISSIONS", value: "DAILY XP", accent: C.gold },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.c })} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <Beat
          dur={D.trade}
          src="v5/04_trademodal.png"
          kick="// DEX TRADE MODAL"
          kickColor={C.green}
          line={<>TAP. SIZE IT.<br /><span style={{ color: C.green }}>SEND IT.</span></>}
          fx={40}
          fx2={50}
          from={1.14}
          to={1.3}
          tint={C.green}
          chips={[
            { label: "FEES + TAX", value: "PREVIEWED", accent: C.green },
            { label: "SIZE", value: "25 → MAX", accent: C.gold },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T.d)} />

      <TransitionSeries.Sequence durationInFrames={D.hist}>
        <Beat
          dur={D.hist}
          src="v5/06_chart.png"
          kick="// 19 MAY 2021"
          kickColor={C.red}
          line={<>EVERYTHING<br /><span style={{ color: C.red }}>LIQUIDATES.</span></>}
          side="right"
          fx={58}
          fx2={46}
          from={1.12}
          to={1.26}
          tint={C.red}
          chips={[{ label: "REAL HISTORY", value: "2020 → 2026", accent: C.red }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.e })} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <Beat
          dur={D.perp}
          src="v5/12_ledger.png"
          kick="// PERP DESK"
          kickColor={C.purple2}
          line={<>UP TO 50x.<br /><span style={{ color: C.red }}>NO MERCY.</span></>}
          fy={72}
          fy2={58}
          from={1.16}
          to={1.3}
          chips={[
            { label: "LIQUIDATION", value: "LIVE CHECK", accent: C.red },
            { label: "CASH LEDGER", value: "EVERY CENT", accent: C.green },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={spr(T.f)} />

      <TransitionSeries.Sequence durationInFrames={D.xp}>
        <Beat
          dur={D.xp}
          src="v5/09_airdrops.png"
          kick="// LEVEL 4 UNLOCKED"
          kickColor={C.gold}
          line={<>XP, TIERS,<br /><span style={{ color: C.gold }}>LEADERBOARD.</span></>}
          side="right"
          fx={52}
          fx2={44}
          from={1.14}
          to={1.26}
          chips={[{ label: "16 LEVELS", value: "GLOBAL RANK", accent: C.gold }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={spr(T.g)} />

      <TransitionSeries.Sequence durationInFrames={D.mob}>
        <TMobile dur={D.mob} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.h })} />

      <TransitionSeries.Sequence durationInFrames={D.rekt}>
        <TRekt dur={D.rekt} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: 1920, height: 1080 })} timing={spr(T.i)} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <TCTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);