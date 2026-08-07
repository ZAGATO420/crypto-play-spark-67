import { createFileRoute } from "@tanstack/react-router";
import ogAsset from "@/assets/tcfb-og.jpg.asset.json";

const TITLE = "THE CRYPTO FINAL BOSS — Crypto Trading Survival Game 2020–2026";
const DESCRIPTION =
  "Trade real historical crypto prices from 2020 to 2026. Survive presales, rugs, airdrops, leverage and liquidations across 84 months — climb the global leaderboard.";
// Own branded 1200x630 card. The previous value was an auto-generated preview
// screenshot, which is why shared links showed platform branding.
const OG_IMAGE = "https://thecryptofinalboss.app" + ogAsset.url;
const BASE_URL = "https://thecryptofinalboss.app";

const SOFTWARE_APP_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "The Crypto Final Boss",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  url: `${BASE_URL}/`,
  image: OG_IMAGE,
  description: DESCRIPTION,
  author: {
    "@type": "Organization",
    name: "The Crypto Final Boss",
    url: BASE_URL,
  },
  genre: "Simulation",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
});

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
      { "script:ld+json": JSON.parse(SOFTWARE_APP_LD) } as any,
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
