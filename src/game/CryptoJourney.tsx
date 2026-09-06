import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, Crown, Flame, HeartPulse, History, Pause, Play, Rocket, ShoppingBag, Skull, Trophy, Volume2, VolumeX, WalletCards, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import crownedBoss from "@/assets/boss/crowned.webp.asset.json";
import enragedBoss from "@/assets/boss/enraged.webp.asset.json";
import smugBoss from "@/assets/boss/smug.webp.asset.json";
import avApe from "@/assets/tcfb/av-ape.webp.asset.json";
import avAstro from "@/assets/tcfb/av-astro.webp.asset.json";
import avBot from "@/assets/tcfb/av-bot.webp.asset.json";
import avCoder from "@/assets/tcfb/av-coder.webp.asset.json";
import avDiamond from "@/assets/tcfb/av-diamond.webp.asset.json";
import avFrog from "@/assets/tcfb/av-frog.webp.asset.json";
import avReaper from "@/assets/tcfb/av-reaper.webp.asset.json";
import avWhale from "@/assets/tcfb/av-whale.webp.asset.json";
import { ARCHETYPES, CHANCES, COINS, COUNTRIES, DIFFICULTIES, EVENTS, MODES, MONTHS, XP_LEVELS, formatMoney, levelFor, rankTitle, type Archetype, type BaseMode, type Chance, type CoinSymbol, type Country, type Difficulty } from "./journey-data";
import { loadBoard, submitRun, type BoardRow } from "./leaderboard";

type Holding = Partial<Record<CoinSymbol, number>>;
type Log = { month: number; title: string; detail: string; tone: "cyan" | "pink" | "yellow" };
type Config = { name: string; avatar: string; arch: Archetype; difficulty: Difficulty; mode: BaseMode; ironman: boolean; country: Country };
type GameState = { month: number; cash: number; holdings: Holding; hunger: number; stress: number; xp: number; streak: number; trades: number; wins: number; muted: boolean; paused: boolean; logs: Log[]; noise: number[]; config: Config };
type Screen = "start" | "setup" | "board" | "journey" | "portfolio" | "survival" | "end";

const SAVE_KEY = "tcfb_card_journey_v2";
export const AVATARS = [
  { id: "ape", url: avApe.url }, { id: "astro", url: avAstro.url }, { id: "bot", url: avBot.url }, { id: "coder", url: avCoder.url },
  { id: "diamond", url: avDiamond.url }, { id: "frog", url: avFrog.url }, { id: "reaper", url: avReaper.url }, { id: "whale", url: avWhale.url },
];

const defaultConfig: Config = { name: "", avatar: "ape", arch: "trader", difficulty: "NORMAL", mode: "classic", ironman: false, country: "DE" };
const archOf = (id: Archetype) => ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[1]!;
const diffOf = (id: Difficulty) => DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1]!;
const modeOf = (id: BaseMode) => MODES.find((m) => m.id === id) ?? MODES[0]!;

const makeNoise = (mode: BaseMode) => {
  const spread = mode === "historical" ? 0 : mode === "chaos" ? 0.32 : 0.09;
  return Array.from({ length: 84 }, () => 1 + (Math.random() * 2 - 1) * spread);
};

const freshState = (config: Config): GameState => ({
  month: 0, cash: archOf(config.arch).cash, holdings: {}, hunger: 8, stress: 6, xp: 0, streak: 0, trades: 0, wins: 0,
  muted: false, paused: false, logs: [], noise: makeNoise(config.mode), config,
});

const priceAt = (symbol: CoinSymbol, month: number, noise: number[]) => {
  const coin = COINS.find((c) => c.symbol === symbol);
  const base = coin?.prices[Math.min(Math.max(month, 0), 83)] ?? 0;
  return base ? base * (noise[Math.min(month, 83)] ?? 1) : 0;
};
const valueOf = (s: GameState) => COINS.reduce((sum, c) => sum + (s.holdings[c.symbol] ?? 0) * priceAt(c.symbol, s.month, s.noise), s.cash);
const pct = (a: number, b: number) => (b ? (a / b - 1) * 100 : 0);
const modeId = (c: Config) => (c.ironman ? `IRONMAN-${c.mode}` : c.mode);

