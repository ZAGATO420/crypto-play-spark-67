import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";

export type PrizeEntry = {
  name: string;
  country: string;
  archetype: string;
  difficulty: string;
  mode: string;
  netWorth: number;
  score: number;
  season: string;
  wallet: string;
  rankTitle: string;
  months: number;
  createdAt: string;
};

export type PrizeSeason = {
  season: string;
  entries: PrizeEntry[];
  prizes: { place: number; amount: number; entry: PrizeEntry | null }[];
};

const PRIZES = [20, 10, 5] as const;

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const fetchPrizepool = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["PRIZEPOOL_PASSWORD"];
    if (!expected) throw new Error("PRIZEPOOL_PASSWORD not configured");
    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const, seasons: [] as PrizeSeason[] };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("leaderboard_runs")
      .select(
        "player_name, country, archetype, difficulty, mode, net_worth, score, season, wallet, rank_title, months_survived, created_at",
      )
      .eq("is_tournament", true)
      .not("wallet", "is", null)
      .order("season", { ascending: false })
      .order("score", { ascending: false })
      .limit(500);

    if (error) {
      console.error("prizepool query failed", error);
      return { ok: true as const, seasons: [] as PrizeSeason[] };
    }

    const bySeason = new Map<string, PrizeEntry[]>();
    for (const r of rows ?? []) {
      const entry: PrizeEntry = {
        name: r.player_name,
        country: r.country,
        archetype: r.archetype,
        difficulty: r.difficulty,
        mode: r.mode,
        netWorth: Number(r.net_worth),
        score: Math.round(Number(r.score)),
        season: r.season,
        wallet: r.wallet,
        rankTitle: r.rank_title,
        months: r.months_survived,
        createdAt: r.created_at,
      };
      const list = bySeason.get(r.season) ?? [];
      list.push(entry);
      bySeason.set(r.season, list);
    }

    const seasons: PrizeSeason[] = [];
    for (const [season, entries] of bySeason) {
      const sorted = entries.sort((a, b) => b.score - a.score);
      seasons.push({
        season,
        entries: sorted,
        prizes: PRIZES.map((amount, i) => ({
          place: i + 1,
          amount,
          entry: sorted[i] ?? null,
        })),
      });
    }

    return { ok: true as const, seasons };
  });
