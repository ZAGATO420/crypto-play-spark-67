import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { CTitle } from "../cine/CTitle";
import { BEnd } from "../blitz/BEnd";
import { OShot } from "./OShot";
import { C } from "../theme";

const D = {
  hook: 44,
  name: 92,
  arch: 84,
  diff: 90,
  mode: 84,
  country: 92,
  iron: 88,
  start: 96,
  term: 78,
  trade: 72,
  perp: 74,
  end: 62,
  cta: 116,
};
const T = [8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 10];

export const ONB_TOTAL = Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });
const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const OnboardVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#04050a" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.hook}>
        <CTitle kick="// BUILD YOUR DEGEN" line={<>84 MONTHS.<br />ONE LIFE.</>} size={116} tint={C.gold} dur={D.hook} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.name}>
        <OShot
          dur={D.name}
          src="onb/a_name.mp4"
          step="STEP 01"
          label="IDENTITY"
          kick="// NAME ON THE GLOBAL BOARD"
          line={<>TYPE YOUR NAME.<br />IT GETS REMEMBERED.</>}
          size={64}
          tint={C.gold}
          fx={12}
          fy={30}
          from={1.9}
          to={2.05}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={spr(T[1])} />

      <TransitionSeries.Sequence durationInFrames={D.arch}>
        <OShot
          dur={D.arch}
          src="onb/a_name.mp4"
          startFrom={110}
          step="STEP 02"
          label="ARCHETYPE"
          kick="// DEGEN · TRADER · INFLUENCER · HODLER"
          line={<>PICK WHO<br />YOU BECOME.</>}
          size={64}
          note="EACH ONE CHANGES CASH, FEES, RISK AND MEME GAINS"
          align="right"
          tint={C.purple2}
          fx={16}
          fy={52}
          from={1.85}
          to={2.0}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={spr(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.diff}>
        <OShot
          dur={D.diff}
          src="onb/c_diff.mp4"
          step="STEP 03"
          label="DIFFICULTY"
          kick="// EASY · NORMAL · BOSS"
          line={<>BOSS MODE PAYS<br />×2.5 XP.</>}
          size={64}
          note="TINY STACK · +42% COSTS · BRUTAL SLIPPAGE"
          tint={C.red}
          fx={12}
          fy={62}
          from={1.9}
          to={2.05}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.mode}>
        <OShot
          dur={D.mode}
          src="onb/c_diff.mp4"
          startFrom={150}
          step="STEP 04"
          label="RUN MODE"
          kick="// HISTORICAL OR CHAOS"
          line={<>REAL TIMELINE,<br />OR PURE CHAOS.</>}
          size={62}
          note="HISTORICAL XP ×0.75 · CHAOS XP ×1.25"
          align="right"
          tint={C.green}
          fx={14}
          fy={78}
          from={1.9}
          to={2.02}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[4])} />

      <TransitionSeries.Sequence durationInFrames={D.country}>
        <OShot
          dur={D.country}
          src="onb/b_country.mp4"
          step="STEP 05"
          label="COUNTRY"
          kick="// DE · US · CH · SG · PT · NG"
          line={<>YOUR RENT AND TAX<br />FOR 7 YEARS.</>}
          size={60}
          note="CHEAP LIVING OR LOW TAX — PICK YOUR POISON"
          tint={C.gold}
          fx={78}
          fy={26}
          from={1.85}
          to={2.0}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[5])} />

      <TransitionSeries.Sequence durationInFrames={D.iron}>
        <OShot
          dur={D.iron}
          src="onb/d_iron.mp4"
          startFrom={40}
          step="STEP 06"
          label="IRONMAN"
          kick="// NO PAUSE · NO SKIP · NO SECOND RUN"
          line={<>DOUBLE XP<br />OR DIE TRYING.</>}
          size={64}
          note="THIS RUN: XP ×6.25"
          align="right"
          tint={C.red}
          fx={80}
          fy={62}
          from={1.95}
          to={2.12}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[6])} />

      <TransitionSeries.Sequence durationInFrames={D.start}>
        <OShot
          dur={D.start}
          src="onb/e_start.mp4"
          startFrom={40}
          step="RUN LIVE"
          label="JAN 2020"
          kick="// FIRST CHOICE, ALREADY DANGEROUS"
          line={<>WHERE DO YOU<br />KEEP YOUR COINS?</>}
          size={62}
          tint={C.purple2}
          fx={50}
          fy={50}
          from={1.35}
          to={1.5}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T[7])} />

      <TransitionSeries.Sequence durationInFrames={D.term}>
        <OShot
          dur={D.term}
          src="v16/04_term.mp4"
          kick="// THE TERMINAL"
          line={<>ONE SCREEN.<br />ZERO SCROLL.</>}
          size={66}
          tint={C.green}
          fx={58}
          fy={48}
          from={1.12}
          to={1.2}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={spr(T[8])} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <OShot
          dur={D.trade}
          src="v16/05_trade.mp4"
          kick="// DEX TRADE"
          line={<>TAP. SIZE IT.<br />SEND IT.</>}
          size={68}
          align="right"
          tint={C.gold}
          fx={42}
          fy={52}
          from={1.14}
          to={1.24}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[9])} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <OShot
          dur={D.perp}
          src="v16/06_perp.mp4"
          kick="// 50× PERPS"
          line={<>ONE CANDLE<br />ENDS THE RUN.</>}
          size={66}
          tint={C.red}
          fx={56}
          fy={50}
          from={1.16}
          to={1.26}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[10])} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <OShot
          dur={D.end}
          src="v16/09_end.mp4"
          kick="// FINAL SCORE"
          line={<>GLOBAL RANK.<br />XP. FLEX.</>}
          size={62}
          align="right"
          tint={C.gold}
          fx={44}
          fy={20}
          from={1.3}
          to={1.44}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[11])} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <BEnd />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
