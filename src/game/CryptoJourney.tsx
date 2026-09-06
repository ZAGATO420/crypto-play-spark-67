import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, Crown, HeartPulse, History, Pause, Play, ShoppingBag, Skull, Trophy, Volume2, VolumeX, WalletCards, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import crownedBoss from "@/assets/boss/crowned.webp.asset.json";
import enragedBoss from "@/assets/boss/enraged.webp.asset.json";
import smugBoss from "@/assets/boss/smug.webp.asset.json";
import { COINS, EVENTS, MONTHS, XP_LEVELS, formatMoney, levelFor, type CoinSymbol } from "./journey-data";

type Holding = Partial<Record<CoinSymbol, number>>;
type Log = { month: number; title: string; detail: string; tone: "cyan" | "pink" | "yellow" };
type GameState = { month: number; cash: number; holdings: Holding; hunger: number; stress: number; xp: number; streak: number; trades: number; muted: boolean; paused: boolean; logs: Log[] };
type Screen = "start" | "journey" | "portfolio" | "survival" | "end";

const SAVE_KEY = "tcfb_card_journey_v1";
const initialState: GameState = { month: 0, cash: 10000, holdings: {}, hunger: 8, stress: 6, xp: 0, streak: 0, trades: 0, muted: false, paused: false, logs: [] };

const valueOf = (state: GameState) => COINS.reduce((sum, coin) => sum + (state.holdings[coin.symbol] ?? 0) * (coin.prices[Math.min(state.month, 83)] ?? 0), state.cash);
const pct = (current: number, previous: number) => previous ? ((current / previous) - 1) * 100 : 0;