export function CryptoJourney() {
  const [screen, setScreen] = useState<Screen>("start");
  const [state, setState] = useState<GameState>(() => freshState(defaultConfig));
  const [coinIndex, setCoinIndex] = useState(0);
  const [result, setResult] = useState<Log | null>(null);
  const [chance, setChance] = useState<Chance | null>(null);
  const [resume, setResume] = useState(false);

  const coin = COINS[coinIndex] ?? COINS[0]!;
  const price = priceAt(coin.symbol, state.month, state.noise);
  const previous = priceAt(coin.symbol, state.month - 1, state.noise);
  const change = pct(price, previous);
  const level = levelFor(state.xp);
  const nextLevel = XP_LEVELS[Math.min(level, XP_LEVELS.length - 1)] ?? XP_LEVELS.at(-1)!;
  const net = valueOf(state);
  const event = EVENTS[state.month];
  const date = `${MONTHS[state.month % 12]} ${2020 + Math.floor(state.month / 12)}`;
  const cfg = state.config;
  const arch = archOf(cfg.arch);
  const diff = diffOf(cfg.difficulty);

  useEffect(() => { if (localStorage.getItem(SAVE_KEY)) setResume(true); }, []);
  useEffect(() => {
    if (screen === "start" || screen === "setup" || state.config.ironman) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [screen, state]);

  const mood = result?.tone === "pink" || state.hunger > 75 || state.stress > 75 ? enragedBoss.url : result?.tone === "yellow" ? smugBoss.url : crownedBoss.url;
  const bossLine = result?.detail ?? chance?.body ?? event?.body ?? (change > 10 ? "Momentum is loud. Your decision must be louder." : change < -10 ? "Red candles reveal who came without a plan." : "Every month is a card. Play the one in front of you.");
  const positions = useMemo(() => COINS.filter((c) => (state.holdings[c.symbol] ?? 0) > 0), [state.holdings]);

  const feedback = (title: string, detail: string, tone: Log["tone"], patch: Partial<GameState> = {}) => {
    const entry = { month: state.month, title, detail, tone };
    setResult(entry);
    setState((cur) => ({ ...cur, ...patch, logs: [entry, ...cur.logs].slice(0, 14) }));
  };

  const buy = () => {
    if (!price) return feedback("NOT LAUNCHED", `${coin.name} is not tradable yet.`, "pink");
    const spend = Math.floor(state.cash * 0.25);
    if (spend < 25) return feedback("BUY BLOCKED", "You need at least $25 cash.", "pink");
    feedback("POSITION OPENED", `${formatMoney(spend)} moved into ${coin.symbol}.`, "cyan", { cash: state.cash - spend, holdings: { ...state.holdings, [coin.symbol]: (state.holdings[coin.symbol] ?? 0) + spend / price }, xp: state.xp + Math.round(90 * arch.xp), trades: state.trades + 1 });
  };

  const sell = () => {
    const qty = state.holdings[coin.symbol] ?? 0;
    if (!qty) return feedback("NOTHING TO SELL", `You do not own ${coin.symbol} yet.`, "pink");
    const proceeds = qty * price;
    feedback("POSITION CLOSED", `${coin.symbol} returned ${formatMoney(proceeds)} to cash.`, proceeds >= 2500 ? "yellow" : "cyan", { cash: state.cash + proceeds, holdings: { ...state.holdings, [coin.symbol]: 0 }, xp: state.xp + Math.round(70 * arch.xp), trades: state.trades + 1 });
  };

  const resolveChance = (take: boolean) => {
    const card = chance;
    if (!card) return;
    setChance(null);
    if (!take) return feedback("YOU PASSED", `${card.title} closed without you. Discipline is a position too.`, "cyan", { xp: state.xp + 20, stress: Math.max(0, state.stress - 3) });
    const stake = Math.max(50, Math.floor(state.cash * card.stake));
    if (state.cash < stake) return feedback("NOT ENOUGH CASH", `${card.title} needs ${formatMoney(stake)} — you hold ${formatMoney(state.cash)}.`, "pink");
    const luck = Math.random() * (1 / diff.risk) * (card.kind === "launch" ? arch.risk : 1);
    let multi = 0;
    let title = "";
    if (card.kind === "tax") {
      return feedback("TRIBUTE PAID", `${formatMoney(stake)} to the Boss. He nods. Stress drops.`, "yellow", { cash: state.cash - stake, stress: Math.max(0, state.stress - 18), xp: state.xp + Math.round(140 * arch.xp) });
    }
    if (card.kind === "airdrop") { multi = luck > 0.55 ? 1.8 + Math.random() * 4 : 0.2; title = multi > 1 ? "AIRDROP PRINTED" : "FARM WASTED"; }
    else if (card.kind === "perp") { multi = luck > 0.5 ? 1.6 + Math.random() * 1.9 : 0; title = multi > 1 ? "PERP IN PROFIT" : "LIQUIDATED"; }
    else { multi = luck > 0.72 ? 3 + Math.random() * 9 : luck > 0.5 ? 1.3 : 0; title = multi > 2.5 ? "MOONSHOT" : multi > 1 ? "SMALL PUMP" : "RUG PULL"; }
    const back = Math.round(stake * multi);
    const win = back > stake;
    feedback(title, `${formatMoney(stake)} staked · ${formatMoney(back)} back · ${win ? "+" : ""}${formatMoney(back - stake)} net.`, win ? "yellow" : "pink", {
      cash: state.cash - stake + back,
      xp: state.xp + Math.round((win ? 300 : 120) * arch.xp),
      wins: state.wins + (multi > 2.5 ? 1 : 0),
      stress: Math.min(100, state.stress + (win ? 4 : 14)),
      trades: state.trades + 1,
    });
  };

  const nextMonth = () => {
    if (state.paused) return feedback("RUN PAUSED", "Resume the clock before moving forward.", "pink");
    if (chance) return feedback("DECIDE FIRST", `${chance.title} is still on the table. Take it or pass.`, "pink");
    if (state.month >= 83) return setScreen("end");
    const next = state.month + 1;
    const cost = Math.round((140 + Math.floor(next / 12) * 25) * diff.cost);
    const nextHunger = Math.min(100, state.hunger + Math.round(9 * arch.risk));
    const nextStress = Math.min(100, state.stress + Math.round((Math.abs(change) > 15 ? 12 : 7) * arch.risk));
    const monthEvent = EVENTS[next];
    const title = monthEvent?.title ?? (change >= 0 ? "MONTH SURVIVED" : "DRAWDOWN SURVIVED");
    const detail = monthEvent?.body ?? `${date} closes at ${change >= 0 ? "+" : ""}${change.toFixed(1)}%. Living cost: ${formatMoney(cost)}.`;
    const tone: Log["tone"] = monthEvent?.tone === "danger" ? "pink" : monthEvent?.tone === "boss" ? "yellow" : "cyan";
    const nextState: GameState = { ...state, month: next, cash: state.cash - cost, hunger: nextHunger, stress: nextStress, xp: state.xp + Math.round(120 * arch.xp), streak: change >= 0 ? state.streak + 1 : 0, logs: [{ month: next, title, detail, tone }, ...state.logs].slice(0, 14) };
    setState(nextState);
    setResult({ month: next, title, detail, tone });
    const alive = nextHunger < 100 && nextStress < 100 && valueOf(nextState) > 0;
    if (!alive) return setScreen("end");
    if (Math.random() < 0.6) setChance(CHANCES[Math.floor(Math.random() * CHANCES.length)]!);
  };

  const recover = (kind: "eat" | "calm") => {
    const cost = Math.round((kind === "eat" ? 80 : 120) * diff.cost);
    if (state.cash < cost) return feedback("ACTION BLOCKED", `${kind.toUpperCase()} costs ${formatMoney(cost)}.`, "pink");
    const patch = kind === "eat" ? { cash: state.cash - cost, hunger: Math.max(0, state.hunger - 35), xp: state.xp + 30 } : { cash: state.cash - cost, stress: Math.max(0, state.stress - 35), xp: state.xp + 30 };
    feedback(kind === "eat" ? "FED & READY" : "HEAD CLEARED", `${formatMoney(cost)} spent. ${kind === "eat" ? "Hunger" : "Stress"} dropped by 35.`, "cyan", patch);
  };

  const begin = (config: Config) => {
    localStorage.removeItem(SAVE_KEY);
    setState(freshState(config));
    setResult(null); setChance(null); setCoinIndex(0); setScreen("journey");
  };

  const restore = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "{}");
      setState({ ...freshState(saved.config ?? defaultConfig), ...saved });
    } catch { setState(freshState(defaultConfig)); }
    setResult(null); setChance(null); setScreen("journey");
  };

  if (screen === "start") return <StartScreen resume={resume} onStart={() => setScreen("setup")} onResume={restore} onBoard={() => setScreen("board")} />;
  if (screen === "setup") return <SetupScreen onBack={() => setScreen("start")} onStart={begin} />;
  if (screen === "board") return <BoardScreen onBack={() => setScreen("start")} />;
  if (screen === "end") return <EndScreen state={state} net={net} onRestart={() => setScreen("setup")} onBoard={() => setScreen("board")} />;

  const actions = chance
    ? [{ label: "PASS", run: () => resolveChance(false), variant: "outline" as const }, { label: "DETAILS", run: () => setScreen("portfolio"), variant: "secondary" as const }, { label: chance.actionLabel, run: () => resolveChance(true), variant: "default" as const }]
    : [{ label: "SELL", run: sell, variant: "outline" as const }, { label: result ? "CONTINUE" : "HOLD", run: nextMonth, variant: "secondary" as const }, { label: "BUY 25%", run: buy, variant: "default" as const }];

  return (
    <main className="journey-shell">
      <header className="journey-status">
        <div className="min-w-0">
          <p className="journey-kicker">{date} · MONTH {state.month + 1}/84 · {cfg.difficulty} · {modeOf(cfg.mode).name}{cfg.ironman ? " · IRONMAN" : ""}</p>
          <h1 className="truncate">{formatMoney(net)}</h1>
        </div>
        <div className="journey-head-actions">
          <Button variant="ghost" size="icon" aria-label={state.paused ? "Resume game" : "Pause game"} onClick={() => setState({ ...state, paused: !state.paused })}>{state.paused ? <Play /> : <Pause />}</Button>
          <Button variant="ghost" size="icon" aria-label={state.muted ? "Turn sound on" : "Mute sound"} onClick={() => setState({ ...state, muted: !state.muted })}>{state.muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>
      </header>

      <section className="journey-meters" aria-label="Run status">
        <Meter label={`LVL ${level}`} value={Math.min(100, (state.xp / nextLevel) * 100)} icon={<Trophy />} tone="yellow" detail={`${state.xp} XP`} />
        <Meter label="HUNGER" value={state.hunger} icon={<Activity />} tone={state.hunger > 70 ? "pink" : "cyan"} detail={`${state.hunger}%`} />
        <Meter label="STRESS" value={state.stress} icon={<HeartPulse />} tone={state.stress > 70 ? "pink" : "cyan"} detail={`${state.stress}%`} />
      </section>

      <div className="journey-layout">
        <aside className="boss-panel">
          <img src={mood} alt="The crowned Crypto Final Boss reacting to your run" />
          <div><p className="journey-kicker"><Crown /> THE BOSS SAYS</p><p>{bossLine}</p></div>
        </aside>

        <section className="journey-stage" aria-live="polite">
          {screen === "portfolio" ? <Portfolio state={state} onClose={() => setScreen("journey")} onSelect={(i) => { setCoinIndex(i); setScreen("journey"); }} /> : screen === "survival" ? <Survival state={state} cost={diff.cost} onEat={() => recover("eat")} onCalm={() => recover("calm")} onClose={() => setScreen("journey")} /> : (
            <>
              <div className="card-stack" aria-hidden="true" />
              <article className={`journey-card tone-${chance ? "pink" : result?.tone ?? coin.color}`}>
                <div className="journey-card-top">
                  <button className="coin-step" aria-label="Previous market" onClick={() => { setCoinIndex((coinIndex + COINS.length - 1) % COINS.length); setResult(null); }}><ChevronLeft /></button>
                  <div className={`coin-mark tone-${chance ? "pink" : coin.color}`}>{chance ? <Zap /> : coin.symbol === "BTC" ? "₿" : coin.symbol.slice(0, 1)}</div>
                  <button className="coin-step" aria-label="Next market" onClick={() => { setCoinIndex((coinIndex + 1) % COINS.length); setResult(null); }}><ChevronRight /></button>
                </div>
                <div className="journey-card-copy">
                  <p className="journey-kicker">{chance ? "RISK CARD · DECIDE NOW" : result ? "ACTION RESULT" : event ? "HISTORICAL EVENT" : "MARKET CARD"}</p>
                  <h2>{chance?.title ?? result?.title ?? event?.title ?? `${coin.name} Market`}</h2>
                  <p>{chance?.body ?? result?.detail ?? event?.body ?? `${coin.symbol} is ${change >= 0 ? "up" : "down"} this month. Choose your move, then face the next page of crypto history.`}</p>
                </div>
                <div className="price-orbit">
                  <span>{chance ? formatMoney(Math.max(50, Math.floor(state.cash * chance.stake))) : price ? formatMoney(price) : "NOT LIVE"}</span>
                  <strong className={chance ? "negative" : change >= 0 ? "positive" : "negative"}>{chance ? "AT RISK" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}</strong>
                </div>
                <div className="card-stats">
                  <span><small>CASH</small>{formatMoney(state.cash)}</span>
                  <span><small>OWNED</small>{(state.holdings[coin.symbol] ?? 0).toFixed(4)}</span>
                  <span><small>STREAK</small>{state.streak}M</span>
                </div>
              </article>
              <div className="journey-actions">
                {actions.map((a) => <Button key={a.label} variant={a.variant} onClick={a.run}>{a.label}</Button>)}
              </div>
            </>
          )}
        </section>

        <aside className="journey-trail">
          <div className="trail-title"><History /><span>YOUR JOURNEY</span></div>
          {state.logs.length ? state.logs.slice(0, 5).map((log, i) => <div className={`trail-entry tone-${log.tone}`} key={`${log.month}-${i}`}><span>{MONTHS[log.month % 12]} {2020 + Math.floor(log.month / 12)}</span><strong>{log.title}</strong></div>) : <p className="trail-empty">Your wins, mistakes and close calls will land here.</p>}
        </aside>
      </div>

      <nav className="journey-nav" aria-label="Game actions">
        <Button variant={screen === "portfolio" ? "default" : "ghost"} onClick={() => setScreen(screen === "portfolio" ? "journey" : "portfolio")}><WalletCards />POSITIONS <span>{positions.length}</span></Button>
        <Button variant={screen === "survival" ? "default" : "ghost"} onClick={() => setScreen(screen === "survival" ? "journey" : "survival")}><HeartPulse />SURVIVE</Button>
        <Button onClick={nextMonth}>NEXT MONTH<ChevronRight /></Button>
      </nav>
    </main>
  );
}

