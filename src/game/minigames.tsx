import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fuel, Gift, KeyRound, MousePointerClick, Search, Shield, Target, Waves } from "lucide-react";
import { playSfx } from "./audio";

/**
 * Tiny skill moments. Every one returns a quality between 0 and 1 so the
 * caller can scale a fill price, a rescue or a loss with it. One finger,
 * 3-5 seconds, no layout of its own.
 */
export type MiniKind = "timing" | "panic" | "gas" | "seed" | "orderbook" | "rugcheck" | "whale" | "airdrop" | "hodl";
export type MiniResult = { quality: number; label: string };

const SEED_WORDS = ["throne", "candle", "gorilla", "liquid", "diamond", "vault", "sniper", "ledger"];

export type MiniOutcome = { money?: number; note: string };

/**
 * Wraps every minigame: the game itself reports a result, then a big result card
 * shows the verdict, the money effect and a CONTINUE button. The caller's
 * onResult only fires on CONTINUE, with the exact same result — no logic change.
 */
const buzz = (p: number | number[]) => { try { navigator.vibrate?.(p); } catch { /* unsupported */ } };

export function Minigame({ kind, hard, roll = Math.random(), onResult, describe }: { kind: MiniKind; hard: boolean; roll?: number; onResult: (r: MiniResult) => void; describe?: (q: number) => MiniOutcome }) {
  const [res, setRes] = useState<MiniResult | null>(null);
  const sent = useRef(false);
  const report = useCallback((r: MiniResult) => setRes((cur) => cur ?? r), []);
  // the moment the result lands: sound + vibration, before the card shows
  useEffect(() => {
    if (!res) return;
    if (res.quality >= 0.9) { playSfx("win"); buzz([40, 60, 40, 60, 120]); }
    else if (res.quality >= 0.6) { playSfx("win"); buzz([50, 50, 80]); }
    else if (res.quality >= 0.4) { playSfx("hit"); buzz(160); }
    else { playSfx("crash"); buzz([220, 80, 220]); }
  }, [res]);
  if (res) {
    const out = describe?.(res.quality);
    const tier = res.quality >= 0.9 ? "PERFECT" : res.quality >= 0.6 ? "CLEAN HIT" : res.quality >= 0.4 ? "SLIPPED" : "REKT";
    const good = res.quality >= 0.6;
    const go = () => { if (sent.current) return; sent.current = true; playSfx("click"); onResult(res); };
    return (
      <div className={`mg-result ${good ? "is-win" : "is-loss"} ${res.quality >= 0.9 ? "is-perfect" : ""}`}>
        <p className="mg-result-tier">{tier}</p>
        <h2 className="mg-result-label">{res.label}</h2>
        {out?.money !== undefined && out.money !== 0 && (
          <p className="mg-result-money">{out.money > 0 ? "+" : "−"}${Math.abs(Math.round(out.money)).toLocaleString("en-US")}</p>
        )}
        <div className="mg-result-meter"><i style={{ width: `${Math.round(res.quality * 100)}%` }} /></div>
        <p className="mg-result-score">SKILL {Math.round(res.quality * 100)}%</p>
        {out?.note && <p className="mg-result-note">{out.note}</p>}
        <Button className="cy-wide cy-primary" onClick={go} autoFocus>CONTINUE</Button>
      </div>
    );
  }
  if (kind === "timing") return <TimingBar hard={hard} onResult={report} />;
  if (kind === "panic") return <PanicTap hard={hard} onResult={report} />;
  if (kind === "gas") return <GasWar hard={hard} roll={roll} onResult={report} />;
  if (kind === "orderbook") return <OrderBook hard={hard} roll={roll} onResult={report} />;
  if (kind === "rugcheck") return <RugCheck roll={roll} onResult={report} />;
  if (kind === "whale") return <CandleCatch hard={hard} roll={roll} onResult={report} />;
  if (kind === "airdrop") return <AirdropClaim hard={hard} roll={roll} onResult={report} />;
  if (kind === "hodl") return <HoldTheLine hard={hard} roll={roll} onResult={report} />;
  return <SeedCheck roll={roll} onResult={report} />;
}


/* ------------------------------------------------------------- timing bar */

