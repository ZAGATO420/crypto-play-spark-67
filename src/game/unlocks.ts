/**
 * Local, cosmetic unlock layer. Lives in its own localStorage key, never in the
 * run save, the audit log, the leaderboard submission or the database.
 * Unlocks only ever take effect in CUSTOM RUNs — the tournament stays identical
 * for every player.
 */
import type { EndingKey } from "./journey-data";

const KEY = "tcfb_unlocks_v1";

export type UnlockId = "luna_survivor" | "boss_slayer" | "diamond_hands" | "bull_runner" | "throne_breaker";

export type UnlockDef = { id: UnlockId; name: string; glyph: string; goal: string; reward: string };

export const UNLOCKS: UnlockDef[] = [
  { id: "luna_survivor", name: "LUNA SURVIVOR", glyph: "🌕", goal: "Live through the Luna crash (May 2022) without a single liquidation.", reward: "New character SURVIVOR in custom runs." },
  { id: "boss_slayer", name: "BOSS SLAYER", glyph: "⚔️", goal: "Beat the Boss in a direct duel.", reward: "Extra relic TITANIUM VAULT can show up in custom runs." },
  { id: "diamond_hands", name: "DIAMOND HANDS", glyph: "💎", goal: "Finish with $500,000 without ever choosing SELL EVERYTHING.", reward: "Title 💎 next to your name on your board." },
  { id: "bull_runner", name: "BULL RUNNER", glyph: "🔥", goal: "Win 5 quarters in a row.", reward: "Title 🔥 next to your name on your board." },
  { id: "throne_breaker", name: "THRONE BREAKER", glyph: "👑", goal: "Reach the THRONE ending.", reward: "A golden crown on your avatar." },
];

export type Unlocks = Partial<Record<UnlockId, string>>;

export const readUnlocks = (): Unlocks => {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Unlocks | null;
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
};

export const hasUnlock = (id: UnlockId): boolean => !!readUnlocks()[id];

export type UnlockInput = {
  ending: EndingKey;
  net: number;
  chapter: number;
  bossWins: number;
  peakStreak: number;
  liquidations: number;
  panicSold: boolean;
};

/** Checked exactly once, when a run ends. Returns the ids that are new this time. */
export const evaluateUnlocks = (input: UnlockInput): UnlockId[] => {
  const earned: UnlockId[] = [];
  // Luna is chapter 9; reaching chapter 10 means the quarter was lived through.
  if (input.chapter >= 10 && input.liquidations === 0) earned.push("luna_survivor");
  if (input.bossWins >= 1) earned.push("boss_slayer");
  if (input.net >= 500_000 && !input.panicSold) earned.push("diamond_hands");
  if (input.peakStreak >= 5) earned.push("bull_runner");
  if (input.ending === "THRONE") earned.push("throne_breaker");
  const have = readUnlocks();
  const fresh = earned.filter((id) => !have[id]);
  if (fresh.length) {
    const now = new Date().toISOString();
    const next: Unlocks = { ...have };
    for (const id of fresh) next[id] = now;
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
  }
  return fresh;
};

/** Cosmetic titles shown next to the player's own name. */
export const titleGlyphs = (u: Unlocks): string =>
  [u.diamond_hands ? "💎" : "", u.bull_runner ? "🔥" : ""].join("");
