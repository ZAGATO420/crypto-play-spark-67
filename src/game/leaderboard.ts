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

export async function loadBoard(limit = 25): Promise<BoardRow[]> {
  const res = await fetch(`/api/public/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("board unavailable");
  return (await res.json()) as BoardRow[];
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