function TimingBar({ hard, onResult }: { hard: boolean; onResult: (r: MiniResult) => void }) {
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState<MiniResult | null>(null);
  const raf = useRef(0);
  const dir = useRef(1);
  const zone = hard ? 11 : 18;
  const speed = hard ? 0.075 : 0.052;

  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      setPos((p) => {
        let next = p + dir.current * speed * dt;
        if (next >= 100) { next = 100; dir.current = -1; }
        if (next <= 0) { next = 0; dir.current = 1; }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [speed]);

  const hit = () => {
    cancelAnimationFrame(raf.current);
    const off = Math.abs(pos - 50);
    const res: MiniResult = off <= zone / 3
      ? { quality: 1, label: "PERFECT FILL" }
      : off <= zone
        ? { quality: 0.65, label: "GOOD FILL" }
        : { quality: 0.15, label: "SLIPPAGE" };
    setDone(res);
    window.setTimeout(() => onResult(res), 850);
  };

  return (
    <>
      <p className="journey-kicker"><Target /> EXIT TIMING</p>
      <h2>HIT THE GREEN</h2>
      <p className="cy-lead">Order books are thin. Land inside the zone for a clean fill, miss it and the market takes its cut.</p>
      <div className="mg-bar" onClick={done ? undefined : hit}>
        <i className="mg-zone" style={{ left: `${50 - zone}%`, width: `${zone * 2}%` }} />
        <i className="mg-core" style={{ left: `${50 - zone / 3}%`, width: `${(zone / 3) * 2}%` }} />
        <i className="mg-needle" style={{ left: `${pos}%` }} />
      </div>
      {done ? <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>
        : <Button className="cy-wide cy-primary" onClick={hit}>FILL NOW</Button>}
    </>
  );
}

/* --------------------------------------------------------------- panic tap */

function PanicTap({ hard, onResult }: { hard: boolean; onResult: (r: MiniResult) => void }) {
  const target = hard ? 22 : 15;
  const [taps, setTaps] = useState(0);
  const [left, setLeft] = useState(4000);
  const [done, setDone] = useState<MiniResult | null>(null);

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 100)), 100);
    return () => window.clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (done || left > 0) return;
    const q = Math.min(1, taps / target);
    const res: MiniResult = q >= 1 ? { quality: 1, label: "YOU GOT OUT" } : q >= 0.6 ? { quality: 0.6, label: "PARTIAL ESCAPE" } : { quality: 0.1, label: "TOO SLOW" };
    setDone(res);
    window.setTimeout(() => onResult(res), 900);
  }, [left, done, taps, target, onResult]);

  return (
    <>
      <p className="journey-kicker"><MousePointerClick /> PANIC EXIT</p>
      <h2>SELL BEFORE IT'S GONE</h2>
      <p className="cy-lead">The book is emptying. Tap fast to push your orders through before the bid disappears.</p>
      <div className="mg-timer"><i style={{ width: `${(left / 4000) * 100}%` }} /></div>
      <button className="mg-tap" disabled={!!done} onClick={() => setTaps((t) => t + 1)}>
        <strong>{taps}</strong><small>/ {target} ORDERS</small>
      </button>
      {done && <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>}
    </>
  );
}

/* ----------------------------------------------------------------- gas war */

