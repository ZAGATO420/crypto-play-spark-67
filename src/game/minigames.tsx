import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fuel, Gift, KeyRound, MousePointerClick, Search, Shield, Target, Waves } from "lucide-react";

/**
 * Tiny skill moments. Every one returns a quality between 0 and 1 so the
 * caller can scale a fill price, a rescue or a loss with it. One finger,
 * 3-5 seconds, no layout of its own.
 */
export type MiniKind = "timing" | "panic" | "gas" | "seed" | "orderbook" | "rugcheck" | "whale" | "airdrop" | "hodl";
export type MiniResult = { quality: number; label: string };

const SEED_WORDS = ["throne", "candle", "gorilla", "liquid", "diamond", "vault", "sniper", "ledger"];

export function Minigame({ kind, hard, roll = Math.random(), onResult }: { kind: MiniKind; hard: boolean; roll?: number; onResult: (r: MiniResult) => void }) {
  if (kind === "timing") return <TimingBar hard={hard} onResult={onResult} />;
  if (kind === "panic") return <PanicTap hard={hard} onResult={onResult} />;
  if (kind === "gas") return <GasWar hard={hard} roll={roll} onResult={onResult} />;
  if (kind === "orderbook") return <OrderBook hard={hard} roll={roll} onResult={onResult} />;
  if (kind === "rugcheck") return <RugCheck roll={roll} onResult={onResult} />;
  if (kind === "whale") return <CandleCatch hard={hard} roll={roll} onResult={onResult} />;
  if (kind === "airdrop") return <AirdropClaim hard={hard} roll={roll} onResult={onResult} />;
  if (kind === "hodl") return <HoldTheLine hard={hard} roll={roll} onResult={onResult} />;
  return <SeedCheck roll={roll} onResult={onResult} />;
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
  const [gas, setGas] = useState(50);
  const [done, setDone] = useState<MiniResult | null>(null);
  const band = useRef({ lo: 25 + roll * 40, w: hard ? 12 : 20 });


  const send = () => {
    const { lo, w } = band.current;
    const res: MiniResult = gas < lo
      ? { quality: 0.05, label: "TOO CHEAP · MISSED THE MINT" }
      : gas > lo + w
        ? { quality: 0.45, label: "OVERPAID FOR GAS" }
        : { quality: 1, label: "FIRST BLOCK" };
    setDone(res);
    window.setTimeout(() => onResult(res), 900);
  };

  return (
    <>
      <p className="journey-kicker"><Fuel /> GAS WAR</p>
      <h2>OUTBID THE BOTS</h2>
      <p className="cy-lead">Bots are bidding blind for the same block. Too low and you never mint. Too high and the fee eats the trade.</p>
      <input className="mg-range" type="range" min={0} max={100} value={gas} disabled={!!done} onChange={(e) => setGas(Number(e.target.value))} aria-label="Gas price" />
      <p className="cy-lead"><strong>{gas} GWEI</strong></p>
      {done ? <p className={`cy-delta ${done.quality > 0.5 ? "positive" : "negative"}`}>{done.label}</p>
        : <Button className="cy-wide cy-primary" onClick={send}>SEND TRANSACTION</Button>}
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
      <p className="cy-lead">{show ? "Four words, three seconds. Your cold storage depends on it." : `Word ${Math.min(step + 1, 4)} of 4 · ${3 - wrong} tries left`}</p>
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
  const [bid, setBid] = useState(50);
  const [done, setDone] = useState(false);
  const width = hard ? 8 : 13;
  const place = () => {
    const off = Math.abs(bid - target);
    const result = off <= width / 3 ? { quality: 1, label: "MAKER FILL" } : off <= width ? { quality: .65, label: "PARTIAL FILL" } : { quality: .15, label: "MISSED LIQUIDITY" };
    setDone(true);
    window.setTimeout(() => onResult(result), 750);
  };
  return <><p className="journey-kicker"><Target /> ORDER BOOK</p><h2>PLACE THE BID</h2><p className="cy-lead">Find the liquidity pocket. Too far away misses; too close pays the spread.</p><div className="mg-depth"><i style={{ left: `${target - width}%`, width: `${width * 2}%` }} /><b style={{ left: `${bid}%` }} /></div><input className="mg-range" type="range" min={0} max={100} value={bid} disabled={done} onChange={(e) => setBid(Number(e.target.value))} aria-label="Bid position" /><Button className="cy-wide cy-primary" disabled={done} onClick={place}>PLACE ORDER</Button></>;
}

function RugCheck({ roll, onResult }: { roll: number; onResult: (r: MiniResult) => void }) {
  const clues = ["Liquidity locked", "Owner can mint", "Audited contract", "Anonymous deployer"];
  const bad = roll < .5 ? 1 : 3;
  const [done, setDone] = useState(false);
  const pick = (index: number) => {
    const result = index === bad ? { quality: 1, label: "RUG FLAGGED" } : { quality: .15, label: "YOU MISSED THE BACKDOOR" };
    setDone(true);
    window.setTimeout(() => onResult(result), 750);
  };
  return <><p className="journey-kicker"><Search /> RUG CHECK</p><h2>FIND THE RED FLAG</h2><p className="cy-lead">One detail can empty the pool. Pick the dangerous line.</p><div className="mg-rug">{clues.map((clue, index) => <Button key={clue} variant="outline" disabled={done} onClick={() => pick(index)}>{clue}</Button>)}</div></>;
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
        <span className="mg-field-score"><strong>{caught}</strong>/{need} GREEN · {missed} RED HIT</span>
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
    const fakes = ["claim-airdrop.xyz", "app.official-claim.io"];
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
      : { quality: 0.15, label: "PHISHING SITE · WALLET DRAINED" };
    setDone(res);
    window.setTimeout(() => onResult(res), 850);
  };

  return (
    <>
      <p className="journey-kicker"><Gift /> AIRDROP WINDOW</p>
      <h2>CLAIM THE REAL ONE</h2>
      <p className="cy-lead">Two of these links drain wallets. The genuine one ends in <strong>tcfb.app</strong>. Claim before the window shuts.</p>
      <div className="mg-timer"><i style={{ width: `${(left / (hard ? 4200 : 5600)) * 100}%` }} /></div>
      <div className="mg-drift">
        {labels.map((label, index) => (
          <button key={label} type="button" className={`mg-drift-btn${done && index === real ? " is-real" : ""}`} disabled={!!done}
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
