import { createFileRoute } from "@tanstack/react-router";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=60",
};

// The game's story runs on historical 2020-2026 prices. These live quotes are
// used only for the start-screen tape, so players see today's real market.
const IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  LINK: "chainlink",
  ADA: "cardano",
  DOT: "polkadot",
};

type Quote = { sym: string; price: number; chg24h: number };

let cache: { at: number; rows: Quote[] } | null = null;
const TTL = 60_000;

async function fromCoinGecko(): Promise<Quote[]> {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    Object.values(IDS).join(",") +
    "&vs_currencies=usd&include_24hr_change=true";
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error("coingecko " + res.status);
  const json = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;
  const rows: Quote[] = [];
  for (const [sym, id] of Object.entries(IDS)) {
    const q = json[id];
    if (!q || typeof q.usd !== "number") continue;
    rows.push({ sym, price: q.usd, chg24h: Number(q.usd_24h_change ?? 0) });
  }
  if (!rows.length) throw new Error("empty");
  return rows;
}

export const Route = createFileRoute("/api/public/prices")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        const now = Date.now();
        if (cache && now - cache.at < TTL) {
          return Response.json({ rows: cache.rows, cached: true }, { headers: CORS });
        }
        try {
          const rows = await fromCoinGecko();
          cache = { at: now, rows };
          return Response.json({ rows, cached: false }, { headers: CORS });
        } catch (err) {
          console.error("live prices failed", err);
          if (cache) {
            return Response.json({ rows: cache.rows, stale: true }, { headers: CORS });
          }
          return Response.json({ error: "unavailable" }, { status: 503, headers: CORS });
        }
      },
    },
  },
});
