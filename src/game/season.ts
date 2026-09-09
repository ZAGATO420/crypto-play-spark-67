import { hashString } from "./rng";

/**
 * Monthly tournament seasons. Everything is derived from the clock, so no
 * scheduled job is needed: the season id is the UTC month, and the winners of
 * a finished season are simply the top three scores stored with that id.
 */

export const PRIZES = [20, 10, 5] as const;

export const seasonIdFor = (date: Date): string =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

export const currentSeasonId = (): string => seasonIdFor(new Date());

const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

export const seasonLabel = (id: string): string => {
  const [year, month] = id.split("-");
  const idx = Number(month) - 1;
  return `${MONTHS[idx] ?? month} ${year}`;
};

/** Last millisecond of the season, UTC. */
export const seasonEnd = (id: string): number => {
  const [year, month] = id.split("-").map(Number);
  return Date.UTC(year!, month!, 1) - 1;
};

export const seasonSeed = (id: string): number => hashString(`tcfb-season-${id}`);

export const countdown = (until: number, now = Date.now()): string => {
  const ms = Math.max(0, until - now);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (d > 0) return `${d}D ${h}H ${m}M`;
  return `${h}H ${m}M`;
};

const EVM = /^0x[a-fA-F0-9]{40}$/;
const SOL = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export const isWallet = (value: string): boolean => {
  const v = value.trim();
  return EVM.test(v) || SOL.test(v);
};

export const shortWallet = (value: string): string =>
  value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;

const PLAYER_KEY = "tcfb_player_key_v1";

/** Stable per-browser id so one player holds one tournament entry per season. */
export const playerKey = (): string => {
  try {
    const found = localStorage.getItem(PLAYER_KEY);
    if (found) return found;
    const made = crypto.randomUUID();
    localStorage.setItem(PLAYER_KEY, made);
    return made;
  } catch {
    return crypto.randomUUID();
  }
};

const WALLET_KEY = "tcfb_wallet_v1";
export const readWallet = (): string => {
  try { return localStorage.getItem(WALLET_KEY) ?? ""; } catch { return ""; }
};
export const saveWallet = (value: string) => {
  try { localStorage.setItem(WALLET_KEY, value.trim()); } catch { /* private mode */ }
};
