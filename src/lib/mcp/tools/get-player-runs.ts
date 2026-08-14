import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";
import { LEADERBOARD_COLUMNS, toPublicEntry, type LeaderboardRow } from "../rank";

export default defineTool({
  name: "get_player_runs",
  title: "Get a player's runs",
  description:
    "Look up the submitted leaderboard runs of a player by their in-game name (case-insensitive, partial match allowed).",
  inputSchema: {
    name: z.string().trim().min(1).describe("The player name shown on the leaderboard."),
    limit: z.number().int().min(1).max(50).default(10).describe("How many runs to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ name, limit }) => {
    const supabase = supabaseAnon();
    const needle = name.replace(/[%_,]/g, " ").trim();
    if (!needle) return { content: [{ type: "text", text: "Invalid player name." }], isError: true };

    const { data, error } = await supabase
      .from("leaderboard_runs")
      .select(LEADERBOARD_COLUMNS)
      .ilike("player_name", `%${needle}%`)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const runs = ((data ?? []) as unknown as LeaderboardRow[]).map((r, i) => toPublicEntry(r, i + 1));
    if (runs.length === 0) {
      return {
        content: [{ type: "text", text: `No runs found for "${name}".` }],
        structuredContent: { name, count: 0, runs: [] },
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(runs, null, 2) }],
      structuredContent: { name, count: runs.length, runs },
    };
  },
});