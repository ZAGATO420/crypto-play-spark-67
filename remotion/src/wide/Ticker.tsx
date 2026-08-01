import React from "react";
import { useCurrentFrame } from "remotion";
import { mono } from "./fonts";
import { C } from "../theme";

const ROW = "BTC 7,218  •  ETH 129  •  SOL 0.78  •  LUNA 0.00  •  FTT 0.00  •  DOGE 0.002  •  $TCFB SOON  •  ";

export const Ticker: React.FC<{ y: number; dir?: 1 | -1; color?: string }> = ({ y, dir = 1, color = C.muted }) => {
  const f = useCurrentFrame();
  const x = ((f * 3.2 * dir) % 1200) - (dir === 1 ? 1200 : 0);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, height: 44, overflow: "hidden", opacity: 0.55 }}>
      <div style={{ position: "absolute", whiteSpace: "nowrap", transform: `translateX(${x}px)`, fontFamily: mono, fontSize: 26, letterSpacing: "0.22em", color }}>
        {ROW.repeat(8)}
      </div>
    </div>
  );
};