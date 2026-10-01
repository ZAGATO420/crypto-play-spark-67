import type { LogEvent } from "./runlog";

export type BoardRow = {
  pos: number;
  name: string;
  arch: string;
  avatar: string;
  country: string;
  difficulty: string;
  mode: string;
  netWorth: number;
  xp: number;
  level: number;
  rank: string;
  months: number;
  survived: boolean;
  score: number;
  season?: string | null;
  isTournament?: boolean;
  prize?: number | null;
};

export type RunSubmission = {
  clientHash: string;
  name: string;
  arch: string;
  country: string;
  difficulty: string;
  mode: string;
  net: number;
  xp: number;
  level: number;
  rank: string;
  months: number;
  achievements: number;
  trades: number;
  survived: boolean;
  score: number;
  avatar?: string;
  season?: string;
  wallet?: string;
  isTournament?: boolean;
  playerKey?: string;
  /** Tournament audit trail; the server replays it before the entry counts for prizes. */
  log?: LogEvent[];
};

export type SubmitFailure = "offline" | "rejected" | "unavailable";

export class SubmitRunError extends Error {
  kind: SubmitFailure;

  constructor(kind: SubmitFailure, message: string) {
    super(message);
    this.name = "SubmitRunError";
    this.kind = kind;
  }
}

export async function loadBoard(limit = 25, season?: string): Promise<BoardRow[]> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (season) query.set("season", season);
  const res = await fetch(`/api/public/leaderboard?${query.toString()}`);
  if (!res.ok) throw new Error("board unavailable");
  return (await res.json()) as BoardRow[];
}

/**
 * The visible target of a run: the net worth the current season leader holds.
 * Loaded once per page, then frozen, so a run never chases a moving number.
 */
export type TopMark = { net: number; name: string; source: "season" | "alltime" | "benchmark" };

/** Nothing on the board yet (fresh season, offline): a real benchmark to beat. */
export const BENCHMARK_MARK = 500_000;

let markCache: Promise<TopMark> | null = null;

export function loadTopMark(season: string): Promise<TopMark> {
  markCache ??= (async (): Promise<TopMark> => {
    const pick = async (s?: string): Promise<BoardRow | undefined> => {
      try {
        const rows = await loadBoard(1, s);
        return rows[0];
      } catch {
        return undefined;
      }
    };
    const leader = await pick(season);
    if (leader && leader.netWorth > 0) {
      return { net: Math.round(leader.netWorth), name: leader.name, source: "season" };
    }
    const allTime = await pick();
    if (allTime && allTime.netWorth > 0) {
      return { net: Math.round(allTime.netWorth), name: allTime.name, source: "alltime" };
    }
    return { net: BENCHMARK_MARK, name: "THE BOSS' OWN BOOK", source: "benchmark" };
  })();
  return markCache;
}

export async function submitRun(run: RunSubmission): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new SubmitRunError("offline", "No connection");
  }
  let res: Response;
  try {
    res = await fetch("/api/public/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(run),
    });
  } catch {
    throw new SubmitRunError("offline", "No connection");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    const kind: SubmitFailure = res.status === 400 || res.status === 422 ? "rejected" : "unavailable";
    throw new SubmitRunError(kind, body.error ?? "submit failed");
  }
}
