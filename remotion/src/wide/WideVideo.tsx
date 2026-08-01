import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { W1Hook } from "./W1Hook";
import { W2Real } from "./W2Real";
import { W3Events, W3_DUR } from "./W3Events";
import { W4Choice } from "./W4Choice";
import { W5Rekt } from "./W5Rekt";
import { W6CTA } from "./W6CTA";
import { C } from "../theme";

const D = { s1: 100, s2: 108, s3: W3_DUR, s4: 118, s5: 66, s6: 126 };
const T = { t1: 14, t2: 10, t3: 12, t4: 8, t5: 14 };
export const WIDE_TOTAL =
  D.s1 + D.s2 + D.s3 + D.s4 + D.s5 + D.s6 - (T.t1 + T.t2 + T.t3 + T.t4 + T.t5);

export const WideVideo: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.s1}><W1Hook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t1 })} />
      <TransitionSeries.Sequence durationInFrames={D.s2}><W2Real dur={D.s2} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.t2 })} />
      <TransitionSeries.Sequence durationInFrames={D.s3}><W3Events /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t3 })} />
      <TransitionSeries.Sequence durationInFrames={D.s4}><W4Choice dur={D.s4} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.t4 })} />
      <TransitionSeries.Sequence durationInFrames={D.s5}><W5Rekt dur={D.s5} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: 1920, height: 1080 })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.t5 })} />
      <TransitionSeries.Sequence durationInFrames={D.s6}><W6CTA /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);