import React from "react";
import { Composition } from "remotion";
import { MainVideo, TOTAL } from "./MainVideo";
import { WideVideo, WIDE_TOTAL } from "./wide/WideVideo";
import { UpdateVideo, UPDATE_TOTAL } from "./update/UpdateVideo";
import { TrailerVideo, TRAILER_TOTAL } from "./trailer/TrailerVideo";
import { V16Trailer, V16_TOTAL } from "./v16/V16Trailer";
import { CineVideo, CINE_TOTAL } from "./cine/CineVideo";
import { BlitzVideo, BLITZ_TOTAL } from "./blitz/BlitzVideo";
import { OnboardVideo, ONB_TOTAL } from "./onb/OnboardVideo";
import { TokVideo, TOK_TOTAL } from "./tok/TokVideo";
import { AdVideo, AD_TOTAL } from "./ad/AdVideo";
import { Teaser16, T16_TOTAL } from "./teaser/Teaser16";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="wide" component={WideVideo} durationInFrames={WIDE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="update" component={UpdateVideo} durationInFrames={UPDATE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="trailer" component={TrailerVideo} durationInFrames={TRAILER_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="v16" component={V16Trailer} durationInFrames={V16_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="cine" component={CineVideo} durationInFrames={CINE_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="blitz" component={BlitzVideo} durationInFrames={BLITZ_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="onboard" component={OnboardVideo} durationInFrames={ONB_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="tiktok" component={TokVideo} durationInFrames={TOK_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="ad" component={AdVideo} durationInFrames={AD_TOTAL} fps={30} width={1080} height={1920} />
    <Composition id="teaser16" component={Teaser16} durationInFrames={T16_TOTAL} fps={30} width={1920} height={1080} />
  </>
);
