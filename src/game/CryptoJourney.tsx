import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ChevronRight, Crown, Flame, HeartPulse, History, Home, Receipt, Rocket, Shield, Skull, TrendingDown, TrendingUp, Trophy, Volume2, VolumeX, WalletCards, X, Zap } from "lucide-react";
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
import {
  ARCHETYPES, CHAPTERS, CHAPTER_WARNINGS, COINS, COUNTRIES, CUSTODY, DIFFICULTIES, ENDINGS, HOUSING, JOBS, MODES, PRESALES, STATUS_BY_CHOICE, TAX_RATE, TOTAL_MONTHS, XP, XP_EXTRA,
  bossScore, chapterLabel, chapterMonth, crashFor, custodyOf, decisionForChapter, failureFor, formatMoney, hintFor, housingOf, isTaxChapter, jobOf, levelFor, levelPerk, monthRangeLabel, monthsSurvived, presaleFor, situationFor, xpProgress,
  type Archetype, type BaseMode, type CoinSymbol, type Country, type CustodyId, type Decision, type DecisionOption, type Difficulty, type EndingKey, type HousingId, type JobId, type Presale, type Situation,
} from "./journey-data";
import { COIN_LOGO } from "./coin-logos";
import { Flag } from "./flags";
import { Minigame, type MiniKind, type MiniResult } from "./minigames";
import { loadBoard, submitRun, type BoardRow } from "./leaderboard";

/* ------------------------------------------------------------------ types */

type Kind = "spot" | "perp";
type Pos = { id: number; symbol: CoinSymbol; kind: Kind; dir: 1 | -1; lev: number; margin: number; entry: number; qty: number; where: CustodyId };
type Log = { chapter: number; title: string; detail: string; tone: "cyan" | "pink" | "yellow" };
type Entry = { chapter: number; label: string; amount: number };
type Config = { name: string; avatar: string; arch: Archetype; difficulty: Difficulty; mode: BaseMode; ironman: boolean; country: Country };
type Run = {
  chapter: number; cash: number; positions: Pos[]; nextId: number;
  hunger: number; stress: number; risk: number; streak: number; crises: number; trades: number; xp: number;
  custody: CustodyId; job: JobId; housing: HousingId; realized: number; taxDebt: number; moves: number;
  ledger: Entry[]; statuses: string[]; logs: Log[]; noise: number[]; muted: boolean; config: Config;
};
type Phase = "brief" | "act" | "resolve";
type LaunchResult = { name: string; tag: string; size: number; back: number; multi: number; rugged: boolean; line: string };
type Pending =
  | { t: "close"; id: number; fraction: number }
  | { t: "presale"; card: Presale; size: number }
  | { t: "crash"; chapter: number }
  | { t: "seed" };
type Dialog =
  | { k: "rules" }
  | { k: "market" }
  | { k: "trade"; symbol: CoinSymbol }
  | { k: "position"; id: number }
  | { k: "presale"; card: Presale }
  | { k: "launchResult"; res: LaunchResult }
  | { k: "survive" }
  | { k: "decision"; card: Decision }
  | { k: "situation"; card: Situation }
  | { k: "crash"; chapter: number }
  | { k: "failure"; chapter: number }
  | { k: "custody" }
  | { k: "life" }
  | { k: "ledger" }
  | { k: "mini"; kind: MiniKind; pending: Pending }
  | { k: "score" }
  | null;
type Screen = "start" | "setup" | "board" | "run" | "end";
type Resolution = { title: string; detail: string; tone: Log["tone"]; delta: number; move: number; lines: string[]; inflow: Entry[]; outflow: Entry[] };
type Pop = { id: number; text: string; tone: "xp" | "up" | "down" };


const SAVE_KEY = "tcfb_cycle_v2";
const AP_BASE = 2;
const AP_CAP = 4;
const LEVERAGE = [2, 5, 10] as const;
const FUNDING = 0.018; // per quarter, on notional — holding leverage is never free

export const AVATARS = [
  { id: "ape", url: avApe.url }, { id: "astro", url: avAstro.url }, { id: "bot", url: avBot.url }, { id: "coder", url: avCoder.url },
  { id: "diamond", url: avDiamond.url }, { id: "frog", url: avFrog.url }, { id: "reaper", url: avReaper.url }, { id: "whale", url: avWhale.url },
];

const defaultConfig: Config = { name: "", avatar: "ape", arch: "trader", difficulty: "NORMAL", mode: "classic", ironman: false, country: "DE" };
const archOf = (id: Archetype) => ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[1]!;
const diffOf = (id: Difficulty) => DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1]!;
const modeOf = (id: BaseMode) => MODES.find((m) => m.id === id) ?? MODES[0]!;
const modeId = (c: Config) => (c.ironman ? `IRONMAN-${c.mode}` : c.mode);
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

const makeNoise = (mode: BaseMode) => {
  const step = mode === "historical" ? 0 : mode === "chaos" ? 0.05 : 0.018;
  const cap = mode === "chaos" ? 0.4 : 0.12;
  let drift = 0;
  return Array.from({ length: 84 }, () => {
    drift = Math.max(-cap, Math.min(cap, drift + (Math.random() * 2 - 1) * step));
    return 1 + drift;
  });
};

const freshRun = (config: Config): Run => ({
  chapter: 0, cash: archOf(config.arch).cash, positions: [], nextId: 1,
  hunger: 8, stress: 6, risk: 0, streak: 0, crises: 0, trades: 0, xp: 0,
  custody: "exchange", job: "dayjob", housing: "shared", realized: 0, taxDebt: 0, moves: 0,
  ledger: [], statuses: [], logs: [], noise: makeNoise(config.mode), muted: false, config,
});

const priceAt = (symbol: CoinSymbol, chapter: number, noise: number[]) => {
  const month = chapterMonth(chapter);
  const base = COINS.find((c) => c.symbol === symbol)?.prices[month] ?? 0;
  return base ? base * (noise[month] ?? 1) : 0;
};
const pnlOf = (p: Pos, price: number) => (p.kind === "spot" ? p.qty * price - p.margin : p.margin * p.lev * p.dir * (price / p.entry - 1));
const valueOf = (p: Pos, price: number) => (p.kind === "spot" ? p.qty * price : Math.max(0, p.margin + pnlOf(p, price)));
const liqPct = (p: Pos, price: number) => (p.kind === "spot" ? 100 : clamp(100 + (pnlOf(p, price) / p.margin) * 100, 0, 100));
const netOf = (r: Run) => r.positions.reduce((sum, p) => sum + valueOf(p, priceAt(p.symbol, r.chapter, r.noise)), r.cash) - r.taxDebt;
const XP_MODE: Record<BaseMode, number> = { classic: 1, historical: 0.75, chaos: 1.25 };
const custodySplit = (r: Run) => {
  const totals: Record<CustodyId, number> = { exchange: 0, hot: 0, cold: 0 };
  for (const p of r.positions) totals[p.where] += valueOf(p, priceAt(p.symbol, r.chapter, r.noise));
  const sum = totals.exchange + totals.hot + totals.cold;
  return { totals, sum };
};


/* ------------------------------------------------------------------- shell */

