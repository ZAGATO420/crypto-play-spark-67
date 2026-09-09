import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchPrizepool, type PrizeSeason } from "@/lib/prizepool.functions";
import { shortWallet } from "@/game/season";
import { Flag as CountryFlag } from "@/game/flags";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

function seasonLabel(id: string): string {
  const [year, month] = id.split("-");
  const idx = Number(month) - 1;
  return `${MONTHS[idx] ?? month} ${year}`;
}

const PRIZE_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

export const Route = createFileRoute("/prizepool")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "TCFB · Prize Pool" },
    ],
  }),
  component: PrizePoolPage,
});

function PrizePoolPage() {
  const fetchFn = useServerFn(fetchPrizepool);
  const [password, setPassword] = useState("");
  const [seasons, setSeasons] = useState<PrizeSeason[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const result = await fetchFn({ data: { password } });
    setLoading(false);
    if (result.ok) {
      setSeasons(result.seasons);
    } else {
      setError(true);
    }
  }

  function toggleReveal(wallet: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(wallet)) next.delete(wallet);
      else next.add(wallet);
      return next;
    });
  }

  function copyWallet(wallet: string) {
    navigator.clipboard?.writeText(wallet).catch(() => {});
  }

  if (!seasons) {
    return (
      <div className="prizepool-gate">
        <div className="prizepool-gate-card">
          <h1 className="prizepool-title">TCFB · PRIZE POOL</h1>
          <p className="prizepool-sub">Tournament wallets &amp; winners — admin only.</p>
          <form onSubmit={onSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              autoFocus
              className="prizepool-input"
            />
            {error && <p className="prizepool-error">Wrong password.</p>}
            <button type="submit" disabled={loading || !password} className="prizepool-btn">
              {loading ? "…" : "ENTER"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalEntries = seasons.reduce((n, s) => n + s.entries.length, 0);

  return (
    <div className="prizepool-page">
      <header className="prizepool-header">
        <h1 className="prizepool-title">TCFB · PRIZE POOL</h1>
        <div className="prizepool-stats">
          <span>{seasons.length} SEASON{seasons.length !== 1 ? "S" : ""}</span>
          <span>{totalEntries} ENTR{totalEntries === 1 ? "Y" : "IES"}</span>
          <button onClick={() => setSeasons(null)} className="prizepool-logout">LOCK</button>
        </div>
      </header>

      {seasons.length === 0 && (
        <p className="prizepool-empty">No tournament entries with wallets yet.</p>
      )}

      {seasons.map((s) => (
        <section key={s.season} className="prizepool-season">
          <div className="prizepool-season-head">
            <h2 className="prizepool-season-title">{seasonLabel(s.season)}</h2>
            <span className="prizepool-season-count">{s.entries.length} players</span>
          </div>

          {/* Prize winners — top 3 */}
          <div className="prizepool-podium">
            {s.prizes.map((p, i) => (
              <div
                key={p.place}
                className="prizepool-prize-card"
                style={{ borderColor: p.entry ? PRIZE_COLORS[i] : "var(--border)" }}
              >
                <div className="prizepool-prize-place" style={{ color: PRIZE_COLORS[i] }}>
                  #{p.place} · ${p.amount} TCFB
                </div>
                {p.entry ? (() => {
                  const w = p.entry;
                  return (
                  <div className="prizepool-prize-winner">
                    <span className="prizepool-winner-name">
                      <CountryFlag code={w.country} /> {w.name}
                    </span>
                    <span className="prizepool-winner-score">
                      Score {w.score.toLocaleString()} · Net ${w.netWorth.toLocaleString()}
                    </span>
                    <button
                      onClick={() => toggleReveal(w.wallet)}
                      className="prizepool-wallet-btn"
                    >
                      {revealed.has(w.wallet) ? w.wallet : shortWallet(w.wallet)}
                    </button>
                    <button onClick={() => copyWallet(w.wallet)} className="prizepool-copy-btn">
                      COPY
                    </button>
                  </div>
                  );
                })() : (
                  <span className="prizepool-prize-empty">—</span>
                )}
              </div>
            ))}
          </div>

          {/* Full entry table */}
          {s.entries.length > 0 && (
            <table className="prizepool-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Arch</th>
                  <th>Diff</th>
                  <th>Net</th>
                  <th>Score</th>
                  <th>Months</th>
                  <th>Wallet</th>
                </tr>
              </thead>
              <tbody>
                {s.entries.map((e, i) => (
                  <tr key={e.wallet} className={i < 3 ? "prizepool-row-prize" : ""}>
                    <td>{i + 1}</td>
                    <td>
                      <CountryFlag code={e.country} /> {e.name}
                    </td>
                    <td>{e.archetype}</td>
                    <td>{e.difficulty}</td>
                    <td>${e.netWorth.toLocaleString()}</td>
                    <td>{e.score.toLocaleString()}</td>
                    <td>{e.months}</td>
                    <td>
                      <button
                        onClick={() => toggleReveal(e.wallet)}
                        className="prizepool-wallet-btn"
                      >
                        {revealed.has(e.wallet) ? e.wallet : shortWallet(e.wallet)}
                      </button>
                      <button onClick={() => copyWallet(e.wallet)} className="prizepool-copy-btn">
                        COPY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ))}
    </div>
  );
}
