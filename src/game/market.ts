// Shared market tape: the client renders it and the server replays it, so both
// must use exactly this code — any drift makes honest tournament runs fail.
import { CHAPTERS, COINS, chapterMonth, type BaseMode, type CoinSymbol } from "./journey-data";
import { det } from "./rng";

export const makeNoise = (mode: BaseMode, seed: number) => {
  const step = mode === "historical" ? 0 : mode === "chaos" ? 0.05 : 0.018;
  const cap = mode === "chaos" ? 0.4 : 0.12;
  let drift = 0;
  return Array.from({ length: 84 }, (_, i) => {
    drift = Math.max(-cap, Math.min(cap, drift + (det(seed, `noise-${i}`) * 2 - 1) * step));
    return 1 + drift;
  });
};

export const priceAt = (symbol: CoinSymbol, chapter: number, noise: number[]) => {
  const month = chapterMonth(chapter);
  const base = COINS.find((c) => c.symbol === symbol)?.prices[month] ?? 0;
  return base ? base * (noise[month] ?? 1) : 0;
};

export type Tape = { chapter: number; noise: number[]; seed: number; mode: BaseMode };

export const livePrice = (symbol: CoinSymbol, r: Tape, t: number, sweep = false) => {
  const a = priceAt(symbol, r.chapter, r.noise);
  if (!a) return 0;
  const tt = Math.max(0, Math.min(1, t));
  if (r.mode === "historical") {
    const coin = COINS.find((candidate) => candidate.symbol === symbol);
    if (!coin) return 0;
    const startMonth = chapterMonth(r.chapter);
    const endMonth = chapterMonth(Math.min(CHAPTERS - 1, r.chapter + 1));
    const monthProgress = Math.max(0, endMonth - startMonth) * tt;
    const leftMonth = Math.min(endMonth, startMonth + Math.floor(monthProgress));
    const rightMonth = Math.min(endMonth, leftMonth + 1);
    const left = coin.prices[leftMonth] ?? a;
    const right = coin.prices[rightMonth] || left;
    const fraction = monthProgress - Math.floor(monthProgress);
    return left + (right - left) * fraction;
  }
  const b = priceAt(symbol, r.chapter + 1, r.noise) || a;
  const span = Math.abs(b / a - 1);
  const phase = det(r.seed, `wick-${r.chapter}-${symbol}`) * Math.PI * 2;
  const amp = (0.35 + det(r.seed, `amp-${r.chapter}-${symbol}`) * 0.7) * Math.max(0.05, span);
  const wick = Math.sin(t * Math.PI * 3 + phase) * amp * (1 - t * 0.55);
  const hunt = sweep ? -Math.max(0, Math.sin(t * Math.PI * 2)) * (0.05 + span * 0.5) : 0;
  return Math.max(a * 0.02, (a + (b - a) * t) * (1 + wick + hunt));
};

/** Every price the live tape could show in a chapter (both sweep variants), with a small margin. */
export const liveRange = (symbol: CoinSymbol, tape: Tape): [number, number] => {
  let lo = Infinity, hi = 0;
  for (const sweep of [false, true]) {
    for (let i = 0; i <= 400; i++) {
      const p = livePrice(symbol, tape, i / 400, sweep);
      if (p < lo) lo = p;
      if (p > hi) hi = p;
    }
  }
  const end = priceAt(symbol, tape.chapter, tape.noise);
  if (end) { lo = Math.min(lo, end); hi = Math.max(hi, end); }
  return [lo * 0.995, hi * 1.005];
};