function GasWar({ hard, roll, onResult }: { hard: boolean; roll: number; onResult: (r: MiniResult) => void }) {
  // Your gas bid sweeps on its own, the bots keep raising their bid band,
  // and the next block closes in seconds. Fire when you sit inside the bots.
  const total = hard ? 4200 : 5200;
  const w = hard ? 12 : 17;
  const [gas, setGas] = useState(5);
  const [lo, setLo] = useState(18 + roll * 22);
  const [left, setLeft] = useState(total);
  const [done, setDone] = useState<MiniResult | null>(null);
  const dir = useRef(1);
  const ref = useRef({ gas: 5, lo: 18 + roll * 22 });

  useEffect(() => {
    if (done) return;
    const speed = hard ? 3.1 : 2.3;
    const climb = hard ? 0.32 : 0.22;
    const id = window.setInterval(() => {
      let g = ref.current.gas + dir.current * speed;
      if (g >= 99) { g = 99; dir.current = -1; }
      if (g <= 1) { g = 1; dir.current = 1; }
      const l = Math.min(100 - w, ref.current.lo + climb);
      ref.current = { gas: g, lo: l };
      setGas(g); setLo(l);
      setLeft((x) => Math.max(0, x - 40));
    }, 40);
    return () => window.clearInterval(id);
  }, [done, hard, w]);

  useEffect(() => {
    if (done || left > 0) return;
    setDone({ quality: 0.05, label: "BLOCK CLOSED | BOTS GOT IT" });
  }, [left, done]);
  useEffect(() => { if (done) onResult(done); }, [done, onResult]);

  const send = () => {
    if (done) return;
    const { gas: g, lo: l } = ref.current;
    setDone(g < l
      ? { quality: 0.05, label: "TOO CHEAP | MISSED THE MINT" }
      : g > l + w
        ? { quality: 0.45, label: "OVERPAID FOR GAS" }
        : { quality: 1, label: "FIRST BLOCK" });
  };
  const inZone = gas >= lo && gas <= lo + w;
  const botGwei = Math.round(lo + w / 2);

  return (
    <>
      <p className="journey-kicker"><Fuel /> GAS WAR</p>
      <h2>OUTBID THE BOTS</h2>
      <p className="cy-lead">The bots keep raising their bid (<strong>yellow</strong>). Your gas swings on its own — hit <strong>SEND</strong> while it's inside the bots, before the block closes.</p>
      <div className="mg-timer"><i style={{ width: `${(left / total) * 100}%` }} /></div>
      <p className="cy-lead"><strong>NEXT BLOCK {(left / 1000).toFixed(1)}s</strong> | BOTS ~{botGwei} GWEI</p>
      <div className="mg-depth" onClick={send}><i style={{ left: `${lo}%`, width: `${w}%` }} /><b style={{ left: `${gas}%` }} /></div>
      <p className={`cy-delta ${inZone ? "positive" : "negative"}`}>YOU {Math.round(gas)} GWEI {inZone ? "| IN THE BLOCK" : gas < lo ? "| TOO LOW" : "| TOO HIGH"}</p>
      {!done && <Button className="cy-wide cy-primary" onClick={send}>SEND TRANSACTION NOW</Button>}
    </>
  );
}

/* --------------------------------------------------------------- seed check */

function SeedCheck({ roll, onResult }: { roll: number; onResult: (r: MiniResult) => void }) {
  // deterministic shuffle so a tournament season shows every player the same words
  const rand = useRef(((s: number) => () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  })(Math.floor(roll * 4294967296)));
  const shuffle = (list: string[]) => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rand.current() * (i + 1));
      [out[i], out[j]] = [out[j]!, out[i]!];
    }
    return out;
  };
  const order = useRef(shuffle(SEED_WORDS).slice(0, 4));
  const shuffled = useRef(shuffle(order.current));

  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [show, setShow] = useState(true);
  const [done, setDone] = useState<MiniResult | null>(null);

  useEffect(() => { const t = window.setTimeout(() => setShow(false), 3200); return () => window.clearTimeout(t); }, []);

  const pick = (word: string) => {
    if (word === order.current[step]) {
      const next = step + 1;
      setStep(next);
      if (next >= order.current.length) {
        const res: MiniResult = wrong === 0 ? { quality: 1, label: "SEED RECOVERED" } : { quality: 0.6, label: "RECOVERED, BARELY" };
        setDone(res);
        window.setTimeout(() => onResult(res), 850);
      }
    } else {
      const w = wrong + 1;
      setWrong(w);
      if (w >= 3) {
        const res: MiniResult = { quality: 0.1, label: "SEED LOST" };
        setDone(res);
        window.setTimeout(() => onResult(res), 850);
      }
    }
  };

  return (
    <>
      <p className="journey-kicker"><KeyRound /> SEED PHRASE</p>
      <h2>{show ? "MEMORISE THIS" : "TAP THEM IN ORDER"}</h2>
      <p className="cy-lead">{show ? "Four words, three seconds. Your cold storage depends on it." : `Word ${Math.min(step + 1, 4)} of 4 | ${3 - wrong} tries left`}</p>
      <div className="mg-seed">
        {(show ? order.current : shuffled.current).map((w, i) => (
          <button key={w} disabled={show || !!done} onClick={() => pick(w)}>{show ? `${i + 1}. ${w}` : w}</button>
        ))}
      </div>
      {done && <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>}
    </>
  );
}


