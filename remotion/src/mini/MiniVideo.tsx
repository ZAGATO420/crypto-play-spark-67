import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadG } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadM } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: G } = loadG("normal", { weights: ["500", "700"], subsets: ["latin"] });
const { fontFamily: M } = loadM("normal", { weights: ["500", "800"], subsets: ["latin"] });

const C = { bg: "#0E0C08", bg2: "#1A160E", acid: "#C6F432", red: "#FF4D3D", cream: "#F2EBDD", dim: "#8A8270", gold: "#F5B83D" };
const S = [70, 130, 115, 105, 95, 95]; // scene lengths
export const MINI_TOTAL = S.reduce((a, b) => a + b, 0);
const starts = S.map((_, i) => S.slice(0, i).reduce((a, b) => a + b, 0));

const pop = (f: number, fps: number, d = 0, cfg = { damping: 14, stiffness: 180 }) => spring({ frame: f - d, fps, config: cfg });

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const candles = Array.from({ length: 22 }, (_, i) => {
    const h = 80 + ((i * 137) % 260);
    const up = (i * 7) % 3 !== 0;
    return { x: i * 52 - ((f * 1.2) % 52), y: 1500 - ((i * 53) % 400) - h, h, up };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 30% 20%, ${C.bg2}, ${C.bg} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.16 }}>
        {candles.map((c, i) => (
          <g key={i}>
            <rect x={c.x + 22} y={c.y - 40} width={4} height={c.h + 80} fill={c.up ? C.acid : C.red} />
            <rect x={c.x + 10} y={c.y} width={28} height={c.h} fill={c.up ? C.acid : C.red} />
          </g>
        ))}
      </svg>
      <AbsoluteFill style={{ background: `repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,.18) 3px 4px)` }} />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{ n: string; t: string; color?: string }> = ({ n, t, color = C.acid }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps);
  return (
    <div style={{ position: "absolute", top: 210, left: 80, transform: `translateX(${(1 - s) * -200}px)`, opacity: s }}>
      <div style={{ fontFamily: M, fontSize: 34, color, letterSpacing: 6, fontWeight: 800 }}>MINIGAME {n}</div>
      <div style={{ fontFamily: G, fontSize: 118, color: C.cream, fontWeight: 700, lineHeight: 0.95, marginTop: 18, maxWidth: 920 }}>{t}</div>
    </div>
  );
};

const Stamp: React.FC<{ at: number; text: string; color: string; sub?: string }> = ({ at, text, color, sub }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = pop(f, fps, at, { damping: 9, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1380, textAlign: "center", transform: `scale(${interpolate(s, [0, 1], [2.4, 1])}) rotate(-4deg)`, opacity: Math.min(1, s * 1.5) }}>
      <span style={{ fontFamily: G, fontWeight: 700, fontSize: 120, color, border: `8px solid ${color}`, padding: "10px 40px", borderRadius: 14 }}>{text}</span>
      {sub && <div style={{ fontFamily: M, fontSize: 46, color: C.cream, marginTop: 50, fontWeight: 800 }}>{sub}</div>}
    </div>
  );
};

const Flash: React.FC<{ at: number; color: string }> = ({ at, color }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 2, at + 12], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: color, opacity: o }} />;
};

