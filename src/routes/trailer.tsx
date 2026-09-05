import { createFileRoute, Link } from "@tanstack/react-router";
import ogAsset from "@/assets/tcfb-og.jpg.asset.json";

const TITLE = "84 Months. One Life. — The Crypto Final Boss Trailer";
const DESCRIPTION =
  "Watch the 10-second teaser: $10k in 2020, 84 months of carnage, real prices, 50x perps and one life. Then play the crypto survival game for free.";
const OG_IMAGE = "https://thecryptofinalboss.app" + ogAsset.url;
const URL = "https://thecryptofinalboss.app/trailer";

const BEATS: { time: string; line: string; note: string }[] = [
  { time: "0:00", line: "2020. YOU HAD $10K.", note: "The boss on his throne of candles. Nobody has beaten him yet." },
  { time: "0:02", line: "84 MONTHS OF CARNAGE.", note: "Luna. FTX. Rugs, presales, airdrops, liquidation cascades." },
  { time: "0:04", line: "REAL PRICES. ONE LIFE.", note: "Every candle is real market history from 2020 to 2026." },
  { time: "0:06", line: "97% GET REKT.", note: "50x perps, funding, forced liquidations. No second run." },
  { time: "0:08", line: "PLAY FREE.", note: "No wallet. No sign-up. Two minutes to your first trade." },
];

export const Route = createFileRoute("/trailer")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "video.other" },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: TrailerPage,
});

function TrailerPage() {
  return (
    <main className="min-h-screen bg-[#070c16] text-[#dfe7f5]">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -6%,rgba(182,255,46,.16) 0%,rgba(182,255,46,0) 46%),radial-gradient(90% 60% at 50% 106%,rgba(255,197,61,.14) 0%,rgba(255,197,61,0) 55%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-12 sm:pt-16">
        <p className="font-mono text-[10px] tracking-[0.28em] text-[#b6ff2e]">
          THE CRYPTO FINAL BOSS · TEASER
        </p>
        <h1
          className="mt-3 text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl"
          style={{
            background: "linear-gradient(180deg,#fff6d8 0%,#ffd76b 38%,#e0a52c 72%,#f6e6b0 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          84 MONTHS. $10K START. ONE LIFE.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#9db0c8] sm:text-base">
          Real crypto history from 2020 to 2026, compressed into one run. Trade the actual
          candles, survive the rugs, and try to walk out of the arena richer than the boss.
        </p>

        <div className="mt-7 grid gap-3 sm:flex sm:items-center">
          <Link
            to="/"
            className="grid h-14 place-items-center rounded-2xl px-8 text-base font-black tracking-[0.14em] text-[#08130a] shadow-[0_18px_40px_-18px_rgba(182,255,46,.7)]"
            style={{ background: "linear-gradient(180deg,#d6ff8a,#b6ff2e 55%,#8fd41c)" }}
          >
            PLAY FREE NOW
          </Link>
          <a
            href="https://x.com/CryptoBossFInal"
            target="_blank"
            rel="noreferrer"
            className="grid h-14 place-items-center rounded-2xl border border-white/15 px-6 font-mono text-xs tracking-[0.18em] text-[#b8c4d6]"
          >
            FOLLOW ON X
          </a>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)]">
          <video
            src="/trailer-16x9.mp4"
            poster={ogAsset.url}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="block aspect-video h-auto w-full"
          />
        </div>

        <h2 className="mt-12 font-mono text-[11px] tracking-[0.24em] text-[#8b9ab1]">
          THE TEN SECONDS, LINE BY LINE
        </h2>
        <ol className="mt-4 grid gap-3">
          {BEATS.map((b) => (
            <li
              key={b.time}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-[#eaf1ff] sm:text-lg">
                  {b.line}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#8b9ab1]">{b.note}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-[#b6ff2e]">
                {b.time}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-3xl border border-[#b6ff2e]/25 bg-[#b6ff2e]/[0.06] p-6 text-center">
          <p className="text-lg font-black tracking-tight text-[#eaf1ff]">
            97% get rekt. Find out which side you are on.
          </p>
          <Link
            to="/"
            className="mt-5 inline-grid h-14 place-items-center rounded-2xl px-10 text-base font-black tracking-[0.14em] text-[#08130a]"
            style={{ background: "linear-gradient(180deg,#d6ff8a,#b6ff2e 55%,#8fd41c)" }}
          >
            ENTER THE ARENA
          </Link>
        </div>
      </div>
    </main>
  );
}
