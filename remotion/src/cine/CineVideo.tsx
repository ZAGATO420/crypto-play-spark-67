import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { COpen } from "./COpen";
import { CLogo } from "./CLogo";
import { CTitle } from "./CTitle";
import { CShot } from "./CShot";
import { CEnd } from "./CEnd";
import { C } from "../theme";

const D = {
  open: 86,
  logo: 52,
  arch: 70,
  iron: 80,
  t1: 32,
  term: 72,
  trade: 86,
  t2: 30,
  perp: 96,
  ops: 74,
  t3: 30,
  warp: 104,
  end: 82,
  cta: 128,
};
const T = [10, 6, 8, 6, 6, 8, 6, 8, 8, 6, 6, 8, 12];

export const CINE_TOTAL =
  Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });
const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const CineVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.open}>
        <COpen dur={D.open} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.logo}>
        <CLogo dur={D.logo} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[1])} />

      <TransitionSeries.Sequence durationInFrames={D.arch}>
        <CShot
          dur={D.arch}
          clip="02_arch.mp4"
          kick="// CHOOSE YOUR DEGEN"
          kickColor={C.purple2}
          line={<>SIX ARCHETYPES.<br />ONE SURVIVOR.</>}
          size={78}
          fx={56}
          fy={52}
          from={1.12}
          to={1.2}
          tint={C.purple}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={spr(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.iron}>
        <CShot
          dur={D.iron}
          clip="03_iron.mp4"
          kick="// IRONMAN"
          kickColor={C.red}
          line={<>NO PAUSE.<br />NO SECOND RUN.</>}
          size={78}
          note="XP MULTIPLIER UP TO ×6.25"
          align="right"
          fx={46}
          fy={54}
          from={1.14}
          to={1.24}
          tint={C.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.t1}>
        <CTitle kick="// THE TERMINAL" line={<>ONE SCREEN.<br />ZERO SCROLL.</>} size={108} tint={C.green} dur={D.t1} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[4])} />

      <TransitionSeries.Sequence durationInFrames={D.term}>
        <CShot
          dur={D.term}
          clip="04_term.mp4"
          kick="// CHART · MARKET · OPS"
          kickColor={C.green}
          line={<>EVERY DECISION<br />IN ONE VIEW.</>}
          size={74}
          note="LIVE P&L · SEASON RANK · DAILY MISSIONS"
          fx={60}
          fy={48}
          from={1.08}
          to={1.16}
          tint={C.green}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[5])} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <CShot
          dur={D.trade}
          clip="05_trade.mp4"
          kick="// DEX TRADE"
          kickColor={C.green}
          line={<>TAP. SIZE IT.<br />SEND IT.</>}
          size={80}
          note="REAL SLIPPAGE · FEES · MARKET IMPACT"
          align="right"
          fx={42}
          fy={52}
          from={1.1}
          to={1.2}
          tint={C.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[6])} />

      <TransitionSeries.Sequence durationInFrames={D.t2}>
        <CTitle kick="// PERP DESK" line={<>UP TO 50×.<br />NO MERCY.</>} size={112} tint={C.red} dur={D.t2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[7])} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <CShot
          dur={D.perp}
          clip="06_perp.mp4"
          kick="// LIQUIDATION IS LIVE"
          kickColor={C.red}
          line={<>ONE CANDLE<br />ENDS THE RUN.</>}
          size={76}
          note="FUNDING COMPOUNDS EVERY MONTH"
          fx={56}
          fy={50}
          from={1.12}
          to={1.22}
          tint={C.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T[8])} />

      <TransitionSeries.Sequence durationInFrames={D.ops}>
        <CShot
          dur={D.ops}
          clip="07_ops.mp4"
          kick="// DEGEN OPS"
          kickColor={C.gold}
          line={<>AIRDROPS. PRESALES.<br />RUGS.</>}
          size={70}
          note="150+ ERA-GATED EVENTS"
          align="right"
          fx={64}
          fy={50}
          from={1.1}
          to={1.18}
          tint={C.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[9])} />

      <TransitionSeries.Sequence durationInFrames={D.t3}>
        <CTitle kick="// REAL HISTORY" line={<>84 MONTHS.<br />REAL PRICES.</>} size={110} tint={C.gold} dur={D.t3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[10])} />

      <TransitionSeries.Sequence durationInFrames={D.warp}>
        <CShot
          dur={D.warp}
          clip="08_warp.mp4"
          kick="// 2020 → 2026"
          kickColor={C.green}
          line={<>HALVINGS. BULLS.<br />BLOODBATHS.</>}
          size={72}
          fx={50}
          fy={44}
          from={1.06}
          to={1.16}
          tint={C.green}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[11])} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <CShot
          dur={D.end}
          clip="09_end.mp4"
          kick="// FINAL SCORE"
          kickColor={C.gold}
          line={<>GLOBAL RANK.<br />XP. FLEX.</>}
          size={72}
          align="right"
          fx={48}
          fy={40}
          from={1.08}
          to={1.16}
          tint={C.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[12])} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <CEnd />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);