export function CryptoJourney() {
  const [screen, setScreen] = useState<Screen>("start");
  const [run, setRun] = useState<Run>(() => freshRun(defaultConfig));
  const [phase, setPhase] = useState<Phase>("brief");
  const [ap, setAp] = useState(AP_BASE);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [queue, setQueue] = useState<Dialog[]>([]);
  const [flash, setFlash] = useState<{ text: string; tone: Log["tone"] } | null>(null);
  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [ending, setEnding] = useState<EndingKey>("SURVIVOR");
  const [resume, setResume] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const [shake, setShake] = useState(false);
  const [netPulse, setNetPulse] = useState<"up" | "down" | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const flashTimer = useRef<number | null>(null);
  const popId = useRef(1);
  const lastNet = useRef(0);

  const cfg = run.config;
  const arch = archOf(cfg.arch);
  const diff = diffOf(cfg.difficulty);
  const net = netOf(run);
  const score = bossScore({ net, chapters: run.chapter, difficulty: cfg.difficulty, crises: run.crises, streak: run.streak });
  const btcMove = pctMove("BTC", run);
  const warning = CHAPTER_WARNINGS[run.chapter] ?? "The market never announces what it is about to do.";
  const presale = presaleFor(run.chapter);
  const xpBar = xpProgress(run.xp);

  useEffect(() => { if (localStorage.getItem(SAVE_KEY)) setResume(true); }, []);
  useEffect(() => {
    if (screen !== "run" || cfg.ironman) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ run, phase, ap }));
  }, [screen, run, phase, ap, cfg.ironman]);

  // net worth pulses green or red whenever money actually moves
  useEffect(() => {
    if (screen !== "run") { lastNet.current = net; return; }
    const before = lastNet.current;
    lastNet.current = net;
    if (!before || Math.abs(net - before) < Math.max(20, before * 0.001)) return;
    setNetPulse(net > before ? "up" : "down");
    const t = window.setTimeout(() => setNetPulse(null), 700);
    return () => window.clearTimeout(t);
  }, [net, screen]);

  const say = (text: string, tone: Log["tone"] = "cyan") => {
    setFlash({ text, tone });
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setFlash(null), 2400);
  };
  const log = (entry: Log) => setRun((r) => ({ ...r, logs: [entry, ...r.logs].slice(0, 12) }));

  const pop = (text: string, tone: Pop["tone"]) => {
    const id = popId.current++;
    setPops((p) => [...p, { id, text, tone }].slice(-5));
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1400);
  };

  const grantXp = (amount: number, label?: string) => {
    const gain = Math.max(1, Math.round(amount * arch.xp * XP_MODE[cfg.mode]));
    setRun((r) => {
      const next = r.xp + gain;
      if (levelFor(next) > levelFor(r.xp)) {
        setLevelUp(levelFor(next));
        window.setTimeout(() => setLevelUp(null), 2200);
      }
      return { ...r, xp: next };
    });
    pop(`+${gain} XP${label ? ` · ${label}` : ""}`, "xp");
  };

  const rumble = () => { setShake(true); window.setTimeout(() => setShake(false), 520); };

  const spend = (cost = 1) => { setAp((a) => Math.max(0, a - cost)); setRun((r) => ({ ...r, moves: r.moves + 1 })); };

  /** Every dollar that moves gets a line in the books. Nothing is invisible. */
  const book = (r: Run, label: string, amount: number): Run => ({ ...r, ledger: [{ chapter: r.chapter, label, amount }, ...r.ledger].slice(0, 60) });

  /* ---------------------------------------------------------- run actions */

  const openSpot = (symbol: CoinSymbol, fraction: number) => {
    const price = priceAt(symbol, run.chapter, run.noise);
    setDialog(null);
    if (!price) return say(`${symbol} does not exist yet. Time travel has rules.`, "pink");
    const size = Math.floor(run.cash * fraction);
    if (size < 50) return say("Under $50. The Boss has more in his couch cushions.", "pink");
    const cust = custodyOf(run.custody);
    const fee = Math.round(size * cust.fee);
    spend();
    setRun((r) => book(book({
      ...r, cash: r.cash - size - fee, trades: r.trades + 1,
      positions: [...r.positions, { id: r.nextId, symbol, kind: "spot", dir: 1, lev: 1, margin: size, entry: price, qty: size / price, where: r.custody }],
      nextId: r.nextId + 1,
    }, `Bought ${symbol} spot`, -size), `${cust.short} fee`, -fee));
    log({ chapter: run.chapter, title: `LONG ${symbol} SPOT`, detail: `${formatMoney(size)} at ${formatMoney(price)} · held in ${cust.short}.`, tone: "cyan" });
    say(`${formatMoney(size)} into ${symbol}, sitting in your ${cust.short}.`, "cyan");
    grantXp(XP.trade, "TRADE");
  };

  const openPerp = (symbol: CoinSymbol, dir: 1 | -1, lev: number, fraction: number) => {
    const price = priceAt(symbol, run.chapter, run.noise);
    setDialog(null);
    if (!price) return say(`${symbol} has no market in ${chapterLabel(run.chapter)}.`, "pink");
    const margin = Math.floor(run.cash * fraction);
    if (margin < 50) return say("Not enough margin. Perps eat small accounts first.", "pink");
    spend();
    setRun((r) => book({
      ...r, cash: r.cash - margin, trades: r.trades + 1, risk: clamp(r.risk + lev * 6 * arch.risk),
      positions: [...r.positions, { id: r.nextId, symbol, kind: "perp", dir, lev, margin, entry: price, qty: 0, where: "exchange" }],
      nextId: r.nextId + 1,
    }, `${lev}x ${dir === 1 ? "long" : "short"} ${symbol} margin`, -margin));
    log({ chapter: run.chapter, title: `${dir === 1 ? "LONG" : "SHORT"} ${symbol} ${lev}x`, detail: `${formatMoney(margin)} margin at ${formatMoney(price)}. Funding runs every quarter.`, tone: "yellow" });
    say(`${lev}x ${dir === 1 ? "long" : "short"} ${symbol} is live. Perps always sit on the exchange.`, "yellow");
    grantXp(XP.trade + lev * 8, `${lev}x`);
  };

  /** Closing asks for a steady hand: the timing bar decides your fill. */
  const askClose = (id: number, fraction: number) => {
    const pos = run.positions.find((p) => p.id === id);
    if (!pos) return;
    if (pos.where === "cold" && ap <= 0) { setDialog(null); return say("Cold storage needs a move to unlock. None left this quarter.", "pink"); }
    setDialog({ k: "mini", kind: "timing", pending: { t: "close", id, fraction } });
  };

  const closePosition = (id: number, fraction: number, quality: number) => {
    setDialog(null);
    const pos = run.positions.find((p) => p.id === id);
    if (!pos) return;
    const cust = custodyOf(pos.where);
    // cold storage fills a quarter late — that is the price of being untouchable
    const price = pos.where === "cold" ? priceAt(pos.symbol, Math.max(0, run.chapter - 1), run.noise) : priceAt(pos.symbol, run.chapter, run.noise);
    const slip = 0.94 + quality * 0.08;
    const whole = valueOf(pos, price) * slip;
    const back = Math.round(whole * fraction);
    const fee = Math.round(back * cust.fee);
    const cost = pos.margin * fraction;
    const gain = back - fee - cost;
    if (pos.where === "cold") spend();
    setRun((r) => book(book({
      ...r,
      cash: r.cash + back - fee,
      trades: r.trades + 1,
      realized: r.realized + Math.max(0, gain),
      risk: pos.kind === "perp" ? clamp(r.risk - pos.lev * 4 * fraction) : r.risk,
      positions: fraction >= 1
        ? r.positions.filter((p) => p.id !== id)
        : r.positions.map((p) => (p.id === id ? { ...p, margin: p.margin * (1 - fraction), qty: p.qty * (1 - fraction) } : p)),
    }, `Closed ${pos.symbol}`, back), `${cust.short} fee`, -fee));
    log({ chapter: run.chapter, title: `CLOSED ${pos.symbol}`, detail: `${formatMoney(back)} back · ${gain >= 0 ? "+" : ""}${formatMoney(gain)}${pos.where === "cold" ? " · settled a quarter late" : ""}.`, tone: gain >= 0 ? "yellow" : "pink" });
    say(`${pos.symbol} closed for ${formatMoney(back)} · ${gain >= 0 ? "+" : ""}${formatMoney(gain)}`, gain >= 0 ? "yellow" : "pink");
    pop(`${gain >= 0 ? "+" : "−"}${formatMoney(Math.abs(gain))}`, gain >= 0 ? "up" : "down");
    grantXp((gain >= 0 ? XP.closeWin : XP.closeLoss) + (quality >= 1 ? XP_EXTRA.minigamePerfect : quality > 0.5 ? XP_EXTRA.minigameOk : 0), gain >= 0 ? "PROFIT TAKEN" : "LESSON");
    if (gain < 0) rumble();
  };

  const takePresale = (card: Presale, size: number, quality: number) => {
    if (run.cash < size) { setDialog(null); return say(`${card.name} needs ${formatMoney(size)} — you hold ${formatMoney(run.cash)}.`, "pink"); }
    spend();
    if (quality < 0.2) {
      setRun((r) => book({ ...r, stress: clamp(r.stress + 10) }, `${card.name} · missed mint (gas)`, -Math.round(size * 0.06)));
      log({ chapter: run.chapter, title: `MISSED · ${card.name}`, detail: "Gas too low. The bots filled the whole allocation.", tone: "pink" });
      return setDialog({ k: "launchResult", res: { name: card.name, tag: card.tag, size: Math.round(size * 0.06), back: 0, multi: 0, rugged: true, line: "Your transaction never made it into the block. Gas is a skill." } });
    }
    const rugged = Math.random() < card.rug / (arch.risk || 1);
    const multi = rugged ? 0.08 : (card.upside[0] + Math.random() * (card.upside[1] - card.upside[0])) * (0.85 + quality * 0.3);
    const back = Math.round(size * multi);
    setRun((r) => book(book({
      ...r, cash: r.cash - size + back, trades: r.trades + 1,
      realized: r.realized + Math.max(0, back - size),
      risk: clamp(r.risk + 10), stress: clamp(r.stress + (rugged ? 12 : 4)),
      statuses: rugged ? Array.from(new Set([...r.statuses, "RUG VICTIM"])) : Array.from(new Set([...r.statuses, "EARLY BUYER"])),
    }, `${card.name} ticket`, -size), `${card.name} payout`, back));
    const title = rugged ? "RUGGED." : multi > 6 ? "MOONSHOT" : "IT PAID";
    const line = rugged
      ? "The liquidity left before you did. The Boss has seen this exact face before."
      : multi > 6
        ? "That is the one you will tell people about for years. Loudly."
        : "Not life changing, but green is green.";
    log({ chapter: run.chapter, title: `${title} · ${card.name}`, detail: `${formatMoney(size)} in · ${formatMoney(back)} out.`, tone: rugged ? "pink" : "yellow" });
    pop(`${back >= size ? "+" : "−"}${formatMoney(Math.abs(back - size))}`, back >= size ? "up" : "down");
    grantXp(rugged ? XP.presaleRug : XP.presaleHit, rugged ? "RUG SURVIVED" : "LAUNCH HIT");
    if (rugged) rumble();
    setDialog({ k: "launchResult", res: { name: card.name, tag: card.tag, size, back, multi, rugged, line } });
  };

  const recover = (kind: "eat" | "calm") => {
    setDialog(null);
    const cost = Math.round((kind === "eat" ? 90 : 130) * diff.cost);
    if (run.cash < cost) return say(`${kind === "eat" ? "Food" : "Calm"} costs ${formatMoney(cost)}. You cannot afford to survive.`, "pink");
    setRun((r) => book({
      ...r, cash: r.cash - cost,
      hunger: kind === "eat" ? clamp(r.hunger - 38) : r.hunger,
      stress: kind === "calm" ? clamp(r.stress - 38) : r.stress,
    }, kind === "eat" ? "Groceries" : "Time off / therapy", -cost));
    say(kind === "eat" ? "Fed. Hunger down 38." : "Head cleared. Stress down 38.", "cyan");
    grantXp(XP.survive, "STILL ALIVE");
  };

  /** Moving the bag is the most important button in the game. */
  const setCustody = (id: CustodyId) => {
    setDialog(null);
    if (id === run.custody) return say(`Everything already sits in your ${custodyOf(id).short}.`, "cyan");
    if (ap <= 0) return say("Moving coins costs a move. None left this quarter.", "pink");
    spend();
    const moved = run.positions.filter((p) => p.kind === "spot");
    const value = moved.reduce((s, p) => s + valueOf(p, priceAt(p.symbol, run.chapter, run.noise)), 0);
    const fee = Math.round(value * 0.004);
    setRun((r) => book({
      ...r, custody: id, cash: r.cash - fee,
      positions: r.positions.map((p) => (p.kind === "spot" ? { ...p, where: id } : p)),
      statuses: id === "cold" ? Array.from(new Set([...r.statuses, "SELF CUSTODY"])) : r.statuses,
    }, `Moved bags to ${custodyOf(id).short}`, -fee));
    log({ chapter: run.chapter, title: `CUSTODY · ${custodyOf(id).short}`, detail: `${formatMoney(value)} moved for ${formatMoney(fee)} in fees.`, tone: "cyan" });
    say(`Bags now in ${custodyOf(id).name}. ${custodyOf(id).blurb}`, "cyan");
    grantXp(XP_EXTRA.custody, "CUSTODY MOVE");
  };

  const setLife = (job: JobId, housing: HousingId) => {
    setDialog(null);
    if (job === run.job && housing === run.housing) return;
    if (ap <= 0) return say("Changing your life costs a move. None left.", "pink");
    spend();
    setRun((r) => ({ ...r, job, housing, stress: clamp(r.stress + (job === "fulltime" ? 8 : 0)) }));
    log({ chapter: run.chapter, title: "LIFE CHANGED", detail: `${jobOf(job).name} · ${housingOf(housing).name}.`, tone: "cyan" });
    say(`${jobOf(job).name} · ${housingOf(housing).name}. Costs and income updated.`, "cyan");
    grantXp(XP_EXTRA.life, "LIFE CHOICE");
  };

  const bank = () => {
    if (ap <= 0) return say("No moves left. End the quarter.", "pink");
    spend();
    setRun((r) => ({ ...r, stress: clamp(r.stress - 6) }));
    say("You sat on your hands. Stress down 6. Patience is a position.", "cyan");
  };

  const resolveDecision = (option: DecisionOption, crisis = true) => {
    const status = STATUS_BY_CHOICE[option.label];
    setRun((r) => {
      const positions = r.positions.map((p) => (option.bagMul !== undefined ? { ...p, margin: p.margin * option.bagMul, qty: p.qty * option.bagMul } : p));
      const cashAfter = Math.max(0, Math.round(r.cash * (option.cashMul ?? 1) + (option.cash ?? 0)));
      const moved: Run = {
        ...r,
        cash: cashAfter,
        positions,
        stress: clamp(r.stress + Math.round((option.stress ?? 0) * arch.risk)),
        hunger: clamp(r.hunger + (option.hunger ?? 0)),
        crises: crisis ? r.crises + 1 : r.crises,
        statuses: status ? Array.from(new Set([...r.statuses, status])) : r.statuses,
        logs: [{ chapter: r.chapter, title: option.label, detail: option.result, tone: option.tone === "win" ? "yellow" : option.tone === "danger" ? "pink" : "cyan" } as Log, ...r.logs].slice(0, 12),
      };
      return cashAfter === r.cash ? moved : book(moved, option.label, cashAfter - r.cash);
    });
    say(option.result, option.tone === "danger" ? "pink" : option.tone === "win" ? "yellow" : "cyan");
    grantXp(option.xp ?? (crisis ? XP.crisis : 200), option.tone === "win" ? "GOOD CALL" : "SURVIVED IT");
    if (option.tone === "danger") rumble();
    nextInQueue();
  };

  /** Crash cards hand you a panic exit: tap fast and you save part of the bag. */
  const resolveCrash = (chapter: number, quality: number) => {
    if (quality >= 0.9) {
      setRun((r) => ({ ...r, stress: clamp(r.stress - 10), statuses: Array.from(new Set([...r.statuses, "COLD BLOODED"])) }));
      say("You de-risked into the crash. The Boss hates good reflexes.", "yellow");
      grantXp(XP_EXTRA.escape, "CRASH DODGED");
    } else if (quality >= 0.5) {
      setRun((r) => ({ ...r, positions: r.positions.map((p) => ({ ...p, margin: p.margin * 0.94, qty: p.qty * 0.94 })), stress: clamp(r.stress + 6) }));
      say("Half your orders filled. The rest went through at panic prices.", "cyan");
      grantXp(XP_EXTRA.minigameOk, "PARTIAL EXIT");
    } else {
      setRun((r) => ({ ...r, positions: r.positions.map((p) => ({ ...p, margin: p.margin * 0.84, qty: p.qty * 0.84 })), stress: clamp(r.stress + 16) }));
      say("You froze. The book emptied without you.", "pink");
      rumble();
    }
    void chapter;
    nextInQueue();
  };

  const resolveSeed = (quality: number) => {
    if (quality >= 0.9) {
      say("Seed recovered word for word. Cold storage intact.", "yellow");
      grantXp(XP_EXTRA.escape, "KEYS SECURED");
    } else if (quality >= 0.5) {
      setRun((r) => book({ ...r, stress: clamp(r.stress + 8) }, "Recovery service", -400));
      say("You needed help to recover it. Embarrassing, survivable.", "cyan");
    } else {
      setRun((r) => ({ ...r, positions: r.positions.map((p) => (p.where === "cold" ? { ...p, margin: p.margin * 0.5, qty: p.qty * 0.5 } : p)), stress: clamp(r.stress + 22) }));
      say("Half your cold bag is locked behind a phrase you cannot remember.", "pink");
      rumble();
    }
    nextInQueue();
  };

  const finishMini = (pending: Pending, res: MiniResult) => {
    if (pending.t === "close") return closePosition(pending.id, pending.fraction, res.quality);
    if (pending.t === "presale") return takePresale(pending.card, pending.size, res.quality);
    if (pending.t === "crash") return resolveCrash(pending.chapter, res.quality);
    return resolveSeed(res.quality);
  };

  // one card at a time: crash report, then the historical decision, then the small moment
  const nextInQueue = () => {
    const head = queue[0] ?? null;
    setDialog(head);
    setQueue(queue.slice(1));
    if (!head) setPhase("brief");
  };





  const endChapter = () => {
    const from = run.chapter;
    const next = from + 1;
    const startNet = netOf(run);
    const lines: string[] = [];
    const inflow: Entry[] = [];
    const outflow: Entry[] = [];
    const spendOn = (label: string, amount: number) => { if (amount > 0) outflow.push({ chapter: next, label, amount: -amount }); };
    const earnFrom = (label: string, amount: number) => { if (amount > 0) inflow.push({ chapter: next, label, amount }); };

    // liquidations first, on the new prices
    let cash = run.cash;
    let risk = clamp(run.risk - 10);
    let crises = run.crises;
    let taxDebt = run.taxDebt;
    let realized = run.realized;
    const survivors: Pos[] = [];
    for (const p of run.positions) {
      const price = priceAt(p.symbol, next, run.noise);
      if (!price) { survivors.push(p); continue; }
      if (p.kind === "perp" && pnlOf(p, price) <= -p.margin * 0.97) {
        lines.push(`${p.symbol} ${p.lev}x liquidated — ${formatMoney(p.margin)} margin gone.`);
        spendOn(`${p.symbol} ${p.lev}x liquidation`, Math.round(p.margin));
        risk = clamp(risk + 14);
        continue;
      }
      survivors.push(p);
    }
    if (run.risk >= 95 && survivors.some((p) => p.kind === "perp")) {
      for (const p of survivors.filter((p) => p.kind === "perp")) lines.push(`Risk overheated: ${p.symbol} ${p.lev}x force-closed.`);
    }
    let positions = run.risk >= 95 ? survivors.filter((p) => p.kind !== "perp") : survivors;
    if (run.risk >= 95) risk = 40;

    // perp funding: leverage is rented, never owned
    const funding = Math.round(positions.filter((p) => p.kind === "perp").reduce((s, p) => s + p.margin * p.lev * FUNDING, 0));
    if (funding > 0) { cash -= funding; spendOn("Perp funding", funding); lines.push(`Perp funding: ${formatMoney(funding)}.`); }

    // an exchange failure takes exactly what you left on the exchange
    const failure = failureFor(next);
    if (failure) {
      const exposed = positions.filter((p) => p.where === "exchange");
      const hit = Math.round(exposed.reduce((s, p) => s + valueOf(p, priceAt(p.symbol, next, run.noise)) * failure.haircut, 0));
      if (hit > 0) {
        positions = positions.map((p) => (p.where === "exchange" ? { ...p, margin: p.margin * (1 - failure.haircut), qty: p.qty * (1 - failure.haircut) } : p));
        spendOn(failure.name, hit);
        lines.push(`${failure.name}: ${formatMoney(hit)} of exchange balance gone.`);
        crises += 1;
        rumble();
      } else {
        lines.push(`${failure.name}: nothing of yours was on that exchange. Well played.`);
      }
    }

    // hot wallet drainers
    const hotSpot = positions.filter((p) => p.where === "hot");
    if (hotSpot.length && Math.random() < custodyOf("hot").drain) {
      const bite = Math.round(hotSpot.reduce((s, p) => s + valueOf(p, priceAt(p.symbol, next, run.noise)) * 0.12, 0));
      positions = positions.map((p) => (p.where === "hot" ? { ...p, margin: p.margin * 0.88, qty: p.qty * 0.88 } : p));
      spendOn("Wallet drainer", bite);
      lines.push(`A malicious approval drained ${formatMoney(bite)} from your hot wallet.`);
    }

    // life: income in, rent and food out
    const job = jobOf(run.job);
    const house = housingOf(run.housing);
    if (job.income > 0) { cash += job.income; earnFrom(`${job.name} income`, job.income); }
    const rent = Math.round(house.rent * diff.cost);
    const food = Math.round((520 + Math.floor(next / 4) * 190) * diff.cost * levelPerk(levelFor(run.xp)));
    cash -= rent + food;
    spendOn(`Rent · ${house.name}`, rent);
    spendOn("Food & living", food);
    lines.push(`Rent ${formatMoney(rent)} · living ${formatMoney(food)} · income ${formatMoney(job.income)}.`);

    // tax once a year on what you actually realised
    if (isTaxChapter(next) && realized > 0) {
      const bill = Math.round(realized * TAX_RATE);
      if (cash >= bill) { cash -= bill; spendOn(`Tax on ${formatMoney(realized)} realised`, bill); lines.push(`Tax bill paid: ${formatMoney(bill)}.`); }
      else { taxDebt += Math.round(bill * 1.2); lines.push(`Tax bill ${formatMoney(bill)} unpaid — it grows 20% and follows you.`); }
      realized = 0;
    }
    if (taxDebt > 0 && !isTaxChapter(next)) taxDebt = Math.round(taxDebt * 1.05);
    cash = Math.max(0, cash);

    // doing nothing is a choice, and it costs
    const idle = run.moves === 0;
    const hunger = clamp(run.hunger + Math.round(9 * arch.risk) + (idle ? 6 : 0));
    const stress = clamp(run.stress + Math.round(7 * arch.risk) + (idle ? 12 : 0) + job.stress - house.calm);
    if (idle) lines.push("You made no moves this quarter. Boredom and doubt did the work instead.");

    const ledger = [...outflow, ...inflow, ...run.ledger].slice(0, 60);
    const draft: Run = { ...run, chapter: next, cash, positions, risk, hunger, stress, crises, taxDebt, realized, ledger, moves: 0 };
    const endNet = netOf(draft);
    const delta = endNet - startNet;
    const streak = delta > 0 && !idle ? run.streak + 1 : 0;
    const move = pctMove("BTC", draft);
    const title = delta >= 0 ? (streak >= 3 ? `GREEN QUARTER · STREAK x${streak}` : "GREEN QUARTER") : "RED QUARTER";
    const detail = `${chapterLabel(next)} · ${monthRangeLabel(next)}: BTC ${move >= 0 ? "+" : ""}${move.toFixed(1)}%. Your book ${delta >= 0 ? "gained" : "lost"} ${formatMoney(Math.abs(delta))}.`;
    const tone: Log["tone"] = delta >= 0 ? (streak >= 3 ? "yellow" : "cyan") : "pink";

    const nextRun: Run = { ...draft, streak, logs: [{ chapter: next, title, detail, tone }, ...run.logs].slice(0, 12) };
    setRun(nextRun);
    setResolution({ title, detail, tone, delta, move, lines, inflow, outflow });
    setPhase("resolve");
    setAp(Math.min(AP_CAP, AP_BASE + job.ap + ap));
    grantXp((idle ? 0 : XP.chapter) + (delta >= 0 && !idle ? XP.greenQuarter : 0) + streak * XP.streakStep, idle ? "IDLE QUARTER" : delta >= 0 ? "GREEN QUARTER" : "MONTHS SURVIVED");
    if (lines.some((l) => l.includes("liquidated")) || move <= -20) rumble();

    const finalNet = netOf(nextRun);
    if (hunger >= 100) return finish("STARVED");
    if (stress >= 100) return finish("BROKEN");
    if (finalNet <= 0) return finish(positions.length === 0 && lines.some((l) => l.includes("liquidated")) ? "CASINO" : "BROKE");
    if (next >= CHAPTERS) return finish(finalNet > archOf(cfg.arch).cash * 40 && crises >= 5 ? "LEGEND" : "SURVIVOR");
  };

  const openChapterCards = (chapter: number) => {
    const cards: Dialog[] = [];
    if (crashFor(chapter)) cards.push({ k: "crash", chapter });
    if (failureFor(chapter)) cards.push({ k: "failure", chapter });
    const decision = decisionForChapter(chapter);
    if (decision) cards.push({ k: "decision", card: decision });
    const situation = situationFor(chapter);
    if (situation) cards.push({ k: "situation", card: situation });
    // cold storage occasionally asks you to prove you still own it
    if (chapter > 3 && run.positions.some((p) => p.where === "cold") && Math.random() < 0.18) cards.push({ k: "mini", kind: "seed", pending: { t: "seed" } });
    if (!cards.length) { setDialog(null); setPhase("brief"); return; }
    setPhase("act");

    setDialog(cards[0]!);
    setQueue(cards.slice(1));
  };

  const continueChapter = () => {
    setResolution(null);
    openChapterCards(run.chapter);
  };

  const finish = (key: EndingKey) => { setEnding(key); setScreen("end"); };

  const begin = (config: Config) => {
    localStorage.removeItem(SAVE_KEY);
    setRun(freshRun(config));
    setPhase("brief"); setAp(AP_BASE); setResolution(null); setDialog({ k: "rules" }); setFlash(null); setQueue([]);
    setScreen("run");
  };


  const restore = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "{}");
      if (saved.run) { setRun({ ...freshRun(saved.run.config ?? defaultConfig), ...saved.run }); setPhase(saved.phase ?? "brief"); setAp(saved.ap ?? AP_BASE); }
    } catch { setRun(freshRun(defaultConfig)); }
    setResolution(null); setDialog(null); setScreen("run");
  };

  if (screen === "start") return <StartScreen resume={resume} onStart={() => setScreen("setup")} onResume={restore} onBoard={() => setScreen("board")} />;
  if (screen === "setup") return <SetupScreen onBack={() => setScreen("start")} onStart={begin} />;
  if (screen === "board") return <BoardScreen onBack={() => setScreen("start")} />;
  if (screen === "end") return <EndScreen run={run} net={net} score={score} ending={ending} onRestart={() => setScreen("setup")} onBoard={() => setScreen("board")} />;

  const mood = run.stress > 70 || run.hunger > 70 ? enragedBoss.url : run.streak >= 2 ? smugBoss.url : crownedBoss.url;
  const bossLine = phase === "brief" ? warning : phase === "resolve" ? resolution?.detail ?? warning : "Two moves. Make them count, or bank one and wait for blood.";

  return (
    <main className={`cy-shell${shake ? " is-shaking" : ""}`}>
      <header className="cy-top">
        <div className="min-w-0">
          <p className="journey-kicker">{chapterLabel(run.chapter)} · {monthRangeLabel(run.chapter)} · {cfg.difficulty} · {modeOf(cfg.mode).name}{cfg.ironman ? " · IRONMAN" : ""}</p>
          <h1 className={`cy-net${netPulse ? ` pulse-${netPulse}` : ""}`}><Count value={net} /></h1>
          <div className="cy-xp" aria-label={`Level ${xpBar.level}, ${run.xp} XP`}>
            <span className="cy-level">LVL {xpBar.level}</span>
            <div className="cy-xp-track"><i style={{ width: `${xpBar.pct}%` }} /></div>
            <span className="cy-xp-num">{run.xp.toLocaleString("en-US")} XP</span>
          </div>
        </div>
        <div className="cy-top-right">
          <button className="cy-score" onClick={() => setDialog({ k: "score" })}><small>BOSS SCORE</small><strong>{score.toLocaleString("en-US")}</strong></button>
          <div className="cy-ap" aria-label={`${ap} moves left`}>{Array.from({ length: AP_CAP }, (_, i) => <i key={i} className={i < ap ? "is-on" : ""} />)}</div>
          <Button variant="ghost" size="icon" aria-label={run.muted ? "Sound on" : "Mute"} onClick={() => setRun({ ...run, muted: !run.muted })}>{run.muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>
      </header>

      <section className="cy-meters" aria-label="Run status">
        <Meter label="RISK" value={run.risk} tone={run.risk > 70 ? "pink" : "yellow"} detail={`${Math.round(run.risk)}%`} icon={<Zap />} />
        <Meter label="HUNGER" value={run.hunger} tone={run.hunger > 70 ? "pink" : "cyan"} detail={`${run.hunger}%`} icon={<Activity />} />
        <Meter label="STRESS" value={run.stress} tone={run.stress > 70 ? "pink" : "cyan"} detail={`${run.stress}%`} icon={<HeartPulse />} />
        <Meter label="STREAK" value={Math.min(100, run.streak * 20)} tone={run.streak ? "yellow" : "cyan"} detail={`x${run.streak}`} icon={<Flame />} />
      </section>


      <section className="cy-positions" aria-label="Open positions">
        <div className="cy-pos-head"><span className="journey-kicker"><WalletCards /> BOOK · {run.positions.length} OPEN</span><span>{formatMoney(run.cash)} CASH</span></div>
        {run.positions.length ? (
          <div className={`cy-chips ${run.positions.length > 4 ? "is-dense" : ""}`}>
            {run.positions.map((p) => {
              const price = priceAt(p.symbol, run.chapter, run.noise);
              const pnl = pnlOf(p, price);
              const liq = liqPct(p, price);
              return (
                <button key={p.id} className={`cy-chip ${pnl >= 0 ? "up" : "down"}`} onClick={() => setDialog({ k: "position", id: p.id })}>
                  <img src={COIN_LOGO[p.symbol]} alt="" width={22} height={22} />
                  <span><strong>{p.symbol}</strong><small>{p.kind === "spot" ? "SPOT" : `${p.dir === 1 ? "L" : "S"} ${p.lev}x`}</small></span>
                  <b>{pnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(pnl))}</b>
                  {p.kind === "perp" && <i className="cy-liq" style={{ width: `${liq}%` }} />}
                </button>
              );
            })}
          </div>
        ) : <p className="cy-empty">No positions. Cash does not win chapters.</p>}
      </section>

      <div className="cy-body">
        <aside className="cy-boss">
          <img src={mood} alt="The crowned Crypto Final Boss watching your run" />
          <div><p className="journey-kicker"><Crown /> THE BOSS</p><p>{bossLine}</p></div>
        </aside>

        <section className="cy-stage" aria-live="polite">
          {phase === "brief" && (
            <article className="cy-card" key={`brief-${run.chapter}`}>
              <p className="journey-kicker"><History /> {chapterLabel(run.chapter)} · THE SETUP</p>
              <h2>{run.chapter === 0 ? "IT STARTS QUIET" : btcMove >= 0 ? "THE TAPE IS GREEN" : "THE TAPE IS BLEEDING"}</h2>
              <p className="cy-lead">{warning}</p>
              {hintFor(run.chapter) && <p className="cy-hint"><strong>WORD ON THE TIMELINE ·</strong> {hintFor(run.chapter)}</p>}
              <div className="cy-facts">
                <span><small>BTC THIS QUARTER</small><strong className={btcMove >= 0 ? "positive" : "negative"}>{btcMove >= 0 ? "+" : ""}{btcMove.toFixed(1)}%</strong></span>
                <span><small>YOUR CASH</small><strong>{formatMoney(run.cash)}</strong></span>
                <span><small>BAGS IN</small><strong>{custodyOf(run.custody).short}</strong></span>
                <span><small>MOVES</small><strong>{ap}</strong></span>
              </div>
              <div className="cy-actions"><Button className="cy-primary" onClick={() => setPhase("act")}>TAKE YOUR TURN <ChevronRight /></Button></div>
            </article>
          )}

          {phase === "act" && (
            <article className="cy-card" key={`act-${run.chapter}`}>
              <p className="journey-kicker"><Zap /> YOUR TURN · {ap} MOVE{ap === 1 ? "" : "S"} LEFT</p>
              <h2>WHAT DO YOU DO?</h2>
              <div className="cy-grid">
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "market" })}><TrendingUp /><strong>TRADE SPOT</strong><small>Buy or short-list a market</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "market" })}><Zap /><strong>PERP DESK</strong><small>2x · 5x · 10x, long or short</small></button>
                <button className="cy-act" disabled={ap <= 0 || !presale} onClick={() => presale && setDialog({ k: "presale", card: presale })}><Rocket /><strong>{presale ? presale.tag : "NO LAUNCH"}</strong><small>{presale ? presale.name : "Nothing live this quarter"}</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "custody" })}><Shield /><strong>CUSTODY · {custodyOf(run.custody).short}</strong><small>Exchange · hot wallet · Ledger</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "life" })}><Home /><strong>LIFE</strong><small>{jobOf(run.job).name} · {housingOf(run.housing).name}</small></button>
                <button className="cy-act" onClick={() => setDialog({ k: "ledger" })}><Receipt /><strong>THE BOOKS</strong><small>Every dollar in and out</small></button>
                <button className="cy-act" onClick={() => setDialog({ k: "survive" })}><HeartPulse /><strong>SURVIVE</strong><small>Eat · calm down</small></button>
                <button className="cy-act" onClick={bank}><History /><strong>WAIT</strong><small>Bank a move, lose stress</small></button>
                <button className="cy-act is-go" onClick={endChapter}><ChevronRight /><strong>END QUARTER</strong><small>Let the market answer</small></button>
              </div>
            </article>
          )}

          {phase === "resolve" && resolution && (
            <article className={`cy-card tone-${resolution.tone}`} key={`res-${run.chapter}`}>
              <p className="journey-kicker">{chapterLabel(run.chapter)} · THE MARKET ANSWERS</p>
              <h2>{resolution.title}</h2>
              <p className={`cy-delta ${resolution.delta >= 0 ? "positive" : "negative"}`}>{resolution.delta >= 0 ? "+" : "−"}{formatMoney(Math.abs(resolution.delta))}</p>
              <p className="cy-lead">{resolution.detail}</p>
              <div className="cy-flows">
                <div className="cy-flow in">
                  <h4>MONEY IN</h4>
                  {resolution.inflow.length ? resolution.inflow.map((e, i) => <p key={i}><span>{e.label}</span><strong>+{formatMoney(e.amount)}</strong></p>) : <p className="muted">Nothing came in. Rough quarter.</p>}
                </div>
                <div className="cy-flow out">
                  <h4>MONEY OUT</h4>
                  {resolution.outflow.length ? resolution.outflow.map((e, i) => <p key={i}><span>{e.label}</span><strong>−{formatMoney(Math.abs(e.amount))}</strong></p>) : <p className="muted">You spent nothing. Suspicious.</p>}
                </div>
              </div>
              <ul className="cy-lines">{resolution.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
              <div className="cy-actions"><Button className="cy-primary" onClick={continueChapter}>NEXT CHAPTER <ChevronRight /></Button></div>
            </article>
          )}

        </section>

        <aside className="cy-trail">
          <div className="trail-title"><History /><span>RUN LOG</span></div>
          {run.statuses.length > 0 && <div className="cy-status-row">{run.statuses.map((s) => <span key={s}>{s}</span>)}</div>}
          {run.logs.length ? run.logs.slice(0, 6).map((l, i) => (
            <div className={`trail-entry tone-${l.tone}`} key={`${l.chapter}-${i}`}><span>{chapterLabel(l.chapter)}</span><strong>{l.title}</strong></div>
          )) : <p className="trail-empty">Every trade, rug and crisis lands here.</p>}
          <button className="cy-rules" onClick={() => setDialog({ k: "rules" })}>HOW IT WORKS</button>
        </aside>
      </div>

      {flash && <div className={`cy-flash tone-${flash.tone}`} role="status">{flash.text}</div>}

      <div className="cy-pops" aria-live="polite">
        {pops.map((p) => <span key={p.id} className={`cy-pop tone-${p.tone}`}>{p.text}</span>)}
      </div>
      {levelUp !== null && <div className="cy-levelup" role="status">LEVEL {levelUp}<small>The Boss raised an eyebrow.</small></div>}

      {dialog && (
        <Sheet onClose={dialog.k === "decision" || dialog.k === "situation" || dialog.k === "mini" ? undefined : () => (dialog.k === "crash" || dialog.k === "failure" || dialog.k === "launchResult" ? nextInQueue() : setDialog(null))}>
          {dialog.k === "rules" && <Rules onClose={() => { setDialog(null); if (run.chapter === 0 && run.logs.length === 0) openChapterCards(0); }} />}
          {dialog.k === "score" && <ScoreSheet net={net} chapters={run.chapter} diff={cfg.difficulty} crises={run.crises} streak={run.streak} score={score} onClose={() => setDialog(null)} />}
          {dialog.k === "market" && <MarketSheet run={run} onPick={(s) => setDialog({ k: "trade", symbol: s })} />}
          {dialog.k === "trade" && <TradeSheet run={run} symbol={dialog.symbol} onSpot={(f) => openSpot(dialog.symbol, f)} onPerp={(d, l, f) => openPerp(dialog.symbol, d, l, f)} />}
          {dialog.k === "position" && <PositionSheet run={run} id={dialog.id} onClose={(f) => askClose(dialog.id, f)} />}
          {dialog.k === "presale" && <PresaleSheet card={dialog.card} cash={run.cash} onTake={(size) => setDialog({ k: "mini", kind: "gas", pending: { t: "presale", card: dialog.card, size } })} onPass={() => { setDialog(null); say(`${dialog.card.name} closed without you. Discipline is a position.`, "cyan"); }} />}
          {dialog.k === "launchResult" && <LaunchResultSheet res={dialog.res} onClose={nextInQueue} />}
          {dialog.k === "survive" && <SurviveSheet run={run} cost={diff.cost} onEat={() => recover("eat")} onCalm={() => recover("calm")} />}
          {dialog.k === "crash" && <CrashSheet chapter={dialog.chapter} onPanic={() => setDialog({ k: "mini", kind: "panic", pending: { t: "crash", chapter: dialog.chapter } })} onClose={nextInQueue} />}
          {dialog.k === "failure" && <FailureSheet chapter={dialog.chapter} run={run} onClose={nextInQueue} />}
          {dialog.k === "custody" && <CustodySheet run={run} onPick={setCustody} />}
          {dialog.k === "life" && <LifeSheet run={run} onPick={setLife} />}
          {dialog.k === "ledger" && <LedgerSheet run={run} onClose={() => setDialog(null)} />}
          {dialog.k === "mini" && <Minigame kind={dialog.kind} hard={cfg.difficulty !== "EASY"} onResult={(res) => finishMini(dialog.pending, res)} />}
          {dialog.k === "decision" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o)} />}
          {dialog.k === "situation" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o, false)} />}
        </Sheet>

      )}

    </main>
  );
}