function Meter({ label, value, icon, tone, detail }: { label: string; value: number; icon: React.ReactNode; tone: string; detail: string }) {
  return <div className={`journey-meter tone-${tone}`}><span className="meter-icon">{icon}</span><div className="min-w-0"><div className="meter-label"><strong>{label}</strong><span>{detail}</span></div><div className="meter-track"><i style={{ width: `${Math.max(3, Math.min(100, value))}%` }} /></div></div></div>;
}

function StartScreen({ resume, onStart, onResume, onBoard }: { resume: boolean; onStart: () => void; onResume: () => void; onBoard: () => void }) {
  return <main className="journey-start"><img src={crownedBoss.url} alt="The crowned Crypto Final Boss" /><div className="start-vignette" /><section><p className="journey-kicker">REAL CRYPTO HISTORY · ONE LIFE</p><h1>THE CRYPTO<br /><span>FINAL BOSS</span></h1><p>Play every brutal month from 2020 to 2026. Pick your archetype, survive the crashes, and prove you can leave richer than the Boss.</p><div className="start-actions"><Button onClick={onStart}>ENTER THE ARENA <ChevronRight /></Button>{resume && <Button variant="outline" onClick={onResume}>CONTINUE RUN</Button>}<Button variant="outline" onClick={onBoard}><Trophy />LEADERBOARD</Button></div><small>84 MONTHS · NO WALLET · FREE TO PLAY</small></section></main>;
}

