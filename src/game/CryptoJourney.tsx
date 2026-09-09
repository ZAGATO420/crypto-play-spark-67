import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ChevronRight, Crown, Flame, HeartPulse, History, Home, Receipt, Rocket, Share2, Shield, Skull, Swords, TrendingDown, TrendingUp, Trophy, Volume2, VolumeX, WalletCards, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import crownedBoss from "@/assets/boss/crowned.webp.asset.json";
import bossStageWide from "@/assets/boss/stage-wide.jpg.asset.json";
import bossStagePortrait from "@/assets/boss/stage-portrait.jpg.asset.json";
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
  ARCHETYPES, CHAPTERS, CHAPTER_WARNINGS, COINS, COUNTRIES, CUSTODY, DIFFICULTIES, ENDINGS, ENDING_HINTS, EXPLAIN, HOUSING, JOBS, MILESTONES, MODES, MODIFIERS, PERK_BLURB, PRESALES, STATUS_BY_CHOICE, TAX_RATE, TOTAL_MONTHS, XP, XP_EXTRA,
  actFor, attackFor, bossFightFor, bossReaction, bossScore, careCost, chapterLabel, chapterMonth, crashFor, custodyOf, decisionForChapter, doomIn, failureFor, formatMoney, hintFor, housingOf, isTaxChapter, jobOf, levelFor, levelPerk, modifierOf, monthRangeLabel, monthsSurvived, objectiveFor, personaFor, pickLifeEvent, presaleFor, situationFor, xpProgress,
  type Archetype, type BaseMode, type BossAttack, type BossFight, type CoinSymbol, type Country, type CustodyId, type Decision, type DecisionOption, type Difficulty, type EndingKey, type HousingId, type JobId, type ModifierId, type Presale, type Situation,
} from "./journey-data";

import { readProfile, recordRun, type Profile } from "./profile";


import { COIN_LOGO } from "./coin-logos";
import { Flag } from "./flags";
import { Minigame, type MiniKind, type MiniResult } from "./minigames";
import { loadBoard, submitRun, SubmitRunError, type BoardRow, type RunSubmission } from "./leaderboard";
import { getVolumes, initAudio, isMuted, playSfx, preloadSfx, setMood, setMusicVol, setMuted, setSfxVol, setTrack, wireAudio } from "./audio";
import { det, randomSeed } from "./rng";
import { PRIZES, countdown, currentSeasonId, isWallet, playerKey, readWallet, saveWallet, seasonEnd, seasonLabel, seasonSeed, shortWallet } from "./season";


/* ------------------------------------------------------------------ types */

type Kind = "spot" | "perp";
type Pos = { id: number; symbol: CoinSymbol; kind: Kind; dir: 1 | -1; lev: number; margin: number; entry: number; qty: number; where: CustodyId };
type Log = { chapter: number; title: string; detail: string; tone: "cyan" | "pink" | "yellow" };
type Entry = { chapter: number; label: string; amount: number };
type Config = { name: string; avatar: string; arch: Archetype; difficulty: Difficulty; mode: BaseMode; ironman: boolean; country: Country; tournament: boolean; season: string; modifier: ModifierId };
type BossBook = { cash: number; btc: number; line: string };
type Run = {
  chapter: number; cash: number; positions: Pos[]; nextId: number;
  hunger: number; stress: number; risk: number; streak: number; crises: number; trades: number; xp: number;
  custody: CustodyId; job: JobId; housing: HousingId; realized: number; taxDebt: number; moves: number; cares: number; criticals: number;
  ledger: Entry[]; statuses: string[]; logs: Log[]; noise: number[]; muted: boolean; seed: number; config: Config;
  boss: BossBook; conviction: number; convictionOn: boolean; perks: string[]; bossWins: number;
  /** The story of this run, in the player's own voice. Rendered on the end screen. */
  chronicle: string[];
  /** Milestone ids already lived through, so a beat never repeats. */
  seen: string[];
};


type Phase = "brief" | "act" | "resolve";
type LaunchResult = { name: string; tag: string; size: number; back: number; multi: number; rugged: boolean; line: string };
type Pending =
  | { t: "close"; id: number; fraction: number }
  | { t: "presale"; card: Presale; size: number }
  | { t: "crash"; chapter: number }
  | { t: "fight"; chapter: number; wager: number }
  | { t: "seed" };
type Dialog =
  | { k: "rules" }
  | { k: "market" }
  | { k: "trade"; symbol: CoinSymbol }
  | { k: "position"; id: number }
  | { k: "presale"; card: Presale }
  | { k: "launchResult"; res: LaunchResult }
  | { k: "survive" }
  | { k: "cashout" }
  | { k: "decision"; card: Decision }
  | { k: "situation"; card: Situation }
  | { k: "crash"; chapter: number }
  | { k: "failure"; chapter: number }
  | { k: "custody" }
  | { k: "life" }
  | { k: "ledger" }
  | { k: "mini"; kind: MiniKind; pending: Pending }
  | { k: "fight"; chapter: number }
  | { k: "offer"; attack: BossAttack }
  | { k: "score" }
  | { k: "year"; chapter: number }

  | { k: "sound" }
  | null;
type Screen = "start" | "setup" | "board" | "run" | "end";
type Resolution = { title: string; detail: string; tone: Log["tone"]; delta: number; move: number; lines: string[]; inflow: Entry[]; outflow: Entry[] };
type Pop = { id: number; text: string; tone: "xp" | "up" | "down" };


const SAVE_KEY = "tcfb_cycle_v2";
const PENDING_SUBMIT_KEY = "tcfb_pending_score_v1";
const AP_BASE = 2;
const AP_CAP = 5;
const LEVERAGE = [2, 5, 10] as const;
const FUNDING = 0.018; // per quarter, on notional — holding leverage is never free
const LIVE_MS = 13_000; // one quarter runs live in front of you
const BOSS_DRAG = 0.045; // even the Boss burns money on the throne


export const AVATARS = [
  { id: "ape", url: avApe.url }, { id: "astro", url: avAstro.url }, { id: "bot", url: avBot.url }, { id: "coder", url: avCoder.url },
  { id: "diamond", url: avDiamond.url }, { id: "frog", url: avFrog.url }, { id: "reaper", url: avReaper.url }, { id: "whale", url: avWhale.url },
];

const defaultConfig: Config = { name: "", avatar: "ape", arch: "trader", difficulty: "NORMAL", mode: "classic", ironman: false, country: "DE", tournament: false, season: currentSeasonId(), modifier: "straight" };
const archOf = (id: Archetype) => ARCHETYPES.find((a) => a.id === id) ?? ARCHETYPES[1]!;
const diffOf = (id: Difficulty) => DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1]!;
const modeOf = (id: BaseMode) => MODES.find((m) => m.id === id) ?? MODES[0]!;
const modeId = (c: Config) => (c.ironman ? `IRONMAN-${c.mode}` : c.mode);
const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

const badgeFor = (run: Run, ending: EndingKey, net: number) => {
  if (ending === "THRONE") return "THRONE TAKER";
  if (ending === "LEGEND") return "FINAL BOSS";
  if (ending === "CASINO") return "EXIT LIQUIDITY";
  if (ending === "BROKE") return run.trades >= 10 ? "CERTIFIED DEGEN" : "PAPER HANDS";
  if (ending === "STARVED" || ending === "BROKEN") return "CHART ADDICT";
  if (ending === "SELLOUT") return "PROFIT TAKER";
  if (run.crises >= 5 && net >= archOf(run.config.arch).cash * 8) return "DIAMOND HANDS";
  if (run.trades <= 3) return "HODL SURVIVOR";
  return "CYCLE SURVIVOR";
};

const DEATH_PUNCHLINES: Record<Exclude<EndingKey, "LEGEND" | "SURVIVOR" | "SELLOUT" | "THRONE">, string[]> = {
  CASINO: ["The liquidation engine sends its regards.", "You called it conviction. The exchange called it collateral.", "10x confidence. 0x account."],
  STARVED: ["You fed the bags. The bags did not feed you.", "Great portfolio. Shame about the human holding it.", "The candles were green. Your fridge was not."],
  BROKEN: ["The market stayed irrational longer than you stayed functional.", "You survived the volatility. Your nervous system did not.", "Touching grass was always free."],
  BROKE: ["Your portfolio has successfully become a tax deduction.", "Seven years of alpha, distilled into zero.", "The Boss thanks you for providing exit liquidity."],
};

const makeNoise = (mode: BaseMode, seed: number) => {
  const step = mode === "historical" ? 0 : mode === "chaos" ? 0.05 : 0.018;
  const cap = mode === "chaos" ? 0.4 : 0.12;
  let drift = 0;
  return Array.from({ length: 84 }, (_, i) => {
    drift = Math.max(-cap, Math.min(cap, drift + (det(seed, `noise-${i}`) * 2 - 1) * step));
    return 1 + drift;
  });
};

// Tournament runs all share the season seed, so every player meets the same
// market noise, the same rugs and the same drainers. Free runs stay random,
// unless a player asks for a rematch on the exact same seed.
const seedFor = (config: Config, reuse?: number) =>
  config.tournament ? seasonSeed(config.season) : reuse ?? randomSeed();

/** In the tournament the modifier is locked to the season seed, so it stays fair. */
export const tournamentModifier = (season: string): ModifierId =>
  MODIFIERS[Math.floor(det(seasonSeed(season), "modifier") * MODIFIERS.length) % MODIFIERS.length]!.id;

const freshRun = (config: Config, reuse?: number): Run => {
  const seed = seedFor(config, reuse);
  const mod = modifierOf(config.modifier).id;
  const start = Math.round(archOf(config.arch).cash * (mod === "glass" ? 0.5 : 1));
  return {
    chapter: 0, cash: start, positions: [], nextId: 1,
    hunger: 8, stress: 6, risk: 0, streak: 0, crises: 0, trades: 0, xp: 0,
    custody: "exchange", job: "dayjob", housing: "shared", realized: 0, taxDebt: mod === "debt" ? 8000 : 0, moves: 0, cares: 0, criticals: 0,
    ledger: mod === "debt" ? [{ chapter: 0, label: "Inherited tax debt", amount: -8000 }] : [], statuses: mod === "straight" ? [] : [modifierOf(mod).name],
    logs: [], noise: makeNoise(config.mode, seed), muted: false, seed, config,
    boss: { cash: start * 3, btc: 0, line: personaFor(det(seed, "persona")).line },
    conviction: 0, convictionOn: false, perks: [], bossWins: 0,
    chronicle: [`I started in ${chapterLabel(0)} with ${formatMoney(start)} and no idea what was coming.`], seen: [],

  };
};



const priceAt = (symbol: CoinSymbol, chapter: number, noise: number[]) => {
  const month = chapterMonth(chapter);
  const base = COINS.find((c) => c.symbol === symbol)?.prices[month] ?? 0;
  return base ? base * (noise[month] ?? 1) : 0;
};

/**
 * The quarter is not a jump any more: t walks from 0 to 1 in front of the
 * player, with real intra-quarter wicks on top of the historical path.
 * Deterministic, so a tournament seed shows everyone the same tape.
 */
const livePrice = (symbol: CoinSymbol, r: Run, t: number, sweep = false) => {
  const a = priceAt(symbol, r.chapter, r.noise);
  if (!a) return 0;
  const b = priceAt(symbol, r.chapter + 1, r.noise) || a;
  const span = Math.abs(b / a - 1);
  const phase = det(r.seed, `wick-${r.chapter}-${symbol}`) * Math.PI * 2;
  const amp = (0.35 + det(r.seed, `amp-${r.chapter}-${symbol}`) * 0.7) * Math.max(0.05, span);
  const wick = Math.sin(t * Math.PI * 3 + phase) * amp * (1 - t * 0.55);
  const hunt = sweep ? -Math.max(0, Math.sin(t * Math.PI * 2)) * (0.05 + span * 0.5) : 0;
  return Math.max(a * 0.02, (a + (b - a) * t) * (1 + wick + hunt));
};

