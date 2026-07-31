import { createFileRoute } from "@tanstack/react-router";

const TITLE = "THE FINAL CRYPTO BOSS — Crypto Trading Survival Game 2020–2026";
const DESCRIPTION =
  "Trade real historical crypto prices from 2020 to 2026. Survive presales, rugs, airdrops, leverage and liquidations across 84 months — climb the global leaderboard.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// The game itself is a single self-contained HTML file (public/game.html) with
// every dependency inlined. Rendering it in a full-bleed frame keeps that file
// portable to any host while this route supplies SSR metadata.
function Index() {
  return (
    <iframe
      src="/game.html"
      title="The Final Crypto Boss"
      className="fixed inset-0 h-full w-full border-0"
      allow="autoplay; clipboard-write"
    />
  );
}
