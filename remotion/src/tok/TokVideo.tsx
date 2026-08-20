import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { TShot } from "./TShot";
import { TEnd } from "./TEnd";
import { C } from "../theme";

const D = { hook: 62, arch: 56, boss: 54, trade: 56, perp: 58, rekt: 50, end: 96 };
const T = [7, 7, 7, 7, 7, 8];
export const TOK_TOTAL = Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });
const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const TokVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#04050a" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.hook}>
        <TShot
          dur={D.hook}
          src="onb/a_name.mp4"
          chip="2020 → 2026"
          kick="// 84 MONTHS. ONE LIFE."
          line={<>CAN YOU<br />SURVIVE<br />CRYPTO?</>}
          size={112}
          tint={C.gold}
          fx={26}
          fy={16}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.arch}>
        <TShot
          dur={D.arch}
          src="onb/a_name.mp4"
          startFrom={110}
          chip="ARCHETYPE"
          kick="// DEGEN · TRADER · INFLUENCER"
          line={<>PICK WHO<br />YOU BECOME.</>}
          size={98}
          tint={C.purple2}
          fx={26}
          fy={46}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={spr(T[1])} />

      <TransitionSeries.Sequence durationInFrames={D.boss}>
        <TShot
          dur={D.boss}
          src="onb/d_iron.mp4"
          startFrom={55}
          chip="IRONMAN"
          kick="// NO PAUSE · NO SECOND RUN"
          line={<>×6.25 XP<br />OR DEATH.</>}
          size={104}
          tint={C.red}
          fx={57}
          fy={40}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <TShot
          dur={D.trade}
          src="v16/05_trade.mp4"
          chip="DEX"
          kick="// REAL 2020-2026 PRICES"
          line={<>TAP. SIZE IT.<br />SEND IT.</>}
          size={102}
          tint={C.gold}
          fx={42}
          fy={52}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <TShot
          dur={D.perp}
          src="v16/06_perp.mp4"
          chip="50× PERPS"
          kick="// LIQUIDATION IS ONE CANDLE AWAY"
          line={<>ONE CANDLE<br />ENDS IT ALL.</>}
          size={100}
          tint={C.red}
          fx={56}
          fy={50}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[4])} />

      <TransitionSeries.Sequence durationInFrames={D.rekt}>
        <TShot
          dur={D.rekt}
          src="v16/09_end.mp4"
          chip="GLOBAL RANK"
          kick="// 3% MAKE IT OUT"
          line={<>POST YOUR<br />SCORE.</>}
          size={104}
          tint={C.green}
          fx={44}
          fy={22}
          from={1.0}
          to={1.08}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[5])} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <TEnd />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
