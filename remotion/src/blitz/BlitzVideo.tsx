import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { CLogo } from "../cine/CLogo";
import { CShot } from "../cine/CShot";
import { BEnd } from "./BEnd";
import { C } from "../theme";

const D = { logo: 42, term: 46, trade: 44, perp: 52, ops: 42, warp: 44, end: 108 };
const T = [6, 6, 6, 6, 6, 8];

export const BLITZ_TOTAL = Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });
const spr = (n: number) => springTiming({ config: { damping: 200 }, durationInFrames: n });

export const BlitzVideo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.logo}>
        <CLogo dur={D.logo} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.term}>
        <CShot
          dur={D.term}
          clip="04_term.mp4"
          kick="// 84 MONTHS OF REAL PRICES"
          kickColor={C.green}
          line={<>ONE SCREEN.<br />ZERO SCROLL.</>}
          size={72}
          fx={60}
          fy={48}
          from={1.1}
          to={1.18}
          tint={C.green}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={spr(T[1])} />

      <TransitionSeries.Sequence durationInFrames={D.trade}>
        <CShot
          dur={D.trade}
          clip="05_trade.mp4"
          kick="// DEX TRADE"
          kickColor={C.gold}
          line={<>TAP. SIZE IT.<br />SEND IT.</>}
          size={74}
          align="right"
          fx={42}
          fy={52}
          from={1.12}
          to={1.22}
          tint={C.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={spr(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.perp}>
        <CShot
          dur={D.perp}
          clip="06_perp.mp4"
          kick="// 50× PERPS"
          kickColor={C.red}
          line={<>ONE CANDLE<br />ENDS THE RUN.</>}
          size={72}
          note="LIQUIDATION IS LIVE"
          fx={56}
          fy={50}
          from={1.14}
          to={1.24}
          tint={C.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={spr(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.ops}>
        <CShot
          dur={D.ops}
          clip="07_ops.mp4"
          kick="// DEGEN OPS"
          kickColor={C.gold}
          line={<>AIRDROPS. PRESALES.<br />RUGS.</>}
          size={66}
          align="right"
          fx={64}
          fy={50}
          from={1.1}
          to={1.2}
          tint={C.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={spr(T[4])} />

      <TransitionSeries.Sequence durationInFrames={D.warp}>
        <CShot
          dur={D.warp}
          clip="09_end.mp4"
          kick="// FINAL SCORE"
          kickColor={C.green}
          line={<>SURVIVE<br />ALL 84 MONTHS.</>}
          size={70}
          fx={34}
          fy={12}
          from={1.4}
          to={1.58}
          tint={C.green}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[5])} />

      <TransitionSeries.Sequence durationInFrames={D.end}>
        <BEnd />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