const Shake: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 14], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (f >= at ? 1 : 0);
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(f * 2.3) * k}px, ${Math.cos(f * 3.1) * k}px)` }}>{children}</AbsoluteFill>;
};

/* 1 — Hook */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ["MOST", "CRYPTO", "GAMES", "ARE", "CLICKERS."];
  const s2 = pop(f, fps, 38, { damping: 10, stiffness: 200 });
  return (
    <AbsoluteFill style={{ padding: 80, justifyContent: "center" }}>
      {words.map((w, i) => {
        const s = pop(f, fps, i * 5);
        return <div key={w} style={{ fontFamily: G, fontWeight: 700, fontSize: 150, lineHeight: 0.92, color: C.cream, opacity: s, transform: `translateY(${(1 - s) * 80}px)` }}>{w}</div>;
      })}
      <div style={{ marginTop: 60, fontFamily: M, fontWeight: 800, fontSize: 60, color: C.bg, background: C.red, alignSelf: "flex-start", padding: "14px 28px", transform: `scale(${s2}) rotate(-3deg)` }}>THIS ONE BITES BACK.</div>
    </AbsoluteFill>
  );
};

/* 2 — Timing bar */
const Timing: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 92;
  const t = Math.min(f, hit);
  const raw = (t * 4.1) % 200;
  const pos = f >= hit ? 50 : raw > 100 ? 200 - raw : raw;
  return (
    <Shake at={hit}>
      <Kicker n="01" t="HIT THE GREEN." />
      <div style={{ position: "absolute", top: 560, left: 80, fontFamily: M, fontSize: 38, color: C.dim, maxWidth: 900 }}>Thin order book. Miss the zone → slippage eats your exit.</div>
      <div style={{ position: "absolute", top: 860, left: 80, right: 80, height: 150, background: "#221d13", borderRadius: 20, border: `4px solid #3a3222`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "32%", width: "36%", top: 0, bottom: 0, background: "rgba(198,244,50,.25)" }} />
        <div style={{ position: "absolute", left: "44%", width: "12%", top: 0, bottom: 0, background: C.acid }} />
        <div style={{ position: "absolute", left: `${pos}%`, top: -10, bottom: -10, width: 14, marginLeft: -7, background: C.cream, boxShadow: `0 0 30px ${C.cream}` }} />
      </div>
      <div style={{ position: "absolute", top: 1060, left: 80, fontFamily: M, fontSize: 40, color: C.cream, fontWeight: 800 }}>BTC EXIT · $63,812</div>
      <Flash at={hit} color={C.acid} />
      <Stamp at={hit} text="PERFECT FILL" color={C.acid} sub="+0% SLIPPAGE · FULL PROFIT" />
    </Shake>
  );
};

/* 3 — Gas war */
const Gas: React.FC = () => {
  const f = useCurrentFrame();
  const end = 78;
  const you = interpolate(f, [8, end], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => x * x * (3 - 2 * x) });
  const bot = interpolate(f, [8, end], [0, 94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gwei = Math.round(interpolate(f, [8, end], [40, 412], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const Lane = ({ y, label, v, col }: { y: number; label: string; v: number; col: string }) => (
    <div style={{ position: "absolute", top: y, left: 80, right: 80 }}>
      <div style={{ fontFamily: M, fontSize: 36, color: col, fontWeight: 800, marginBottom: 14 }}>{label}</div>
      <div style={{ height: 90, background: "#221d13", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: col }} />
      </div>
    </div>
  );
  return (
    <Shake at={end}>
      <Kicker n="02" t="FRONT-RUN THE BOT." color={C.gold} />
      <Lane y={720} label="YOU" v={you} col={C.acid} />
      <Lane y={920} label="SNIPER_BOT.eth" v={bot} col={C.red} />
      <div style={{ position: "absolute", top: 1150, left: 80, fontFamily: G, fontWeight: 700, fontSize: 96, color: C.gold }}>{gwei} gwei</div>
      <Flash at={end} color={C.gold} />
      <Stamp at={end} text="BLOCK WON" color={C.gold} sub="PRESALE ALLOCATION SECURED" />
    </Shake>
  );
};

/* 4 — Panic tap */
const Panic: React.FC = () => {
  const f = useCurrentFrame();
  const end = 74;
  const taps = Math.min(12, Math.floor(f / 5.5));
  const frozen = f >= end;
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <Shake at={end}>
      <AbsoluteFill style={{ background: C.red, opacity: blink && !frozen ? 0.1 : 0 }} />
      <Kicker n="03" t="EXCHANGE IS COLLAPSING." color={C.red} />
      <div style={{ position: "absolute", top: 780, left: 80, fontFamily: M, fontSize: 40, color: C.red, fontWeight: 800, opacity: blink ? 1 : 0.4 }}>⚠ WITHDRAWALS FREEZE IN 0:0{Math.max(0, 3 - Math.floor(f / 25))}</div>
      <div style={{ position: "absolute", top: 880, left: 80, display: "flex", flexWrap: "wrap", gap: 20, width: 920 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ width: 210, height: 110, borderRadius: 16, background: i < taps ? C.acid : "#2a2418", transform: `scale(${i === taps - 1 ? 1.08 : 1})`, fontFamily: M, fontWeight: 800, fontSize: 30, color: i < taps ? C.bg : C.dim, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i < taps ? "PULLED" : "TAP"}
          </div>
        ))}
      </div>
      <Flash at={end} color={C.acid} />
      <Stamp at={end} text="FUNDS SAVED" color={C.acid} sub="12/12 · NOT YOUR KEYS, NOT YOUR COINS" />
    </Shake>
  );
};

