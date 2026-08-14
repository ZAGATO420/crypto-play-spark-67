import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";
import { LEADERBOARD_COLUMNS, rankScore, toPublicEntry, type LeaderboardRow } from "../rank";

const MODES = [
  "all",
  "classic",
  "chaos",
  "historical",
  "IRONMAN-classic",
  "IRONMAN-chaos",
  "IRONMAN-historical",
] as const;

export default defineTool({
  name: "get_leaderboard",
  title: "Get global leaderboard",
  description:
    "Read the global THE CRYPTO FINAL BOSS leaderboard, ranked by the in-game score (net worth, XP, months survived, achievements and game mode weighting).",
  inputSchema: {
    mode: z.enum(MODES).default("all").describe("Filter by game mode, or 'all'."),
    limit: z.number().int().min(1).max(100).default(20).describe("How many entries to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ mode, limit }) => {
    const supabase = supabaseAnon();
    let query = supabase
      .from("leaderboard_runs")
      .select(LEADERBOARD_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500);
    if (mode && mode !== "all") query = query.eq("mode", mode);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const rows = ((data ?? []) as unknown as LeaderboardRow[])
      .slice()
      .sort((a, b) => rankScore(b) - rankScore(a))
      .slice(0, limit)
      .map((r, i) => toPublicEntry(r, i + 1));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { mode, count: rows.length, entries: rows },
    };
  },
});