const pctMove = (symbol: CoinSymbol, r: Run) => {
  const now = priceAt(symbol, r.chapter, r.noise);
  const before = priceAt(symbol, Math.max(0, r.chapter - 1), r.noise);
  return before ? (now / before - 1) * 100 : 0;
};

/* -------------------------------------------------------------- fragments */

function Count({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const from = shown;
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 420);
      setShown(from + (value - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{formatMoney(Math.round(shown))}</>;
}

function Meter({ label, value, icon, tone, detail }: { label: string; value: number; icon: React.ReactNode; tone: string; detail: string }) {
  return (
    <div className={`journey-meter tone-${tone}`}>
      <span className="meter-icon">{icon}</span>
      <div className="min-w-0">
        <div className="meter-label"><strong>{label}</strong><span>{detail}</span></div>
        <div className="meter-track"><i style={{ width: `${Math.max(3, Math.min(100, value))}%` }} /></div>
      </div>
    </div>
  );
}

function Sheet({ children, onClose }: { children: React.ReactNode; onClose?: (() => void) | undefined }) {
  return (
    <div className="cy-scrim" role="dialog" aria-modal="true">
      <div className="cy-sheet">
        {onClose && <button className="cy-close" aria-label="Close" onClick={onClose}><X /></button>}
        {children}
      </div>
    </div>
  );
}

function Rules({ onClose }: { onClose: () => void }) {
  return (
    <>
      <p className="journey-kicker"><Crown /> THE BOSS EXPLAINS IT ONCE</p>
      <h2>HOW THE CYCLE WORKS</h2>
      <ol className="cy-steps">
        <li><b>1</b><span>28 chapters, one per quarter, 2020 to 2026. Real prices, no hindsight.</span></li>
        <li><b>2</b><span>Two moves per chapter: spot, perps, a launch, or wait and bank one for later.</span></li>
        <li><b>3</b><span>END QUARTER and the market answers. Perps can liquidate, the risk meter can force-close everything.</span></li>
        <li><b>4</b><span>History hits back: Black Thursday, Luna, FTX, the ETF. Your choice becomes a permanent status.</span></li>
        <li><b>5</b><span>Hunger or stress at 100 ends the run. So does zero. Only the Boss Score counts on the board.</span></li>
      </ol>
      <Button className="cy-primary" onClick={onClose}>LET ME TRADE</Button>
    </>
  );
}

function ScoreSheet({ net, chapters, diff, crises, streak, score, onClose }: { net: number; chapters: number; diff: Difficulty; crises: number; streak: number; score: number; onClose: () => void }) {
  const d = diffOf(diff);
  return (
    <>
      <p className="journey-kicker"><Trophy /> LEADERBOARD MATH</p>
      <h2>BOSS SCORE</h2>
      <ul className="cy-lines">
        <li>Net worth · {formatMoney(net)}</li>
        <li>Chapters survived · {chapters}/{CHAPTERS} = x{(Math.max(0.1, Math.min(1, chapters / CHAPTERS))).toFixed(2)}</li>
        <li>Difficulty {d.name} · x{d.cost.toFixed(2)}</li>
        <li>Crises survived · {crises} = +{formatMoney(crises * 500)}</li>
        <li>Streak · x{(1 + Math.min(0.5, streak * 0.05)).toFixed(2)}</li>
      </ul>
      <p className="cy-delta positive">{score.toLocaleString("en-US")}</p>
      <Button className="cy-primary" onClick={onClose}>GOT IT</Button>
    </>
  );
}

function MarketSheet({ run, onPick }: { run: Run; onPick: (s: CoinSymbol) => void }) {
  return (
    <>
      <p className="journey-kicker"><TrendingUp /> {chapterLabel(run.chapter)} · THE EXCHANGE</p>
      <h2>PICK A MARKET</h2>
      <div className="cy-market">
        {COINS.map((c) => {
          const price = priceAt(c.symbol, run.chapter, run.noise);
          const before = priceAt(c.symbol, Math.max(0, run.chapter - 1), run.noise);
          const move = before && price ? (price / before - 1) * 100 : 0;
          return (
            <button key={c.symbol} className={`cy-market-row ${price ? "" : "is-off"}`} disabled={!price} onClick={() => onPick(c.symbol)}>
              <img src={COIN_LOGO[c.symbol]} alt="" width={26} height={26} />
              <span><strong>{c.symbol}</strong><small>{c.name}</small></span>
              <b>{price ? formatMoney(price) : "not live"}</b>
              <em className={move >= 0 ? "positive" : "negative"}>{price ? `${move >= 0 ? "+" : ""}${move.toFixed(1)}%` : "—"}</em>
            </button>
          );
        })}
      </div>
    </>
  );
}

function TradeSheet({ run, symbol, onSpot, onPerp }: { run: Run; symbol: CoinSymbol; onSpot: (f: number) => void; onPerp: (d: 1 | -1, l: number, f: number) => void }) {
  const [dir, setDir] = useState<1 | -1>(1);
  const [lev, setLev] = useState<number>(5);
  const price = priceAt(symbol, run.chapter, run.noise);
  return (
    <>
      <p className="journey-kicker"><Zap /> ONE TAP = ORDER FILLED</p>
      <div className="cy-trade-head"><img src={COIN_LOGO[symbol]} alt="" width={44} height={44} /><span><strong>{symbol}</strong><small>{formatMoney(price)} · {chapterLabel(run.chapter)}</small></span></div>
      <div className="cy-trade-cols">
        <div>
          <p className="journey-kicker">SPOT · YOU OWN IT</p>
          <Button variant="secondary" onClick={() => onSpot(0.25)}>BUY 25% · {formatMoney(run.cash * 0.25)}</Button>
          <Button variant="secondary" onClick={() => onSpot(0.5)}>BUY 50% · {formatMoney(run.cash * 0.5)}</Button>
          <Button variant="secondary" onClick={() => onSpot(1)}>ALL IN · {formatMoney(run.cash)}</Button>
        </div>
        <div>
          <p className="journey-kicker">PERP · BORROWED COURAGE</p>
          <div className="cy-toggle">
            <button className={dir === 1 ? "is-on" : ""} onClick={() => setDir(1)}><TrendingUp />LONG</button>
            <button className={dir === -1 ? "is-on" : ""} onClick={() => setDir(-1)}><TrendingDown />SHORT</button>
          </div>
          <div className="cy-toggle">{LEVERAGE.map((l) => <button key={l} className={lev === l ? "is-on" : ""} onClick={() => setLev(l)}>{l}x</button>)}</div>
          <Button onClick={() => onPerp(dir, lev, 0.25)}>OPEN · {formatMoney(run.cash * 0.25)} MARGIN</Button>
          <Button onClick={() => onPerp(dir, lev, 0.5)}>OPEN · {formatMoney(run.cash * 0.5)} MARGIN</Button>
          <small className="cy-note">Liquidation at −{(100 / lev).toFixed(0)}% price move against you.</small>
        </div>
      </div>
    </>
  );
}

function PositionSheet({ run, id, onClose }: { run: Run; id: number; onClose: (f: number) => void }) {
  const pos = run.positions.find((p) => p.id === id);
  if (!pos) return null;
  const price = priceAt(pos.symbol, run.chapter, run.noise);
  const pnl = pnlOf(pos, price);
  const liq = liqPct(pos, price);
  return (
    <>
      <p className="journey-kicker"><WalletCards /> {pos.kind === "spot" ? "SPOT POSITION" : `${pos.dir === 1 ? "LONG" : "SHORT"} ${pos.lev}x`}</p>
      <div className="cy-trade-head"><img src={COIN_LOGO[pos.symbol]} alt="" width={44} height={44} /><span><strong>{pos.symbol}</strong><small>entry {formatMoney(pos.entry)} · now {formatMoney(price)}</small></span></div>
      <p className={`cy-delta ${pnl >= 0 ? "positive" : "negative"}`}>{pnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(pnl))}</p>
      {pos.kind === "perp" && (
        <div className="cy-liq-bar" aria-label={`${Math.round(liq)}% margin left`}><i style={{ width: `${liq}%` }} /><span>{Math.round(liq)}% MARGIN LEFT</span></div>
      )}
      <div className="cy-actions three">
        <Button variant="secondary" onClick={() => onClose(0.25)}>CLOSE 25%</Button>
        <Button variant="secondary" onClick={() => onClose(0.5)}>CLOSE 50%</Button>
        <Button className="cy-primary" onClick={() => onClose(1)}>CLOSE ALL</Button>
      </div>
      <small className="cy-note">Closing is free. Opening costs a move.</small>
    </>
  );
}

function PresaleSheet({ card, cash, onTake, onPass }: { card: Presale; cash: number; onTake: (size: number) => void; onPass: () => void }) {
  // never offer the same ticket twice: min, a quarter of cash, half of cash
  const sizes = Array.from(new Set([card.min, Math.floor(cash * 0.25), Math.floor(cash * 0.5)]
    .map((s) => Math.max(card.min, s))
    .filter((s) => s <= Math.max(card.min, cash))))
    .sort((a, b) => a - b);
  const labels = ["MIN TICKET", "25% OF CASH", "HALF YOUR CASH"];
  return (
    <>
      <p className="journey-kicker"><Rocket /> {card.tag} · ONE SHOT</p>
      <h2>{card.name}</h2>
      <p className="cy-lead">{card.blurb}</p>
      <ul className="cy-lines">
        <li>Rug risk · {Math.round(card.rug * 100)}%</li>
        <li>If it works · {card.upside[0]}x to {card.upside[1]}x</li>
        <li>Your cash · {formatMoney(cash)}</li>
      </ul>
      <div className={`cy-actions ${sizes.length === 3 ? "three" : ""}`}>
        {sizes.map((s, i) => (
          <Button key={s} variant={i === sizes.length - 1 ? "default" : "secondary"} onClick={() => onTake(s)}>
            {formatMoney(s)}<small>{labels[i]}</small>
          </Button>
        ))}
      </div>
      <Button variant="outline" className="cy-wide" onClick={onPass}>PASS</Button>
    </>
  );
}

function LaunchResultSheet({ res, onClose }: { res: LaunchResult; onClose: () => void }) {
  const gain = res.back - res.size;
  return (
    <>
      <p className="journey-kicker"><Rocket /> {res.tag} · RESULT</p>
      <h2 className={res.rugged ? "negative" : "positive"}>{res.rugged ? "RUGGED." : res.multi > 6 ? "MOONSHOT" : "IT PAID"}</h2>
      <p className={`cy-delta ${gain >= 0 ? "positive" : "negative"}`}>{gain >= 0 ? "+" : "−"}{formatMoney(Math.abs(gain))}</p>
      <ul className="cy-lines">
        <li>{res.name} · {res.multi.toFixed(2)}x</li>
        <li>Invested · {formatMoney(res.size)}</li>
        <li>Back in your pocket · {formatMoney(res.back)}</li>
      </ul>
      <p className="cy-lead">{res.line}</p>
      <Button className="cy-wide cy-primary" onClick={onClose}>BACK TO THE DESK <ChevronRight /></Button>
    </>
  );
}

function CrashSheet({ chapter, onPanic, onClose }: { chapter: number; onPanic: () => void; onClose: () => void }) {
  const crash = crashFor(chapter);
  if (!crash) return <Button className="cy-wide" onClick={onClose}>CONTINUE</Button>;
  return (
    <>
      <p className="journey-kicker"><TrendingDown /> {chapterLabel(chapter)} · {monthRangeLabel(chapter)}</p>
      <h2 className="negative">{crash.title}</h2>
      <p className="cy-lead">{crash.line}</p>
      <div className="cy-actions">
        <Button className="cy-primary" onClick={onPanic}>HIT THE EXIT <Zap /></Button>
        <Button onClick={onClose}>SIT STILL</Button>
      </div>
      <small className="cy-note">Fast hands save part of the bag. Frozen hands pay full price.</small>
    </>
  );
}

function FailureSheet({ chapter, run, onClose }: { chapter: number; run: Run; onClose: () => void }) {
  const fail = failureFor(chapter);
  if (!fail) return <Button className="cy-wide" onClick={onClose}>CONTINUE</Button>;
  const exposed = run.positions.filter((p) => p.where === "exchange").length;
  return (
    <>
      <p className="journey-kicker"><Shield /> {chapterLabel(chapter)} · COUNTERPARTY</p>
      <h2 className="negative">{fail.name}</h2>
      <p className="cy-lead">{fail.line}</p>
      <p className="cy-note">{exposed ? `You still have ${exposed} position${exposed === 1 ? "" : "s"} sitting there. ${Math.round(fail.haircut * 100)}% of it goes up in smoke at the end of this quarter.` : "Nothing of yours was on that exchange. That is what the Ledger was for."}</p>
      <Button className="cy-wide cy-primary" onClick={onClose}>FACE IT <ChevronRight /></Button>
    </>
  );
}

function CustodySheet({ run, onPick }: { run: Run; onPick: (id: CustodyId) => void }) {
  return (
    <>
      <p className="journey-kicker"><Shield /> WHERE DO YOUR COINS SLEEP?</p>
      <h2>CUSTODY</h2>
      <div className="cy-pick-list">
        {CUSTODY.map((c) => (
          <button key={c.id} className={`cy-pick-row ${run.custody === c.id ? "is-on" : ""}`} onClick={() => onPick(c.id)}>
            <strong>{c.name}</strong>
            <small>{c.blurb}</small>
            <em>Fee {(c.fee * 100).toFixed(1)}% · {c.id === "exchange" ? "exchange risk" : c.id === "hot" ? "drainer risk" : "slow fills"}</em>
          </button>
        ))}
      </div>
      <small className="cy-note">Moving the bag costs one move and 0.4% in fees. Perps always stay on the exchange.</small>
    </>
  );
}

function LifeSheet({ run, onPick }: { run: Run; onPick: (j: JobId, h: HousingId) => void }) {
  const [job, setJob] = useState<JobId>(run.job);
  const [housing, setHousing] = useState<HousingId>(run.housing);
  return (
    <>
      <p className="journey-kicker"><Home /> INCOME · RENT · SANITY</p>
      <h2>YOUR LIFE</h2>
      <div className="cy-pick-list">
        {JOBS.map((j) => (
          <button key={j.id} className={`cy-pick-row ${job === j.id ? "is-on" : ""}`} onClick={() => setJob(j.id)}>
            <strong>{j.name}</strong><small>{j.blurb}</small><em>{j.income ? `+${formatMoney(j.income)} / quarter` : "no income"} · stress +{j.stress}{j.ap ? ` · +${j.ap} move` : ""}</em>
          </button>
        ))}
      </div>
      <div className="cy-pick-list">
        {HOUSING.map((h) => (
          <button key={h.id} className={`cy-pick-row ${housing === h.id ? "is-on" : ""}`} onClick={() => setHousing(h.id)}>
            <strong>{h.name}</strong><small>{h.blurb}</small><em>−{formatMoney(h.rent)} / quarter · stress {h.calm >= 0 ? `−${h.calm}` : `+${-h.calm}`}</em>
          </button>
        ))}
      </div>
      <Button className="cy-wide cy-primary" onClick={() => onPick(job, housing)}>LOCK IT IN <ChevronRight /></Button>
    </>
  );
}

function LedgerSheet({ run, onClose }: { run: Run; onClose: () => void }) {
  const inSum = run.ledger.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0);
  const outSum = run.ledger.filter((e) => e.amount < 0).reduce((s, e) => s + e.amount, 0);
  return (
    <>
      <p className="journey-kicker"><Receipt /> EVERY DOLLAR, NO EXCUSES</p>
      <h2>THE BOOKS</h2>
      <div className="cy-facts">
        <span><small>IN</small><strong className="positive">+{formatMoney(inSum)}</strong></span>
        <span><small>OUT</small><strong className="negative">−{formatMoney(Math.abs(outSum))}</strong></span>
        <span><small>TAX OWED</small><strong className={run.taxDebt ? "negative" : ""}>{formatMoney(run.taxDebt)}</strong></span>
      </div>
      <div className="cy-ledger">
        {run.ledger.length ? run.ledger.map((e, i) => (
          <p key={i}><span>{chapterLabel(e.chapter)} · {e.label}</span><strong className={e.amount >= 0 ? "positive" : "negative"}>{e.amount >= 0 ? "+" : "−"}{formatMoney(Math.abs(e.amount))}</strong></p>
        )) : <p className="muted"><span>Nothing booked yet.</span></p>}
      </div>
      <Button className="cy-wide cy-primary" onClick={onClose}>CLOSE THE BOOKS <ChevronRight /></Button>
    </>
  );
}




