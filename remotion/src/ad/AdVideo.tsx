import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { AShot } from "./AShot";
import { AOpen } from "./AOpen";
import { ACTA } from "./ACTA";
import { AC } from "./palette";

const D = {
  open: 92,
  hook: 74,
  market: 84,
  chart: 74,
  decision: 86,
  trade: 72,
  perp: 88,
  time: 66,
  ops: 62,
  end: 78,
  cta: 116,
};
const T = [10, 9, 8, 9, 8, 9, 8, 7, 8, 12];

export const AD_TOTAL =
  Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });
const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const AdVideo: React.FC = () => (
  <AbsoluteFill style={{ background: AC.bg }}>
    <Audio src={staticFile("audio/ad_score.wav")} volume={0.9} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.open}>
        <AOpen dur={D.open} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.hook}>
        <AShot
          dur={D.hook}
          src="clips/ad/a_throne.mp4"
          chip="2020 → 2026"
          kick="// NO RESET · NO SECOND RUN"
          line={<>84 MONTHS.<br />ONE LIFE.</>}
          size={116}
          fy={40}
          tint={AC.acid}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={spr(T[1])} />

      <TransitionSeries.Sequence durationInFrames={D.market}>
        <AShot
          dur={D.market}
          src="clips/ad/b_market.mp4"
          chip="LIVE TERMINAL"
          kick="// 22 COINS · REAL CHARTS"
          line={<>TRADE THE<br />WHOLE CYCLE.</>}
          size={104}
          fy={58}
          note="BTC $59,027 · +530% ON THE BAG"
          tint={AC.acid}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.chart}>
        <AShot
          dur={D.chart}
          src="clips/ad/b_chart.mp4"
          chip="P&L"
          kick="// EVERY MONTH IS REAL HISTORY"
          line={<>$10K → $1.1M<br />IN 15 MONTHS.</>}
          size={98}
          fy={44}
          tint={AC.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.decision}>
        <AShot
          dur={D.decision}
          src="clips/ad/c_decision.mp4"
          chip="STORY MODE"
          kick="// ONE CHOICE · NO UNDO"
          line={<>THE HALVING.<br />THE FORK.<br />THE RUG.</>}
          size={92}
          fy={52}
          top
          tint={AC.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[4])} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <AShot
          dur={D.trade}
          src="clips/ad/e_trade.mp4"
          chip="ONE TAP"
          kick="// SLIPPAGE · FEES · TAX PREVIEWED"
          line={<>TAP. SIZE IT.<br />SEND IT.</>}
          size={104}
          fy={62}
          tint={AC.acid}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={spr(T[5])} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <AShot
          dur={D.perp}
          src="clips/ad/f_perp.mp4"
          chip="50× PERPS"
          kick="// LIQUIDATION IS 1.8% AWAY"
          line={<>$12K MARGIN.<br />$600K ON<br />THE LINE.</>}
          size={92}
          fy={48}
          note="LIQ $58,550 · ONE CANDLE ENDS IT"
          top
          tint={AC.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[6])} />

      <TransitionSeries.Sequence durationInFrames={D.time}>
        <AShot
          dur={D.time}
          src="clips/ad/h_time.mp4"
          chip="TIMEWARP"
          kick="// LUNA · FTX · THE QUIET YEARS"
          line={<>84 MONTHS<br />OF CARNAGE.</>}
          size={98}
          fy={40}
          rate={1}
          tint={AC.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={spr(T[7])} />

      <TransitionSeries.Sequence durationInFrames={D.ops}>
        <AShot
          dur={D.ops}
          src="clips/ad/g_ops.mp4"
          chip="DEGEN OPS"
          kick="// AIRDROPS · PRESALES · RUGS"
          line={<>FARM IT ALL.<br />TRUST NOBODY.</>}
          size={92}
          fy={82}
          from={1.0}
          to={1.06}
          tint={AC.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[8])} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <AShot
          dur={D.end}
          src="clips/ad/i_end.mp4"
          chip="GLOBAL RANK"
          kick="// FINAL BOSS MATERIAL"
          line={<>$2,325,723<br />SURVIVED.</>}
          size={96}
          fy={26}
          note="POST YOUR RUN. MOST GET LIQUIDATED."
          tint={AC.acid}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: 1080, height: 1920 })} timing={spr(T[9])} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <ACTA dur={D.cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
