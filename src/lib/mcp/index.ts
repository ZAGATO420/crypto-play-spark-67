import { defineMcp } from "@lovable.dev/mcp-js";
import getLeaderboardTool from "./tools/get-leaderboard";
import getPlayerRunsTool from "./tools/get-player-runs";
import getGameGuideTool from "./tools/get-game-guide";

export default defineMcp({
  name: "tcfb-the-crypto-final-boss",
  title: "TCFB The Crypto Final Boss",
  version: "0.1.0",
  instructions:
    "Tools for THE CRYPTO FINAL BOSS, a crypto trading survival game on real 2020-2026 prices. Use `get_leaderboard` for the global ranking, `get_player_runs` to look up a player's submitted runs, and `get_game_guide` to explain modes, mechanics and scoring. All data is public; runs can only be submitted from inside the game.",
  tools: [getLeaderboardTool, getPlayerRunsTool, getGameGuideTool],
});