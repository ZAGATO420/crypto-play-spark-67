import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const GUIDE = {
  overview:
    "THE CRYPTO FINAL BOSS is a browser survival game: trade real historical crypto prices from 2020 to 2026 across 84 in-game months and try not to get rekt.",
  url: "https://thecryptofinalboss.app",
  modes: [
    { id: "classic", label: "Classic", xpMultiplier: 1, note: "The standard 2020-2026 run." },
    { id: "historical", label: "Historical", xpMultiplier: 0.75, note: "Follows the real timeline, so it is more predictable and pays less XP." },
    { id: "chaos", label: "Chaos", xpMultiplier: 1.25, note: "Wilder swings and random shocks, higher XP payout." },
  ],
  ironman: "Ironman is a toggle on top of any mode: one life, no bail-outs, and it stacks the XP multiplier up to x6.25.",
  difficulties: ["EASY", "NORMAL", "BOSS"],
  mechanics: [
    "Spot market: buy and sell 20+ coins with slippage and market impact.",
    "Perps: leverage up to 50x with live liquidation distance and compounding funding rates.",
    "Airdrops, launchpads, presales, ICOs, rugs and scams as timed events.",
    "Cash ledger logs every booking, plus taxes, wealth tax and inflation.",
    "16-level XP system, season status, daily missions and achievements.",
  ],
  scoring:
    "Leaderboard score = net worth + XP x10 + months survived x500 + achievements x250, +25000 for surviving all 84 months, -5000 for runs under 6 months, then x0.8 for historical and x1.2 for chaos.",
  survivalTips: [
    "Keep dry powder: forced selling into a crash is how most runs die.",
    "Leverage kills first, fees kill slowly. Watch the liquidation distance bar.",
    "Presale allocations are capped, so do not plan a whole run around one launch.",
    "Tax bills arrive whether or not you kept cash aside.",
  ],
};

export default defineTool({
  name: "get_game_guide",
  title: "Get game guide",
  description:
    "Explain THE CRYPTO FINAL BOSS: game modes, difficulties, mechanics, how the leaderboard score is calculated and survival tips.",
  inputSchema: {
    section: z
      .enum(["all", "modes", "mechanics", "scoring", "tips"])
      .default("all")
      .describe("Which part of the guide to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ section }) => {
    const payload =
      section === "modes"
        ? { modes: GUIDE.modes, ironman: GUIDE.ironman, difficulties: GUIDE.difficulties }
        : section === "mechanics"
          ? { mechanics: GUIDE.mechanics }
          : section === "scoring"
            ? { scoring: GUIDE.scoring }
            : section === "tips"
              ? { survivalTips: GUIDE.survivalTips }
              : GUIDE;
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});