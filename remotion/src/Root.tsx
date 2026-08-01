import React from "react";
import { Composition } from "remotion";
import { MainVideo, TOTAL } from "./MainVideo";
import { WideVideo, WIDE_TOTAL } from "./wide/WideVideo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="wide" component={WideVideo} durationInFrames={WIDE_TOTAL} fps={30} width={1920} height={1080} />
  </>
);