const pnlOf = (p: Pos, price: number) => (p.kind === "spot" ? p.qty * price - p.margin : p.margin * p.lev * p.dir * (price / p.entry - 1));
const valueOf = (p: Pos, price: number) => (p.kind === "spot" ? p.qty * price : Math.max(0, p.margin + pnlOf(p, price)));
const liqPct = (p: Pos, price: number) => (p.kind === "spot" ? 100 : clamp(100 + (pnlOf(p, price) / p.margin) * 100, 0, 100));
const netOf = (r: Run) => r.positions.reduce((sum, p) => sum + valueOf(p, priceAt(p.symbol, r.chapter, r.noise)), r.cash) - r.taxDebt;
const bossNetOf = (r: Run, chapter = r.chapter) => Math.round(r.boss.cash + r.boss.btc * priceAt("BTC", chapter, r.noise));
const XP_MODE: Record<BaseMode, number> = { classic: 1, historical: 0.75, chaos: 1.25 };
const custodySplit = (r: Run) => {
  const totals: Record<CustodyId, number> = { exchange: 0, hot: 0, cold: 0 };
  for (const p of r.positions) totals[p.where] += valueOf(p, priceAt(p.symbol, r.chapter, r.noise));
  const sum = totals.exchange + totals.hot + totals.cold;
  return { totals, sum };
};

/** Three readings, one of them a lie. Knowing the cycle is the edge. */
const signalsFor = (r: Run) => {
  const move = (() => {
    const a = priceAt("BTC", r.chapter, r.noise);
    const b = priceAt("BTC", r.chapter + 1, r.noise) || a;
    return a ? (b / a - 1) * 100 : 0;
  })();
  const up = move >= 0;
  const truths = [
    { label: "FUNDING", value: up ? "positive and climbing" : "negative, shorts are paying" },
    { label: "OPEN INTEREST", value: up ? "building into the move" : "unwinding fast" },
    { label: "SENTIMENT", value: up ? "greedy" : "fearful" },
  ];
  const lie = Math.floor(det(r.seed, `lie-${r.chapter}`) * 3) % 3;
  return truths.map((s, i) => (i === lie
    ? { ...s, value: i === 0 ? (up ? "negative, shorts are paying" : "positive and climbing") : i === 1 ? (up ? "unwinding fast" : "building into the move") : (up ? "fearful" : "greedy"), lie: true }
    : { ...s, lie: false }));
};

/** The Boss rebalances his own book every quarter. He is right more often than you. */
const bossTurn = (r: Run, next: number): BossBook => {
  const p0 = priceAt("BTC", r.chapter, r.noise) || 1;
  const value = (r.boss.cash + r.boss.btc * p0) * (1 - BOSS_DRAG);
  const upNext = (priceAt("BTC", next, r.noise) || p0) >= p0;
  const smart = det(r.seed, `bossiq-${next}`) < 0.6;
  const long = smart ? upNext : !upNext;
  const target = long ? 0.85 : 0.12;
  const btc = (value * target) / p0;
  const line = long
    ? "He loaded the boat while you were thinking about it."
    : "He sold into your optimism and is sitting on cash.";
  return { cash: value - btc * p0, btc, line };
};


