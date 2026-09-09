/**
 * Meta progression. Everything a player keeps between runs lives here, in the
 * browser: how many runs, the best numbers, which endings they have already
 * seen and which badges they collected. No backend, no accounts.
 */

import type { EndingKey } from "./journey-data";

const KEY = "tcfb_profile_v1";

export type Profile = {
  runs: number;
  bestNet: number;
  bestScore: number;
  bestMonths: number;
  bossWins: number;
  endings: Partial<Record<EndingKey, number>>;
  badges: string[];
};

const EMPTY: Profile = { runs: 0, bestNet: 0, bestScore: 0, bestMonths: 0, bossWins: 0, endings: {}, badges: [] };

export const readProfile = (): Profile => {
  if (typeof localStorage === "undefined") return EMPTY;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Profile> | null;
    if (!raw) return EMPTY;
    return { ...EMPTY, ...raw, endings: raw.endings ?? {}, badges: raw.badges ?? [] };
  } catch {
    return EMPTY;
  }
};

export const recordRun = (input: { ending: EndingKey; net: number; score: number; months: number; bossWins: number; badge: string }): Profile => {
  const p = readProfile();
  const next: Profile = {
    runs: p.runs + 1,
    bestNet: Math.max(p.bestNet, Math.round(input.net)),
    bestScore: Math.max(p.bestScore, Math.round(input.score)),
    bestMonths: Math.max(p.bestMonths, input.months),
    bossWins: p.bossWins + input.bossWins,
    endings: { ...p.endings, [input.ending]: (p.endings[input.ending] ?? 0) + 1 },
    badges: Array.from(new Set([...p.badges, input.badge])),
  };
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode: the run still counts on screen */ }
  return next;
};