/* 5 — Seed check (the fail) */
const Seed: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = ["throne", "candle", "gorilla", "liquid", "diamond", "vault"];
  const pick = Math.min(5, Math.floor(f / 9));
  const fail = 58;
  return (
    <Shake at={fail}>
      <Kicker n="04" t="REMEMBER YOUR SEED." color={C.cream} />
      <div style={{ position: "absolute", top: 760, left: 80, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 920 }}>
        {words.map((w, i) => {
          const wrong = i === 4 && f >= fail;
          const ok = i < pick && !(i === 4);
          const s = pop(f, fps, i * 4);
          return (
            <div key={w} style={{ opacity: s, fontFamily: M, fontWeight: 800, fontSize: 46, padding: "28px 30px", borderRadius: 14, background: wrong ? C.red : ok ? "rgba(198,244,50,.18)" : "#221d13", color: wrong ? C.bg : C.cream, border: `3px solid ${ok ? C.acid : "#3a3222"}` }}>
              {i + 1}. {i === 4 && f >= fail ? "diamonnd?" : w}
            </div>
          );
        })}
      </div>
      <Flash at={fail} color={C.red} />
      <Stamp at={fail} text="VAULT LOST" color={C.red} sub="-$41,200 · THE BOSS LAUGHS" />
    </Shake>
  );
};

/* 6 — CTA */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = pop(f, fps, 0, { damping: 15, stiffness: 80, mass: 2 } as never);
  const s2 = pop(f, fps, 22);
  return (
    <AbsoluteFill>
      <Img src={staticFile("img/ad_boss_cta.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, transform: `scale(${1.15 - s * 0.1})` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 30%, ${C.bg} 80%)` }} />
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 330, opacity: s }}>
        <div style={{ fontFamily: M, fontWeight: 800, fontSize: 40, color: C.acid, letterSpacing: 4 }}>2020 → 2026 · REAL PRICES</div>
        <div style={{ fontFamily: G, fontWeight: 700, fontSize: 132, color: C.cream, lineHeight: 0.95, marginTop: 20 }}>CAN YOU SURVIVE THE CYCLE?</div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 170, fontFamily: M, fontWeight: 800, fontSize: 54, color: C.bg, background: C.acid, padding: "16px 30px", transform: `translateY(${(1 - s2) * 60}px)`, opacity: s2 }}>thecryptofinalboss.app</div>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 10, width: `${(f / MINI_TOTAL) * 100}%`, background: C.acid }} />;
};

export const MiniVideo: React.FC = () => {
  const scenes = [Hook, Timing, Gas, Panic, Seed, End];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Bg />
      {scenes.map((Sc, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={S[i]}>
          <Sc />
        </Sequence>
      ))}
      <Progress />
    </AbsoluteFill>
  );
};
