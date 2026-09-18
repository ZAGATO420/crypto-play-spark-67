export type RankableRun = {
  net_worth: number | string;
  xp: number;
  months_survived: number;
  achievements: number;
  survived: boolean;
  mode?: string | null;
  score?: number | string | null;
  wallet?: string | null;
  player_key?: string | null;
};

export function rankScore(r: RankableRun): number {
  const stored = Number(r.score) || 0;
  if (stored > 0) return stored;
  const net = Number(r.net_worth) || 0;
  let score = net + r.xp * 10 + r.months_survived * 500 + r.achievements * 250;
  if (r.survived) score += 25_000;
  if (r.months_survived < 6) score -= 5_000;
  const mode = (r.mode || "").toLowerCase();
  if (mode.includes("historical")) score *= 0.8;
  else if (mode.includes("chaos")) score *= 1.2;
  return score;
}

/** Merge every row linked by the same wallet or browser player key, then keep the best run. */
export function bestPerPlayer<T extends RankableRun>(rows: T[]): T[] {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    let root = x;
    while (parent.get(root) && parent.get(root) !== root) root = parent.get(root) ?? root;
    parent.set(x, root);
    return root;
  };
  const union = (a: string, b: string) => {
    parent.set(a, parent.get(a) ?? a);
    parent.set(b, parent.get(b) ?? b);
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  };
  const idsOf = (r: T) => {
    const wallet = String(r.wallet ?? "").trim().toLowerCase();
    const key = String(r.player_key ?? "").trim();
    return [...(wallet ? [`w:${wallet}`] : []), ...(key ? [`k:${key}`] : [])];
  };
  for (const row of rows) {
    const ids = idsOf(row);
    for (const id of ids) parent.set(id, parent.get(id) ?? id);
    for (let i = 1; i < ids.length; i += 1) union(ids[0] ?? ids[i]!, ids[i]!);
  }
  const best = new Map<string, T>();
  const unlinked: T[] = [];
  for (const row of rows) {
    const ids = idsOf(row);
    if (!ids.length) { unlinked.push(row); continue; }
    const id = find(ids[0]!);
    const previous = best.get(id);
    if (!previous || rankScore(row) > rankScore(previous)) best.set(id, row);
  }
  return [...unlinked, ...best.values()];
}
