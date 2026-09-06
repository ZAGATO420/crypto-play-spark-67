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
};

export type RunSubmission = {
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
  avatar?: string;
};

export async function loadBoard(limit = 25): Promise<BoardRow[]> {
  const res = await fetch(`/api/public/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("board unavailable");
  return (await res.json()) as BoardRow[];
}

export async function submitRun(run: RunSubmission): Promise<void> {
  const res = await fetch("/api/public/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(run),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "submit failed");
}
