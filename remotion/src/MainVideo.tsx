import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { S1Hook } from "./scenes/S1Hook";
import { S2Real } from "./scenes/S2Real";
import { S3Events, S3_DUR } from "./scenes/S3Events";
import { S4Choice } from "./scenes/S4Choice";
import { S5CTA } from "./scenes/S5CTA";
import { C } from "./theme";

export const D = { s1: 108, s2: 120, s3: S3_DUR, s4: 132, s5: 138 };
export const T = { t1: 16, t2: 12, t3: 14, t4: 18 };
export const TOTAL =
  D.s1 + D.s2 + D.s3 + D.s4 + D.s5 - (T.t1 + T.t2 + T.t3 + T.t4);

export const MainVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.s1}><S1Hook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t1 })} />
      <TransitionSeries.Sequence durationInFrames={D.s2}><S2Real dur={D.s2} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.t2 })} />
      <TransitionSeries.Sequence durationInFrames={D.s3}><S3Events /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t3 })} />
      <TransitionSeries.Sequence durationInFrames={D.s4}><S4Choice dur={D.s4} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t4 })} />
      <TransitionSeries.Sequence durationInFrames={D.s5}><S5CTA /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
