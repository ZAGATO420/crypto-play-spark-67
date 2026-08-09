import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { VBeat } from "./VBeat";
import { VCTA } from "./VCTA";
import { C } from "../theme";

const D = {
  start: 92,
  arch: 80,
  iron: 104,
  term: 96,
  trade: 112,
  perp: 128,
  ops: 100,
  warp: 148,
  end: 116,
  cta: 126,
};
const T = { a: 12, b: 12, c: 10, d: 12, e: 12, f: 10, g: 12, h: 12, i: 14 };

export const V16_TOTAL =
  Object.values(D).reduce((a, b) => a + b, 0) - Object.values(T).reduce((a, b) => a + b, 0);

const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const V16Trailer: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.start}>
        <VBeat
          dur={D.start}
          clip="01_start.mp4"
          kick="// 84 MONTHS OF CRYPTO"
          kickColor={C.green}
          line={
            <>
              I PLAYED<br />
              <span style={{ color: C.gold }}>2020 → 2026.</span>
            </>
          }
          size={98}
          fx={44}
          fy={46}
          from={1.12}
          to={1.24}
          chips={[{ label: "REAL PRICES", value: "HISTORICAL", accent: C.green }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T.a)} />

      <TransitionSeries.Sequence durationInFrames={D.arch}>
        <VBeat
          dur={D.arch}
          clip="02_arch.mp4"
          kick="// PICK YOUR DEGEN"
          kickColor={C.purple2}
          line={
            <>
              SIX WAYS<br />
              <span style={{ color: C.gold }}>TO GET REKT.</span>
            </>
          }
          side="right"
          fx={58}
          fy={52}
          from={1.1}
          to={1.22}
          tint={C.purple}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={spr(T.b)} />

      <TransitionSeries.Sequence durationInFrames={D.iron}>
        <VBeat
          dur={D.iron}
          clip="03_iron.mp4"
          kick="// IRONMAN MODE"
          kickColor={C.red}
          line={
            <>
              NO PAUSE.<br />
              <span style={{ color: C.red }}>XP ×6.25.</span>
            </>
          }
          fx={46}
          fy={54}
          from={1.12}
          to={1.26}
          tint={C.red}
          chips={[
            { label: "BOSS ×2.5", value: "CHAOS ×1.25", accent: C.gold },
            { label: "IRONMAN", value: "×2 XP", accent: C.red },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.c })} />

      <TransitionSeries.Sequence durationInFrames={D.term}>
        <VBeat
          dur={D.term}
          clip="04_term.mp4"
          kick="// THE TERMINAL"
          line={
            <>
              ONE SCREEN.<br />
              <span style={{ color: C.green }}>ZERO SCROLL.</span>
            </>
          }
          side="right"
          fx={60}
          fy={48}
          from={1.08}
          to={1.2}
          chips={[
            { label: "SEASON STATUS", value: "LIVE RANK", accent: C.purple2 },
            { label: "MISSIONS", value: "DAILY XP", accent: C.gold },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T.d)} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <VBeat
          dur={D.trade}
          clip="05_trade.mp4"
          kick="// DEX TRADE MODAL"
          kickColor={C.green}
          line={
            <>
              TAP. SIZE IT.<br />
              <span style={{ color: C.green }}>SEND IT.</span>
            </>
          }
          fx={42}
          fy={52}
          from={1.1}
          to={1.24}
          tint={C.green}
          chips={[
            { label: "SLIPPAGE", value: "REAL IMPACT", accent: C.green },
            { label: "FEES + TAX", value: "PREVIEWED", accent: C.gold },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.e })} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <VBeat
          dur={D.perp}
          clip="06_perp.mp4"
          kick="// PERP DESK"
          kickColor={C.purple2}
          line={
            <>
              UP TO 50x.<br />
              <span style={{ color: C.red }}>NO MERCY.</span>
            </>
          }
          side="right"
          fx={56}
          fy={50}
          from={1.12}
          to={1.26}
          tint={C.red}
          chips={[
            { label: "LIQUIDATION", value: "LIVE CHECK", accent: C.red },
            { label: "FUNDING", value: "COMPOUNDS", accent: C.gold },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={spr(T.f)} />

      <TransitionSeries.Sequence durationInFrames={D.ops}>
        <VBeat
          dur={D.ops}
          clip="07_ops.mp4"
          kick="// DEGEN OPS"
          kickColor={C.gold}
          line={
            <>
              AIRDROPS.<br />
              <span style={{ color: C.gold }}>PRESALES. RUGS.</span>
            </>
          }
          fx={64}
          fy={50}
          from={1.1}
          to={1.22}
          chips={[{ label: "150+ EVENTS", value: "ERA-GATED", accent: C.purple2 }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={spr(T.g)} />

      <TransitionSeries.Sequence durationInFrames={D.warp}>
        <VBeat
          dur={D.warp}
          clip="08_warp.mp4"
          kick="// TIMEWARP"
          kickColor={C.green}
          line={
            <>
              HALVINGS. BULLS.<br />
              <span style={{ color: C.red }}>BLOODBATHS.</span>
            </>
          }
          side="right"
          size={84}
          fx={50}
          fy={44}
          from={1.06}
          to={1.2}
          tint={C.green}
          chips={[{ label: "84 MONTHS", value: "ONE RUN", accent: C.green }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.h })} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <VBeat
          dur={D.end}
          clip="09_end.mp4"
          kick="// FINAL SCORE"
          kickColor={C.gold}
          size={78}
          line={
            <>
              GLOBAL<br />
              <span style={{ color: C.gold }}>RANK. XP. FLEX.</span>
            </>
          }
          fx={48}
          fy={40}
          from={1.08}
          to={1.2}
          tint={C.gold}
          chips={[{ label: "SHARE CARD", value: "POST IT", accent: C.gold }]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: 1920, height: 1080 })} timing={spr(T.i)} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <VCTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);