function OrderBook({ hard, roll, onResult }: { hard: boolean; roll: number; onResult: (r: MiniResult) => void }) {
  const target = Math.round(24 + roll * 52);
  const width = hard ? 8 : 13;
  // the bid line sweeps across the book on its own; tap to stop it in the pocket
  const [bid, setBid] = useState(4);
  const [done, setDone] = useState<MiniResult | null>(null);
  const dir = useRef(1);
  useEffect(() => {
    if (done) return;
    const speed = hard ? 2.6 : 1.8;
    const id = window.setInterval(() => setBid((b) => {
      let n = b + dir.current * speed;
      if (n >= 98) { n = 98; dir.current = -1; }
      if (n <= 2) { n = 2; dir.current = 1; }
      return n;
    }), 30);
    return () => window.clearInterval(id);
  }, [done, hard]);
  const place = () => {
    if (done) return;
    const off = Math.abs(bid - target);
    const result = off <= width / 3 ? { quality: 1, label: "MAKER FILL" } : off <= width ? { quality: .65, label: "PARTIAL FILL" } : { quality: .15, label: "MISSED LIQUIDITY" };
    setDone(result);
    window.setTimeout(() => onResult(result), 750);
  };
  return <><p className="journey-kicker"><Target /> ORDER BOOK</p><h2>PLACE THE BID</h2><p className="cy-lead">Your bid line sweeps across the book. Tap when it sits in the <strong>yellow liquidity pocket</strong> — dead centre is a full maker fill.</p><div className="mg-depth" onClick={place}><i style={{ left: `${target - width}%`, width: `${width * 2}%` }} /><b style={{ left: `${bid}%` }} /></div>{done ? <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p> : <Button className="cy-wide cy-primary" onClick={place}>PLACE ORDER NOW</Button>}</>;
}

function RugCheck({ roll, onResult }: { roll: number; onResult: (r: MiniResult) => void }) {
  // exactly one red flag on the board; the other lines are genuinely safe
  const bad = roll < .5 ? 1 : 3;
  const clues = bad === 1
    ? ["Liquidity locked 12 months", "Owner can mint new tokens", "Audited contract", "Team doxxed on X"]
    : ["Liquidity locked 12 months", "Mint function renounced", "Audited contract", "Deployer can pull liquidity"];
  const [picked, setPicked] = useState<number | null>(null);
  const pick = (index: number) => {
    if (picked !== null) return;
    const result = index === bad ? { quality: 1, label: "RUG FLAGGED" } : { quality: .15, label: "YOU MISSED THE BACKDOOR" };
    setPicked(index);
    window.setTimeout(() => onResult(result), 900);
  };
  return <><p className="journey-kicker"><Search /> RUG CHECK</p><h2>FIND THE RED FLAG</h2><p className="cy-lead">Three lines are safe. <strong>One lets the dev drain the pool.</strong> Tap the dangerous one.</p><div className="mg-rug">{clues.map((clue, index) => <Button key={clue} variant="outline" disabled={picked !== null} className={picked === null ? "" : index === bad ? "is-bad" : index === picked ? "is-wrong" : ""} onClick={() => pick(index)}>{clue}</Button>)}</div></>;
}

/* ------------------------------------------------------- candle catch (whale) */

/**
 * Green candles print, red candles dump. Tap the green ones, leave the red ones
 * alone. Animated, thumb-sized, over in five seconds.
 */