function SetupScreen({ onBack, onStart }: { onBack: () => void; onStart: (config: Config) => void }) {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const set = <K extends keyof Config>(key: K, value: Config[K]) => setConfig((c) => ({ ...c, [key]: value }));
  return (
    <main className="journey-setup">
      <header><div><p className="journey-kicker">BUILD YOUR PLAYER</p><h1>CHOOSE YOUR RUN</h1></div><Button variant="ghost" size="icon" aria-label="Back" onClick={onBack}><X /></Button></header>
      <section className="setup-block"><p className="journey-kicker">NAME & AVATAR</p>
        <input className="setup-input" maxLength={18} placeholder="YOUR HANDLE" value={config.name} onChange={(e) => set("name", e.target.value)} aria-label="Player name" />
        <div className="avatar-row">{AVATARS.map((a) => <button key={a.id} className={`avatar-pick ${config.avatar === a.id ? "is-on" : ""}`} aria-label={`Avatar ${a.id}`} onClick={() => set("avatar", a.id)}><img src={a.url} alt={`${a.id} avatar`} /></button>)}</div>
        <div className="chip-row">{COUNTRIES.map((c) => <button key={c} className={`chip ${config.country === c ? "is-on" : ""}`} onClick={() => set("country", c)}>{c}</button>)}</div>
      </section>
      <section className="setup-block"><p className="journey-kicker">ARCHETYPE</p><div className="pick-grid">{ARCHETYPES.map((a) => <button key={a.id} className={`pick-card ${config.arch === a.id ? "is-on" : ""}`} onClick={() => set("arch", a.id)}><strong>{a.name}</strong><em>{formatMoney(a.cash)} START</em><small>{a.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">DIFFICULTY</p><div className="pick-grid">{DIFFICULTIES.map((d) => <button key={d.id} className={`pick-card ${config.difficulty === d.id ? "is-on" : ""}`} onClick={() => set("difficulty", d.id)}><strong>{d.name}</strong><em>COSTS {Math.round(d.cost * 100)}%</em><small>{d.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">MODE</p><div className="pick-grid">{MODES.map((m) => <button key={m.id} className={`pick-card ${config.mode === m.id ? "is-on" : ""}`} onClick={() => set("mode", m.id)}><strong>{m.name}</strong><em>{m.xpLabel}</em><small>{m.blurb}</small></button>)}</div>
        <button className={`iron-toggle ${config.ironman ? "is-on" : ""}`} onClick={() => set("ironman", !config.ironman)}><Flame /><span><strong>IRONMAN</strong><small>No saves, no second chances. Death is final.</small></span></button>
      </section>
      <div className="setup-cta"><Button onClick={() => onStart({ ...config, name: config.name.trim() || "anon" })}><Rocket />START JANUARY 2020</Button></div>
    </main>
  );
}

function BoardScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { loadBoard(25).then(setRows).catch(() => setError(true)); }, []);
  return (
    <main className="journey-setup">
      <header><div><p className="journey-kicker">GLOBAL RANKS</p><h1>LEADERBOARD</h1></div><Button variant="ghost" size="icon" aria-label="Back" onClick={onBack}><X /></Button></header>
      {error ? <p className="trail-empty">The board is unreachable right now. Try again in a moment.</p> : !rows ? <p className="trail-empty">Loading the world's best runs…</p> : rows.length === 0 ? <p className="trail-empty">No runs yet. Yours can be first.</p> : (
        <div className="board-list">{rows.map((r) => <div className="board-row" key={`${r.pos}-${r.name}`}><b>#{r.pos}</b><span><strong>{r.name}</strong><small>{r.arch.toUpperCase()} · {r.country} · {r.mode.toUpperCase()} · {r.months}M</small></span><i>{formatMoney(r.netWorth)}</i></div>)}</div>
      )}
    </main>
  );
}

function Portfolio({ state, onClose, onSelect }: { state: GameState; onClose: () => void; onSelect: (index: number) => void }) {
  const positions = COINS.map((coin, index) => ({ coin, index, qty: state.holdings[coin.symbol] ?? 0 })).filter((i) => i.qty > 0);
  return <section className="journey-sheet"><div className="sheet-head"><div><p className="journey-kicker">POSITION CARDS</p><h2>YOUR STACK</h2></div><Button variant="ghost" size="icon" aria-label="Close positions" onClick={onClose}><X /></Button></div>{positions.length ? <div className="position-list">{positions.map(({ coin, index, qty }) => <button key={coin.symbol} onClick={() => onSelect(index)} className={`position-card tone-${coin.color}`}><span className={`coin-mark tone-${coin.color}`}>{coin.symbol === "BTC" ? "₿" : coin.symbol[0]}</span><span><strong>{coin.symbol}</strong><small>{qty.toFixed(5)} coins</small></span><b>{formatMoney(qty * priceAt(coin.symbol, state.month, state.noise))}</b><ChevronRight /></button>)}</div> : <div className="empty-state"><WalletCards /><h3>NO OPEN POSITIONS</h3><p>Return to the journey and buy your first coin.</p></div>}</section>;
}

function Survival({ state, cost, onEat, onCalm, onClose }: { state: GameState; cost: number; onEat: () => void; onCalm: () => void; onClose: () => void }) {
  return <section className="journey-sheet"><div className="sheet-head"><div><p className="journey-kicker">STAY IN THE GAME</p><h2>SURVIVAL</h2></div><Button variant="ghost" size="icon" aria-label="Close survival" onClick={onClose}><X /></Button></div><div className="survival-choice"><div><Activity /><span><small>HUNGER</small><strong>{state.hunger}%</strong></span></div><p>At 100%, your run ends. Food removes 35 hunger.</p><Button onClick={onEat}>EAT · {formatMoney(Math.round(80 * cost))}</Button></div><div className="survival-choice"><div><HeartPulse /><span><small>STRESS</small><strong>{state.stress}%</strong></span></div><p>At 100%, you break. Calm removes 35 stress.</p><Button onClick={onCalm}>CALM · {formatMoney(Math.round(120 * cost))}</Button></div><div className="shop-note"><ShoppingBag /><span><strong>RISK CARDS PAY THE BILLS</strong><small>Launches, airdrops and leverage arrive as journey cards when they matter.</small></span></div></section>;
}

function EndScreen({ state, net, onRestart, onBoard }: { state: GameState; net: number; onRestart: () => void; onBoard: () => void }) {
  const survived = state.month >= 83 && net > 0;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const rank = rankTitle(net, state.month, survived);
  const send = async () => {
    setStatus("sending");
    try {
      await submitRun({ name: state.config.name || "anon", arch: state.config.arch, country: state.config.country, difficulty: state.config.difficulty, mode: modeId(state.config), net: Math.round(net), xp: Math.round(state.xp), level: levelFor(state.xp), rank, months: state.month, achievements: state.wins, trades: state.trades, survived, avatar: state.config.avatar });
      setStatus("done");
    } catch { setStatus("error"); }
  };
  return <main className={`journey-end ${survived ? "won" : "lost"}`}><img src={survived ? smugBoss.url : enragedBoss.url} alt={survived ? "The Boss respects your completed run" : "The Boss ends your run"} /><section><p className="journey-kicker">{survived ? "THE TIMELINE IS COMPLETE" : "YOUR RUN IS OVER"}</p><h1>{survived ? "YOU SURVIVED" : "REKT."}</h1><p>{rank} · {state.month} months played{state.config.ironman ? " · IRONMAN" : ""}</p><div className="end-score"><span><small>FINAL NET</small><strong>{formatMoney(net)}</strong></span><span><small>LEVEL</small><strong>{levelFor(state.xp)}</strong></span><span><small>TRADES</small><strong>{state.trades}</strong></span></div><div className="start-actions"><Button onClick={send} disabled={status === "sending" || status === "done"}><Trophy />{status === "done" ? "SCORE SUBMITTED" : status === "sending" ? "SENDING…" : "CLAIM YOUR RANK"}</Button><Button variant="outline" onClick={onBoard}>LEADERBOARD</Button><Button variant="secondary" onClick={onRestart}>{survived ? <Crown /> : <Skull />}PLAY AGAIN</Button></div>{status === "error" && <small>The board rejected this run. Your local result still stands.</small>}</section></main>;
}