export function CryptoJourney() {
  const [screen, setScreen] = useState<Screen>("start");
  const [state, setState] = useState<GameState>(initialState);
  const [coinIndex, setCoinIndex] = useState(0);
  const [result, setResult] = useState<Log | null>(null);
  const [resume, setResume] = useState(false);
  const coin = COINS[coinIndex] ?? { symbol: "BTC" as CoinSymbol, name: "Bitcoin", color: "yellow" as const, prices: [0] };
  const price = coin.prices[state.month] ?? 0;
  const previous = coin.prices[Math.max(0, state.month - 1)] ?? 0;
  const change = pct(price, previous);
  const level = levelFor(state.xp);
  const nextLevel = XP_LEVELS[Math.min(level, XP_LEVELS.length - 1)] ?? XP_LEVELS.at(-1) ?? 1;
  const net = valueOf(state);
  const event = EVENTS[state.month];
  const date = `${MONTHS[state.month % 12]} ${2020 + Math.floor(state.month / 12)}`;

  useEffect(() => {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) setResume(true);
  }, []);

  useEffect(() => {
    if (screen !== "start") localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [screen, state]);

  const mood = result?.tone === "pink" || state.hunger > 75 || state.stress > 75 ? enragedBoss.url : result?.tone === "yellow" ? smugBoss.url : crownedBoss.url;
  const bossLine = result?.detail ?? event?.body ?? (change > 10 ? "Momentum is loud. Your decision must be louder." : change < -10 ? "Red candles reveal who came without a plan." : "Every month is a card. Play the one in front of you.");
  const positions = useMemo(() => COINS.filter((c) => (state.holdings[c.symbol] ?? 0) > 0), [state.holdings]);

  const feedback = (title: string, detail: string, tone: Log["tone"], patch: Partial<GameState> = {}) => {
    const entry = { month: state.month, title, detail, tone };
    setResult(entry);
    setState((current) => ({ ...current, ...patch, logs: [entry, ...current.logs].slice(0, 12) }));
  };

  const buy = () => {
    if (!price) return feedback("NOT LAUNCHED", `${coin.name} is not tradable yet.`, "pink");
    const spend = Math.floor(state.cash * .25);
    if (spend < 25) return feedback("BUY BLOCKED", `You need at least $25 cash.`, "pink");
    const qty = spend / price;
    feedback("POSITION OPENED", `${formatMoney(spend)} moved into ${coin.symbol}.`, "cyan", { cash: state.cash - spend, holdings: { ...state.holdings, [coin.symbol]: (state.holdings[coin.symbol] ?? 0) + qty }, xp: state.xp + 90, trades: state.trades + 1 });
  };

  const sell = () => {
    const qty = state.holdings[coin.symbol] ?? 0;
    if (!qty) return feedback("NOTHING TO SELL", `You do not own ${coin.symbol} yet.`, "pink");
    const proceeds = qty * price;
    feedback("POSITION CLOSED", `${coin.symbol} returned ${formatMoney(proceeds)} to cash.`, proceeds >= 2500 ? "yellow" : "cyan", { cash: state.cash + proceeds, holdings: { ...state.holdings, [coin.symbol]: 0 }, xp: state.xp + 70, trades: state.trades + 1 });
  };

  const nextMonth = () => {
    if (state.paused) return feedback("RUN PAUSED", "Resume the clock before moving forward.", "pink");
    if (state.month >= 83) return setScreen("end");
    const next = state.month + 1;
    const cost = 140 + Math.floor(next / 12) * 25;
    const nextHunger = Math.min(100, state.hunger + 9);
    const nextStress = Math.min(100, state.stress + (Math.abs(change) > 15 ? 12 : 7));
    const alive = nextHunger < 100 && nextStress < 100 && net > 0;
    const monthEvent = EVENTS[next];
    const title = monthEvent?.title ?? (change >= 0 ? "MONTH SURVIVED" : "DRAWDOWN SURVIVED");
    const detail = monthEvent?.body ?? `${date} closes at ${change >= 0 ? "+" : ""}${change.toFixed(1)}%. Living cost: ${formatMoney(cost)}.`;
    const tone: Log["tone"] = monthEvent?.tone === "danger" ? "pink" : monthEvent?.tone === "boss" ? "yellow" : "cyan";
    setState((current) => ({ ...current, month: next, cash: current.cash - cost, hunger: nextHunger, stress: nextStress, xp: current.xp + 120, streak: change >= 0 ? current.streak + 1 : 0, logs: [{ month: next, title, detail, tone }, ...current.logs].slice(0, 12) }));
    setResult({ month: next, title, detail, tone });
    if (!alive) setScreen("end");
  };

  const recover = (kind: "eat" | "calm") => {
    const cost = kind === "eat" ? 80 : 120;
    if (state.cash < cost) return feedback("ACTION BLOCKED", `${kind.toUpperCase()} costs ${formatMoney(cost)}.`, "pink");
    const patch = kind === "eat" ? { cash: state.cash - cost, hunger: Math.max(0, state.hunger - 35), xp: state.xp + 30 } : { cash: state.cash - cost, stress: Math.max(0, state.stress - 35), xp: state.xp + 30 };
    feedback(kind === "eat" ? "FED & READY" : "HEAD CLEARED", `${formatMoney(cost)} spent. ${kind === "eat" ? "Hunger" : "Stress"} dropped by 35.`, "cyan", patch);
  };

  const start = (restore = false) => {
    if (restore) {
      try { setState({ ...initialState, ...JSON.parse(localStorage.getItem(SAVE_KEY) ?? "{}") }); } catch { setState(initialState); }
    } else {
      localStorage.removeItem(SAVE_KEY);
      setState(initialState);
    }
    setResult(null);
    setScreen("journey");
  };

  if (screen === "start") return <StartScreen resume={resume} onStart={() => start()} onResume={() => start(true)} />;
  if (screen === "end") return <EndScreen state={state} net={net} onRestart={() => start()} />;

  return (
    <main className="journey-shell">
      <header className="journey-status">
        <div className="min-w-0">
          <p className="journey-kicker">{date} · MONTH {state.month + 1}/84</p>
          <h1 className="truncate">{formatMoney(net)}</h1>
        </div>
        <div className="journey-head-actions">
          <Button variant="ghost" size="icon" aria-label={state.paused ? "Resume game" : "Pause game"} title={state.paused ? "Resume" : "Pause"} onClick={() => setState({ ...state, paused: !state.paused })}>{state.paused ? <Play /> : <Pause />}</Button>
          <Button variant="ghost" size="icon" aria-label={state.muted ? "Turn sound on" : "Mute sound"} title="Sound" onClick={() => setState({ ...state, muted: !state.muted })}>{state.muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>
      </header>

      <section className="journey-meters" aria-label="Run status">
        <Meter label={`LVL ${level}`} value={Math.min(100, state.xp / nextLevel * 100)} icon={<Trophy />} tone="yellow" detail={`${state.xp} XP`} />
        <Meter label="HUNGER" value={state.hunger} icon={<Activity />} tone={state.hunger > 70 ? "pink" : "cyan"} detail={`${state.hunger}%`} />
        <Meter label="STRESS" value={state.stress} icon={<HeartPulse />} tone={state.stress > 70 ? "pink" : "cyan"} detail={`${state.stress}%`} />
      </section>

      <div className="journey-layout">
        <aside className="boss-panel">
          <img src={mood} alt="The crowned Crypto Final Boss reacting to your run" />
          <div><p className="journey-kicker"><Crown /> THE BOSS SAYS</p><p>{bossLine}</p></div>
        </aside>

        <section className="journey-stage" aria-live="polite">
          {screen === "portfolio" ? <Portfolio state={state} onClose={() => setScreen("journey")} onSelect={(index) => { setCoinIndex(index); setScreen("journey"); }} /> : screen === "survival" ? <Survival state={state} onEat={() => recover("eat")} onCalm={() => recover("calm")} onClose={() => setScreen("journey")} /> : (
            <>
              <div className="card-stack" aria-hidden="true" />
              <article className={`journey-card tone-${result?.tone ?? coin.color}`}>
                <div className="journey-card-top">
                  <button className="coin-step" aria-label="Previous market" onClick={() => { setCoinIndex((coinIndex + COINS.length - 1) % COINS.length); setResult(null); }}><ChevronLeft /></button>
                  <div className={`coin-mark tone-${coin.color}`}>{coin.symbol === "BTC" ? "₿" : coin.symbol.slice(0, 1)}</div>
                  <button className="coin-step" aria-label="Next market" onClick={() => { setCoinIndex((coinIndex + 1) % COINS.length); setResult(null); }}><ChevronRight /></button>
                </div>
                <div className="journey-card-copy">
                  <p className="journey-kicker">{result ? "ACTION RESULT" : event ? "HISTORICAL EVENT" : "MARKET CARD"}</p>
                  <h2>{result?.title ?? event?.title ?? `${coin.name} Journey`}</h2>
                  <p>{result?.detail ?? event?.body ?? `${coin.symbol} is ${change >= 0 ? "up" : "down"} this month. Choose your move, then face the next page of crypto history.`}</p>
                </div>
                <div className="price-orbit">
                  <span>{price ? formatMoney(price) : "NOT LIVE"}</span>
                  <strong className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(1)}%</strong>
                </div>
                <div className="card-stats">
                  <span><small>CASH</small>{formatMoney(state.cash)}</span>
                  <span><small>OWNED</small>{(state.holdings[coin.symbol] ?? 0).toFixed(4)}</span>
                  <span><small>STREAK</small>{state.streak}M</span>
                </div>
              </article>
              <div className="journey-actions">
                <Button variant="outline" onClick={sell}>SELL</Button>
                <Button variant="secondary" onClick={nextMonth}>{result ? "CONTINUE" : "HOLD"}</Button>
                <Button onClick={buy}>BUY 25%</Button>
              </div>
            </>
          )}
        </section>

        <aside className="journey-trail">
          <div className="trail-title"><History /><span>YOUR JOURNEY</span></div>
          {state.logs.length ? state.logs.slice(0, 5).map((log, index) => <div className={`trail-entry tone-${log.tone}`} key={`${log.month}-${index}`}><span>{MONTHS[log.month % 12]} {2020 + Math.floor(log.month / 12)}</span><strong>{log.title}</strong></div>) : <p className="trail-empty">Your wins, mistakes and close calls will land here.</p>}
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

function StartScreen({ resume, onStart, onResume }: { resume: boolean; onStart: () => void; onResume: () => void }) {
  return <main className="journey-start"><img src={crownedBoss.url} alt="The crowned Crypto Final Boss" /><div className="start-vignette" /><section><p className="journey-kicker">REAL CRYPTO HISTORY · ONE LIFE</p><h1>THE CRYPTO<br/><span>FINAL BOSS</span></h1><p>Play every brutal month from 2020 to 2026. Build your stack, survive the crashes, and prove you can leave richer than the Boss.</p><div className="start-actions"><Button onClick={onStart}>START WITH $10K <ChevronRight /></Button>{resume && <Button variant="outline" onClick={onResume}>CONTINUE RUN</Button>}</div><small>84 MONTHS · NO WALLET · FREE TO PLAY</small></section></main>;
}

function Portfolio({ state, onClose, onSelect }: { state: GameState; onClose: () => void; onSelect: (index: number) => void }) {
  const positions = COINS.map((coin, index) => ({ coin, index, qty: state.holdings[coin.symbol] ?? 0 })).filter((item) => item.qty > 0);
  return <section className="journey-sheet"><div className="sheet-head"><div><p className="journey-kicker">POSITION CARDS</p><h2>YOUR STACK</h2></div><Button variant="ghost" size="icon" aria-label="Close positions" onClick={onClose}><X /></Button></div>{positions.length ? <div className="position-list">{positions.map(({ coin, index, qty }) => <button key={coin.symbol} onClick={() => onSelect(index)} className={`position-card tone-${coin.color}`}><span className={`coin-mark tone-${coin.color}`}>{coin.symbol === "BTC" ? "₿" : coin.symbol[0]}</span><span><strong>{coin.symbol}</strong><small>{qty.toFixed(5)} coins</small></span><b>{formatMoney(qty * (coin.prices[state.month] ?? 0))}</b><ChevronRight /></button>)}</div> : <div className="empty-state"><WalletCards /><h3>NO OPEN POSITIONS</h3><p>Return to the journey and buy your first coin.</p></div>}</section>;
}

function Survival({ state, onEat, onCalm, onClose }: { state: GameState; onEat: () => void; onCalm: () => void; onClose: () => void }) {
  return <section className="journey-sheet"><div className="sheet-head"><div><p className="journey-kicker">STAY IN THE GAME</p><h2>SURVIVAL</h2></div><Button variant="ghost" size="icon" aria-label="Close survival" onClick={onClose}><X /></Button></div><div className="survival-choice"><div><Activity /><span><small>HUNGER</small><strong>{state.hunger}%</strong></span></div><p>At 100%, your run ends. Food removes 35 hunger.</p><Button onClick={onEat}>EAT · $80</Button></div><div className="survival-choice"><div><HeartPulse /><span><small>STRESS</small><strong>{state.stress}%</strong></span></div><p>At 100%, you break. Calm removes 35 stress.</p><Button onClick={onCalm}>CALM · $120</Button></div><div className="shop-note"><ShoppingBag /><span><strong>SHOP DROPS ARE NOW CONTEXTUAL</strong><small>Gear and opportunities arrive as journey cards when they matter.</small></span></div></section>;
}

function EndScreen({ state, net, onRestart }: { state: GameState; net: number; onRestart: () => void }) {
  const won = state.month >= 83 && net > 0;
  return <main className={`journey-end ${won ? "won" : "lost"}`}><img src={won ? smugBoss.url : enragedBoss.url} alt={won ? "The Boss respects your completed run" : "The Boss ends your run"}/><section><p className="journey-kicker">{won ? "THE TIMELINE IS COMPLETE" : "YOUR RUN IS OVER"}</p><h1>{won ? "YOU SURVIVED" : "REKT."}</h1><p>{won ? "You crossed 84 months of crypto history." : "The market always collects its debt. Run it back smarter."}</p><div className="end-score"><span><small>FINAL NET</small><strong>{formatMoney(net)}</strong></span><span><small>LEVEL</small><strong>{levelFor(state.xp)}</strong></span><span><small>TRADES</small><strong>{state.trades}</strong></span></div><Button onClick={onRestart}>{won ? <Crown /> : <Skull />}PLAY AGAIN</Button></section></main>;
}