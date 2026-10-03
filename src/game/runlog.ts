/**
 * Tournament run protocol. While a tournament run plays, every money-moving
 * action appends one compact event. The log ships with the leaderboard
 * submission and the server replays it against the same deterministic
 * history (prices, seed, relics) — a faked result has no matching events.
 */

export type LogEvent =
  | { t: "spot"; c: number; s: string; size: number; fee: number; price: number }
  | { t: "perp"; c: number; s: string; dir: 1 | -1; lev: number; margin: number; price: number }
  | { t: "close"; c: number; id: number; frac: number; q: number; price: number; back: number; fee: number }
  | { t: "risk"; c: number; stake: number; q: number; mode: string; sym: string; timingR: number | null }
  | { t: "presale"; c: number; name: string; size: number; q: number; back: number; gas?: number }
  | { t: "fight"; c: number; wager: number; q: number; delta: number }
  | { t: "decision"; c: number; label: string; crisis: boolean }
  | { t: "skill"; c: number; q: number; delta: number }
  | { t: "crash"; c: number; q: number }
  | { t: "seedphrase"; c: number; q: number }
  | { t: "care"; c: number; kind: "eat" | "calm"; cost: number }
  | { t: "custody"; c: number; to: string; fee: number }
  | { t: "life"; c: number; job: string; housing: string }
  | { t: "offer"; c: number; amount: number }
  | { t: "loot"; c: number; kind: string; bonus: number }
  | { t: "relic"; c: number; id: string }
  | { t: "conviction"; c: number; on: boolean }
  | { t: "stance"; c: number; stance: string }
  | { t: "bank"; c: number }
  | { t: "signal"; c: number; fee: number }
  | { t: "quarter"; c: number; n?: number; cash?: number }
  | { t: "sellout"; c: number };
