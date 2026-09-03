import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

const RANKS = [
  "Exit Liquidity",
  "Jeet",
  "Paper Hands",
  "Degen",
  "Trader",
  "Chad",
  "Whale",
  "Final Boss",
  "Legend",
  "Rekt",
  "Survivor",
  "Dead",
  // titles produced by the client's getRank()
  "Early Rekt",
  "Certified Rekt",
  "Late Game Rekt",
  "Final Boss Material",
  "Top 3% Diamond Hands",
  "Top 8% Survivor",
  "Solid Survivor",
  "Achievement Hunter",
  "Made It",
  "Unknown",
];

const COUNTRIES = ["DE", "USA", "CH", "SG", "PT", "NG"] as const;
const ARCHETYPES = ["degen", "trader", "influencer", "hodler"] as const;
const DIFFICULTIES = ["EASY", "NORMAL", "BOSS"] as const;
const MODES = [
  "classic",
  "chaos",
  "historical",
  "IRONMAN-classic",
  "IRONMAN-chaos",
  "IRONMAN-historical",
] as const;

const runSchema = z.object({
  name: z.string().trim().min(1).max(18),
  arch: z.enum(ARCHETYPES),
  country: z.enum(COUNTRIES),
  difficulty: z.enum(DIFFICULTIES),
  mode: z.enum(MODES),
  net: z.number().finite().min(-1e9).max(1e10),
  xp: z.number().int().min(0).max(5_000_000),
  level: z.number().int().min(1).max(50),
  rank: z.string().trim().max(32).default(""),
  months: z.number().int().min(0).max(84),
  achievements: z.number().int().min(0).max(200),
  trades: z.number().int().min(0).max(20_000),
  survived: z.boolean().default(false),
  avatar: z.string().trim().max(12).optional(),
});

// Mirrors the client's XP_LEVELS thresholds (public/game.html). level = index + 1.
const XP_THRESHOLDS = [
  0, 400, 1200, 2600, 4800, 8000, 12500, 18500, 26000, 36000, 50000, 70000,
  95000, 130000, 180000, 250000,
];

function maxLevelForXp(xp: number): number {
  let i = 0;
  for (let k = 0; k < XP_THRESHOLDS.length; k++) {
    if (xp >= XP_THRESHOLDS[k]!) i = k;
  }
  return i + 1;
}

// Plausibility gate: a run cannot be richer than the game's own math allows.
// Ceiling scales with how long the player actually played, so a "month 3,
// one trillion dollars" payload is rejected before it ever reaches the table.
function implausibleReason(run: z.infer<typeof runSchema>): string | null {
  // Airdrops/presales/50x perps can multiply an early run hard, so keep a very
  // generous floor for short runs and let the ceiling grow with months played.
  const monthCeiling = Math.max(50_000_000, 25_000 * Math.pow(2.1, Math.max(run.months, 1)));
  if (run.net > Math.min(monthCeiling, 1e10)) return "net";
  // XP is earned per action; it cannot outrun the number of months by orders of magnitude.
  if (run.xp > 60_000 + run.months * 40_000) return "xp";
  if (run.trades > 120 + run.months * 120) return "trades";
  // Level must match the client's XP curve (allow +1 for rounding drift).
  if (run.level > maxLevelForXp(run.xp) + 1) return "level";
  return null;
}

function sanitizeName(name: string): string {
  return name.replace(/[^\p{L}\p{N} _.\-]/gu, "").slice(0, 18) || "anon";
}

// Ranking score: a 3-month bail-out with +$100 must not outrank a 32-month run
// that ended slightly negative. Net worth still dominates, but survival time,
// XP and achievements count — and unfinished mini-runs get a soft penalty.
function rankScore(r: {
  net_worth: number | string;
  xp: number;
  months_survived: number;
  achievements: number;
  survived: boolean;
  mode?: string | null;
}): number {
  const net = Number(r.net_worth) || 0;
  let score = net + r.xp * 10 + r.months_survived * 500 + r.achievements * 250;
  if (r.survived) score += 25_000;
  if (r.months_survived < 6) score -= 5_000;
  // Historical runs follow the real timeline and are therefore predictable;
  // chaos runs carry real risk. Weight them so knowledge alone cannot top a
  // chaos run (mirrors the client's XP multipliers).
  const mode = (r.mode || "").toLowerCase();
  if (mode.includes("historical")) score *= 0.8;
  else if (mode.includes("chaos")) score *= 1.2;
  return score;
}