function SurviveSheet({ run, cost, onEat, onCalm }: { run: Run; cost: number; onEat: () => void; onCalm: () => void }) {
  return (
    <>
      <p className="journey-kicker"><HeartPulse /> STAY IN THE GAME · FREE MOVE</p>
      <h2>SURVIVAL</h2>
      <div className="cy-survive">
        <div><Activity /><span><small>HUNGER</small><strong>{run.hunger}%</strong></span><Button onClick={onEat}>EAT · {formatMoney(Math.round(90 * cost))}</Button></div>
        <div><HeartPulse /><span><small>STRESS</small><strong>{run.stress}%</strong></span><Button onClick={onCalm}>CALM · {formatMoney(Math.round(130 * cost))}</Button></div>
      </div>
      <small className="cy-note">Either one at 100% ends the run. Both climb every quarter.</small>
    </>
  );
}

function DecisionSheet({ card, onPick }: { card: Decision | Situation; onPick: (o: DecisionOption) => void }) {
  return (
    <>
      <p className="journey-kicker"><History /> {card.kicker}</p>
      <h2>{card.title}</h2>
      <p className="cy-lead">{card.body}</p>
      <div className="cy-decide">
        {card.options.map((o) => (
          <button key={o.label} className={`cy-option tone-${o.tone}`} onClick={() => onPick(o)}>{o.label}</button>
        ))}
      </div>
      <small className="cy-note">This choice becomes a permanent status on your run.</small>
    </>
  );
}