const readPendingSubmission = (): RunSubmission | null => {
  try { return JSON.parse(localStorage.getItem(PENDING_SUBMIT_KEY) ?? "null") as RunSubmission | null; }
  catch { return null; }
};
const savePendingSubmission = (submission: RunSubmission) => localStorage.setItem(PENDING_SUBMIT_KEY, JSON.stringify(submission));
const clearPendingSubmission = (clientHash: string) => {
  if (readPendingSubmission()?.clientHash === clientHash) localStorage.removeItem(PENDING_SUBMIT_KEY);
};
const retryPendingSubmission = async () => {
  const pending = readPendingSubmission();
  if (!pending) return;
  try { await submitRun(pending); clearPendingSubmission(pending.clientHash); }
  catch (error) { if (error instanceof SubmitRunError && error.kind === "rejected") clearPendingSubmission(pending.clientHash); }
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
  const [tournament, setTournament] = useState(false);

  const [pops, setPops] = useState<Pop[]>([]);
  const [shake, setShake] = useState(false);
  // the feeling layer: a coloured flash over everything, and the Boss talking back
  const [fxFlash, setFxFlash] = useState<"gold" | "red" | null>(null);
  const [bossTalk, setBossTalk] = useState<string | null>(null);
  const [details, setDetails] = useState(false);

  const [muted, setMutedState] = useState(false);
  const [vols, setVols] = useState({ musicVol: 0.35, sfxVol: 0.6 });
  useEffect(() => { wireAudio(); initAudio(); preloadSfx(); setMutedState(isMuted()); setVols(getVolumes()); }, []);
  const [netPulse, setNetPulse] = useState<"up" | "down" | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const flashTimer = useRef<number | null>(null);
  const popId = useRef(1);
  const lastNet = useRef(0);

  // the live quarter: t walks 0 -> 1 while you act, then the market answers
  const [tick, setTick] = useState(0);
  const [fast, setFast] = useState(false);
  const [verified, setVerified] = useState(false);
  const tickRef = useRef(0);

  const cfg = run.config;
  const arch = archOf(cfg.arch);
  const diff = diffOf(cfg.difficulty);
  const net = netOf(run);
  const score = bossScore({ net, chapters: run.chapter, difficulty: cfg.difficulty, crises: run.crises, streak: run.streak, modifier: cfg.modifier });
  const btcMove = pctMove("BTC", run);
  const warning = CHAPTER_WARNINGS[run.chapter] ?? "The market never announces what it is about to do.";
  const presale = presaleFor(run.chapter);
  const xpBar = xpProgress(run.xp);
  const persona = personaFor(det(run.seed, "persona"));
  const act = actFor(run.chapter);
  const attack = attackFor(run.chapter, det(run.seed, `attack-${run.chapter}`), persona.bias);
  const sweeping = attack?.id === "SWEEP";

  const signals = useMemo(() => signalsFor(run), [run.chapter, run.seed, run.noise]);
  const bossNet = bossNetOf(run);
  const perkFee = run.perks.includes("CHEAP FEES") ? 0.5 : 1;
  /** During the live phase every price is the moving one. */
  const mark = (symbol: CoinSymbol) => (phase === "act" ? livePrice(symbol, run, tick, sweeping) : priceAt(symbol, run.chapter, run.noise));


  useEffect(() => {
    if (localStorage.getItem(SAVE_KEY)) setResume(true);
    void retryPendingSubmission();
    const retry = () => { void retryPendingSubmission(); };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);
  useEffect(() => { void setTrack(screen === "run" ? "run" : "menu"); }, [screen]);
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
  /** The music leans with the market: hyped in a bull, choked in a crash. */
  useEffect(() => {
    if (screen !== "run") return;
    const danger = crashFor(run.chapter) || run.stress > 75 || run.hunger > 75 || run.risk > 85;
    setMood(danger ? "tense" : run.streak >= 2 ? "hype" : "calm");
  }, [screen, run.chapter, run.stress, run.hunger, run.risk, run.streak]);


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
        playSfx("level");
        window.setTimeout(() => setLevelUp(null), 2200);
      }
      return { ...r, xp: next };
    });
    pop(`+${gain} XP${label ? ` · ${label}` : ""}`, "xp");
  };

  const rumble = () => { playSfx("crash"); setShake(true); window.setTimeout(() => setShake(false), 520); };

  /**
   * One place decides how a moment *feels*: sound, colour, shake, the flying
   * number and what the Boss says about it. Every action calls this instead of
   * wiring its own effects, so nothing on screen stays silent.
   */
  const feel = (kind: "win" | "loss" | "liq" | "crash" | "save" | "green" | "red" | "idle", amount?: number) => {
    const salt = run.chapter * 7 + run.trades + run.moves;
    if (kind === "win" || kind === "green" || kind === "save") { setFxFlash("gold"); playSfx(kind === "save" ? "hit" : "win"); }
    if (kind === "loss" || kind === "red") { setFxFlash("red"); playSfx("sell"); }
    if (kind === "liq" || kind === "crash") { setFxFlash("red"); rumble(); }
    if (kind === "idle") playSfx("click");
    if (amount !== undefined && Math.abs(amount) >= 1) pop(`${amount >= 0 ? "+" : "−"}${formatMoney(Math.abs(amount))}`, amount >= 0 ? "up" : "down");
    setBossTalk(bossReaction(kind, salt));
    window.setTimeout(() => setFxFlash(null), 620);
  };

  const spend = (cost = 1) => { setAp((a) => Math.max(0, a - cost)); setRun((r) => ({ ...r, moves: r.moves + 1 })); };

  /** Every dollar that moves gets a line in the books. Nothing is invisible. */
  const book = (r: Run, label: string, amount: number): Run => ({ ...r, ledger: [{ chapter: r.chapter, label, amount }, ...r.ledger].slice(0, 60) });

  /** One line of the story, told in the first person, kept for the end screen. */
  const chron = (r: Run, line: string): Run => ({ ...r, chronicle: [...r.chronicle, line].slice(-14) });


  /* ---------------------------------------------------------- run actions */

  const openSpot = (symbol: CoinSymbol, fraction: number) => {
    const price = mark(symbol);
    setDialog(null);
    if (!price) return say(`${symbol} does not exist yet. Time travel has rules.`, "pink");
    const cust = custodyOf(run.custody);
    const budget = Math.floor(run.cash * fraction);
    const size = Math.floor(budget / (1 + cust.fee * perkFee));
    if (size < 50) return say("Under $50. The Boss has more in his couch cushions.", "pink");
    const fee = Math.round(size * cust.fee * perkFee);

    spend();
    setRun((r) => {
      if (r.cash < size + fee) return r;
      return book(book({
        ...r, cash: r.cash - size - fee, trades: r.trades + 1,
        positions: [...r.positions, { id: r.nextId, symbol, kind: "spot", dir: 1, lev: 1, margin: size, entry: price, qty: size / price, where: r.custody }],
        nextId: r.nextId + 1,
      }, `Bought ${symbol} spot`, -size), `${cust.short} fee`, -fee);
    });
    log({ chapter: run.chapter, title: `LONG ${symbol} SPOT`, detail: `${formatMoney(size)} at ${formatMoney(price)} · held in ${cust.short}.`, tone: "cyan" });
    say(`${formatMoney(size)} into ${symbol}, sitting in your ${cust.short}.`, "cyan");
    playSfx("buy");
    grantXp(XP.trade, "TRADE");
  };

  const openPerp = (symbol: CoinSymbol, dir: 1 | -1, lev: number, fraction: number) => {
    const price = mark(symbol);
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
    playSfx("buy");
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
    playSfx("sell");
    const pos = run.positions.find((p) => p.id === id);
    if (!pos) return;
    const cust = custodyOf(pos.where);
    // cold storage fills a quarter late — that is the price of being untouchable
    const price = pos.where === "cold" ? priceAt(pos.symbol, Math.max(0, run.chapter - 1), run.noise) : mark(pos.symbol);
    const slip = 0.94 + quality * 0.08;
    const whole = valueOf(pos, price) * slip;
    const back = Math.round(whole * fraction);
    const fee = Math.round(back * cust.fee * perkFee);
    const cost = pos.margin * fraction;
    const gain = back - fee - cost;

    if (pos.where === "cold") spend();
    setRun((r) => book(book({
      ...r,
      cash: r.cash + back - fee,
      trades: r.trades + 1,
      realized: r.realized + gain,
      risk: pos.kind === "perp" ? clamp(r.risk - pos.lev * 4 * fraction) : r.risk,
      positions: fraction >= 1
        ? r.positions.filter((p) => p.id !== id)
        : r.positions.map((p) => (p.id === id ? { ...p, margin: p.margin * (1 - fraction), qty: p.qty * (1 - fraction) } : p)),
    }, `Closed ${pos.symbol}`, back), `${cust.short} fee`, -fee));
    log({ chapter: run.chapter, title: `CLOSED ${pos.symbol}`, detail: `${formatMoney(back)} back · ${gain >= 0 ? "+" : ""}${formatMoney(gain)}${pos.where === "cold" ? " · settled a quarter late" : ""}.`, tone: gain >= 0 ? "yellow" : "pink" });
    say(`${pos.symbol} closed for ${formatMoney(back)} · ${gain >= 0 ? "+" : ""}${formatMoney(gain)}`, gain >= 0 ? "yellow" : "pink");
    feel(gain >= 0 ? "win" : "loss", gain);
    grantXp((gain >= 0 ? XP.closeWin : XP.closeLoss) + (quality >= 1 ? XP_EXTRA.minigamePerfect : quality > 0.5 ? XP_EXTRA.minigameOk : 0), gain >= 0 ? "PROFIT TAKEN" : "LESSON");
    if (Math.abs(gain) >= 25_000) setRun((r) => chron(r, gain >= 0
      ? `In ${chapterLabel(run.chapter)} I took ${formatMoney(gain)} out of ${pos.symbol} and felt untouchable.`
      : `${chapterLabel(run.chapter)}: I closed ${pos.symbol} for a ${formatMoney(Math.abs(gain))} loss and told myself it was tuition.`));

  };

  /**
   * One tap on a chip is a market exit at the live price. Fast, slightly worse
   * fill, no window in the way — speed instead of clicking.
   */
  const quickClose = (id: number) => {
    const pos = run.positions.find((p) => p.id === id);
    if (!pos) return;
    if (pos.where === "cold") return setDialog({ k: "position", id });
    closePosition(id, 1, 0.5);
  };

  /** Double or nothing on the whole quarter. The bar took you a while to fill. */
  const toggleConviction = () => {
    if (run.conviction < 100 && !run.convictionOn) return say("Conviction is not full yet. Win quarters, fill the bar.", "pink");
    playSfx("hit");
    setRun((r) => ({ ...r, convictionOn: !r.convictionOn }));
    say(run.convictionOn ? "Conviction back in the holster." : "CONVICTION ARMED · this quarter counts 1.5x, win or lose.", "yellow");
  };

  const takeOffer = (amount: number) => {
    setDialog(null);
    playSfx("vault");
    setRun((r) => book({ ...r, cash: r.cash + amount, statuses: Array.from(new Set([...r.statuses, "BOSS DEBT"])), stress: clamp(r.stress + 6) }, "The Boss bought you out", amount));
    log({ chapter: run.chapter, title: "TOOK THE OFFER", detail: `${formatMoney(amount)} now, a cut of every quarter forever.`, tone: "pink" });
    say(`${formatMoney(amount)} in your account. He owns a piece of you now.`, "pink");
  };

  /** A boss fight: stake real money, land the skill moment, live with it. */
  const resolveFight = (chapter: number, wager: number, quality: number) => {
    const fight = bossFightFor(chapter);
    if (!fight) return nextInQueue();
    if (quality >= 0.9) {
      const won = Math.round(wager * 2);
      setRun((r) => chron(book({
        ...r, cash: r.cash + won, bossWins: r.bossWins + 1, conviction: clamp(r.conviction + 35),
        boss: { ...r.boss, cash: Math.max(0, r.boss.cash - won), line: "He is not smiling any more." },
        perks: Array.from(new Set([...r.perks, fight.perk])),
        statuses: Array.from(new Set([...r.statuses, "BOSS BEATEN"])),
      }, `${fight.title} · won`, won), `I beat him at ${fight.title.replace(/^.*· /, "")} and took ${formatMoney(won)} off his table.`));
      say(`You took ${formatMoney(won)} off the Boss. Perk unlocked: ${fight.perk}.`, "yellow");
      feel("win", won);
      grantXp(XP_EXTRA.escape * 2, "BOSS BEATEN");
    } else if (quality >= 0.5) {
      setRun((r) => ({ ...r, stress: clamp(r.stress + 8), conviction: clamp(r.conviction + 10) }));
      say("A draw. He keeps the chair, you keep your stake.", "cyan");
      feel("save");
      grantXp(XP_EXTRA.minigameOk, "HELD YOUR GROUND");
    } else {
      setRun((r) => chron(book({
        ...r, cash: Math.max(0, r.cash - wager), stress: clamp(r.stress + 16), conviction: 0, convictionOn: false,
        boss: { ...r.boss, cash: r.boss.cash + wager, line: "He counted your money in front of you." },
      }, `${fight.title} · lost`, -wager), `He took ${formatMoney(wager)} off me in ${chapterLabel(chapter)} and made sure the room saw it.`));
      say(`He took ${formatMoney(wager)} and told the room about it.`, "pink");
      feel("liq", -wager);
    }

    nextInQueue();
  };


  const takePresale = (card: Presale, size: number, quality: number) => {
    if (run.cash < size) { setDialog(null); return say(`${card.name} needs ${formatMoney(size)} — you hold ${formatMoney(run.cash)}.`, "pink"); }
    spend();
    if (quality < 0.2) {
      const gas = Math.round(size * 0.06);
      setRun((r) => book({ ...r, cash: Math.max(0, r.cash - gas), stress: clamp(r.stress + 10) }, `${card.name} · missed mint (gas)`, -gas));
      log({ chapter: run.chapter, title: `MISSED · ${card.name}`, detail: "Gas too low. The bots filled the whole allocation.", tone: "pink" });
      return setDialog({ k: "launchResult", res: { name: card.name, tag: card.tag, size: Math.round(size * 0.06), back: 0, multi: 0, rugged: true, line: "Your transaction never made it into the block. Gas is a skill." } });
    }
    const rugged = det(run.seed, `rug-${run.chapter}-${card.name}`) < card.rug / (arch.risk || 1);
    const multi = rugged ? 0.08 : (card.upside[0] + det(run.seed, `multi-${run.chapter}-${card.name}`) * (card.upside[1] - card.upside[0])) * (0.85 + quality * 0.3);

    const back = Math.round(size * multi);
    setRun((r) => book(book({
      ...r, cash: r.cash - size + back, trades: r.trades + 1,
      realized: r.realized + back - size,
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
    if (ap <= 0) return say("Eating costs a move like everything else. None left this quarter.", "pink");
    if (run.cares >= diff.caps) return say(`You already looked after yourself ${run.cares}x this quarter. That is the limit.`, "pink");
    const cost = careCost(kind, run.chapter, cfg.difficulty);
    if (run.cash < cost) return say(`${kind === "eat" ? "Food" : "Calm"} costs ${formatMoney(cost)}. You cannot afford to survive.`, "pink");
    playSfx("care");
    // second helping does far less: you cannot buy your way out of survival
    const relief = Math.round(42 * diff.care * (run.cares === 0 ? 1 : run.cares === 1 ? 0.55 : 0.3));
    spend();
    setRun((r) => book({
      ...r, cash: r.cash - cost, cares: r.cares + 1,
      hunger: kind === "eat" ? clamp(r.hunger - relief) : r.hunger,
      stress: kind === "calm" ? clamp(r.stress - relief) : r.stress,
    }, kind === "eat" ? "Groceries" : "Time off / therapy", -cost));
    say(kind === "eat" ? `Fed. Hunger down ${relief}. That was a move you did not trade.` : `Head cleared. Stress down ${relief}.`, "cyan");
    grantXp(XP.survive, "STILL ALIVE");
  };

  /** Walk away mid-run: everything sells at today's price, then the books close. */
  const cashOut = () => {
    setDialog(null);
    playSfx("sell");
    let cash = run.cash;
    let realized = run.realized;
    const ledger: Entry[] = [];
    for (const p of run.positions) {
      const cust = custodyOf(p.where);
      const price = priceAt(p.symbol, run.chapter, run.noise);
      const gross = Math.round(valueOf(p, price) * 0.96);
      const fee = Math.round(gross * cust.fee);
      cash += gross - fee;
      realized += gross - fee - p.margin;
      ledger.push({ chapter: run.chapter, label: `Exit ${p.symbol}`, amount: gross - fee });
    }
    if (realized > 0) {
      const bill = Math.round(realized * TAX_RATE);
      cash -= bill;
      ledger.push({ chapter: run.chapter, label: `Exit tax on ${formatMoney(realized)}`, amount: -bill });
    }
    if (run.taxDebt > 0) {
      const paid = Math.min(Math.max(0, cash), run.taxDebt);
      cash -= paid;
      ledger.push({ chapter: run.chapter, label: "Outstanding tax debt", amount: -paid });
    }
    setRun((r) => ({ ...r, cash: Math.max(0, Math.round(cash)), positions: [], taxDebt: 0, realized: 0, ledger: [...ledger, ...r.ledger].slice(0, 60) }));
    finish("SELLOUT");
  };


  /** Moving the bag is the most important button in the game. */
  const setCustody = (id: CustodyId) => {
    setDialog(null);
    playSfx("vault");
    if (id === run.custody) return say(`Everything already sits in your ${custodyOf(id).short}.`, "cyan");
    if (ap <= 0) return say("Moving coins costs a move. None left this quarter.", "pink");
    spend();
    const moved = run.positions.filter((p) => p.kind === "spot");
    const value = moved.reduce((s, p) => s + valueOf(p, priceAt(p.symbol, run.chapter, run.noise)), 0);
    const fee = Math.round(value * 0.004);
    if (run.cash < fee) return say(`Moving these bags costs ${formatMoney(fee)}. Keep enough cash for the network.`, "pink");
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
    playSfx("click");
    const status = STATUS_BY_CHOICE[option.label];
    setRun((r) => {
      const positions = r.positions.map((p) => (option.bagMul !== undefined ? { ...p, margin: p.margin * option.bagMul, qty: p.qty * option.bagMul } : p));
      const cashAfter = Math.max(0, Math.round(r.cash * (option.cashMul ?? 1) + (option.cash ?? 0)));
      const moved: Run = {
        ...r,
        cash: cashAfter,
        positions,
        stress: clamp(r.stress + Math.round((option.stress ?? 0) * arch.risk * 0.55)),
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
    const title = crashFor(chapter)?.title ?? "the crash";
    if (quality >= 0.9) {
      setRun((r) => chron({ ...r, stress: clamp(r.stress - 10), statuses: Array.from(new Set([...r.statuses, "COLD BLOODED"])) }, `I saw ${title} coming and got out with my hands steady.`));
      say("You de-risked into the crash. The Boss hates good reflexes.", "yellow");
      feel("save");
      grantXp(XP_EXTRA.escape, "CRASH DODGED");
    } else if (quality >= 0.5) {
      setRun((r) => ({ ...r, positions: r.positions.map((p) => ({ ...p, margin: p.margin * 0.94, qty: p.qty * 0.94 })), stress: clamp(r.stress + 6) }));
      say("Half your orders filled. The rest went through at panic prices.", "cyan");
      feel("crash");
      grantXp(XP_EXTRA.minigameOk, "PARTIAL EXIT");
    } else {
      setRun((r) => chron({ ...r, positions: r.positions.map((p) => ({ ...p, margin: p.margin * 0.84, qty: p.qty * 0.84 })), stress: clamp(r.stress + 16) }, `${title} hit and I just sat there watching the numbers fall.`));
      say("You froze. The book emptied without you.", "pink");
      feel("crash");
    }
    nextInQueue();
  };


  const resolveSeed = (quality: number) => {
    if (quality >= 0.9) {
      say("Seed recovered word for word. Cold storage intact.", "yellow");
      grantXp(XP_EXTRA.escape, "KEYS SECURED");
    } else if (quality >= 0.5) {
      setRun((r) => book({ ...r, cash: Math.max(0, r.cash - 400), stress: clamp(r.stress + 8) }, "Recovery service", -400));
      say("You needed help to recover it. Embarrassing, survivable.", "cyan");
    } else {
      setRun((r) => ({ ...r, positions: r.positions.map((p) => (p.where === "cold" ? { ...p, margin: p.margin * 0.5, qty: p.qty * 0.5 } : p)), stress: clamp(r.stress + 22) }));
      say("Half your cold bag is locked behind a phrase you cannot remember.", "pink");
      rumble();
    }
    nextInQueue();
  };

  const finishMini = (pending: Pending, res: MiniResult) => {
    playSfx("hit");
    if (pending.t === "close") return closePosition(pending.id, pending.fraction, res.quality);
    if (pending.t === "presale") return takePresale(pending.card, pending.size, res.quality);
    if (pending.t === "crash") return resolveCrash(pending.chapter, res.quality);
    if (pending.t === "fight") return resolveFight(pending.chapter, pending.wager, res.quality);
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
    playSfx("quarter");
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
    let lifeHunger = 0;
    let lifeStress = 0;
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
      for (const p of survivors.filter((p) => p.kind === "perp")) {
        const returned = Math.round(valueOf(p, priceAt(p.symbol, next, run.noise)));
        cash += returned;
        earnFrom(`${p.symbol} ${p.lev}x force-close`, returned);
        lines.push(`Risk overheated: ${p.symbol} ${p.lev}x force-closed · ${formatMoney(returned)} returned.`);
      }
    }
    let positions = run.risk >= 95 ? survivors.filter((p) => p.kind !== "perp") : survivors;
    if (run.risk >= 95) risk = 40;

    // perp funding: leverage is rented, never owned — and the Boss can raise the rent
    const squeeze = attack?.id === "SQUEEZE" ? 2.2 : 1;
    const funding = Math.round(positions.filter((p) => p.kind === "perp").reduce((s, p) => s + p.margin * p.lev * FUNDING * squeeze, 0));
    if (funding > 0) { cash -= funding; spendOn(squeeze > 1 ? "Perp funding · squeezed" : "Perp funding", funding); lines.push(`Perp funding: ${formatMoney(funding)}${squeeze > 1 ? " — he doubled the rate." : "."}`); }

    // the price of taking his money
    if (run.statuses.includes("BOSS DEBT")) {
      const cut = Math.round(Math.max(600, startNet * 0.02));
      cash -= cut;
      spendOn("The Boss takes his cut", cut);
      lines.push(`He took his cut: ${formatMoney(cut)}. That deal never expires.`);
    }


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
    if (hotSpot.length && det(run.seed, `drain-${next}`) < custodyOf("hot").drain) {
      const bite = Math.round(hotSpot.reduce((s, p) => s + valueOf(p, priceAt(p.symbol, next, run.noise)) * 0.12, 0));
      positions = positions.map((p) => (p.where === "hot" ? { ...p, margin: p.margin * 0.88, qty: p.qty * 0.88 } : p));
      spendOn("Wallet drainer", bite);
      lines.push(`A malicious approval drained ${formatMoney(bite)} from your hot wallet.`);
    }

    // life: income in, old tax debt serviced, then rent and food out
    const job = jobOf(run.job);
    const house = housingOf(run.housing);
    if (job.income > 0) { cash += job.income; earnFrom(`${job.name} income`, job.income); }
    if (taxDebt > 0 && cash > 0) {
      const paid = Math.min(cash, taxDebt);
      cash -= paid;
      taxDebt -= paid;
      spendOn("Tax debt payment", paid);
      lines.push(`Tax debt payment: ${formatMoney(paid)}.`);
    }
    const rent = Math.round(house.rent * diff.cost);
    const food = Math.round((520 + Math.floor(next / 4) * 190) * diff.cost * levelPerk(levelFor(run.xp)));
    cash -= rent + food;
    spendOn(`Rent · ${house.name}`, rent);
    spendOn("Food & living", food);
    lines.push(`Rent ${formatMoney(rent)} · living ${formatMoney(food)} · income ${formatMoney(job.income)}.`);

    // tax once a year on what you actually realised
    if (isTaxChapter(next) && realized > 0) {
      const bill = Math.round(realized * TAX_RATE);
      const paid = Math.min(cash, bill);
      cash -= paid;
      if (paid > 0) spendOn(`Tax on ${formatMoney(realized)} net profit`, paid);
      if (paid < bill) {
        const unpaid = Math.round((bill - paid) * 1.2);
        taxDebt += unpaid;
        lines.push(`Tax bill ${formatMoney(bill)} · ${formatMoney(paid)} paid · ${formatMoney(unpaid)} debt after penalty.`);
      } else lines.push(`Tax bill paid: ${formatMoney(bill)}.`);
      realized = 0;
    }
    if (taxDebt > 0 && !isTaxChapter(next)) taxDebt = Math.round(taxDebt * 1.05);
    cash = Math.max(0, cash);

    // a private life happens whether the chart cares or not
    if (next > 1 && det(run.seed, `life-${next}`) < 0.42) {
      const ev = pickLifeEvent(det(run.seed, `life-pick-${next}`));

      if (ev.cash < 0) { cash = Math.max(0, cash + ev.cash); spendOn(ev.label, -ev.cash); }
      else { cash += ev.cash; earnFrom(ev.label, ev.cash); }
      lines.push(`${ev.label}: ${ev.line}`);
      lifeHunger = ev.hunger ?? 0;
      lifeStress = ev.stress ?? 0;
    }

    // doing nothing is a choice, and it costs
    const idle = run.moves === 0;
    // leverage does not only cost money, it costs sleep
    const notional = positions.filter((p) => p.kind === "perp").reduce((s, p) => s + p.margin * p.lev, 0);
    const levered = Math.min(18, Math.round((notional / Math.max(1, startNet)) * 12));
    const hunger = clamp(run.hunger + Math.round((8 + Math.floor(next / 6)) * arch.risk * diff.hunger) + (idle ? 7 : 0) + lifeHunger);
    const redQuarter = netOf({ ...run, chapter: next, cash, positions, taxDebt }) < startNet;
    const nerves = run.perks.includes("STEEL NERVES") ? 0.7 : 1;
    const stress = clamp(
      run.stress + Math.round(((6 + Math.floor(next / 7)) * arch.risk * diff.stress + (idle ? 10 : 0)
      + Math.round(job.stress * 0.5) - house.calm + levered + (redQuarter ? 8 : -3) + lifeStress) * nerves),
    );

    if (idle) lines.push("You made no moves this quarter. Boredom and doubt did the work instead.");
    if (levered >= 8) lines.push("Your leverage kept you awake. Stress climbed with the notional.");

    const critical = hunger >= 80 || stress >= 80;
    const criticals = run.criticals + (critical ? 1 : 0);
    if (critical) lines.push("You are running on empty. Shaking hands cost you a move next quarter.");

    const ledger = [...outflow, ...inflow, ...run.ledger].slice(0, 60);
    const draft: Run = { ...run, chapter: next, cash, positions, risk, hunger, stress, crises, taxDebt, realized, ledger, moves: 0, cares: 0, criticals };
    const endNet = netOf(draft);
    const delta = endNet - startNet;

    // conviction: you called the quarter, so the quarter pays or bills you double
    let convCash = 0;
    if (run.convictionOn) {
      convCash = Math.round(delta * 0.5);
      draft.cash = Math.max(0, draft.cash + convCash);
      draft.ledger = [{ chapter: next, label: convCash >= 0 ? "Conviction paid off" : "Conviction backfired", amount: convCash }, ...draft.ledger].slice(0, 60);
      lines.push(convCash >= 0
        ? `Conviction paid: ${formatMoney(convCash)} extra.`
        : `Conviction backfired: ${formatMoney(Math.abs(convCash))} gone. He warned you.`);
    }

    const streak = delta > 0 && !idle ? run.streak + 1 : 0;
    const move = pctMove("BTC", draft);
    const title = delta >= 0 ? (streak >= 3 ? `GREEN QUARTER · STREAK x${streak}` : "GREEN QUARTER") : "RED QUARTER";
    const detail = `${chapterLabel(next)} · ${monthRangeLabel(next)}: BTC ${move >= 0 ? "+" : ""}${move.toFixed(1)}%. Your book ${delta >= 0 ? "gained" : "lost"} ${formatMoney(Math.abs(delta))}.`;
    const tone: Log["tone"] = delta >= 0 ? (streak >= 3 ? "yellow" : "cyan") : "pink";

    // the Boss trades his own book against yours, every single quarter
    const boss = bossTurn(run, next);
    const conviction = run.convictionOn ? 0 : clamp(run.conviction + (delta > 0 && !idle ? 22 : delta < 0 ? -12 : 4));
    lines.push(boss.line);

    const liquidated = lines.some((l) => l.includes("liquidated"));
    // the story of the run writes itself from the quarters that actually hurt or paid
    const story: string[] = [];
    if (liquidated) story.push(`${chapterLabel(next)}: I got liquidated and stared at an empty position for a while.`);
    if (failure && lines.some((l) => l.includes(failure.name) && l.includes("gone"))) story.push(`${failure.name} took money that was supposed to be mine.`);
    if (Math.abs(delta) >= Math.max(40_000, startNet * 0.5)) story.push(delta > 0
      ? `${chapterLabel(next)} paid me ${formatMoney(delta)} and I thought I had figured it out.`
      : `${chapterLabel(next)} cost me ${formatMoney(Math.abs(delta))} and I stopped opening the app for a week.`);
    const milestone = MILESTONES.find((m) => !run.seen.includes(m.id) && netOf(draft) >= m.net);

    const nextRun: Run = {
      ...draft, streak, boss, conviction, convictionOn: false,
      chronicle: [...draft.chronicle, ...story, ...(milestone ? [milestone.line] : [])].slice(-14),
      seen: milestone ? [...run.seen, milestone.id] : run.seen,
      logs: [{ chapter: next, title, detail, tone }, ...run.logs].slice(0, 12),
    };
    setRun(nextRun);
    setResolution({ title, detail, tone, delta: delta + convCash, move, lines, inflow, outflow });
    setPhase("resolve");
    setTick(0);
    setFast(false);
    setVerified(false);
    setAp(Math.max(1, Math.min(AP_CAP, AP_BASE + job.ap + ap - (critical ? 1 : 0) + (run.perks.includes("+1 MOVE") ? 1 : 0))));
    grantXp((idle ? 0 : XP.chapter) + (delta >= 0 && !idle ? XP.greenQuarter : 0) + streak * XP.streakStep, idle ? "IDLE QUARTER" : delta >= 0 ? "GREEN QUARTER" : "MONTHS SURVIVED");
    feel(liquidated ? "liq" : idle ? "idle" : delta >= 0 ? "green" : "red", delta + convCash);
    if (milestone) say(milestone.line, "yellow");
    if (critical) { setShake(true); window.setTimeout(() => setShake(false), 520); }


    const finalNet = netOf(nextRun);
    if (hunger >= 100) return finish("STARVED");
    if (stress >= 100) return finish("BROKEN");
    if (finalNet <= 0) return finish(positions.length === 0 && lines.some((l) => l.includes("liquidated")) ? "CASINO" : "BROKE");
    if (next >= CHAPTERS) {
      // beating him means out-trading his book and taking his fights
      if (finalNet > bossNetOf(nextRun, next) && nextRun.bossWins >= 3 && criticals === 0) return finish("THRONE");
      return finish(finalNet > archOf(cfg.arch).cash * 60 && crises >= 6 && criticals === 0 && run.trades >= 12 ? "LEGEND" : "SURVIVOR");
    }
  };


  const openChapterCards = (chapter: number) => {
    const cards: Dialog[] = [];
    // the Boss steps up first: his fights and his offers open the quarter
    if (bossFightFor(chapter)) cards.push({ k: "fight", chapter });
    const atk = attackFor(chapter, det(run.seed, `attack-${chapter}`), personaFor(det(run.seed, "persona")).bias);
    if (atk?.id === "OFFER") cards.push({ k: "offer", attack: atk });
    if (crashFor(chapter)) cards.push({ k: "crash", chapter });
    if (failureFor(chapter)) cards.push({ k: "failure", chapter });
    const decision = decisionForChapter(chapter);
    if (decision) cards.push({ k: "decision", card: decision });
    const situation = situationFor(chapter);
    if (situation) cards.push({ k: "situation", card: situation });
    // cold storage occasionally asks you to prove you still own it
    if (chapter > 3 && run.positions.some((p) => p.where === "cold") && det(run.seed, `seedcheck-${chapter}`) < 0.18) cards.push({ k: "mini", kind: "seed", pending: { t: "seed" } });
    if (!cards.length) { setDialog(null); setPhase("brief"); return; }

    setPhase("act");

    setDialog(cards[0]!);
    setQueue(cards.slice(1));
  };

  const continueChapter = () => {
    setResolution(null);
    openChapterCards(run.chapter);
  };

  const finish = (key: EndingKey) => { localStorage.removeItem(SAVE_KEY); setResume(false); setEnding(key); setScreen("end"); playSfx("win"); };

  /**
   * The live quarter. While you act, the price actually walks from this
   * quarter's open to the next one's close. When it arrives, the quarter ends
   * whether you were ready or not. HOLD runs the clock down fast.
   */
  useEffect(() => {
    if (screen !== "run" || phase !== "act" || dialog) return;
    let raf = 0;
    let last = performance.now();
    let shown = tickRef.current;
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      tickRef.current = Math.min(1, tickRef.current + dt / (fast ? 1_600 : LIVE_MS));
      if (tickRef.current >= 1) { tickRef.current = 0; endChapter(); return; }
      // Repaint at ~5 fps, not 60: a full re-render every frame made the cards flicker.
      if (tickRef.current - shown >= 0.02) { shown = tickRef.current; setTick(tickRef.current); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, phase, dialog, fast, run]);



  const begin = (config: Config, reuse?: number) => {
    localStorage.removeItem(SAVE_KEY);
    setResume(false);
    setRun(freshRun(config, reuse));
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

  if (screen === "start") return <StartScreen resume={resume} onStart={(t) => { setTournament(t); setScreen("setup"); }} onResume={restore} onBoard={() => setScreen("board")} />;
  if (screen === "setup") return <SetupScreen tournament={tournament} onBack={() => setScreen("start")} onStart={begin} />;
  if (screen === "board") return <BoardScreen onBack={() => setScreen("start")} />;
  if (screen === "end") return (
    <EndScreen
      run={run} net={net} score={score} ending={ending}
      onRestart={() => setScreen("setup")}
      onRematch={() => begin(run.config, run.seed)}
      onBoard={() => setScreen("board")} />
  );



  const mood = run.stress > 70 || run.hunger > 70 ? enragedBoss.url : run.streak >= 2 ? smugBoss.url : crownedBoss.url;
  const bossLine = bossTalk ?? (phase === "brief" ? warning : phase === "resolve" ? resolution?.detail ?? warning : "Two moves. Make them count, or bank one and wait for blood.");
  // the one sentence a first-time player needs, and the dread of what is coming
  const objective = objectiveFor({
    chapter: run.chapter, positions: run.positions.length, cash: run.cash, hunger: run.hunger, stress: run.stress,
    taxDebt: run.taxDebt, crash: !!crashFor(run.chapter), presale: !!presaleFor(run.chapter), moves: ap, net, bossNet,
  });
  const doom = doomIn(run.chapter);


  return (
    <main className={`cy-shell${shake ? " is-shaking" : ""}`}>
      {fxFlash && <div className={`cy-fx cy-fx-${fxFlash}`} aria-hidden />}

      <header className="cy-top">
        <div className="min-w-0">
          <p className="journey-kicker">{act.name} · {chapterLabel(run.chapter)} · {monthRangeLabel(run.chapter)} · {cfg.difficulty}{cfg.modifier !== "straight" ? ` · ${modifierOf(cfg.modifier).name}` : ""}{cfg.ironman ? " · IRONMAN" : ""}{cfg.tournament ? ` · ${seasonLabel(cfg.season)}` : ""}</p>
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
          <Button variant="ghost" size="icon" aria-label={muted ? "Sound on" : "Sound settings"} onClick={() => setDialog({ k: "sound" })}>{muted ? <VolumeX /> : <Volume2 />}</Button>
        </div>
      </header>

      <section className={`cy-goal${objective.urgent ? " is-urgent" : ""}`} aria-live="polite">
        <p className="cy-goal-head">DO THIS NOW</p>
        <p className="cy-goal-line">{objective.goal}</p>
        <p className="cy-goal-why">{objective.why}</p>
        {doom !== null && <p className="cy-goal-doom">Something breaks in {doom} quarter{doom === 1 ? "" : "s"}. Be ready.</p>}
      </section>

      <section className="cy-meters" aria-label="Run status">
        <Meter label="RISK" value={run.risk} tone={run.risk > 70 ? "pink" : "yellow"} detail={`${Math.round(run.risk)}%`} icon={<Zap />} />
        <Meter label="HUNGER" value={run.hunger} tone={run.hunger > 70 ? "pink" : "cyan"} detail={`${run.hunger}%`} icon={<Activity />} />
        <Meter label="STRESS" value={run.stress} tone={run.stress > 70 ? "pink" : "cyan"} detail={`${run.stress}%`} icon={<HeartPulse />} />
        <Meter label="STREAK" value={Math.min(100, run.streak * 20)} tone={run.streak ? "yellow" : "cyan"} detail={`x${run.streak}`} icon={<Flame />} />
      </section>

      <button className="cy-details-toggle" onClick={() => setDetails((d) => !d)} aria-expanded={details}>
        {details ? "HIDE THE DETAILS" : `SHOW THE DETAILS · ${formatMoney(net)} vs ${formatMoney(bossNet)}`}
      </button>

      {details && (
        <section className="cy-versus" aria-label="You against the Boss">
          <div className="cy-versus-head"><span className="journey-kicker"><Crown /> YOU vs {persona.name}</span><span>{run.bossWins} FIGHT{run.bossWins === 1 ? "" : "S"} WON</span></div>
          <p className="cy-versus-help">{EXPLAIN["boss"]}</p>
          <div className="cy-versus-bar">
            <i className="you" style={{ width: `${Math.round((Math.max(0, net) / Math.max(1, Math.max(0, net) + Math.max(0, bossNet))) * 100)}%` }} />
          </div>
          <div className="cy-versus-num"><strong>{formatMoney(net)}</strong><strong className="boss">{formatMoney(bossNet)}</strong></div>
          <div className="cy-conviction">
            <span>CONVICTION</span>
            <div className="cy-conv-track"><i className={run.convictionOn ? "is-armed" : ""} style={{ width: `${Math.round(run.conviction)}%` }} /></div>
            <button className={`cy-conv-btn${run.convictionOn ? " is-on" : ""}`} onClick={toggleConviction}>{run.convictionOn ? "ARMED · 1.5x" : "RISK IT"}</button>
          </div>
          <p className="cy-versus-help">{EXPLAIN["conviction"]}</p>
        </section>
      )}


      <section className="cy-positions" aria-label="Open positions">
        <div className="cy-pos-head"><span className="journey-kicker"><WalletCards /> BOOK · {run.positions.length} OPEN</span><span>{formatMoney(run.cash)} CASH</span></div>
        {run.positions.length ? (
          <div className={`cy-chips ${run.positions.length > 4 ? "is-dense" : ""}`}>
            {run.positions.map((p) => {
              const price = mark(p.symbol);
              const pnl = pnlOf(p, price);
              const liq = liqPct(p, price);
              return (
                <span key={p.id} className={`cy-chip-wrap ${pnl >= 0 ? "up" : "down"}`}>
                  <button className={`cy-chip ${pnl >= 0 ? "up" : "down"}`} onClick={() => setDialog({ k: "position", id: p.id })}>
                    <img src={COIN_LOGO[p.symbol]} alt="" width={22} height={22} />
                    <span><strong>{p.symbol}</strong><small>{p.kind === "spot" ? "SPOT" : `${p.dir === 1 ? "L" : "S"} ${p.lev}x`}</small></span>
                    <b>{pnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(pnl))}</b>
                    {p.kind === "perp" && <i className="cy-liq" style={{ width: `${liq}%` }} />}
                  </button>
                  {phase === "act" && p.where !== "cold" && <button className="cy-chip-exit" onClick={() => quickClose(p.id)} aria-label={`Close ${p.symbol} now`}>EXIT</button>}
                </span>
              );
            })}
          </div>
        ) : <p className="cy-empty">No positions. Cash does not win chapters.</p>}
        {run.positions.length > 0 && (() => {
          const p = [...run.positions].sort((a, b) => b.margin - a.margin)[0]!;
          const price = mark(p.symbol);
          const pnl = pnlOf(p, price);
          return <p className="cy-pos-plain">Your biggest bet: {p.symbol}, bought at {formatMoney(p.entry)}, now {formatMoney(price)} — you are {formatMoney(Math.abs(pnl))} {pnl >= 0 ? "up" : "down"}. Tap it to sell.</p>;
        })()}

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
              <p className="journey-kicker"><Zap /> LIVE · {ap} MOVE{ap === 1 ? "" : "S"} LEFT</p>
              <div className="cy-live">
                <div className="cy-live-clock"><i style={{ width: `${Math.round(tick * 100)}%` }} /></div>
                <div className="cy-live-tape">
                  {(["BTC", "ETH", "SOL"] as CoinSymbol[]).map((s) => {
                    const open = priceAt(s, run.chapter, run.noise);
                    const now = mark(s);
                    if (!open) return null;
                    const pct = (now / open - 1) * 100;
                    return (
                      <span key={s} className={pct >= 0 ? "up" : "down"}>
                        <img src={COIN_LOGO[s]} alt="" width={18} height={18} />
                        <strong>{formatMoney(now)}</strong>
                        <small>{pct >= 0 ? "+" : ""}{pct.toFixed(1)}%</small>
                      </span>
                    );
                  })}
                </div>
                {attack && <p className="cy-attack"><strong>{attack.name} ·</strong> {attack.line}</p>}
                <div className="cy-signals">
                  {signals.map((s, i) => (
                    <span key={i} className={`cy-signal${verified ? (s.lie ? " is-fake" : " is-true") : ""}`}><small>{s.label}</small>{s.value}</span>
                  ))}

                  <button className="cy-verify" disabled={verified} onClick={() => {
                    if (verified) return;
                    const fee = Math.max(150, Math.round(net * 0.01));
                    if (run.cash < fee) return say("No cash for research. Trade on vibes then.", "pink");
                    setRun((r) => book({ ...r, cash: r.cash - fee }, "Signal research", -fee));
                    setVerified(true);
                    playSfx("click");
                  }}>{verified ? "ONE OF THEM WAS A LIE" : `VERIFY · ${formatMoney(Math.max(150, Math.round(net * 0.01)))}`}</button>
                </div>
              </div>
              <h2>WHAT DO YOU DO?</h2>
              <div className="cy-grid">

                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "market" })}><TrendingUp /><strong>TRADE SPOT</strong><small>Buy or short-list a market</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "market" })}><Zap /><strong>PERP DESK</strong><small>2x · 5x · 10x, long or short</small></button>
                <button className="cy-act" disabled={ap <= 0 || !presale} onClick={() => presale && setDialog({ k: "presale", card: presale })}><Rocket /><strong>{presale ? presale.tag : "NO LAUNCH"}</strong><small>{presale ? presale.name : "Nothing live this quarter"}</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "custody" })}><Shield /><strong>CUSTODY · {custodyOf(run.custody).short}</strong><small>Exchange · hot wallet · Ledger</small></button>
                <button className="cy-act" disabled={ap <= 0} onClick={() => setDialog({ k: "life" })}><Home /><strong>LIFE</strong><small>{jobOf(run.job).name} · {housingOf(run.housing).name}</small></button>
                <button className="cy-act" onClick={() => setDialog({ k: "ledger" })}><Receipt /><strong>THE BOOKS</strong><small>Every dollar in and out</small></button>
                <button className="cy-act" onClick={() => setDialog({ k: "survive" })}><HeartPulse /><strong>SURVIVE</strong><small>Eat · calm down · costs a move</small></button>
                <button className="cy-act is-exit" onClick={() => setDialog({ k: "cashout" })}><Skull /><strong>CASH OUT</strong><small>End the run, take the bag</small></button>
                <button className="cy-act" onClick={bank}><History /><strong>WAIT</strong><small>Bank a move, lose stress</small></button>
                <button className={`cy-act${fast ? " is-go" : ""}`} onClick={() => { setFast(true); playSfx("click"); }}><Flame /><strong>HOLD</strong><small>{fast ? "Running the clock down" : "Fast-forward the quarter"}</small></button>
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
        <Sheet onClose={dialog.k === "decision" || dialog.k === "situation" || dialog.k === "mini" || dialog.k === "fight" || dialog.k === "offer" ? undefined : () => (dialog.k === "crash" || dialog.k === "failure" || dialog.k === "launchResult" ? nextInQueue() : setDialog(null))}>
          {dialog.k === "rules" && <Rules onClose={() => { setDialog(null); if (run.chapter === 0 && run.logs.length === 0) openChapterCards(0); }} />}
          {dialog.k === "sound" && <SoundSheet
            muted={muted} vols={vols}
            onMute={(v) => { setMuted(v); setMutedState(v); }}
            onMusic={(v) => { setMusicVol(v); setVols(getVolumes()); }}
            onSfx={(v) => { setSfxVol(v); setVols(getVolumes()); playSfx("click"); }}
            onClose={() => setDialog(null)} />}
          {dialog.k === "score" && <ScoreSheet net={net} chapters={run.chapter} diff={cfg.difficulty} crises={run.crises} streak={run.streak} score={score} onClose={() => setDialog(null)} />}
          {dialog.k === "market" && <MarketSheet run={run} onPick={(s) => setDialog({ k: "trade", symbol: s })} />}
          {dialog.k === "trade" && <TradeSheet run={run} symbol={dialog.symbol} onSpot={(f) => openSpot(dialog.symbol, f)} onPerp={(d, l, f) => openPerp(dialog.symbol, d, l, f)} />}
          {dialog.k === "position" && <PositionSheet run={run} id={dialog.id} onClose={(f) => askClose(dialog.id, f)} />}
          {dialog.k === "presale" && <PresaleSheet card={dialog.card} cash={run.cash} onTake={(size) => setDialog({ k: "mini", kind: "gas", pending: { t: "presale", card: dialog.card, size } })} onPass={() => { setDialog(null); say(`${dialog.card.name} closed without you. Discipline is a position.`, "cyan"); }} />}
          {dialog.k === "launchResult" && <LaunchResultSheet res={dialog.res} onClose={nextInQueue} />}
          {dialog.k === "survive" && <SurviveSheet run={run} difficulty={cfg.difficulty} caps={diff.caps} onEat={() => recover("eat")} onCalm={() => recover("calm")} />}
          {dialog.k === "cashout" && <CashOutSheet run={run} net={net} score={score} onConfirm={cashOut} onClose={() => setDialog(null)} />}
          {dialog.k === "crash" && <CrashSheet chapter={dialog.chapter} onPanic={() => setDialog({ k: "mini", kind: "panic", pending: { t: "crash", chapter: dialog.chapter } })} onClose={nextInQueue} />}
          {dialog.k === "failure" && <FailureSheet chapter={dialog.chapter} run={run} onClose={nextInQueue} />}
          {dialog.k === "custody" && <CustodySheet run={run} onPick={setCustody} />}
          {dialog.k === "life" && <LifeSheet run={run} onPick={setLife} />}
          {dialog.k === "ledger" && <LedgerSheet run={run} onClose={() => setDialog(null)} />}
          {dialog.k === "mini" && <Minigame kind={dialog.kind} roll={det(run.seed, `mini-${run.chapter}-${dialog.kind}`)} hard={cfg.difficulty !== "EASY" || run.hunger >= 80 || run.stress >= 80} onResult={(res) => finishMini(dialog.pending, res)} />}
          {dialog.k === "decision" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o)} />}
          {dialog.k === "situation" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o, false)} />}
          {dialog.k === "fight" && <FightSheet chapter={dialog.chapter} cash={run.cash}
            onFight={(wager, kind) => setDialog({ k: "mini", kind, pending: { t: "fight", chapter: dialog.chapter, wager } })}
            onDuck={() => { setRun((r) => ({ ...r, stress: clamp(r.stress + 10), conviction: 0 })); say("You walked past his table. He remembers that.", "pink"); nextInQueue(); }} />}
          {dialog.k === "offer" && <OfferSheet attack={dialog.attack} net={net}
            onTake={() => takeOffer(Math.max(2000, Math.round(net * 0.25)))}
            onRefuse={() => { setDialog(null); setRun((r) => ({ ...r, conviction: clamp(r.conviction + 15) })); say("You told him no. Conviction up.", "yellow"); }} />}

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
  const shownRef = useRef(value);
  useEffect(() => { shownRef.current = shown; }, [shown]);
  useEffect(() => {
    const from = shownRef.current;
    // Small live wobbles snap instead of animating, otherwise the number
    // restarts its count-up every few frames and the card looks like it flickers.
    if (Math.abs(value - from) < Math.max(2, Math.abs(value) * 0.01)) { setShown(value); return; }
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
        <li><b>1</b><span>28 quarters, 2020 to 2026. Real prices, no hindsight. Each quarter runs live — the price moves while you decide.</span></li>
        <li><b>2</b><span>Moves are your currency: spot, perps, launches, food, sleep. HOLD runs the clock down, WAIT banks a move.</span></li>
        <li><b>3</b><span>Three signals every quarter and one of them is a lie. VERIFY costs money and shows you which.</span></li>
        <li><b>4</b><span>The Boss trades his own book against you. Beat him in six boss fights to win his perks — or take his buy-out and pay him forever.</span></li>
        <li><b>5</b><span>History hits back: Black Thursday, Luna, FTX, the ETF. Hunger or stress at 100 ends the run. Only the Boss Score counts on the board.</span></li>

      </ol>
      <Button className="cy-primary" onClick={onClose}>LET ME TRADE</Button>
    </>
  );
}