const SELECT_COLS =
  "player_name, archetype, country, difficulty, mode, net_worth, xp, level, rank_title, months_survived, achievements, survived, avatar, created_at";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// A publishable-key client for reads only. The service-role key is a JWT whose
// `iat` can land in the future relative to the DB clock (PGRST303); the
// publishable key is opaque and not subject to that validation, so it keeps the
// public board readable during clock drift. Table has a public read policy.
async function createReadFallbackClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
        if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const Route = createFileRoute("/api/public/leaderboard")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),

      GET: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const url = new URL(request.url);
        const mode = url.searchParams.get("mode");
        const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 200);

        const runQuery = async (client: {
          from: (t: string) => any;
        }) => {
          let query = client
            .from("leaderboard_runs")
            .select(SELECT_COLS)
            .order("created_at", { ascending: false })
            .limit(500);

          if (mode && mode !== "all") query = query.eq("mode", mode);
          return (await query) as { data: any[] | null; error: any };
        };

        let { data, error } = await runQuery(supabaseAdmin);
        // Transient auth/clock/network hiccups (e.g. PGRST303) should not hard-fail the board.
        for (let attempt = 0; attempt < 3 && error; attempt++) {
          await sleep(250 * (attempt + 1));
          ({ data, error } = await runQuery(supabaseAdmin));
        }
        if (error) {
          console.error("leaderboard read failed, trying publishable fallback", error);
          const fallback = await createReadFallbackClient();
          if (fallback) {
            for (let attempt = 0; attempt < 2 && error; attempt++) {
              ({ data, error } = await runQuery(fallback as any));
              if (error) await sleep(250);
            }
          }
        }
        if (error) {
          console.error("leaderboard read failed", error);
          return Response.json({ error: "unavailable" }, { status: 503, headers: CORS });
        }




        const rows = (data ?? [])
          .slice()
          .sort((a, b) => rankScore(b) - rankScore(a))
          .slice(0, limit)
          .map((r, i) => ({
          pos: i + 1,
          name: r.player_name,
          arch: r.archetype,
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
          timestamp: r.created_at,
          score: Math.round(rankScore(r)),
        }));

        return Response.json(rows, { headers: CORS });
      },

      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid json" }, { status: 400, headers: CORS });
        }

        const parsed = runSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "invalid payload" }, { status: 400, headers: CORS });
        }
        const run = parsed.data;

        const reason = implausibleReason(run);
        if (reason) {
          console.warn("leaderboard score rejected", {
            reason,
            months: run.months,
            net: run.net,
            xp: run.xp,
            level: run.level,
            trades: run.trades,
            mode: run.mode,
          });
          return Response.json({ error: "score rejected" }, { status: 422, headers: CORS });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const row = {
          player_name: sanitizeName(run.name),
          archetype: run.arch,
          country: run.country,
          difficulty: run.difficulty,
          mode: run.mode,
          net_worth: run.net,
          xp: run.xp,
          level: run.level,
          rank_title: RANKS.includes(run.rank) ? run.rank : "",
          months_survived: run.months,
          achievements: run.achievements,
          trades: run.trades,
          survived: run.survived,
          avatar: run.avatar ?? null,
        };

        let { error } = await supabaseAdmin.from("leaderboard_runs").insert(row);
        // PGRST303 / network blips: retry before telling a player their run is lost.
        for (let attempt = 0; attempt < 3 && error; attempt++) {
          await sleep(300 * (attempt + 1));
          ({ error } = await supabaseAdmin.from("leaderboard_runs").insert(row));
        }

        if (error) {
          console.error("leaderboard write failed", error);
          return Response.json({ error: "unavailable" }, { status: 503, headers: CORS });
        }


        return Response.json({ ok: true, success: true }, { status: 201, headers: CORS });
      },
    },
  },
});