/* ---------------------------------------------------------------- screens */

function StartScreen({ resume, onStart, onResume, onBoard }: { resume: boolean; onStart: () => void; onResume: () => void; onBoard: () => void }) {
  return (
    <main className="journey-start">
      <img src={crownedBoss.url} alt="The crowned Crypto Final Boss" />
      <div className="start-vignette" />
      <section>
        <p className="journey-kicker">REAL CRYPTO HISTORY · ONE LIFE</p>
        <h1>THE CRYPTO<br /><span>FINAL BOSS</span></h1>
        <p>Trade the whole cycle from 2020 to 2026. Spot, perps, launches and the crashes that ate everyone else. Survive all 84 months and beat the Boss Score.</p>
        <div className="start-actions">
          <Button onClick={onStart}>ENTER THE ARENA <ChevronRight /></Button>
          {resume && <Button variant="outline" onClick={onResume}>CONTINUE RUN</Button>}
          <Button variant="outline" onClick={onBoard}><Trophy />LEADERBOARD</Button>
        </div>
        <small>84 MONTHS · NO WALLET · FREE TO PLAY</small>
      </section>
    </main>
  );
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
        <div className="chip-row">{COUNTRIES.map((c) => <button key={c} className={`chip ${config.country === c ? "is-on" : ""}`} onClick={() => set("country", c)}><Flag code={c} size={18} />{c}</button>)}</div>
      </section>
      <section className="setup-block"><p className="journey-kicker">ARCHETYPE</p><div className="pick-grid">{ARCHETYPES.map((a) => <button key={a.id} className={`pick-card ${config.arch === a.id ? "is-on" : ""}`} onClick={() => set("arch", a.id)}><strong>{a.name}</strong><em>{formatMoney(a.cash)} START</em><small>{a.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">DIFFICULTY</p><div className="pick-grid">{DIFFICULTIES.map((d) => <button key={d.id} className={`pick-card ${config.difficulty === d.id ? "is-on" : ""}`} onClick={() => set("difficulty", d.id)}><strong>{d.name}</strong><em>SCORE x{d.cost.toFixed(2)}</em><small>{d.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">MODE</p><div className="pick-grid">{MODES.map((m) => <button key={m.id} className={`pick-card ${config.mode === m.id ? "is-on" : ""}`} onClick={() => set("mode", m.id)}><strong>{m.name}</strong><em>{m.blurb}</em><small>{m.xpLabel}</small></button>)}</div>
        <button className={`iron-toggle ${config.ironman ? "is-on" : ""}`} onClick={() => set("ironman", !config.ironman)}><Flame /><span><strong>IRONMAN</strong><small>No saves, no second chances. Death is final.</small></span></button>
      </section>
      <div className="setup-cta">
        <div className="setup-summary">
          <img src={AVATARS.find((a) => a.id === config.avatar)?.url} alt="" />
          <span>
            <strong>{config.name.trim() || "anon"} <Flag code={config.country} size={14} /></strong>
            <small>{archOf(config.arch).name} · {formatMoney(archOf(config.arch).cash)} · {config.difficulty}{config.ironman ? " · IRONMAN" : ""}</small>
          </span>
        </div>
        <Button onClick={() => onStart({ ...config, name: config.name.trim() || "anon" })}><Rocket />START Q1 2020</Button>
      </div>
    </main>
  );
}

function BoardScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => { loadBoard(25).then(setRows).catch(() => setError(true)); }, []);
  return (
    <main className="journey-setup">
      <header><div><p className="journey-kicker">BOSS SCORE · SEASON 1</p><h1>LEADERBOARD</h1></div><Button variant="ghost" size="icon" aria-label="Back" onClick={onBack}><X /></Button></header>
      {error ? <p className="trail-empty">The board is unreachable right now. Try again in a moment.</p> : !rows ? <p className="trail-empty">Loading the world's best runs…</p> : rows.length === 0 ? <p className="trail-empty">No runs yet. Yours can be first.</p> : (
        <div className="board-list">
          {rows.map((r) => (
            <div className="board-row" key={`${r.pos}-${r.name}`}>
              <b>#{r.pos}</b>
              <Flag code={r.country} size={22} />
              <span><strong>{r.name}</strong><small>{r.arch.toUpperCase()} · LVL {r.level} · {r.xp.toLocaleString("en-US")} XP · {r.months} MO · {formatMoney(r.netWorth)}</small></span>
              <i>{(r.score ?? 0).toLocaleString("en-US")}</i>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function EndScreen({ run, net, score, ending, onRestart, onBoard }: { run: Run; net: number; score: number; ending: EndingKey; onRestart: () => void; onBoard: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const won = ending === "LEGEND" || ending === "SURVIVOR" || ending === "SELLOUT";
  const end = ENDINGS[ending];
  const send = async () => {
    setStatus("sending");
    try {
      await submitRun({
        name: run.config.name || "anon", arch: run.config.arch, country: run.config.country,
        difficulty: run.config.difficulty, mode: modeId(run.config), net: Math.round(Math.max(0, net)),
        score, xp: run.xp, level: levelFor(run.xp), rank: end.title, months: monthsSurvived(run.chapter), achievements: run.crises,
        trades: run.trades, survived: won, avatar: run.config.avatar,
      });
      setStatus("done");
    } catch { setStatus("error"); }
  };
  return (
    <main className={`journey-end ${won ? "won" : "lost"}`}>
      <img src={won ? smugBoss.url : enragedBoss.url} alt={won ? "The Boss respects your run" : "The Boss ends your run"} />
      <section>
        <p className="journey-kicker">{won ? "THE CYCLE IS COMPLETE" : "YOUR RUN IS OVER"}</p>
        <h1>{end.title}</h1>
        <p>{end.line}</p>
        <div className="end-score">
          <span><small>BOSS SCORE</small><strong>{score.toLocaleString("en-US")}</strong></span>
          <span><small>NET WORTH</small><strong>{formatMoney(net)}</strong></span>
          <span><small>MONTHS</small><strong>{monthsSurvived(run.chapter)}/{TOTAL_MONTHS}</strong></span>
          <span><small>LEVEL · XP</small><strong>{levelFor(run.xp)} · {run.xp.toLocaleString("en-US")}</strong></span>
          <span><small>CRISES</small><strong>{run.crises}</strong></span>
        </div>
        {run.statuses.length > 0 && <div className="cy-status-row">{run.statuses.map((s) => <span key={s}>{s}</span>)}</div>}
        <div className="start-actions">
          <Button onClick={send} disabled={status === "sending" || status === "done"}><Trophy />{status === "done" ? "SCORE SUBMITTED" : status === "sending" ? "SENDING…" : "CLAIM YOUR RANK"}</Button>
          <Button variant="outline" onClick={onBoard}>LEADERBOARD</Button>
          <Button variant="secondary" onClick={onRestart}>{won ? <Crown /> : <Skull />}PLAY AGAIN</Button>
        </div>
        {status === "error" && <small>The board rejected this run. Your local result still stands.</small>}
      </section>
    </main>
  );
}

export const PRESALE_COUNT = PRESALES.length;
