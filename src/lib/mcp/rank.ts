// Mirrors the ranking math used by /api/public/leaderboard so MCP callers see
// the same ordering the in-game board shows.
export type LeaderboardRow = {
  player_name: string;
  archetype: string | null;
  country: string | null;
  difficulty: string | null;
  mode: string | null;
  net_worth: number | string;
  xp: number;
  level: number;
  rank_title: string | null;
  months_survived: number;
  achievements: number;
  survived: boolean;
  avatar: string | null;
  created_at: string;
};

export function rankScore(r: LeaderboardRow): number {
  const net = Number(r.net_worth) || 0;
  let score = net + r.xp * 10 + r.months_survived * 500 + r.achievements * 250;
  if (r.survived) score += 25_000;
  if (r.months_survived < 6) score -= 5_000;
  const mode = (r.mode || "").toLowerCase();
  if (mode.includes("historical")) score *= 0.8;
  else if (mode.includes("chaos")) score *= 1.2;
  return score;
}

export function toPublicEntry(r: LeaderboardRow, pos: number) {
  return {
    pos,
    name: r.player_name,
    archetype: r.archetype,
    avatar: r.avatar || "",
    country: r.country,
    difficulty: r.difficulty,
    mode: r.mode,
    netWorth: Number(r.net_worth),
    xp: r.xp,
    level: r.level,
    rank: r.rank_title,
    months: r.months_survived,
    achievements: r.achievements,
    survived: r.survived,
    playedAt: r.created_at,
    score: Math.round(rankScore(r)),
  };
}

export const LEADERBOARD_COLUMNS =
  "player_name, archetype, country, difficulty, mode, net_worth, xp, level, rank_title, months_survived, achievements, survived, avatar, created_at";