function SoundSheet({ muted, vols, onMute, onMusic, onSfx, onClose }: { muted: boolean; vols: { musicVol: number; sfxVol: number }; onMute: (v: boolean) => void; onMusic: (v: number) => void; onSfx: (v: number) => void; onClose: () => void }) {
  return (
    <>
      <p className="journey-kicker"><Volume2 /> AUDIO</p>
      <h2>SOUND</h2>
      <p className="cy-lead">Two produced hip-hop loops and clean action sounds. Set it once, it stays.</p>
      <div className="sound-rows">
        <label className="sound-row">
          <span>MUSIC</span>
          <input type="range" min={0} max={1} step={0.05} value={vols.musicVol} onChange={(e) => onMusic(Number(e.target.value))} aria-label="Music volume" />
          <b>{Math.round(vols.musicVol * 100)}%</b>
        </label>
        <label className="sound-row">
          <span>EFFECTS</span>
          <input type="range" min={0} max={1} step={0.05} value={vols.sfxVol} onChange={(e) => onSfx(Number(e.target.value))} aria-label="Effect volume" />
          <b>{Math.round(vols.sfxVol * 100)}%</b>
        </label>
      </div>
      <div className="cy-sound-actions">
        <Button variant={muted ? "default" : "outline"} onClick={() => onMute(!muted)}>{muted ? <><Volume2 />SOUND ON</> : <><VolumeX />MUTE ALL</>}</Button>
        <Button onClick={onClose}>DONE</Button>
      </div>
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
        <li>Formula · (net worth × survival × difficulty + crises) × streak</li>
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

/** A real duel: stake money, land the skill moment, win a perk off him. */
function FightSheet({ chapter, cash, onFight, onDuck }: { chapter: number; cash: number; onFight: (wager: number, kind: MiniKind) => void; onDuck: () => void }) {
  const fight = bossFightFor(chapter);
  if (!fight) return <Button className="cy-wide" onClick={onDuck}>CONTINUE</Button>;
  const stakes = [0.1, 0.25, 0.5].map((f) => Math.max(200, Math.round(cash * f)));
  return (
    <>
      <p className="journey-kicker"><Crown /> BOSS FIGHT · {chapterLabel(chapter)}</p>
      <h2>{fight.title}</h2>
      <p className="cy-lead">{fight.line}</p>
      <p className="cy-hint"><strong>WIN ·</strong> double your stake and the perk {fight.perk} ({PERK_BLURB[fight.perk]}) · <strong>LOSE ·</strong> he keeps the stake.</p>
      <div className="cy-grid">
        {stakes.map((s, i) => (
          <button key={i} className="cy-act" disabled={cash < s} onClick={() => onFight(s, fight.mini)}>
            <Zap /><strong>{formatMoney(s)}</strong><small>{["Careful", "Serious", "Everything he expects"][i]}</small>
          </button>
        ))}
      </div>
      <div className="cy-actions"><Button onClick={onDuck}>WALK AWAY</Button></div>
      <small className="cy-note">Walking away costs no money, just stress and your conviction.</small>
    </>
  );
}

function OfferSheet({ attack, net, onTake, onRefuse }: { attack: BossAttack; net: number; onTake: () => void; onRefuse: () => void }) {
  const amount = Math.max(2000, Math.round(net * 0.25));
  return (
    <>
      <p className="journey-kicker"><Crown /> {attack.name}</p>
      <h2>HE WANTS TO BUY YOU OUT</h2>
      <p className="cy-lead">{attack.line}</p>
      <div className="cy-facts">
        <span><small>CASH NOW</small><strong className="positive">{formatMoney(amount)}</strong></span>
        <span><small>FOREVER</small><strong className="negative">2% of your book every quarter</strong></span>
      </div>
      <div className="cy-actions">
        <Button className="cy-primary" onClick={onTake}>TAKE THE MONEY</Button>
        <Button onClick={onRefuse}>TELL HIM NO</Button>
      </div>
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
        {CUSTODY.filter((c) => !(run.config.modifier === "keys" && c.id === "cold")).map((c) => (
          <button key={c.id} className={`cy-pick-row ${run.custody === c.id ? "is-on" : ""}`} onClick={() => onPick(c.id)}>
            <strong>{c.name}</strong>
            <small>{c.blurb}</small>
            <em>Fee {(c.fee * 100).toFixed(1)}% · {c.id === "exchange" ? "exchange risk" : c.id === "hot" ? "drainer risk" : "slow fills"}</em>
          </button>
        ))}
      </div>
      <small className="cy-note">{run.config.modifier === "keys" ? "NO COLD STORAGE: the Ledger is locked this run. You live with counterparty risk." : "Moving the bag costs one move and 0.4% in fees. Perps always stay on the exchange."}</small>

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




function CashOutSheet({ run, net, score, onConfirm, onClose }: { run: Run; net: number; score: number; onConfirm: () => void; onClose: () => void }) {
  const early = run.chapter < CHAPTERS - 1;
  return (
    <>
      <p className="journey-kicker"><Skull /> {chapterLabel(run.chapter)} · WALK AWAY</p>
      <h2>CASH OUT NOW?</h2>
      <p className="cy-lead">
        Every position sells at today&apos;s price minus fees, tax on your profit and any debt comes off the top, and the run ends here.
        {early ? " Leaving early stamps you SELLOUT — safe, respectable, never top of the board." : " You are close to the end. Finishing pays more."}
      </p>
      <div className="cy-facts">
        <span><small>OPEN POSITIONS</small><strong>{run.positions.length}</strong></span>
        <span><small>NET WORTH NOW</small><strong>{formatMoney(net)}</strong></span>
        <span><small>TAX DEBT</small><strong>{formatMoney(run.taxDebt)}</strong></span>
        <span><small>SCORE SO FAR</small><strong>{score.toLocaleString("en-US")}</strong></span>
      </div>
      <div className="cy-decide">
        <button onClick={onConfirm}><strong>TAKE THE BAG AND LEAVE</strong><small>Sell everything, close the books, submit the score</small></button>
        <button onClick={onClose}><strong>KEEP PLAYING</strong><small>The Boss expected nothing less</small></button>
      </div>
    </>
  );
}

function SurviveSheet({ run, difficulty, caps, onEat, onCalm }: { run: Run; difficulty: Difficulty; caps: number; onEat: () => void; onCalm: () => void }) {
  const left = Math.max(0, caps - run.cares);
  return (
    <>
      <p className="journey-kicker"><HeartPulse /> STAY IN THE GAME · COSTS A MOVE</p>
      <h2>SURVIVAL</h2>
      <div className="cy-survive">
        <div><Activity /><span><small>HUNGER</small><strong>{run.hunger}%</strong></span><Button disabled={!left} onClick={onEat}>EAT · {formatMoney(careCost("eat", run.chapter, difficulty))}</Button></div>
        <div><HeartPulse /><span><small>STRESS</small><strong>{run.stress}%</strong></span><Button disabled={!left} onClick={onCalm}>CALM · {formatMoney(careCost("calm", run.chapter, difficulty))}</Button></div>
      </div>
      <small className="cy-note">{left ? `${left} care action${left === 1 ? "" : "s"} left this quarter. Each one burns a move, and the second helps far less.` : "You are done looking after yourself this quarter. Survive on what you have."}</small>
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

type Quote = { sym: string; price: number; chg24h: number };

function PriceTape() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  useEffect(() => {
    let alive = true;
    const pull = async () => {
      try {
        const res = await fetch("/api/public/prices");
        if (!res.ok) return;
        const data = (await res.json()) as { rows?: Quote[] };
        const list = data.rows ?? [];
        if (alive && list.length) setQuotes(list);
      } catch { /* atmosphere only — silence is fine */ }
    };
    void pull();
    const id = window.setInterval(pull, 60_000);
    return () => { alive = false; window.clearInterval(id); };
  }, []);
  if (!quotes.length) return null;
  const row = [...quotes, ...quotes];
  return (
    <div className="price-tape" aria-label="Live crypto prices">
      <div className="price-tape-track">
        <span className="tcfb-pill"><b>$TCFB</b> <i>SOON</i></span>
        {row.map((q, i) => (
          <span key={`${q.sym}-${i}`} className={q.chg24h >= 0 ? "is-up" : "is-down"}>
            <b>{q.sym}</b> {q.price >= 1 ? formatMoney(q.price) : `$${q.price.toFixed(4)}`} <i>{q.chg24h >= 0 ? "+" : ""}{q.chg24h.toFixed(1)}%</i>
          </span>
        ))}
      </div>
    </div>
  );
}

function MenuSound() {
  const [open, setOpen] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [vols, setVols] = useState({ musicVol: 0.35, sfxVol: 0.6 });
  useEffect(() => { setMutedState(isMuted()); setVols(getVolumes()); }, [open]);
  return (
    <>
      <button className="menu-sound" aria-label={muted ? "Sound on" : "Sound settings"} onClick={() => { initAudio(); preloadSfx(); playSfx("click"); setOpen(true); }}>
        {muted ? <VolumeX /> : <Volume2 />}
      </button>
      {open && (
        <Sheet onClose={() => setOpen(false)}>
          <SoundSheet
            muted={muted} vols={vols}
            onMute={(v) => { setMuted(v); setMutedState(v); if (!v) playSfx("click"); }}
            onMusic={(v) => { setMusicVol(v); setVols(getVolumes()); }}
            onSfx={(v) => { setSfxVol(v); setVols(getVolumes()); playSfx("click"); }}
            onClose={() => setOpen(false)} />
        </Sheet>
      )}
    </>
  );
}

function SeasonBanner({ onStart, compact }: { onStart?: (() => void) | undefined; compact?: boolean }) {
  const season = currentSeasonId();
  const ends = seasonEnd(season);
  // Countdown is time-dependent, so it only renders after mount (no SSR mismatch).
  const [left, setLeft] = useState<string | null>(null);

  useEffect(() => {
    setLeft(countdown(ends));
    const id = window.setInterval(() => setLeft(countdown(ends)), 30_000);
    return () => window.clearInterval(id);
  }, [ends]);

  if (compact) {
    return (
      <div className="season-strip">
        <span className="season-live"><Trophy /> {seasonLabel(season)}</span>
        <strong>{left ? `ENDS IN ${left}` : "LIVE NOW"}</strong>
        <span className="season-prizes">{PRIZES.map((p) => <em key={p}>${p}</em>)}<b>$TCFB</b></span>
      </div>
    );
  }

  return (
    <div className="season-banner">
      <div className="season-head">
        <span className="season-live"><Trophy /> $TCFB TOURNAMENT · {seasonLabel(season)}</span>
        <strong>{left ? `ENDS IN ${left}` : "LIVE NOW"}</strong>
      </div>
      <p>Top 3 of the season leaderboard win {PRIZES.map((p) => `$${p}`).join(" · ")} in $TCFB, paid within 3 days after the token launch in October. Same seed for everyone: identical crashes, launches and rugs.</p>
      <p className="season-rules">One account per player. Multiple accounts, shared wallets or duplicate entries are disqualified. Only your best run of the season counts.</p>
      {onStart && <Button className="season-cta" onClick={() => { playSfx("win"); onStart(); }}><Trophy />PLAY THE TOURNAMENT <ChevronRight /></Button>}
    </div>
  );
}

function TournamentRules({ onClose }: { onClose: () => void }) {
  return (
    <>
      <p className="journey-kicker"><Trophy /> $TCFB TOURNAMENT · {seasonLabel(currentSeasonId())}</p>
      <h2>THE RULES</h2>
      <ol className="cy-steps">
        <li><b>1</b><span>Every tournament run of the month uses the same seed. Identical crashes, launches and rugs for everyone.</span></li>
        <li><b>2</b><span>Only your best run of the month counts. Play as often as you like.</span></li>
        <li><b>3</b><span>One account per player. Multiple accounts, shared wallets or duplicate entries are disqualified.</span></li>
        <li><b>4</b><span>Top 3 win {PRIZES.map((p) => `$${p}`).join(" / ")} in $TCFB, paid within 3 days after the token launch in October.</span></li>
        <li><b>5</b><span>You only add a wallet at the end of a run. Wallets stay private.</span></li>
      </ol>
      <Button className="cy-primary" onClick={onClose}>GOT IT <ChevronRight /></Button>
    </>
  );
}

/** Everything the player keeps: runs, records, endings, badges. */
function RecordStrip({ profile, onEndings }: { profile: Profile; onEndings: () => void }) {
  const seen = Object.keys(profile.endings).length;
  const total = Object.keys(ENDINGS).length;
  if (!profile.runs) return null;
  return (
    <button className="start-record" onClick={() => { playSfx("click"); onEndings(); }}>
      <span><small>RUNS</small><strong>{profile.runs}</strong></span>
      <span><small>BEST</small><strong>{formatMoney(profile.bestNet)}</strong></span>
      <span><small>BEST SCORE</small><strong>{profile.bestScore.toLocaleString("en-US")}</strong></span>
      <span><small>ENDINGS</small><strong>{seen}/{total}</strong></span>
      <ChevronRight />
    </button>
  );
}

function EndingsSheet({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const keys = Object.keys(ENDINGS) as EndingKey[];
  return (
    <>
      <p className="journey-kicker"><Crown /> YOUR COLLECTION</p>
      <h2>ENDINGS {Object.keys(profile.endings).length}/{keys.length}</h2>
      <div className="cy-pick-list end-gallery">
        {keys.map((k) => {
          const found = (profile.endings[k] ?? 0) > 0;
          return (
            <div key={k} className={`cy-pick-row ${found ? "is-on" : "is-locked"}`}>
              <strong>{found ? ENDINGS[k].title : "???"}</strong>
              <small>{found ? ENDINGS[k].line : ENDING_HINTS[k]}</small>
              <em>{found ? `REACHED ${profile.endings[k]}x` : "LOCKED"}</em>
            </div>
          );
        })}
      </div>
      {profile.badges.length > 0 && <div className="cy-status-row">{profile.badges.map((b) => <span key={b}>{b}</span>)}</div>}
      <Button className="cy-primary" onClick={onClose}>BACK <ChevronRight /></Button>
    </>
  );
}

function StartScreen({ resume, onStart, onResume, onBoard }: { resume: boolean; onStart: (tournament: boolean) => void; onResume: () => void; onBoard: () => void }) {
  const [rules, setRules] = useState(false);
  const [endings, setEndings] = useState(false);
  // Read after mount: localStorage is not available while rendering on the server.
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { setProfile(readProfile()); }, []);
  return (
    <main className="journey-start">
      <picture>
        <source media="(max-width: 720px)" srcSet={bossStagePortrait.url} />
        <img src={bossStageWide.url} alt="The Crypto Final Boss on his server throne" width={1920} height={1088} />
      </picture>
      <div className="start-vignette" />
      <PriceTape />
      <MenuSound />
      <section className="start-stage">
        <div className="start-brand">
          <p className="journey-kicker">REAL CRYPTO HISTORY · ONE LIFE</p>
          <h1>THE CRYPTO<br /><span>FINAL BOSS</span></h1>
          <p>Trade the cycle from 2020 to 2026. Survive every crash.</p>
        </div>
        <div className="start-console">
          <SeasonBanner compact />
          {profile && <RecordStrip profile={profile} onEndings={() => setEndings(true)} />}
          <div className="start-actions">
            <Button className="start-main" onClick={() => { playSfx("win"); onStart(true); }}><Trophy />PLAY THE TOURNAMENT <ChevronRight /></Button>
            <div className="start-secondary">
              <Button variant="outline" onClick={() => { playSfx("click"); onStart(false); }}>FREE RUN</Button>
              <Button variant="outline" onClick={() => { playSfx("click"); onBoard(); }}><Trophy />LEADERBOARD</Button>
              {resume && <Button variant="outline" onClick={() => { playSfx("click"); onResume(); }}>CONTINUE RUN</Button>}
            </div>
          </div>
          <small className="start-footer">84 MONTHS · FREE TO PLAY · <button className="start-rules" onClick={() => { playSfx("click"); setRules(true); }}>RULES</button></small>
        </div>
      </section>
      {rules && <Sheet onClose={() => setRules(false)}><TournamentRules onClose={() => setRules(false)} /></Sheet>}
      {endings && profile && <Sheet onClose={() => setEndings(false)}><EndingsSheet profile={profile} onClose={() => setEndings(false)} /></Sheet>}
    </main>
  );
}




function SetupScreen({ tournament, onBack, onStart }: { tournament: boolean; onBack: () => void; onStart: (config: Config) => void }) {
  const season = currentSeasonId();
  // In the tournament everyone plays the same twist, so nobody picks an easier one.
  const locked = tournament ? tournamentModifier(season) : null;
  const [config, setConfig] = useState<Config>({ ...defaultConfig, tournament, season, modifier: locked ?? "straight" });
  const set = <K extends keyof Config>(key: K, value: Config[K]) => { if (key !== "name") playSfx("click"); setConfig((c) => ({ ...c, [key]: value })); };
  const startCash = Math.round(archOf(config.arch).cash * (config.modifier === "glass" ? 0.5 : 1));
  return (
    <main className="journey-setup">
      <header><div><p className="journey-kicker">{tournament ? `TOURNAMENT · ${seasonLabel(config.season)}` : "FREE RUN"}</p><h1>CHOOSE YOUR RUN</h1></div><MenuSound /><Button variant="ghost" size="icon" aria-label="Back" onClick={() => { playSfx("click"); onBack(); }}><X /></Button></header>
      {tournament && <SeasonBanner />}

      <section className="setup-block"><p className="journey-kicker">NAME & AVATAR</p>
        <input className="setup-input" maxLength={18} placeholder="YOUR HANDLE" value={config.name} onChange={(e) => set("name", e.target.value)} aria-label="Player name" />
        <div className="avatar-row">{AVATARS.map((a) => <button key={a.id} className={`avatar-pick ${config.avatar === a.id ? "is-on" : ""}`} aria-label={`Avatar ${a.id}`} onClick={() => set("avatar", a.id)}><img src={a.url} alt={`${a.id} avatar`} /></button>)}</div>
        <div className="chip-row">{COUNTRIES.map((c) => <button key={c} className={`chip ${config.country === c ? "is-on" : ""}`} onClick={() => set("country", c)}><Flag code={c} size={18} />{c}</button>)}</div>
      </section>
      <section className="setup-block"><p className="journey-kicker">ARCHETYPE</p><div className="pick-grid">{ARCHETYPES.map((a) => <button key={a.id} className={`pick-card ${config.arch === a.id ? "is-on" : ""}`} onClick={() => set("arch", a.id)}><strong>{a.name}</strong><em>{formatMoney(a.cash)} START</em><small>{a.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">THE TWIST{locked ? ` · LOCKED FOR ${seasonLabel(season)}` : ""}</p>
        <div className="pick-grid">{MODIFIERS.filter((m) => !locked || m.id === locked).map((m) => (
          <button key={m.id} className={`pick-card ${config.modifier === m.id ? "is-on" : ""}`} disabled={!!locked} onClick={() => set("modifier", m.id)}><strong>{m.name}</strong><em>SCORE x{m.mul.toFixed(2)}</em><small>{m.blurb}</small></button>
        ))}</div>
      </section>
      <section className="setup-block"><p className="journey-kicker">DIFFICULTY</p><div className="pick-grid">{DIFFICULTIES.map((d) => <button key={d.id} className={`pick-card ${config.difficulty === d.id ? "is-on" : ""}`} onClick={() => set("difficulty", d.id)}><strong>{d.name}</strong><em>SCORE x{d.cost.toFixed(2)}</em><small>{d.blurb}</small></button>)}</div></section>
      <section className="setup-block"><p className="journey-kicker">MODE</p><div className="pick-grid">{MODES.map((m) => <button key={m.id} className={`pick-card ${config.mode === m.id ? "is-on" : ""}`} onClick={() => set("mode", m.id)}><strong>{m.name}</strong><em>{m.blurb}</em><small>{m.xpLabel}</small></button>)}</div>
        <button className={`iron-toggle ${config.ironman ? "is-on" : ""}`} onClick={() => set("ironman", !config.ironman)}><Flame /><span><strong>IRONMAN</strong><small>No saves, no second chances. Death is final.</small></span></button>
      </section>
      <div className="setup-cta">
        <div className="setup-summary">
          <img src={AVATARS.find((a) => a.id === config.avatar)?.url} alt="" />
          <span>
            <strong>{config.name.trim() || "anon"} <Flag code={config.country} size={14} /></strong>
            <small>{archOf(config.arch).name} · {formatMoney(startCash)} · {config.difficulty}{config.modifier !== "straight" ? ` · ${modifierOf(config.modifier).name}` : ""}{config.ironman ? " · IRONMAN" : ""}</small>
          </span>
        </div>
        <Button onClick={() => { playSfx("win"); onStart({ ...config, name: config.name.trim() || "anon" }); }}><Rocket />START Q1 2020</Button>
      </div>

    </main>
  );
}

function BoardScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState(false);
  const [view, setView] = useState<"season" | "all">("season");
  const season = currentSeasonId();
  useEffect(() => {
    let alive = true;
    setRows(null); setError(false);
    retryPendingSubmission().finally(() => {
      loadBoard(25, view === "season" ? season : "all")
        .then((r) => { if (alive) setRows(r); })
        .catch(() => { if (alive) setError(true); });
    });
    return () => { alive = false; };
  }, [season, view]);
  return (
    <main className="journey-setup board-screen">
      <div className="board-shell">
        <header className="board-header"><div><p className="journey-kicker">BOSS SCORE · {view === "season" ? seasonLabel(season) : "ALL TIME"}</p><h1>LEADERBOARD</h1></div><div className="board-header-actions"><MenuSound /><Button variant="ghost" size="icon" aria-label="Back" onClick={() => { playSfx("click"); onBack(); }}><X /></Button></div></header>
        <SeasonBanner />
        <div className="cy-toggle board-tabs">
          <button className={view === "season" ? "is-on" : ""} onClick={() => { playSfx("click"); setView("season"); }}><Trophy />TOURNAMENT</button>
          <button className={view === "all" ? "is-on" : ""} onClick={() => { playSfx("click"); setView("all"); }}>ALL TIME</button>
        </div>
        <div className="board-column-head" aria-hidden="true"><span>PLAYER</span><span>RUN</span><span>NET WORTH</span><span>BOSS SCORE</span></div>
        {error ? <p className="trail-empty">The board is unreachable right now. Try again in a moment.</p> : !rows ? <p className="trail-empty">Loading the world's best runs…</p> : rows.length === 0 ? <p className="trail-empty">{view === "season" ? "No tournament run yet this season. Yours can be first." : "No runs yet. Yours can be first."}</p> : (
          <div className="board-list">
            {rows.map((r) => {
              const avatar = AVATARS.find((a) => a.id === r.avatar) ?? AVATARS[0];
              return (
                <div className={`board-row${r.prize ? " is-prize" : ""}`} key={`${r.pos}-${r.name}`}>
                  <b className="board-position">#{r.pos}</b>
                  {avatar && <img className="board-face" src={avatar.url} alt="" loading="lazy" />}
                  <span className="board-player"><strong>{r.name}{r.prize ? <em className="board-prize">${r.prize} $TCFB</em> : null}</strong><small><Flag code={r.country} size={15} />{r.rank ? `${r.rank.toUpperCase()} · ` : ""}{r.arch.toUpperCase()} · {r.difficulty.toUpperCase()}</small></span>
                  <span className="board-run"><small>LVL {r.level}</small><strong>{r.xp.toLocaleString("en-US")} XP</strong><em>{r.months} / 84 MONTHS</em></span>
                  <span className="board-net"><small>NET WORTH</small><strong>{formatMoney(r.netWorth)}</strong></span>
                  <span className="board-score"><small>BOSS SCORE</small><i>{(r.score ?? 0).toLocaleString("en-US")}</i></span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}


function EndScreen({ run, net, score, ending, onRestart, onRematch, onBoard }: { run: Run; net: number; score: number; ending: EndingKey; onRestart: () => void; onRematch: () => void; onBoard: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "queued" | "rejected">("idle");
  const [wallet, setWallet] = useState(() => readWallet());
  const [walletError, setWalletError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const tournament = run.config.tournament;

  const won = ending === "LEGEND" || ending === "SURVIVOR" || ending === "SELLOUT";
  const end = ENDINGS[ending];
  const badge = badgeFor(run, ending, net);
  const submission = useMemo<RunSubmission>(() => ({
    clientHash: crypto.randomUUID(),
    name: run.config.name || "anon", arch: run.config.arch, country: run.config.country,
    difficulty: run.config.difficulty, mode: modeId(run.config), net: Math.round(net),
    score, xp: run.xp, level: levelFor(run.xp), rank: badge, months: monthsSurvived(run.chapter), achievements: run.crises,
    trades: run.trades, survived: won, avatar: run.config.avatar,
    season: run.config.season, isTournament: tournament, playerKey: playerKey(),
  }), [badge, net, run, score, tournament, won]);
  const punchline = useMemo(() => {
    if (won) return null;
    const lines = DEATH_PUNCHLINES[ending as keyof typeof DEATH_PUNCHLINES];
    return lines[Math.abs(run.moves + run.trades + run.chapter) % lines.length];
  }, [ending, run.chapter, run.moves, run.trades, won]);

  // Store the run once, and keep the record from *before* this run so we can taunt with it.
  const beforeRef = useRef<Profile | null>(null);
  useEffect(() => {
    beforeRef.current = readProfile();
    setProfile(recordRun({ ending, net, score, months: monthsSurvived(run.chapter), bossWins: run.bossWins, badge }));
    // Runs once per end screen on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const before = beforeRef.current;
  const newRecord = !!before && score > before.bestScore && before.runs > 0;
  const nearMiss = useMemo(() => {
    const startCash = Math.round(archOf(run.config.arch).cash * (run.config.modifier === "glass" ? 0.5 : 1));
    if (ending === "THRONE") return null;
    if (won && net >= startCash * 40) return `You were ${formatMoney(startCash * 60 - net)} short of LEGEND. One better exit and it was yours.`;
    if (!won) {
      const left = TOTAL_MONTHS - monthsSurvived(run.chapter);
      return `${left} months left on the clock. The Boss barely had to try.`;
    }
    return "Beat the Boss' own book and win 3 fights to take the THRONE.";
  }, [ending, net, run.chapter, run.config.arch, run.config.modifier, won]);

  const shareText = `THE CRYPTO FINAL BOSS\n${ENDINGS[ending].title} · ${badge}\nNET ${formatMoney(net)} · SCORE ${score.toLocaleString("en-US")}\n${monthsSurvived(run.chapter)}/${TOTAL_MONTHS} months · ${run.bossWins} boss fights won${run.config.modifier !== "straight" ? `\n${modifierOf(run.config.modifier).name}` : ""}\nplay: thecryptofinalboss.app`;
  const share = async () => {
    playSfx("click");
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch { setCopied(false); }
  };

  const send = async () => {
    const trimmed = wallet.trim();
    if (tournament && !isWallet(trimmed)) { setWalletError(true); return; }
    setWalletError(false);
    if (tournament) saveWallet(trimmed);
    const payload: RunSubmission = tournament ? { ...submission, wallet: trimmed } : submission;
    setStatus("sending");
    savePendingSubmission(payload);
    try {
      await submitRun(payload);
      clearPendingSubmission(payload.clientHash);
      setStatus("done");
    } catch (error) {
      if (error instanceof SubmitRunError && error.kind === "rejected") {
        clearPendingSubmission(payload.clientHash);
        setStatus("rejected");
      } else setStatus("queued");
    }
  };

  return (
    <main className={`journey-end ${won ? "won" : "lost"}`}>
      <img src={won ? smugBoss.url : enragedBoss.url} alt={won ? "The Boss respects your run" : "The Boss ends your run"} />
      <section className="end-stage">
        <header className="end-header">
          <p className="journey-kicker">{won ? "THE CYCLE IS COMPLETE" : "YOUR RUN IS OVER"}</p>
          <h1>{end.title}</h1>
          <div className="end-divider" />
          <p>{end.line}</p>
          {punchline && <blockquote className="death-punchline">“{punchline}”</blockquote>}
        </header>

        <div className="end-glass">
          <div className="end-worth">
            <span><small>FINAL NET WORTH</small><strong>{formatMoney(net)}</strong></span>
            <div className="end-badge"><Crown /><span><small>RANK UNLOCKED</small><strong>{badge}</strong></span></div>
          </div>
          <div className="end-scoreline">
            <span><small>BOSS SCORE</small><strong>{score.toLocaleString("en-US")}</strong></span>
            <span><small>MONTHS</small><strong>{monthsSurvived(run.chapter)}/{TOTAL_MONTHS}</strong></span>
            <span><small>LEVEL · XP</small><strong>{levelFor(run.xp)} · {run.xp.toLocaleString("en-US")}</strong></span>
            <span><small>CRISES</small><strong>{run.crises}</strong></span>
          </div>
          {run.statuses.length > 0 && <div className="cy-status-row end-statuses">{run.statuses.map((s) => <span key={s}>{s}</span>)}</div>}
          {newRecord && <p className="end-record">NEW PERSONAL RECORD · beat {before?.bestScore.toLocaleString("en-US")}</p>}
          {nearMiss && <p className="end-nearmiss">{nearMiss}</p>}
          {profile && <small className="end-progress">RUN {profile.runs} · ENDINGS {Object.keys(profile.endings).length}/{Object.keys(ENDINGS).length} · BEST {formatMoney(profile.bestNet)}</small>}
        </div>

        {run.chronicle.length > 1 && (
          <div className="end-chronicle">
            <p className="journey-kicker">HOW IT WENT</p>
            <ol>{run.chronicle.slice(-7).map((line, i) => <li key={i}>{line}</li>)}</ol>
          </div>
        )}


        {tournament && status !== "done" && (
          <div className="end-wallet">
            <p className="journey-kicker">TOURNAMENT {seasonLabel(run.config.season)} · PRIZES {PRIZES.map((p) => `$${p}`).join(" / ")}</p>
            <input className="setup-input" placeholder="YOUR WALLET (EVM OR SOLANA)" maxLength={64} value={wallet} onChange={(e) => { setWallet(e.target.value); setWalletError(false); }} aria-label="Prize wallet" />
            <small>{walletError ? "That wallet address is not valid. Check it and try again." : "Only the top 3 need it. Wallets stay private. One account per player — prizes are paid within 3 days after the October launch."}</small>

          </div>
        )}
        {tournament && status === "done" && wallet.trim() && <small className="end-message">Entered for {seasonLabel(run.config.season)} as {shortWallet(wallet.trim())}.</small>}

        <div className="start-actions end-actions">

          <Button onClick={() => { playSfx("win"); void send(); }} disabled={status === "sending" || status === "done" || status === "rejected"}><Trophy />{status === "done" ? "SCORE SUBMITTED" : status === "sending" ? "SENDING…" : status === "queued" ? "TRY AGAIN" : status === "rejected" ? "RUN NOT ACCEPTED" : "CLAIM YOUR RANK"}</Button>
          <Button variant="outline" disabled={status === "sending"} onClick={() => { playSfx("click"); onBoard(); }}>LEADERBOARD</Button>
          <Button variant="outline" onClick={() => void share()}><Share2 />{copied ? "COPIED" : "SHARE RESULT"}</Button>
          <Button variant="secondary" disabled={status === "sending"} onClick={() => { playSfx("click"); onRematch(); }}><Swords />SAME SEED REMATCH</Button>
          <Button variant="secondary" disabled={status === "sending"} onClick={() => { playSfx("click"); onRestart(); }}>{won ? <Crown /> : <Skull />}NEW RUN</Button>
        </div>

        {status === "queued" && <small className="end-message">The board is unavailable. Your result is saved and will retry automatically.</small>}
        {status === "rejected" && <small className="end-message">This result failed the board's integrity checks and cannot be submitted.</small>}

      </section>
    </main>
  );
}

export const PRESALE_COUNT = PRESALES.length;