type Drop = { id: number; x: number; y: number; green: boolean; hit: boolean };
function CandleCatch({ hard, roll, onResult }: { hard: boolean; roll: number; onResult: (r: MiniResult) => void }) {
  const need = hard ? 7 : 5;
  const [drops, setDrops] = useState<Drop[]>([]);
  const [caught, setCaught] = useState(0);
  const [missed, setMissed] = useState(0);
  const [left, setLeft] = useState(5200);
  const [done, setDone] = useState<MiniResult | null>(null);
  const seed = useRef(Math.floor(roll * 1e6) + 7);
  const next = () => { seed.current = (seed.current * 1103515245 + 12345) % 2147483648; return seed.current / 2147483648; };
  const id = useRef(1);

  useEffect(() => {
    if (done) return;
    const spawn = window.setInterval(() => {
      setDrops((list) => [...list, { id: id.current++, x: 6 + next() * 84, y: -12, green: next() > (hard ? 0.45 : 0.35), hit: false }].slice(-14));
    }, hard ? 340 : 420);
    const move = window.setInterval(() => {
      setDrops((list) => list.map((d) => ({ ...d, y: d.y + (hard ? 7 : 5.5) })).filter((d) => d.y < 108));
    }, 60);
    const clock = window.setInterval(() => setLeft((l) => Math.max(0, l - 100)), 100);
    return () => { window.clearInterval(spawn); window.clearInterval(move); window.clearInterval(clock); };
  }, [done, hard]);

  useEffect(() => {
    if (done || left > 0) return;
    const q = Math.max(0, Math.min(1, (caught - missed * 0.5) / need));
    const res: MiniResult = q >= 0.95 ? { quality: 1, label: "EVERY GREEN CANDLE" } : q >= 0.6 ? { quality: 0.65, label: "GOOD HANDS" } : { quality: 0.15, label: "YOU CHASED RED" };
    setDone(res);
    window.setTimeout(() => onResult(res), 800);
  }, [left, done, caught, missed, need, onResult]);

  const tap = (d: Drop) => {
    if (done || d.hit) return;
    setDrops((list) => list.map((x) => (x.id === d.id ? { ...x, hit: true } : x)));
    if (d.green) setCaught((c) => c + 1);
    else setMissed((m) => m + 1);
  };

  return (
    <>
      <p className="journey-kicker"><Waves /> WHALE WAVE</p>
      <h2>CATCH THE GREEN</h2>
      <p className="cy-lead">Green candles are the whale buying. Red ones are the dump. Tap green, never red — {need} green wins it.</p>
      <div className="mg-timer"><i style={{ width: `${(left / 5200) * 100}%` }} /></div>
      <div className="mg-field" aria-label="Falling candles">
        {drops.map((d) => (
          <button key={d.id} type="button" className={`mg-candle ${d.green ? "is-green" : "is-red"}${d.hit ? " is-hit" : ""}`}
            style={{ left: `${d.x}%`, top: `${d.y}%` }} onPointerDown={() => tap(d)} aria-label={d.green ? "Green candle" : "Red candle"} />
        ))}
        <span className="mg-field-score"><strong>{caught}</strong>/{need} GREEN | {missed} RED HIT</span>
      </div>
      {done && <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>}
    </>
  );
}

/* ---------------------------------------------------------- airdrop claim */

/** Three claim buttons drift across the screen. Only one is the real contract. */
function AirdropClaim({ hard, roll, onResult }: { hard: boolean; roll: number; onResult: (r: MiniResult) => void }) {
  // The genuine link is always the tcfb.app one; only its slot rotates.
  const real = Math.floor(roll * 3) % 3;
  const labels = useMemo(() => {
    const fakes = ["claim-tcfb.app.xyz", "tcfb-app.claim.io"];
    const out = [...fakes];
    out.splice(real, 0, "claim.tcfb.app");
    return out;
  }, [real]);

  const [t, setT] = useState(0);
  const [left, setLeft] = useState(hard ? 4200 : 5600);
  const [done, setDone] = useState<MiniResult | null>(null);

  useEffect(() => {
    if (done) return;
    const move = window.setInterval(() => setT((v) => v + 0.05), 50);
    const clock = window.setInterval(() => setLeft((l) => Math.max(0, l - 100)), 100);
    return () => { window.clearInterval(move); window.clearInterval(clock); };
  }, [done]);

  useEffect(() => {
    if (done || left > 0) return;
    const res: MiniResult = { quality: 0.1, label: "CLAIM WINDOW CLOSED" };
    setDone(res);
    window.setTimeout(() => onResult(res), 800);
  }, [left, done, onResult]);

  const pick = (index: number) => {
    if (done) return;
    const res: MiniResult = index === real
      ? { quality: 1, label: "AIRDROP CLAIMED" }
      : { quality: 0.15, label: "PHISHING SITE | WALLET DRAINED" };
    setDone(res);
    window.setTimeout(() => onResult(res), 850);
  };

  return (
    <>
      <p className="journey-kicker"><Gift /> AIRDROP WINDOW</p>
      <h2>CLAIM THE REAL ONE</h2>
      <p className="cy-lead">Official post from @TCFB: <strong>claim.tcfb.app</strong>. Two look-alike links drain your wallet. Tap the exact official one before the window shuts.</p>
      <div className="mg-timer"><i style={{ width: `${(left / (hard ? 4200 : 5600)) * 100}%` }} /></div>
      <div className="mg-drift">
        {labels.map((label, index) => (
          <button key={label} type="button" className={`mg-drift-btn${done && index === real ? " is-real" : done ? " is-fake" : ""}`} disabled={!!done}
            style={{ transform: `translateX(${Math.sin(t + index * 1.7) * (hard ? 26 : 16)}px)` }} onClick={() => pick(index)}>
            {label}
          </button>
        ))}
      </div>
      {done && <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>}
    </>
  );
}

