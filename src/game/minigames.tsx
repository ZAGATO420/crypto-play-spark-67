import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Fuel, KeyRound, MousePointerClick, Target } from "lucide-react";

/**
 * Four tiny skill moments. Every one returns a quality between 0 and 1 so the
 * caller can scale a fill price, a rescue or a loss with it. One finger,
 * 3-5 seconds, no layout of its own.
 */
export type MiniKind = "timing" | "panic" | "gas" | "seed";
export type MiniResult = { quality: number; label: string };

const SEED_WORDS = ["throne", "candle", "gorilla", "liquid", "diamond", "vault", "sniper", "ledger"];

export function Minigame({ kind, hard, roll = Math.random(), onResult }: { kind: MiniKind; hard: boolean; roll?: number; onResult: (r: MiniResult) => void }) {
  if (kind === "timing") return <TimingBar hard={hard} onResult={onResult} />;
  if (kind === "panic") return <PanicTap hard={hard} onResult={onResult} />;
  if (kind === "gas") return <GasWar hard={hard} roll={roll} onResult={onResult} />;
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
