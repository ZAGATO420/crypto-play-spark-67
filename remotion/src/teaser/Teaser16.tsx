import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { T16, T16CTA, TC } from "./T16";

const D = { boss: 62, chaos: 64, play: 64, rekt: 58, cta: 76 };
const T = [6, 6, 6, 6];

export const T16_TOTAL =
  Object.values(D).reduce((a, b) => a + b, 0) - T.reduce((a, b) => a + b, 0);

const cut = (n: number) => linearTiming({ durationInFrames: n });

export const Teaser16: React.FC = () => (
  <AbsoluteFill style={{ background: TC.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.boss}>
        <T16
          dur={D.boss}
          src="clips/t16/boss_throne.mp4"
          kick="// JANUARY 2020"
          line={
            <>
              YOU HAD
              <br />
              $10,000.
            </>
          }
          size={140}
          from={1.02}
          to={1.14}
          fy={42}
          bright={1.2}
          tint={TC.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[0])} />

      <TransitionSeries.Sequence durationInFrames={D.chaos}>
        <T16
          dur={D.chaos}
          src="clips/t16/chaos.mp4"
          kick="// LUNA · FTX · THE QUIET YEARS"
          line={
            <>
              84 MONTHS
              <br />
              OF CARNAGE.
            </>
          }
          size={132}
          from={1.06}
          to={1.2}
          tint={TC.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-right" })}
        timing={cut(T[1])}
      />

      <TransitionSeries.Sequence durationInFrames={D.play}>
        <T16
          dur={D.play}
          src="clips/perps.mp4"
          kick="// 22 COINS · 50x PERPS · REAL PRICES"
          line={
            <>
              ONE LIFE.
              <br />
              NO RESET.
            </>
          }
          size={132}
          from={1.02}
          to={1.12}
          fy={38}
          bright={1.5}
          tint={TC.acid}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[2])} />

      <TransitionSeries.Sequence durationInFrames={D.rekt}>
        <T16
          dur={D.rekt}
          src="clips/t16/boss_laugh.mp4"
          kick="// THE BOSS KEEPS SCORE"
          line={<>97% GET REKT.</>}
          size={146}
          from={1.04}
          to={1.18}
          fy={40}
          bright={1.45}
          tint={TC.red}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut(T[3])} />

      <TransitionSeries.Sequence durationInFrames={D.cta}>
        <T16CTA dur={D.cta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