/* ---------------------------------------------------------- hold the line */

/** Hold to defend your margin: keep the shield inside the moving danger band. */
function HoldTheLine({ hard, roll, onResult }: { hard: boolean; roll: number; onResult: (r: MiniResult) => void }) {
  const [pos, setPos] = useState(50);
  const [band, setBand] = useState(50);
  const [held, setHeld] = useState(0);
  const [left, setLeft] = useState(5000);
  const [done, setDone] = useState<MiniResult | null>(null);
  const holding = useRef(false);
  const width = hard ? 13 : 19;
  const need = hard ? 2600 : 2200;

  useEffect(() => {
    if (done) return;
    let t = roll * 6;
    const loop = window.setInterval(() => {
      t += hard ? 0.08 : 0.055;
      setBand(50 + Math.sin(t) * 32 + Math.sin(t * 2.3) * 9);
      setPos((p) => Math.max(0, Math.min(100, p + (holding.current ? 2.4 : -2.4))));
      setLeft((l) => Math.max(0, l - 50));
    }, 50);
    return () => window.clearInterval(loop);
  }, [done, hard, roll]);

  useEffect(() => {
    if (done) return;
    if (Math.abs(pos - band) <= width) setHeld((h) => h + 50);
  }, [pos, band, width, done]);

  useEffect(() => {
    if (done || left > 0) return;
    const q = Math.min(1, held / need);
    const res: MiniResult = q >= 0.95 ? { quality: 1, label: "MARGIN HELD" } : q >= 0.55 ? { quality: 0.6, label: "SHAKEN, NOT LIQUIDATED" } : { quality: 0.1, label: "MARGIN CALL" };
    setDone(res);
    window.setTimeout(() => onResult(res), 850);
  }, [left, done, held, need, onResult]);

  const inZone = Math.abs(pos - band) <= width;
  return (
    <>
      <p className="journey-kicker"><Shield /> MARGIN DEFENCE</p>
      <h2>HOLD THE LINE</h2>
      <p className="cy-lead">Press and hold to push your shield up, release to let it fall. Keep it inside the moving band to defend your margin.</p>
      <div className="mg-timer"><i style={{ width: `${(left / 5000) * 100}%` }} /></div>
      <div className={`mg-line${inZone ? " is-safe" : ""}`}>
        <i className="mg-line-band" style={{ bottom: `${Math.max(0, band - width)}%`, height: `${width * 2}%` }} />
        <b className="mg-line-shield" style={{ bottom: `${pos}%` }} />
        <span className="mg-line-score">{Math.round((held / need) * 100)}%</span>
      </div>
      <Button className="cy-wide cy-primary" disabled={!!done}
        onPointerDown={() => { holding.current = true; }}
        onPointerUp={() => { holding.current = false; }}
        onPointerCancel={() => { holding.current = false; }}
        onLostPointerCapture={() => { holding.current = false; }}
        onPointerLeave={() => { holding.current = false; }}>HOLD TO DEFEND</Button>

      {done && <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>}
    </>
  );
}
