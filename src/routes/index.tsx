import { createFileRoute } from "@tanstack/react-router";

const TITLE = "THE CRYPTO FINAL BOSS — Crypto Trading Survival Game 2020–2026";
const DESCRIPTION =
  "Trade real historical crypto prices from 2020 to 2026. Survive presales, rugs, airdrops, leverage and liquidations across 84 months — climb the global leaderboard.";
const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e0ecbba0-79a2-4955-b7a6-c8d465adcd7a/id-preview-c53c0856--2a796c05-ed68-4e85-996a-dca7fcf09410.lovable.app-1785515630030.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thecryptofinalboss.app/" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: "https://thecryptofinalboss.app/" }],
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
      title="The Crypto Final Boss"
      className="fixed inset-0 h-full w-full border-0"
      allow="autoplay; clipboard-write"
    />
  );
}
