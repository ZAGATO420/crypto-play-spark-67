import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { U1Cold } from "./U1Cold";
import { U2Terminal } from "./U2Terminal";
import { U3Perps } from "./U3Perps";
import { U4Liq } from "./U4Liq";
import { U5Ops } from "./U5Ops";
import { U6CTA } from "./U6CTA";
import { C } from "../theme";

const D = { s1: 84, s2: 112, s3: 172, s4: 132, s5: 140, s6: 126 };
const T = { t1: 12, t2: 14, t3: 10, t4: 12, t5: 14 };
export const UPDATE_TOTAL =
  D.s1 + D.s2 + D.s3 + D.s4 + D.s5 + D.s6 - (T.t1 + T.t2 + T.t3 + T.t4 + T.t5);

export const UpdateVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.s1}><U1Cold /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t1 })} />
      <TransitionSeries.Sequence durationInFrames={D.s2}><U2Terminal dur={D.s2} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t2 })} />
      <TransitionSeries.Sequence durationInFrames={D.s3}><U3Perps dur={D.s3} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.t3 })} />
      <TransitionSeries.Sequence durationInFrames={D.s4}><U4Liq dur={D.s4} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-top" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t4 })} />
      <TransitionSeries.Sequence durationInFrames={D.s5}><U5Ops dur={D.s5} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: 1920, height: 1080 })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t5 })} />
      <TransitionSeries.Sequence durationInFrames={D.s6}><U6CTA /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
