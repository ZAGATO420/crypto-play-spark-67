import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ChevronRight, Target, Crown, Ellipsis, Flame, HeartPulse, History, Home, Receipt, Rocket, Share2, Shield, Skull, Swords, TrendingDown, TrendingUp, Trophy, Volume2, VolumeX, WalletCards, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import crownedBoss from "@/assets/boss/crowned.webp.asset.json";
import bossStageWide from "@/assets/boss/stage-wide.jpg.asset.json";
import bossStagePortrait from "@/assets/boss/stage-portrait.jpg.asset.json";
import enragedBoss from "@/assets/boss/enraged.webp.asset.json";
import smugBoss from "@/assets/boss/smug.webp.asset.json";
import actMania from "@/assets/game/act-mania.jpg";
import actCollapse from "@/assets/game/act-collapse.jpg";
import actEndgame from "@/assets/game/act-endgame.jpg";
import avApe from "@/assets/tcfb/av-ape.webp.asset.json";
import avAstro from "@/assets/tcfb/av-astro.webp.asset.json";
import avBot from "@/assets/tcfb/av-bot.webp.asset.json";
import avCoder from "@/assets/tcfb/av-coder.webp.asset.json";
import avDiamond from "@/assets/tcfb/av-diamond.webp.asset.json";
import avFrog from "@/assets/tcfb/av-frog.webp.asset.json";
import avReaper from "@/assets/tcfb/av-reaper.webp.asset.json";
import avWhale from "@/assets/tcfb/av-whale.webp.asset.json";
import {
  ARCHETYPES, CHAPTERS, CHAPTER_WARNINGS, COINS, COUNTRIES, CUSTODY, DIFFICULTIES, ENDINGS, ENDING_HINTS, EXPLAIN, HOUSING, HOW_TO_PLAY, JOBS, MILESTONES, MODE_MOVES, MODE_THEME, MODES, MODIFIERS, PERK_BLURB, PRESALES, PRESETS, STATUS_BY_CHOICE, TAX_RATE, TOTAL_MONTHS, TOURNAMENT_RULES, XP, XP_EXTRA,
  actFor, attackFor, bossFightFor, bossReaction, bossScore, careCost, chapterLabel, chapterMonth, chapterPlayFor, crashFor, custodyOf, decisionForChapter, doomIn, failureFor, formatMoney, hintFor, housingOf, isTaxChapter, jobOf, levelFor, levelPerk, lootDraw, missionFor, modifierOf, monthRangeLabel, monthsSurvived, objectiveFor, personaFor, pickLifeEvent, presaleFor, situationFor, skillCheckFor, standingFor, xpProgress,
  type Archetype, type BaseMode, type BossAttack, type BossFight, type ChapterMode, type CoinSymbol, type Country, type CustodyId, type Decision, type DecisionOption, type Difficulty, type EndingKey, type HousingId, type JobId, type LootCard, type ModifierId, type Presale, type Situation,
} from "./journey-data";

import { readProfile, recordRun, type Profile } from "./profile";


import { COIN_LOGO } from "./coin-logos";
import { Flag } from "./flags";
import { Minigame, type MiniKind, type MiniResult } from "./minigames";
import { loadBoard, loadTopMark, submitRun, SubmitRunError, type BoardRow, type RunSubmission, type TopMark } from "./leaderboard";
import { audioLive, getVolumes, initAudio, isMuted, playSfx, playSfxExclusive, preloadSfx, setMood, setMusicVol, setMuted, setSfxVol, setTrack, unlockAudio, wireAudio } from "./audio";
import { det, randomSeed } from "./rng";
import { PRIZES, countdown, currentSeasonId, isWallet, playerKey, readName, readWallet, saveName, saveWallet, seasonEnd, seasonLabel, seasonSeed, shortWallet } from "./season";
import { SYNERGIES, relicChapter, relicOf, relicOffer, relicPower, type Relic } from "./relics";
import type { LogEvent } from "./runlog";
import { livePrice as sharedLivePrice, makeNoise, priceAt } from "./market";

/** Compact money for tight HUD chips: $1.4M, $920K, $480. */
function shortMoney(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(a >= 10_000_000 ? 0 : 1)}M`;
  if (a >= 1_000) return `$${(a / 1_000).toFixed(a >= 10_000 ? 0 : 1)}K`;
  return `$${Math.round(a)}`;
}



/* ------------------------------------------------------------------ types */

type Kind = "spot" | "perp";
/** The quarter plan: how hard you are willing to be wrong. */
type Stance = "survive" | "balanced" | "degen";
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
  /** This quarter's plan, and how many quarters in a row you called it right. */
  stance: Stance; heat: number;
  /** Chapters whose boss fight is already settled, so nobody can farm the same duel twice. */
  fought: number[];
  /** The story of this run, in the player's own voice. Rendered on the end screen. */
  chronicle: string[];
  /** Milestone ids already lived through, so a beat never repeats. */
  seen: string[];
  /** This quarter's risk moment: graded on play, paid at the quarter reveal. One per quarter, survives a reload. */
  riskPlay: { chapter: number; quality: number; label: string; stake: number; mode: ChapterMode; symbol: CoinSymbol; delta: number; settled: boolean; timing?: Timing | null } | null;
  /** Roguelike relics collected this run. They bend your own numbers, never history. */
  relics: string[];
  /** Tournament audit trail: every money-moving action, replayed server-side before a prize entry counts. */
  audit: LogEvent[];
};



type Phase = "brief" | "act" | "resolve";
type LaunchResult = { name: string; tag: string; size: number; back: number; multi: number; rugged: boolean; line: string };
type Pending =
  | { t: "close"; id: number; fraction: number }
  | { t: "presale"; card: Presale; size: number }
  | { t: "crash"; chapter: number }
  | { t: "fight"; chapter: number; wager: number }
  | { t: "skill" }
  | { t: "phaseRisk"; stake: number; mode: ChapterMode; timing?: Timing | null }
  | { t: "seed" };

/**
 * One skill moment per phase, fixed to the game that phase already owns.
 * Pressing the risky move plays it; how well you play it decides the payout.
 */
const PHASE_RISK: Record<ChapterMode, { kind: MiniKind; head: string; hit: string; ok: string; miss: string }> = {
  ACCUMULATE: { kind: "whale", head: "CATCH THE GREEN",
    hit: "Perfect accumulation — you took every green print the whale left behind.",
    ok: "Solid buying. Nothing wasted, nothing spectacular.",
    miss: "You chased the red candles and paid up for your bag." },
  MOMENTUM: { kind: "orderbook", head: "PLACE THE BID",
    hit: "Perfect fill — you caught the breakout and pressed it clean.",
    ok: "A solid momentum trade, nothing wasted.",
    miss: "You bought the local top and paid the spread." },
  PANIC: { kind: "hodl", head: "HOLD THROUGH THE CRASH",
    hit: "You held the line through the darkest wick without flinching. Diamond hands.",
    ok: "You wobbled but you stayed in. The bag survived the wick.",
    miss: "You cracked under pressure and dumped at the exact local bottom." },
  HUNT: { kind: "airdrop", head: "CLAIM THE REAL ONE",
    hit: "You hit the genuine claim instantly and the bots ate your dust.",
    ok: "Claim landed, a little late. You are in.",
    miss: "You clicked a drainer link and paid for the lesson." },
  DEFEND: { kind: "panic", head: "GET IT OFF THE EXCHANGE",
    hit: "Withdrawals out before the gate slammed. Ice cold under pressure.",
    ok: "Most of it made it out. The rest sat there while the venue wobbled.",
    miss: "You froze while withdrawals were paused. That one hurt." },
  "BOSS DUEL": { kind: "gas", head: "OUTBID THE BOTS",
    hit: "You outbid his bots to the cent. He felt that one.",
    ok: "You landed the block, a little expensive. Respect earned.",
    miss: "His bots front-ran you and he made sure the room noticed." },
};

type Dialog =
  | { k: "rules" }
  | { k: "market"; tab?: Kind }
  | { k: "trade"; symbol: CoinSymbol }
  | { k: "position"; id: number }
  | { k: "presale"; card: Presale }
  | { k: "launchResult"; res: LaunchResult }
  | { k: "survive" }
  | { k: "more" }
  | { k: "loot"; cards: LootCard[] }
  | { k: "relic"; cards: Relic[] }

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
  | { k: "how" }
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

/**
 * The strategy layer. Before a quarter closes you commit to a plan, and the
 * plan changes how hard the result lands. Reading the tape right builds HEAT,
 * which pays a rising bonus — reading it wrong resets it to zero.
 */
const STANCES: { id: Stance; name: string; short: string; line: string; win: number; loss: number; stress: number; xp: number }[] = [
  { id: "survive", name: "SURVIVE", short: "SHIELD", line: "Half the damage, half the upside. Pays when the tape bleeds.", win: 0.6, loss: 0.5, stress: -7, xp: 60 },
  { id: "balanced", name: "BALANCED", short: "STEADY", line: "Take the quarter exactly as it comes. No bonus, no penalty.", win: 1, loss: 1, stress: 0, xp: 40 },
  { id: "degen", name: "FULL DEGEN", short: "ALL IN", line: "Every move hits 60% harder — profit and pain. Builds HEAT fastest.", win: 1.6, loss: 1.6, stress: 9, xp: 120 },
];
const stanceOf = (id: Stance) => STANCES.find((s) => s.id === id) ?? STANCES[1]!;
/** Calling the quarter right stacks HEAT, and HEAT multiplies your next win. */
const heatBonus = (heat: number, step = 0.12) => 1 + Math.min(5, heat) * step;


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
  if (run.crises >= 5 && net >= startCashFor(run.config) * 8) return "DIAMOND HANDS";
  if (run.trades <= 3) return "HODL SURVIVOR";
  return "CYCLE SURVIVOR";
};

const DEATH_PUNCHLINES: Record<Exclude<EndingKey, "LEGEND" | "SURVIVOR" | "SELLOUT" | "THRONE">, string[]> = {
  CASINO: ["The liquidation engine sends its regards.", "You called it conviction. The exchange called it collateral.", "10x confidence. 0x account."],
  STARVED: ["You fed the bags. The bags did not feed you.", "Great portfolio. Shame about the human holding it.", "The candles were green. Your fridge was not."],
  BROKEN: ["The market stayed irrational longer than you stayed functional.", "You survived the volatility. Your nervous system did not.", "Touching grass was always free."],
  BROKE: ["Your portfolio has successfully become a tax deduction.", "Seven years of alpha, distilled into zero.", "The Boss thanks you for providing exit liquidity."],
};

// Tournament runs all share the season seed, so every player meets the same
// market noise, the same rugs and the same drainers. Free runs stay random,
// unless a player asks for a rematch on the exact same seed.
const seedFor = (config: Config, reuse?: number) =>
  config.tournament ? seasonSeed(config.season) : reuse ?? randomSeed();

/** In the tournament the modifier is locked to the season seed, so it stays fair. */
export const tournamentModifier = (season: string): ModifierId =>
  MODIFIERS[Math.floor(det(seasonSeed(season), "modifier") * MODIFIERS.length) % MODIFIERS.length]!.id;

/** Tournament runs all start with the same money, so the archetype is looks and
 *  playstyle only — never an advantage. Free runs keep the archetype bankroll. */
export const startCashFor = (config: Config) => {
  const base = config.tournament ? TOURNAMENT_RULES.cash : archOf(config.arch).cash;
  return Math.round(base * (!config.tournament && config.modifier === "glass" ? 0.5 : 1));
};

const tournamentConfig = (): Config => {
  const season = currentSeasonId();
  return {
    ...defaultConfig,
    name: "anon",
    tournament: true,
    season,
    modifier: tournamentModifier(season),
    difficulty: TOURNAMENT_RULES.difficulty,
    mode: TOURNAMENT_RULES.mode,
    ironman: TOURNAMENT_RULES.ironman,
  };
};

const trackGameBeat = (beat: string, detail?: Record<string, string | number | boolean>) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("tcfb:game", { detail: { beat, ...detail } }));
  const chapter = typeof detail?.["chapter"] === "number" ? detail["chapter"] : undefined;
  const tournament = typeof detail?.["tournament"] === "boolean" ? detail["tournament"] : undefined;
  const safeDetail = Object.fromEntries(Object.entries(detail ?? {}).filter(([key]) => key !== "chapter" && key !== "tournament"));
  void fetch("/api/public/game-analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ beat, chapter, tournament, viewport: `${window.innerWidth}x${window.innerHeight}`, detail: safeDetail }),
    keepalive: true,
  }).catch(() => undefined);
};

const freshRun = (config: Config, reuse?: number): Run => {
  const seed = seedFor(config, reuse);
  const mod = modifierOf(config.modifier).id;
  const start = startCashFor(config);
  return {
    chapter: 0, cash: start, positions: [], nextId: 1,
    hunger: 8, stress: 6, risk: 0, streak: 0, crises: 0, trades: 0, xp: 0,
    custody: "exchange", job: "dayjob", housing: "shared", realized: 0, taxDebt: mod === "debt" ? 8000 : 0, moves: 0, cares: 0, criticals: 0,
    ledger: mod === "debt" ? [{ chapter: 0, label: "Inherited tax debt", amount: -8000 }] : [], statuses: mod === "straight" ? [] : [modifierOf(mod).name],
    logs: [], noise: makeNoise(config.mode, seed), muted: false, seed, config,
    boss: { cash: start * 3, btc: 0, line: personaFor(det(seed, "persona")).line },
    conviction: 0, convictionOn: false, perks: [], bossWins: 0, fought: [], stance: "balanced", heat: 0,
    chronicle: [`I started in ${chapterLabel(0)} with ${formatMoney(start)} and no idea what was coming.`], seen: [], riskPlay: null, relics: [],
    audit: [],
  };
};



/**
 * The quarter is not a jump any more: t walks from 0 to 1 in front of the
 * player, with real intra-quarter wicks on top of the historical path.
 * Deterministic, so a tournament seed shows everyone the same tape.
 */
const livePrice = (symbol: CoinSymbol, r: Run, t: number, sweep = false) =>
  sharedLivePrice(symbol, { chapter: r.chapter, noise: r.noise, seed: r.seed, mode: r.config.mode }, t, sweep);

/**
 * MOMENTUM pilot: watching the tape is a skill. When the risky move is pressed we
 * grade WHERE in the last ~3 seconds of ALREADY VISIBLE tape the click landed.
 * Buying a visible local low pays a bonus, chasing a visible high (worse during a
 * SWEEP fakeout) costs. The middle of the range is neutral, exactly as before.
 */
type Timing = { r: number; z: number; verdict: string };
const TIMING_WINDOW = 3_000 / LIVE_MS; // three seconds of revealed tape

const timingEdge = (symbol: CoinSymbol, r: Run, t: number, sweep: boolean): Timing => {
  const from = Math.max(0, t - TIMING_WINDOW);
  if (t - from < 0.01) return { r: 0, z: 0.5, verdict: "too early to read the tape | no edge" };
  const steps = 24;
  let low = Infinity;
  let high = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const price = livePrice(symbol, r, from + ((t - from) * i) / steps, sweep);
    if (price < low) low = price;
    if (price > high) high = price;
  }
  const price = livePrice(symbol, r, t, sweep);
  const z = clamp((price - low) / Math.max(high - low, 1e-9), 0, 1);
  const dipStrength = clamp((0.28 - z) / 0.28, 0, 1);
  const topStrength = clamp((z - 0.72) / 0.28, 0, 1);
  const edge = dipStrength > 0
    ? dipStrength * 0.12
    : topStrength > 0 ? -topStrength * (sweep ? 0.18 : 0.12) : 0;
  const pct = `${edge >= 0 ? "+" : "−"}${Math.abs(Math.round(edge * 100))}%`;
  const verdict = dipStrength > 0
    ? `bought the local low | ${pct}`
    : topStrength > 0
      ? sweep ? `chased the sweep fakeout high | ${pct}` : `chased the local high | ${pct}`
      : "entered mid range | no edge";
  return { r: Number(edge.toFixed(4)), z: Number(z.toFixed(3)), verdict };
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
  // The real target of a run: what the current season leader holds. Fetched once
  // per page and then frozen, so nobody chases a number that moves mid-run.
  const topMark = useTopMark(currentSeasonId());
  // Relics turn into one bag of multipliers here, so every payout path reads
  // the same numbers instead of each checking artefacts by hand.
  const power = useMemo(() => relicPower(run.relics ?? []), [run.relics]);


  const [pops, setPops] = useState<Pop[]>([]);
  const [shake, setShake] = useState(false);
  // the feeling layer: a coloured flash over everything, and the Boss talking back
  const [fxFlash, setFxFlash] = useState<"gold" | "red" | null>(null);
  const [bossTalk, setBossTalk] = useState<string | null>(null);
  const [arcadeFx, setArcadeFx] = useState<
    | { kind: "god"; label: string; multiplier: number; amount?: number }
    | { kind: "liq"; symbol: CoinSymbol; leverage: number; amount: number }
    | null
  >(null);
  // On phones the secondary explainers collapse so one quarter fits a single screen.
  const [intel, setIntel] = useState(false);
  // A loud, unmistakable confirmation that a position really opened.
  const [fillFx, setFillFx] = useState<{ head: string; sub: string; tone: "buy" | "perp" } | null>(null);
  const fillTimer = useRef<number | null>(null);
  const showFill = (head: string, sub: string, tone: "buy" | "perp") => {
    if (fillTimer.current) window.clearTimeout(fillTimer.current);
    setFillFx({ head, sub, tone });
    fillTimer.current = window.setTimeout(() => setFillFx(null), 1500);
  };

  // THE ONE SIGNATURE MOMENT: the terminal is overridden for a single second,
  // the Boss rams himself into frame and stamps his verdict. Rare on purpose —
  // only real turning points (duel won, duel lost, margin erased) fire it.
  const [interrupt, setInterrupt] = useState<{ stamp: string; line: string; img: string; tone: "good" | "bad" } | null>(null);
  const interruptTimer = useRef<number | null>(null);
  const bossInterrupt = (stamp: string, line: string, tone: "good" | "bad") => {
    if (interruptTimer.current) window.clearTimeout(interruptTimer.current);
    setInterrupt({ stamp, line, tone, img: tone === "good" ? crownedBoss.url : enragedBoss.url });
    interruptTimer.current = window.setTimeout(() => setInterrupt(null), 1250);
  };



  const [muted, setMutedState] = useState(false);
  const [vols, setVols] = useState({ musicVol: 0.35, sfxVol: 0.6 });
  useEffect(() => { wireAudio(); initAudio(); preloadSfx(); setMutedState(isMuted()); setVols(getVolumes()); }, []);
  const [netPulse, setNetPulse] = useState<"up" | "down" | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  // Q1 opens straight in the live market, so its story cards are held back
  // until the player's first action — whatever that action is.
  const openingPlayed = useRef(false);
  const flashTimer = useRef<number | null>(null);
  const arcadeTimer = useRef<number | null>(null);
  const popId = useRef(1);
  const lastNet = useRef(0);

  // the live quarter: t walks 0 -> 1 while you act, then the market answers
  const [tick, setTick] = useState(0);
  const [fast, setFast] = useState(false);
  const [guide, setGuide] = useState<0 | 1 | 2 | null>(null);
  const [verified, setVerified] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState<CoinSymbol>("BTC");
  /** The one skill test of the current quarter, once it has been played. */
  const [skill, setSkill] = useState<{ chapter: number; quality: number; label: string; delta: number } | null>(null);

  const tickRef = useRef(0);
  const chartRevealRef = useRef<SVGRectElement | null>(null);
  const chartMarkerRef = useRef<HTMLElement | null>(null);
  const liveClockRef = useRef<HTMLElement | null>(null);
  const [actSplash, setActSplash] = useState(true);
  const lastAct = useRef(1);

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
  const chapterPlay = chapterPlayFor(run.chapter);
  const mission = missionFor(run.chapter);
  const attack = attackFor(run.chapter, det(run.seed, `attack-${run.chapter}`), persona.bias);
  const sweeping = attack?.id === "SWEEP";

  const signals = useMemo(() => signalsFor(run), [run.chapter, run.seed, run.noise]);
  const bossNet = bossNetOf(run);
  const perkFee = run.perks.includes("CHEAP FEES") ? 0.5 : 1;
  /** During the live phase every price is the moving one. */
  const mark = (symbol: CoinSymbol) => (phase === "act" ? livePrice(symbol, run, tick, sweeping) : priceAt(symbol, run.chapter, run.noise));
  const focusSymbol = activeSymbol;
  const focusPositions = run.positions.filter((position) => position.symbol === focusSymbol);
  const focusPosition = [...focusPositions].sort((a, b) => b.margin - a.margin)[0];
  const focusPrice = mark(focusSymbol);
  const focusPnl = focusPositions.reduce((total, position) => total + pnlOf(position, focusPrice), 0);
  const chartPoints = useMemo(() => Array.from({ length: 28 }, (_, i) => {
    const t = i / 27;
    const price = livePrice(focusSymbol, run, t, sweeping);
    return price;
  }), [focusSymbol, run.chapter, run.seed, run.noise, sweeping]);
  const chartMin = Math.min(...chartPoints);
  const chartMax = Math.max(...chartPoints);
  const chartSpan = Math.max(Number.EPSILON, chartMax - chartMin);
  const chartPath = chartPoints.map((price, i) => `${(i / 27) * 100},${92 - ((price - chartMin) / chartSpan) * 76}`).join(" ");
  /**
   * The same live walk drawn as candles, so the quarter reads like a real chart:
   * each step becomes an open/close body with a wick, green up, red down.
   */
  const candles = useMemo(() => chartPoints.slice(1).map((close, i) => {
    const open = chartPoints[i]!;
    const y = (p: number) => 92 - ((p - chartMin) / chartSpan) * 76;
    const top = Math.min(y(open), y(close));
    const bottom = Math.max(y(open), y(close));
    const wick = Math.max(1.2, (bottom - top) * 0.55);
    return { x: ((i + 0.5) / 27) * 100, top, height: Math.max(0.9, bottom - top), wickTop: top - wick, wickBottom: bottom + wick, up: close >= open };
  }), [chartPoints, chartMin, chartSpan]);

  const currentChartX = Math.max(2, Math.min(98, tick * 100));
  const currentChartY = 92 - ((focusPrice - chartMin) / chartSpan) * 76;
  const entryChartY = focusPosition ? Math.max(10, Math.min(94, 92 - ((focusPosition.entry - chartMin) / chartSpan) * 76)) : null;
  /** Every open trade's profit and loss, always on screen in the status bar. */
  const openPnl = run.positions.reduce((total, position) => total + pnlOf(position, mark(position.symbol)), 0);
  // A leveraged position within 20% of its liquidation price puts the whole screen on alert.
  const liqAlert = run.positions.some((position) => position.kind === "perp" && liqPct(position, mark(position.symbol)) < 20);
  // The first moment a trade enters that danger zone: one warning cue, one Boss taunt.
  const liqWarned = useRef(false);
  useEffect(() => {
    if (!liqAlert) { liqWarned.current = false; return; }
    if (liqWarned.current) return;
    liqWarned.current = true;
    playSfxExclusive("hit");
    setBossTalk("Your margin is gone in a heartbeat. Add, exit, or pray.");
    say("LIQUIDATION CLOSE | protect the position", "pink");
  }, [liqAlert]);



  const survivalDanger = Math.max(run.stress, run.hunger, run.risk);
  const arenaState = crashFor(run.chapter) || survivalDanger >= 80 ? "danger" : focusPnl > 0 || run.streak >= 2 ? "winning" : "neutral";
  /** His state of mind, read off his own book and the duels he has lost. */
  const bossPhase: "SMUG" | "PRESSED" | "ENRAGED" | "BROKEN" =
    run.bossWins >= 3 && net > bossNet ? "BROKEN" : net > bossNet * 1.2 ? "ENRAGED" : net > bossNet * 0.6 ? "PRESSED" : "SMUG";

  const marketPulse = focusPosition ? (focusPnl >= 0 ? "up" : "down") : btcMove >= 0 ? "up" : "down";
  const waitingForFirstTrade = run.chapter < 2 && run.trades === 0;
  const duelStake = Math.max(200, Math.round(run.cash * 0.1));


  useEffect(() => {
    if (localStorage.getItem(SAVE_KEY)) setResume(true);
    void retryPendingSubmission();
    const retry = () => { void retryPendingSubmission(); };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);
  useEffect(() => { void setTrack(screen === "run" ? "run" : "menu"); }, [screen]);
  useEffect(() => {
    if (screen === "start") trackGameBeat("start_seen");
    if (screen === "end") trackGameBeat("end_seen", { chapter: run.chapter, tournament: run.config.tournament });
  }, [screen]);
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
    setMood(danger || act.n === 2 ? "tense" : act.n === 3 || run.streak >= 2 ? "hype" : "calm");
  }, [screen, run.chapter, run.stress, run.hunger, run.risk, run.streak]);
  useEffect(() => {
    if (screen !== "run" || lastAct.current === act.n) return;
    lastAct.current = act.n;
    setActSplash(true);
    playSfx("level");
    const id = window.setTimeout(() => setActSplash(false), 2400);
    return () => window.clearTimeout(id);
  }, [act.n, screen]);


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
    const gain = Math.max(1, Math.round(amount * arch.xp * XP_MODE[cfg.mode] * power.xpMul));
    setRun((r) => {
      const next = r.xp + gain;
      if (levelFor(next) > levelFor(r.xp)) {
        setLevelUp(levelFor(next));
        playSfx("level");
        window.setTimeout(() => setLevelUp(null), 2200);
      }
      return { ...r, xp: next };
    });
    pop(`+${gain} XP${label ? ` | ${label}` : ""}`, "xp");
  };

  const rumble = () => { playSfx("crash"); setShake(true); window.setTimeout(() => setShake(false), 520); };

  const triggerGodCandle = (label: string, multiplier = 10, amount?: number) => {
    if (arcadeTimer.current) window.clearTimeout(arcadeTimer.current);
    setArcadeFx(amount === undefined
      ? { kind: "god", label, multiplier: Math.max(1, multiplier) }
      : { kind: "god", label, multiplier: Math.max(1, multiplier), amount });
    setBossTalk("Fine. That candle was disgusting. Do it again.");
    playSfxExclusive("win");
    arcadeTimer.current = window.setTimeout(() => setArcadeFx(null), 2300);
  };

  const triggerLiquidationShock = (position: Pos) => {
    if (arcadeTimer.current) window.clearTimeout(arcadeTimer.current);
    setArcadeFx({ kind: "liq", symbol: position.symbol, leverage: position.lev, amount: Math.round(position.margin) });
    setBossTalk("That was not leverage. That was a donation.");
    playSfxExclusive("crash");
    setShake(true);
    window.setTimeout(() => setShake(false), 680);
    arcadeTimer.current = window.setTimeout(() => setArcadeFx(null), 2500);
    bossInterrupt("LIQUIDATED", `${position.symbol} ${position.lev}x | margin erased`, "bad");
  };

  /**
   * One place decides how a moment *feels*: sound, colour, shake, the flying
   * number and what the Boss says about it. Every action calls this instead of
   * wiring its own effects, so nothing on screen stays silent.
   */
  const feel = (kind: "win" | "loss" | "liq" | "crash" | "save" | "green" | "red" | "idle", amount?: number) => {
    const salt = run.chapter * 7 + run.trades + run.moves;
    if (kind === "win" || kind === "green") { setFxFlash("gold"); playSfx("win"); }
    if (kind === "save") { setFxFlash("gold"); playSfx("vault"); }
    if (kind === "loss" || kind === "red") { setFxFlash("red"); playSfx("hit"); }
    if (kind === "liq" || kind === "crash") { setFxFlash("red"); playSfx("crash"); setShake(true); window.setTimeout(() => setShake(false), 520); }
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

  /** Tournament runs record every money-moving action; the server replays this log before a prize entry counts. */
  const rec = (e: LogEvent) => {
    if (!cfg.tournament) return;
    setRun((r) => ({ ...r, audit: [...(r.audit ?? []), e] }));
  };


  /* ---------------------------------------------------------- run actions */

  const openSpot = (symbol: CoinSymbol, fraction: number) => {
    const price = mark(symbol);
    setDialog(null);
    if (!price) return say(`${symbol} does not exist yet. Time travel has rules.`, "pink");
    setActiveSymbol(symbol);
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
    rec({ t: "spot", c: run.chapter, s: symbol, size, fee, price });
    log({ chapter: run.chapter, title: `LONG ${symbol} SPOT`, detail: `${formatMoney(size)} at ${formatMoney(price)} | held in ${cust.short}.`, tone: "cyan" });
    say(`${formatMoney(size)} into ${symbol}, sitting in your ${cust.short}.`, "cyan");
    showFill(`${formatMoney(size)} ${symbol} BOUGHT`, `POSITION OPEN | ${cust.short} | entry ${formatMoney(price)}`, "buy");
    playSfx("buy");

    if (run.trades === 0) trackGameBeat("first_trade", { chapter: run.chapter, tournament: cfg.tournament });
    grantXp(XP.trade, "TRADE");
    if (guide === 0) setGuide(1);
    // The opening lesson lets the player act before history hits. Immediately
    // after that first BTC order, the full Q1 event queue still plays.
    playOpening();
  };

  const openPerp = (symbol: CoinSymbol, dir: 1 | -1, lev: number, fraction: number) => {
    const price = mark(symbol);
    setDialog(null);
    if (!price) return say(`${symbol} has no market in ${chapterLabel(run.chapter)}.`, "pink");
    setActiveSymbol(symbol);
    const margin = Math.floor(run.cash * fraction);
    if (margin < 50) return say("Not enough margin. Perps eat small accounts first.", "pink");
    spend();
    setRun((r) => book({
      ...r, cash: r.cash - margin, trades: r.trades + 1, risk: clamp(r.risk + lev * 6 * arch.risk),
      positions: [...r.positions, { id: r.nextId, symbol, kind: "perp", dir, lev, margin, entry: price, qty: 0, where: "exchange" }],
      nextId: r.nextId + 1,
    }, `${lev}x ${dir === 1 ? "long" : "short"} ${symbol} margin`, -margin));
    rec({ t: "perp", c: run.chapter, s: symbol, dir, lev, margin, price });
    log({ chapter: run.chapter, title: `${dir === 1 ? "LONG" : "SHORT"} ${symbol} ${lev}x`, detail: `${formatMoney(margin)} margin at ${formatMoney(price)}. Funding runs every quarter.`, tone: "yellow" });
    say(`${lev}x ${dir === 1 ? "long" : "short"} ${symbol} is live. Perps always sit on the exchange.`, "yellow");
    showFill(`${lev}x ${dir === 1 ? "LONG" : "SHORT"} ${symbol} LIVE`, `${formatMoney(margin)} margin | entry ${formatMoney(price)}`, "perp");
    playSfx("buy");
    // opening leverage is the loudest moment in the game: the candle shows the
    // exact leverage you picked, never a hardcoded number
    triggerGodCandle(`${symbol} ${dir === 1 ? "LONG" : "SHORT"}`, lev, margin);

    grantXp(XP.trade + lev * 8, `${lev}x`);
    playOpening();
  };

  /** Closing asks for a steady hand: the timing bar decides your fill. */
  const askClose = (id: number, fraction: number) => {
    const pos = run.positions.find((p) => p.id === id);
    if (!pos) return;
    if (pos.where === "cold" && ap <= 0) { setDialog(null); return say("Cold storage needs a move to unlock. None left this quarter.", "pink"); }
    setDialog({ k: "mini", kind: chapterPlay.mode === "MOMENTUM" ? "orderbook" : "timing", pending: { t: "close", id, fraction } });
  };

  const closePosition = (id: number, fraction: number, quality: number) => {
    setDialog(null);
    if (run.realized === 0) trackGameBeat("first_exit", { chapter: run.chapter, tournament: cfg.tournament });
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
    rec({ t: "close", c: run.chapter, id, frac: fraction, q: quality, price, back, fee });
    log({ chapter: run.chapter, title: `CLOSED ${pos.symbol}`, detail: `${formatMoney(back)} back | ${gain >= 0 ? "+" : ""}${formatMoney(gain)}${pos.where === "cold" ? " | settled a quarter late" : ""}.`, tone: gain >= 0 ? "yellow" : "pink" });
    say(`${pos.symbol} closed for ${formatMoney(back)} | ${gain >= 0 ? "+" : ""}${formatMoney(gain)}`, gain >= 0 ? "yellow" : "pink");
    feel(gain >= 0 ? "win" : "loss", gain);
    if (gain > 0 && cost > 0 && gain / cost >= 2) triggerGodCandle(`${pos.symbol} ${pos.kind === "perp" ? `${pos.lev}x` : "SPOT"}`, gain / cost + 1, gain);
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
    rec({ t: "conviction", c: run.chapter, on: !run.convictionOn });
    say(run.convictionOn ? "Conviction back in the holster." : "CONVICTION ARMED | this quarter counts 1.5x, win or lose.", "yellow");
  };

  const takeOffer = (amount: number) => {
    nextInQueue();
    playSfx("vault");
    setRun((r) => book({ ...r, cash: r.cash + amount, statuses: Array.from(new Set([...r.statuses, "BOSS DEBT"])), stress: clamp(r.stress + 6) }, "The Boss bought you out", amount));
    rec({ t: "offer", c: run.chapter, amount });
    log({ chapter: run.chapter, title: "TOOK THE OFFER", detail: `${formatMoney(amount)} now, a cut of every quarter forever.`, tone: "pink" });
    say(`${formatMoney(amount)} in your account. He owns a piece of you now.`, "pink");
  };

  /** A boss fight: stake real money, land the skill moment, live with it. */
  const resolveFight = (chapter: number, wager: number, quality: number) => {
    const fight = bossFightFor(chapter);
    rec({ t: "fight", c: chapter, wager, q: quality, delta: quality >= 0.9 ? Math.round(wager * 2 * power.duelMul) : quality >= 0.5 ? 0 : -wager });
    setRun((r) => (r.fought.includes(chapter) ? r : { ...r, fought: [...r.fought, chapter] }));
    // the duel is this quarter's risk moment; it pays on the spot, so it is already settled
    setRun((r) => ({ ...r, riskPlay: { chapter, quality, label: "THE DUEL", stake: wager, mode: "BOSS DUEL", symbol: "BTC", delta: 0, settled: true } }));
    if (!fight) return nextInQueue();
    if (quality >= 0.9) {
      const won = Math.round(wager * 2 * power.duelMul);
      setRun((r) => chron(book({
        ...r, cash: r.cash + won, bossWins: r.bossWins + 1, conviction: clamp(r.conviction + 35),
        boss: { ...r.boss, cash: Math.max(0, r.boss.cash - won), line: "He is not smiling any more." },
        perks: Array.from(new Set([...r.perks, fight.perk])),
        statuses: Array.from(new Set([...r.statuses, "BOSS BEATEN"])),
      }, `${fight.title} | won`, won), `I beat him at ${fight.title.replace(/^.*\| /, "")} and took ${formatMoney(won)} off his table.`));
      say(`You took ${formatMoney(won)} off the Boss. Perk unlocked: ${fight.perk}.`, "yellow");
      bossInterrupt("THRONE THREATENED", `${fight.title} | you took ${formatMoney(won)} off his table`, "good");
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
      }, `${fight.title} | lost`, -wager), `He took ${formatMoney(wager)} off me in ${chapterLabel(chapter)} and made sure the room saw it.`));
      say(`He took ${formatMoney(wager)} and told the room about it.`, "pink");
      bossInterrupt("REJECTED", `${fight.title} | ${formatMoney(wager)} stake gone`, "bad");
      feel("liq", -wager);
    }

    nextInQueue();
  };


  const takePresale = (card: Presale, size: number, quality: number) => {
    if (run.cash < size) { setDialog(null); return say(`${card.name} needs ${formatMoney(size)} — you hold ${formatMoney(run.cash)}.`, "pink"); }
    spend();
    // the hunt is this quarter's one risk moment too; it settles on the spot
    setRun((r) => ({ ...r, riskPlay: { chapter: r.chapter, quality, label: card.name, stake: size, mode: "HUNT", symbol: "BTC", delta: 0, settled: true } }));
    if (quality < 0.2) {
      const gas = Math.round(size * 0.06);
      rec({ t: "presale", c: run.chapter, name: card.name, size, q: quality, back: 0, gas });
      setRun((r) => book({ ...r, cash: Math.max(0, r.cash - gas), stress: clamp(r.stress + 10) }, `${card.name} | missed mint (gas)`, -gas));
      log({ chapter: run.chapter, title: `MISSED | ${card.name}`, detail: "Gas too low. The bots filled the whole allocation.", tone: "pink" });
      return setDialog({ k: "launchResult", res: { name: card.name, tag: card.tag, size: Math.round(size * 0.06), back: 0, multi: 0, rugged: true, line: "Your transaction never made it into the block. Gas is a skill." } });
    }
    const rugged = det(run.seed, `rug-${run.chapter}-${card.name}`) < card.rug / (arch.risk || 1);
    const multi = rugged ? 0.08 : (card.upside[0] + det(run.seed, `multi-${run.chapter}-${card.name}`) * (card.upside[1] - card.upside[0])) * (0.85 + quality * 0.3);

    const back = Math.round(size * multi);
    rec({ t: "presale", c: run.chapter, name: card.name, size, q: quality, back });
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
    log({ chapter: run.chapter, title: `${title} | ${card.name}`, detail: `${formatMoney(size)} in | ${formatMoney(back)} out.`, tone: rugged ? "pink" : "yellow" });
    pop(`${back >= size ? "+" : "−"}${formatMoney(Math.abs(back - size))}`, back >= size ? "up" : "down");
    grantXp(rugged ? XP.presaleRug : XP.presaleHit, rugged ? "RUG SURVIVED" : "LAUNCH HIT");
    if (rugged) rumble();
    if (!rugged && multi >= 3) triggerGodCandle(card.name, multi, back - size);
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
    rec({ t: "care", c: run.chapter, kind, cost });
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
    rec({ t: "sellout", c: run.chapter });
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
    rec({ t: "custody", c: run.chapter, to: id, fee });
    log({ chapter: run.chapter, title: `CUSTODY | ${custodyOf(id).short}`, detail: `${formatMoney(value)} moved for ${formatMoney(fee)} in fees.`, tone: "cyan" });
    say(`Bags now in ${custodyOf(id).name}. ${custodyOf(id).blurb}`, "cyan");
    grantXp(XP_EXTRA.custody, "CUSTODY MOVE");
  };

  const setLife = (job: JobId, housing: HousingId) => {
    setDialog(null);
    if (job === run.job && housing === run.housing) return;
    if (ap <= 0) return say("Changing your life costs a move. None left.", "pink");
    spend();
    setRun((r) => ({ ...r, job, housing, stress: clamp(r.stress + (job === "fulltime" ? 8 : 0)) }));
    rec({ t: "life", c: run.chapter, job, housing });
    log({ chapter: run.chapter, title: "LIFE CHANGED", detail: `${jobOf(job).name} | ${housingOf(housing).name}.`, tone: "cyan" });
    say(`${jobOf(job).name} | ${housingOf(housing).name}. Costs and income updated.`, "cyan");
    grantXp(XP_EXTRA.life, "LIFE CHOICE");
  };

  const bank = () => {
    if (ap <= 0) return say("No moves left. End the quarter.", "pink");
    spend();
    setRun((r) => ({ ...r, stress: clamp(r.stress - 6) }));
    rec({ t: "bank", c: run.chapter });
    say("You sat on your hands. Stress down 6. Patience is a position.", "cyan");
  };

  const resolveDecision = (option: DecisionOption, crisis = true) => {
    playSfx("click");
    rec({ t: "decision", c: run.chapter, label: option.label, crisis });
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
    rec({ t: "crash", c: chapter, q: quality });
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
    rec({ t: "seedphrase", c: run.chapter, q: quality });
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

  /** The quarter's skill test. Plain reward, plain penalty, visible either way. */
  const resolveSkill = (quality: number, label: string) => {
    const check = skillCheckFor(run.chapter);
    const stake = Math.max(300, Math.round(net * 0.02));
    const delta = quality >= 0.6 ? Math.round(stake * quality) : -Math.round(stake * 0.5);
    const xp = Math.round(check.reward * quality);
    rec({ t: "skill", c: run.chapter, q: quality, delta });
    setRun((r) => book({ ...r, cash: Math.max(0, r.cash + delta), xp: r.xp + xp }, `${check.head} | ${label}`, delta));
    setSkill({ chapter: run.chapter, quality, label, delta });
    pop(`${delta >= 0 ? "+" : "−"}${formatMoney(Math.abs(delta))}`, delta >= 0 ? "up" : "down");
    if (xp > 0) pop(`+${xp} XP | ${label}`, "xp");
    playSfx(delta >= 0 ? "win" : "hit");
    nextInQueue();
  };

  /**
   * Every phase's risky move IS its skill moment. Playing it only earns a GRADE —
   * the money is settled at the quarter reveal against the real market move, so the
   * payout can never leak the market direction. One risk moment per quarter.
   */
  const resolvePhaseRisk = (stake: number, quality: number, label: string, mode: ChapterMode, timing?: Timing | null) => {
    const copy = PHASE_RISK[mode];
    const xp = quality >= 0.9 ? 700 : quality >= 0.6 ? 450 : 120;
    const buys = mode === "ACCUMULATE";
    const symbol: CoinSymbol = mode === "ACCUMULATE" || mode === "MOMENTUM" ? focusSymbol : "BTC";
    rec({ t: "risk", c: run.chapter, stake, q: quality, mode, sym: symbol, timingR: timing?.r ?? null });
    // accumulating still puts real money into a real coin; the skill only scales it
    if (buys) openSpot(focusSymbol, 0.25); else spend();
    setRun((r) => ({
      ...r,
      xp: r.xp + xp,
      heat: quality >= 0.9 ? r.heat + 1 : quality >= 0.6 ? r.heat : 0,
      stress: clamp(r.stress + (quality >= 0.6 ? 0 : 8)),
      riskPlay: { chapter: r.chapter, quality, label, stake, mode, symbol, delta: 0, settled: false, timing: timing ?? null },
    }));
    setSkill({ chapter: run.chapter, quality, label, delta: 0 });
    pop(`+${xp} XP | ${label}`, "xp");
    pop(quality >= 0.9 ? "PERFECT | PAYS AT THE REVEAL" : quality >= 0.6 ? "CLEAN | PAYS AT THE REVEAL" : "FUMBLED | THIS WILL COST YOU", quality >= 0.6 ? "up" : "down");
    if (timing) pop(`TIMED | ${timing.verdict}`, timing.r > 0 ? "up" : timing.r < 0 ? "down" : "xp");
    say(`${quality >= 0.9 ? copy.hit : quality >= 0.6 ? copy.ok : copy.miss}${timing ? ` Your entry: ${timing.verdict}.` : ""} End the quarter to see what the market did with it.`, quality >= 0.6 ? "yellow" : "pink");
    playSfx(quality >= 0.6 ? "win" : "hit");
    feel(quality >= 0.6 ? "win" : "loss");
    if (mode === "PANIC") setFast(true);
    if (!buys) nextInQueue();
  };

  const finishMini = (raw: Pending, result: MiniResult) => {
    const pending = raw;
    // MEV BOT and HOUSE EDGE raise the floor under every skill moment.
    const res: MiniResult = power.skillFloor > result.quality
      ? { ...result, quality: power.skillFloor, label: `${result.label} | MEV BOT CLEANUP` }
      : result;
    // A perfect skill moment gets its own clean flash. The GOD CANDLE is reserved
    // for real monster payouts and always shows the multiple that was actually hit.
    if (res.quality >= 1) { playSfx("win"); pop(`PERFECT | ${res.label}`, "up"); }

    if (pending.t === "close") return closePosition(pending.id, pending.fraction, res.quality);
    if (pending.t === "presale") return takePresale(pending.card, pending.size, res.quality);
    if (pending.t === "crash") return resolveCrash(pending.chapter, res.quality);
    if (pending.t === "fight") return resolveFight(pending.chapter, pending.wager, res.quality);
    if (pending.t === "skill") return resolveSkill(res.quality, res.label);
    if (pending.t === "phaseRisk") return resolvePhaseRisk(pending.stake, res.quality, res.label, pending.mode, pending.timing);
    return resolveSeed(res.quality);
  };



  // one card at a time: crash report, then the historical decision, then the small moment
  const nextInQueue = () => {
    const head = queue[0] ?? null;
    setDialog(head);
    setQueue(queue.slice(1));
    if (!head) setPhase("brief");
  };





  /** Opens the held-back Q1 event queue once, after the player's first action.
   *  Returns true when it took over the screen. */
  const playOpening = (delay = 260) => {
    if (run.chapter !== 0 || openingPlayed.current) return false;
    openingPlayed.current = true;
    window.setTimeout(() => openChapterCards(0), delay);
    return true;
  };

  const endChapter = () => {
    // Ending Q1 without ever trading must not skip the opening story beats.
    if (playOpening(120)) return;
    playSfx("quarter");
    const from = run.chapter;
    rec({ t: "quarter", c: from });
    const next = from + 1;
    const startNet = netOf(run);
    const lines: string[] = [];
    // this quarter's risk moment, graded on play and paid right here
    const play = run.riskPlay && run.riskPlay.chapter === from && !run.riskPlay.settled ? run.riskPlay : null;
    // the quarter's skill test, reported in plain words every single time
    if (!play) lines.push(skill && skill.chapter === from
      ? `Skill test | ${skillCheckFor(from).head}: ${skill.label} (${skill.delta >= 0 ? "+" : "−"}${formatMoney(Math.abs(skill.delta))}).`
      : `Skill test | ${skillCheckFor(from).head}: not played. No bonus this quarter.`);

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

    /**
     * The risk moment pays against the real quarter move, never against the click.
     * m = clamp(quarter return x 3, -1, +1.4) on the coin the phase was about.
     * Hit in a green quarter: stake x m x quality. Hit in a red quarter: it still
     * bleeds, but skill cuts the damage (stake x m x (1 - quality)). A fumble
     * always costs half the stake, green quarter or not.
     */
    let riskSettled: Run["riskPlay"] = run.riskPlay;
    if (play) {
      const head = PHASE_RISK[play.mode].head;
      const before = priceAt(play.symbol, from, run.noise);
      const after = priceAt(play.symbol, next, run.noise);
      const ret = before && after ? after / before - 1 : 0;
      const m = Math.max(-1, Math.min(1.4, ret * 3));
      const raw = play.quality < 0.6
        ? -Math.round(play.stake * 0.5 * power.fumbleCut)
        : m >= 0 ? Math.round(play.stake * m * play.quality * power.payoutMul) : Math.round(play.stake * m * (1 - play.quality) * power.redCut);
      const base = raw;
      // MOMENTUM pilot: when you clicked on the live tape scales the result the same
      // way in both directions. A fumbled minigame is never rescued by good timing.
      const edge = play.quality >= 0.6 ? (play.timing?.r ?? 0) * power.timingMul : 0;
      const paid = edge === 0 ? base : Math.round(base * (base >= 0 ? 1 + edge : 1 - edge));

      cash = Math.max(0, cash + paid);
      if (paid >= 0) earnFrom(`${head} | ${play.label}`, paid);
      else spendOn(`${head} | ${play.label}`, -paid);
      lines.push(`Risk moment | ${head}: ${play.label} on a ${ret >= 0 ? "+" : ""}${(ret * 100).toFixed(1)}% ${play.symbol} quarter — ${paid >= 0 ? "+" : "−"}${formatMoney(Math.abs(paid))}.`);
      if (play.timing) lines.push(`Timed entry | ${play.timing.verdict}${edge !== 0 ? ` — skill result ${base >= 0 ? "+" : "−"}${formatMoney(Math.abs(base))} became ${paid >= 0 ? "+" : "−"}${formatMoney(Math.abs(paid))}.` : " — no change to the payout."}`);
      riskSettled = { ...play, delta: paid, settled: true };
      // a big reveal gets the candle with the multiple actually earned on the stake
      if (paid > 0 && play.stake > 0 && paid / play.stake >= 0.5) triggerGodCandle(`${play.label}`, 1 + paid / play.stake, paid);
    }
    let lifeHunger = 0;
    let lifeStress = 0;
    let liquidation: Pos | null = null;
    const survivors: Pos[] = [];
    for (const p of run.positions) {
      const price = priceAt(p.symbol, next, run.noise);
      if (!price) { survivors.push(p); continue; }
      if (p.kind === "perp" && pnlOf(p, price) <= -p.margin * 0.97) {
        liquidation ??= p;
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
        lines.push(`Risk overheated: ${p.symbol} ${p.lev}x force-closed | ${formatMoney(returned)} returned.`);
      }
    }
    let positions = run.risk >= 95 ? survivors.filter((p) => p.kind !== "perp") : survivors;
    if (run.risk >= 95) risk = 40;

    // perp funding: leverage is rented, never owned — and the Boss can raise the rent
    const squeeze = attack?.id === "SQUEEZE" ? 2.2 : 1;
    const funding = Math.round(positions.filter((p) => p.kind === "perp").reduce((s, p) => s + p.margin * p.lev * FUNDING * squeeze, 0));
    if (funding > 0) { cash -= funding; spendOn(squeeze > 1 ? "Perp funding | squeezed" : "Perp funding", funding); lines.push(`Perp funding: ${formatMoney(funding)}${squeeze > 1 ? " — he doubled the rate." : "."}`); }

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
    const rent = Math.round(house.rent * diff.cost * power.lifeCut);
    const food = Math.round((520 + Math.floor(next / 4) * 190) * diff.cost * levelPerk(levelFor(run.xp)) * power.lifeCut);

    cash -= rent + food;
    spendOn(`Rent | ${house.name}`, rent);
    spendOn("Food & living", food);
    lines.push(`Rent ${formatMoney(rent)} | living ${formatMoney(food)} | income ${formatMoney(job.income)}.`);

    // tax once a year on what you actually realised
    if (isTaxChapter(next) && realized > 0) {
      const bill = Math.round(realized * TAX_RATE);
      const paid = Math.min(cash, bill);
      cash -= paid;
      if (paid > 0) spendOn(`Tax on ${formatMoney(realized)} net profit`, paid);
      if (paid < bill) {
        const unpaid = Math.round((bill - paid) * 1.2);
        taxDebt += unpaid;
        lines.push(`Tax bill ${formatMoney(bill)} | ${formatMoney(paid)} paid | ${formatMoney(unpaid)} debt after penalty.`);
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
    const hunger = clamp(run.hunger + Math.round(((8 + Math.floor(next / 6)) * arch.risk * diff.hunger + (idle ? 7 : 0) + lifeHunger) * power.hungerCut));
    const redQuarter = netOf({ ...run, chapter: next, cash, positions, taxDebt }) < startNet;
    const nerves = (run.perks.includes("STEEL NERVES") ? 0.7 : 1) * power.stressCut;
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
    const draft: Run = { ...run, chapter: next, cash, positions, risk, hunger, stress, crises, taxDebt, realized, ledger, moves: 0, cares: 0, criticals, riskPlay: riskSettled };
    const endNet = netOf(draft);
    const delta = endNet - startNet;
    const activeMission = missionFor(run.chapter);
    const missionWon = activeMission.id === "grow" ? delta > 0
      : activeMission.id === "spread" ? new Set(positions.map((p) => p.symbol)).size >= 3
        : activeMission.id === "sniper" ? run.moves === 1
          : activeMission.id === "profit8" ? endNet >= startNet * 1.08
            : activeMission.id === "cashout" ? run.trades > 0 && run.realized !== realized
              : activeMission.id === "patience" ? run.moves === 0
                : delta > 0 && run.moves > 0;

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

    // THE PLAN: your stance decides how hard this quarter lands, and whether
    // your HEAT streak grows or dies. Reading the tape is the actual skill.
    const plan = stanceOf(run.stance);
    const calledRight = (run.stance === "degen" && delta > 0) || (run.stance === "survive" && delta < 0) || (run.stance === "balanced" && Math.abs(delta) < Math.max(1, startNet * 0.03));
    const heat = calledRight ? Math.min(9, run.heat + 1) : 0;
    let planCash = 0;
    if (delta > 0) planCash = Math.round(delta * (plan.win - 1) * (calledRight ? heatBonus(run.heat) : 1));
    else if (delta < 0) planCash = Math.round(Math.abs(delta) * (1 - plan.loss));
    if (planCash !== 0) {
      draft.cash = Math.max(0, draft.cash + planCash);
      draft.ledger = [{ chapter: next, label: `${plan.name} plan`, amount: planCash }, ...draft.ledger].slice(0, 60);
      lines.push(planCash >= 0
        ? `${plan.name} plan paid ${formatMoney(planCash)} extra${calledRight && run.heat > 0 ? ` | HEAT x${run.heat} bonus` : ""}.`
        : `${plan.name} plan cost ${formatMoney(Math.abs(planCash))} more. The plan was wrong.`);
    } else if (delta < 0 && plan.loss < 1) {
      lines.push(`${plan.name} plan absorbed part of the hit.`);
    }
    lines.push(calledRight
      ? `You called the quarter right. HEAT x${heat} — next win pays ${Math.round((heatBonus(heat) - 1) * 100)}% more.`
      : run.heat > 0 ? `Wrong read. HEAT streak of ${run.heat} is gone.` : "No read this quarter. HEAT stays cold.");
    draft.stress = clamp(draft.stress + plan.stress);

    const streak = delta > 0 && !idle ? run.streak + 1 : 0;
    const move = pctMove("BTC", draft);
    const title = delta >= 0 ? (streak >= 3 ? `GREEN QUARTER | STREAK x${streak}` : "GREEN QUARTER") : "RED QUARTER";
    const detail = `${chapterLabel(next)} | ${monthRangeLabel(next)}: BTC ${move >= 0 ? "+" : ""}${move.toFixed(1)}%. Your book ${delta >= 0 ? "gained" : "lost"} ${formatMoney(Math.abs(delta))}.`;
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
      ...draft, streak, boss, conviction, convictionOn: false, heat, stance: "balanced",
      chronicle: [...draft.chronicle, ...story, ...(milestone ? [milestone.line] : [])].slice(-14),
      seen: milestone ? [...run.seen, milestone.id] : run.seen,
      logs: [{ chapter: next, title, detail, tone }, ...run.logs].slice(0, 12),
    };
    setRun(nextRun);
    if ([1, 4, 12].includes(next)) trackGameBeat(`month_${next * 3}`, { tournament: cfg.tournament });
    setResolution({ title, detail, tone, delta: delta + convCash + planCash, move, lines, inflow, outflow });
    setPhase("resolve");
    setTick(0);
    setFast(false);
    setVerified(false);
    setAp(Math.max(1, Math.min(AP_CAP, AP_BASE + job.ap + ap - (critical ? 1 : 0) + (run.perks.includes("+1 MOVE") ? 1 : 0))));
    grantXp((idle ? 0 : XP.chapter) + (delta >= 0 && !idle ? XP.greenQuarter : 0) + streak * XP.streakStep + (missionWon ? activeMission.reward : 0) + (calledRight ? plan.xp + heat * 25 : 0), calledRight ? `${plan.name} CALLED RIGHT` : missionWon ? "MISSION COMPLETE" : idle ? "IDLE QUARTER" : delta >= 0 ? "GREEN QUARTER" : "MONTHS SURVIVED");
    if (liquidation) triggerLiquidationShock(liquidation);
    else feel(idle ? "idle" : delta >= 0 ? "green" : "red", delta + convCash + planCash);
    if (milestone) say(milestone.line, "yellow");
    if (critical) { setShake(true); window.setTimeout(() => setShake(false), 520); }


    const finalNet = netOf(nextRun);
    if (hunger >= 100) return finish("STARVED");
    if (stress >= 100) return finish("BROKEN");
    if (finalNet <= 0) return finish(positions.length === 0 && lines.some((l) => l.includes("liquidated")) ? "CASINO" : "BROKE");
    if (next >= CHAPTERS) {
      // beating him means out-trading his book and taking his fights
      if (finalNet > bossNetOf(nextRun, next) && nextRun.bossWins >= 3 && criticals === 0) return finish("THRONE");
      return finish(finalNet > startCashFor(cfg) * 60 && crises >= 6 && criticals === 0 && run.trades >= 12 ? "LEGEND" : "SURVIVOR");
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
    if (!cards.length) { setDialog(null); setQueue([]); setPhase("brief"); return; }

    setPhase("act");

    setDialog(cards[0]!);
    setQueue(cards.slice(1));
  };

  /**
   * One blind pick for every survived quarter. Pure bonus on top of the run —
   * the same seed deals every tournament player the same three cards.
   */
  const takeLoot = (card: LootCard) => {
    const id = `loot-${run.chapter}`;
    const bonus = Math.max(500, Math.round(net * 0.02));
    rec({ t: "loot", c: run.chapter, kind: card.kind, bonus: card.kind === "cash" || card.kind === "tcfb" ? bonus : 0 });
    setRun((r) => {
      const seen = Array.from(new Set([...r.seen, id]));
      if (card.kind === "cash") return book({ ...r, seen, cash: r.cash + bonus }, `Loot | ${card.name}`, bonus);
      if (card.kind === "tcfb") return book({ ...r, seen, cash: r.cash + bonus, statuses: Array.from(new Set([...r.statuses, "$TCFB HOLDER"])) }, `Loot | ${card.name}`, bonus);
      if (card.kind === "calm") return { ...r, seen, stress: clamp(r.stress - 25) };
      if (card.kind === "fed") return { ...r, seen, hunger: clamp(r.hunger - 25) };
      if (card.kind === "move") return { ...r, seen, perks: Array.from(new Set([...r.perks, "+1 MOVE"])) };
      return { ...r, seen };
    });
    if (card.kind === "xp") grantXp(400, "ALPHA LEAK");
    if (card.kind === "tcfb") grantXp(250, "$TCFB");
    if (card.kind === "move") setAp((a) => Math.min(AP_CAP, a + 1));
    playSfx("win");
    say(`${card.name} | ${card.blurb}`, "yellow");
    setDialog(null);
    openChapterCards(run.chapter);
  };

  /**
   * One artefact, kept for the rest of the run. Two matching artefacts unlock a
   * named synergy, which is where the collection starts to feel like a build.
   */
  const takeRelic = (card: Relic) => {
    const owned = [...(run.relics ?? []), card.id];
    rec({ t: "relic", c: run.chapter, id: card.id });
    const before = power.synergies.map((s) => s.name);
    const after = relicPower(owned).synergies.filter((s) => !before.includes(s.name));
    setRun((r) => ({ ...r, relics: owned, seen: Array.from(new Set([...r.seen, `relic-${r.chapter}`])) }));
    playSfx("level");
    grantXp(300, card.name);
    if (after[0]) {
      triggerGodCandle(`SYNERGY | ${after[0].name}`, 8);
      say(`SYNERGY UNLOCKED | ${after[0].name} — ${after[0].line}`, "yellow");
    } else say(`${card.name} | ${card.effect}`, "yellow");
    setDialog(null);
    openChapterCards(run.chapter);
  };

  const continueChapter = () => {
    setResolution(null);
    setSkill(null);
    if (guide === 2) setGuide(null);
    if (relicChapter(run.chapter) && !run.seen.includes(`relic-${run.chapter}`)) {
      const cards = relicOffer(run.relics ?? [], (salt) => det(run.seed, salt), run.chapter);
      if (cards.length) { setDialog({ k: "relic", cards }); return; }
    }
    if (run.chapter >= 1 && !run.seen.includes(`loot-${run.chapter}`)) {
      setDialog({ k: "loot", cards: lootDraw((salt) => det(run.seed, salt), run.chapter) });
      return;
    }
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
    if (waitingForFirstTrade) return;
    let raf = 0;
    let last = performance.now();
    let shown = tickRef.current;
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      tickRef.current = Math.min(1, tickRef.current + dt / (fast ? 1_600 : LIVE_MS));
      if (tickRef.current >= 1) { tickRef.current = 0; endChapter(); return; }
      const liveX = Math.max(2, Math.min(98, tickRef.current * 100));
      const liveMark = livePrice(focusSymbol, run, tickRef.current, sweeping);
      const liveY = 92 - ((liveMark - chartMin) / chartSpan) * 76;
      if (chartRevealRef.current) chartRevealRef.current.setAttribute("width", String(liveX));
      if (chartMarkerRef.current) {
        chartMarkerRef.current.style.left = `${liveX}%`;
        chartMarkerRef.current.style.top = `${liveY}%`;
      }
      if (liveClockRef.current) liveClockRef.current.style.width = `${tickRef.current * 100}%`;
      // Financial values update at a calm rate; the visual tape above moves at
      // native requestAnimationFrame speed without rerendering the whole game.
      if (tickRef.current - shown >= 0.02) { shown = tickRef.current; setTick(tickRef.current); }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, phase, dialog, fast, run, waitingForFirstTrade, focusSymbol, chartMin, chartSpan, sweeping]);



  const begin = (config: Config, reuse?: number) => {
    localStorage.removeItem(SAVE_KEY);
    setResume(false);
    setRun(freshRun(config, reuse));
    setActiveSymbol("BTC");
    openingPlayed.current = false;
    setPhase("act"); setAp(AP_BASE); setResolution(null); setDialog(null); setFlash(null); setQueue([]);
    setScreen("run");
    // Every fresh run explains itself. Experienced players can skip explicitly;
    // a stale browser flag must never hide the only onboarding.
    setGuide(0);
    setSkill(null);
    lastAct.current = 1;
    setActSplash(false);
    trackGameBeat(reuse === undefined ? "run_started" : "rematch_started", { tournament: config.tournament });
  };


  const restore = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "{}");
      if (saved.run) {
        const restored = { ...freshRun(saved.run.config ?? defaultConfig), ...saved.run } as Run;
        // Old or damaged saves: drop positions missing numbers so nothing shows $NaN.
        const ok = (p: Partial<Pos>) => [p.margin, p.entry, p.qty, p.lev].every((v) => typeof v === "number" && Number.isFinite(v)) && (p.dir === 1 || p.dir === -1);
        restored.positions = (Array.isArray(restored.positions) ? restored.positions : []).filter(ok).map((p) => ({ ...p, where: p.where ?? "exchange" } as Pos));
        if (!Array.isArray(restored.relics)) restored.relics = [];
        if (!Array.isArray(restored.seen)) restored.seen = [];
        if (!Array.isArray(restored.audit)) restored.audit = [];
        setRun(restored);
        setActiveSymbol([...restored.positions].sort((a, b) => b.margin - a.margin)[0]?.symbol ?? "BTC");
        setPhase(saved.phase ?? "brief");
        setAp(saved.ap ?? AP_BASE);
      }
    } catch { setRun(freshRun(defaultConfig)); }
    setResolution(null); setDialog(null); setGuide(null); setScreen("run");
  };

  if (screen === "start") return <StartScreen resume={resume} mark={topMark} onTournament={() => begin(tournamentConfig())} onFreeRun={() => { setTournament(false); setScreen("setup"); }} onResume={restore} onBoard={() => setScreen("board")} />;
  if (screen === "setup") return <SetupScreen tournament={tournament} mark={topMark} onBack={() => setScreen("start")} onStart={begin} />;
  if (screen === "board") return <BoardScreen onBack={() => setScreen("start")} />;
  if (screen === "end") return (
    <EndScreen
      run={run} net={net} score={score} ending={ending} mark={topMark}
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
  const standing = standingFor(net, bossNet, run.chapter);
  const check = skillCheckFor(run.chapter);
  const lastBook = run.ledger[0];
  // Plain-words preview of the yellow button: what leaves, what arrives, what then.
  const buyBudget = Math.floor(run.cash * 0.25);
  // Guided first buy always spends exactly this fixed amount (never a quarter of a richer wallet).
  const guideBuy = Math.min(2500, Math.floor(run.cash));
  const sellValue = focusPosition ? Math.round(valueOf(focusPosition, focusPrice)) : 0;
  const preview: { gives: string; gets: string; then: string } =
    guide === 0 ? { gives: `${formatMoney(guideBuy)} of your cash`, gets: `Bitcoin worth ${formatMoney(guideBuy)} at ${formatMoney(focusPrice)}`, then: "Price up, you gain. Price down, you lose. That is the whole trade." }
    : chapterPlay.mode === "HUNT" && presale ? { gives: `${formatMoney(presale.min)} or more as a ticket`, gets: `${presale.name} tokens before everyone else`, then: `${Math.round(presale.rug * 100)}% chance it is a rug | up to ${presale.upside[1]}x if it is not.` }
    : chapterPlay.mode === "DEFEND" ? { gives: "One of your moves", gets: "Your coins in safer storage", then: "An exchange failure cannot reach money you already moved." }
    : chapterPlay.mode === "BOSS DUEL" ? { gives: `${formatMoney(duelStake)} as a stake`, gets: "Up to double it, plus a perk", then: "Lose the skill moment and the stake is gone." }
    : focusPosition ? { gives: `Your ${focusSymbol}, bought at ${formatMoney(focusPosition.entry)}`, gets: `${formatMoney(sellValue)} back as cash`, then: `You lock in ${focusPnl >= 0 ? "a profit of" : "a loss of"} ${formatMoney(Math.abs(focusPnl))}. Cash cannot fall.` }
    : chapterPlay.mode === "PANIC" ? { gives: "Nothing", gets: "You stay in cash", then: "The crash cannot touch you, but you earn nothing either." }
    : { gives: `${formatMoney(buyBudget)} of your cash`, gets: `${focusSymbol} worth ${formatMoney(buyBudget)} at ${formatMoney(focusPrice)}`, then: "Price up, you gain. Price down, you lose." };

  // ---- the two visible moves of this quarter: one takes risk, one protects ----
  const theme = MODE_THEME[chapterPlay.mode];
  const moves = MODE_MOVES[chapterPlay.mode];
  const duelOpen = !!bossFightFor(run.chapter) && !run.fought.includes(run.chapter);
  /** One risk moment per quarter, in every phase. The flag lives in the run, so a reload cannot farm it. */
  const riskPlayed = !!run.riskPlay && run.riskPlay.chapter === run.chapter;
  const riskLocked = riskPlayed || (chapterPlay.mode === "BOSS DUEL" ? !duelOpen : ap <= 0);
  // survival only takes screen space when the body is actually failing
  const surviveUrgent = run.hunger >= 70 || run.stress >= 70;
  /** Every phase: the risky move is played, not clicked. Stake is visible up front. */
  const phaseRisk = PHASE_RISK[chapterPlay.mode];
  // the hunt alternates between the two scam-spotting games, and tightens with the years
  const riskKind: MiniKind = chapterPlay.mode === "HUNT"
    ? (run.chapter % 2 === 0 ? "airdrop" : "rugcheck")
    : phaseRisk.kind;
  const riskHard = cfg.difficulty !== "EASY" || run.hunger >= 80 || run.stress >= 80
    || (chapterPlay.mode === "HUNT" && run.chapter >= 8);
  const phaseStake = Math.min(Math.max(400, Math.round(net * 0.03)), Math.max(0, Math.round(run.cash * 0.25)));
  const huntTicket = presale ? Math.min(Math.max(presale.min, Math.round(net * 0.05)), Math.max(presale.min, Math.round(run.cash * 0.25))) : 0;
  const stakePilot = guide === null && phaseStake > 0 && !riskPlayed
    && (chapterPlay.mode === "ACCUMULATE" || chapterPlay.mode === "MOMENTUM" || chapterPlay.mode === "PANIC" || chapterPlay.mode === "DEFEND");
  const huntPilot = chapterPlay.mode === "HUNT" && !!presale && guide === null && !riskPlayed && run.cash >= huntTicket;
  const duelPilot = chapterPlay.mode === "BOSS DUEL" && duelOpen && guide === null && !riskPlayed;
  const skillPilot = stakePilot || huntPilot || duelPilot;
  const playedGrade = run.riskPlay && run.riskPlay.chapter === run.chapter ? Math.round(run.riskPlay.quality * 100) : 0;
  // the stake, the game and what a fumble costs stay readable on the card itself
  const riskLabel = riskPlayed ? `PLAYED | GRADE ${playedGrade}%`
    : huntPilot && presale ? `APE INTO ${presale.name} | ${formatMoney(huntTicket)}`
      : duelPilot ? `FIGHT HIM | STAKE ${formatMoney(duelStake)}`
        : stakePilot ? `${moves.risk.label} | ${formatMoney(phaseStake)}`
          : moves.risk.label;
  const riskTerms = skillPilot;
  const riskWhy = riskPlayed
    ? "Your one risk moment this quarter is used. End the quarter to see what the market paid."
    : huntPilot && presale
      ? `${phaseRisk.head} | ticket ${formatMoney(huntTicket)} | rug risk ${Math.round(presale.rug * 100)}% | upside ${presale.upside[0]}x–${presale.upside[1]}x`
      : duelPilot
        ? `${phaseRisk.head} | stake ${formatMoney(duelStake)} | win up to double it plus a perk | lose it all if you fail`
        : stakePilot
          ? `${phaseRisk.head}: a 4 second skill moment on ${formatMoney(phaseStake)} | the quarter's move decides the size | a fumble always costs ${formatMoney(Math.round(phaseStake * 0.5))}${chapterPlay.mode === "MOMENTUM" ? " | your click time on the live tape adds up to ±18%" : ""}`
          : moves.risk.why;

  const riskMove = () => {
    playSfx("click");
    if (riskPlayed) return say("You already took your shot this quarter. End the quarter.", "pink");
    if (stakePilot) {
      // MOMENTUM pilot: the moment of the click on the live tape is part of the play
      const timing = chapterPlay.mode === "MOMENTUM" && phase === "act"
        ? timingEdge(focusSymbol, run, tickRef.current, sweeping)
        : null;
      return setDialog({ k: "mini", kind: riskKind, pending: { t: "phaseRisk", stake: phaseStake, mode: chapterPlay.mode, timing } });
    }
    if (huntPilot && presale) return setDialog({ k: "mini", kind: riskKind, pending: { t: "presale", card: presale, size: huntTicket } });
    if (duelPilot) return setDialog({ k: "mini", kind: riskKind, pending: { t: "fight", chapter: run.chapter, wager: duelStake } });
    switch (chapterPlay.mode) {
      case "PANIC": setFast(true); say("You are holding through the crash. Nerves of steel or a very expensive lesson.", "pink"); break;
      case "HUNT": setDialog(presale ? { k: "presale", card: presale } : { k: "market" }); break;
      case "DEFEND": say("Funds stay where they trade. Fast to move, first to burn.", "pink"); bank(); break;
      case "BOSS DUEL": setDialog({ k: "fight", chapter: run.chapter }); break;
      case "MOMENTUM":
        if (focusPosition) setDialog({ k: "market" });
        else openSpot(focusSymbol, 0.25);
        break;
      default: openSpot(focusSymbol, 0.25);
    }
  };
  const safeMove = () => {
    playSfx("click");
    switch (chapterPlay.mode) {
      case "MOMENTUM": if (focusPosition) quickClose(focusPosition.id); else bank(); break;
      case "PANIC": if (focusPosition) askClose(focusPosition.id, 1); else bank(); break;
      case "DEFEND": setDialog({ k: "custody" }); break;
      default: bank();
    }
  };


  return (
    <main className={`cy-shell cy-act-${act.n}${shake ? " is-shaking" : ""}${guide !== null ? " has-guide" : ""}${intel ? " has-intel" : ""}${liqAlert ? " is-liqalert" : ""}`}>
      <img className="cy-world" src={act.n === 1 ? actMania : act.n === 2 ? actCollapse : actEndgame} alt="" loading="lazy" width={1600} height={900} aria-hidden />
      {actSplash && <section className={`cy-act-splash cy-act-splash-${act.n}`} onClick={() => setActSplash(false)} aria-label={`${act.name} begins`}>
        <img src={act.n === 1 ? actMania : act.n === 2 ? actCollapse : actEndgame} alt="" />
        <div><p>{chapterLabel(run.chapter)}</p><h2>{act.name}</h2><span>{act.line}</span></div>
      </section>}
      {fxFlash && <div className={`cy-fx cy-fx-${fxFlash}`} aria-hidden />}
      {arcadeFx && <ArcadeMoment fx={arcadeFx} boss={enragedBoss.url} />}
      {interrupt && (
        <section className={`pit-interrupt is-${interrupt.tone}`} role="alert" aria-label="Boss interruption">
          <img src={interrupt.img} alt="" aria-hidden />
          <div>
            <small>[ SYSTEM OVERRIDE // BOSS SIGNATURE DETECTED ]</small>
            <strong>{interrupt.stamp}</strong>
            <p>{interrupt.line}</p>
          </div>
        </section>
      )}
      {fillFx && <div className={`cy-fill tone-${fillFx.tone}`} role="status"><strong>{fillFx.head}</strong><small>{fillFx.sub}</small></div>}


      {/* ZONE 1 — the duel cockpit: you, the Boss, one line of numbers. */}
      <header className={`cy-hud is-${arenaState}`}>
        <figure className="cy-hud-side is-you">
          <img src={AVATARS.find((a) => a.id === cfg.avatar)?.url ?? avApe.url} alt="Your trader" />
          <figcaption>
            <strong className={netPulse ? `pulse-${netPulse}` : ""}><Count value={net} /></strong>
            <span>{formatMoney(run.cash)} cash{openPnl !== 0 ? <> · <b className={openPnl > 0 ? "positive" : "negative"}>{openPnl > 0 ? "+" : "−"}{formatMoney(Math.abs(openPnl))}</b></> : null}</span>
            <i className="cy-hud-vitals" aria-label={`Stress ${run.stress}%, hunger ${run.hunger}%`}>
              <b className={`is-stress${run.stress >= 70 ? " is-critical" : ""}`}><u style={{ width: `${run.stress}%` }} /></b>
              <b className={`is-hunger${run.hunger >= 70 ? " is-critical" : ""}`}><u style={{ width: `${run.hunger}%` }} /></b>
            </i>
          </figcaption>
        </figure>

        <div className="cy-hud-mid">
          <span className="cy-hud-q">Q{run.chapter + 1}/{CHAPTERS}</span>
          <span className="cy-hud-vs">VS</span>
          <div className="cy-hud-xp" aria-label={`Level ${xpBar.level}, ${run.xp} XP`}>
            <b>L{xpBar.level}</b><i><u style={{ width: `${xpBar.pct}%` }} /></i>
          </div>
          {topMark && (
            <button type="button" className={`cy-hud-rank ${net >= topMark.net ? "is-ahead" : "is-behind"}`} onClick={() => setDialog({ k: "score" })}>
              {`#1 ${net >= topMark.net ? "+" : "−"}${shortMoney(Math.abs(net - topMark.net))}`}
            </button>
          )}
        </div>

        <figure className={`cy-hud-side is-boss is-${bossPhase.toLowerCase()}`}>
          <img src={mood} alt="The Crypto Final Boss" />
          <figcaption>
            <strong>{formatMoney(Math.max(0, bossNet))}</strong>
            <span>{bossPhase}{run.bossWins > 0 ? ` · ${run.bossWins}W` : ""}</span>
            <i className="cy-hud-hp"><u style={{ width: `${Math.max(4, Math.min(100, Math.round((Math.max(0, bossNet) / Math.max(1, Math.max(0, bossNet) + Math.max(0, net))) * 100)))}%` }} /></i>
          </figcaption>
        </figure>
      </header>

      {/* One single strip: what to do now, your relics, briefing and sound. */}
      <div className={`cy-strip${guide !== null ? " is-guided" : ""}${objective.urgent ? " is-urgent" : ""}`}>
        <p>{guide === 0 ? `STEP 1/3 · Buy ${formatMoney(guideBuy)} of Bitcoin below` : guide === 1 ? "STEP 2/3 · End the quarter to reveal the market" : guide === 2 ? "STEP 3/3 · Read the result, then continue" : chapterPlay.task}</p>
        {(run.relics ?? []).length > 0 && guide === null && (
          <span className="cy-strip-relics">{(run.relics ?? []).map((id) => <b key={id} title={`${relicOf(id)?.name} — ${relicOf(id)?.effect}`}>{relicOf(id)?.glyph ?? "?"}</b>)}</span>
        )}
        {guide !== null
          ? <button type="button" className="cy-strip-btn" onClick={() => setGuide(null)}>SKIP</button>
          : <button type="button" className="cy-strip-btn" onClick={() => { playSfx("click"); setIntel((v) => !v); }} aria-expanded={intel}>{intel ? "HIDE" : "BRIEF"}</button>}
        <button type="button" className="cy-strip-btn is-icon" aria-label={muted ? "Sound on" : "Sound settings"} onClick={() => setDialog({ k: "sound" })}>{muted ? <VolumeX /> : <Volume2 />}</button>
      </div>
      {intel && guide === null && <p className="cy-strip-brief">{standing.line} — {mission.text} (+{mission.reward} XP){doom !== null ? ` · Something breaks in ${doom} quarter${doom === 1 ? "" : "s"}.` : ""}</p>}


      <div className="cy-body">

        <section className="cy-stage" aria-live="polite">
          {phase === "brief" && (
            <article className="cy-card" key={`brief-${run.chapter}`}>
              <p className="journey-kicker"><History /> {chapterLabel(run.chapter)} | THE SETUP</p>
              <h2>{run.chapter === 0 ? "IT STARTS QUIET" : btcMove >= 0 ? "THE TAPE IS GREEN" : "THE TAPE IS BLEEDING"}</h2>
              <p className="cy-lead">{warning}</p>
              {hintFor(run.chapter) && <p className="cy-hint"><strong>WORD ON THE TIMELINE:</strong> {hintFor(run.chapter)}</p>}
              <div className="cy-facts">
                <span><small>BTC THIS QUARTER</small><strong className={btcMove >= 0 ? "positive" : "negative"}>{btcMove >= 0 ? "+" : ""}{btcMove.toFixed(1)}%</strong></span>
                <span><small>YOUR CASH</small><strong>{formatMoney(run.cash)}</strong></span>
                <span><small>BAGS IN</small><strong>{custodyOf(run.custody).short}</strong></span>
                <span><small>MOVES</small><strong>{ap}</strong></span>
              </div>
              <div className="cy-actions"><Button className={`cy-primary${guide === 1 ? " is-guided" : ""}`} onClick={() => setPhase("act")}>TAKE YOUR TURN <ChevronRight /></Button></div>
            </article>
          )}

          {phase === "act" && (
            <article className={`cy-card cy-arena is-${arenaState} mode-${theme.slug}`} key={`act-${run.chapter}`}>
              {cfg.tournament && <SeasonBanner compact />}
              <div className={`cy-market-visual pulse-${marketPulse}${waitingForFirstTrade ? " is-paused" : ""}`}>
                <div className="cy-chart-title">
                  <span><img src={COIN_LOGO[focusSymbol]} alt="" width={28} height={28} /><b>{focusSymbol}</b><small>{formatMoney(focusPrice)}</small></span>
                  <strong className={focusPnl >= 0 ? "positive" : "negative"}>{focusPosition ? `${focusPnl >= 0 ? "+" : "−"}${formatMoney(Math.abs(focusPnl))}` : `${ap} MOVE${ap === 1 ? "" : "S"} LEFT`}</strong>
                </div>
                {run.positions.length > 0 && (
                  <div className={`cy-chips ${run.positions.length > 4 ? "is-dense" : ""}`} aria-label="Open positions">
                    {run.positions.map((p) => {
                      const price = mark(p.symbol);
                      const pnl = pnlOf(p, price);
                      const liq = liqPct(p, price);
                      return (
                        <span key={p.id} className={`cy-chip-wrap ${pnl >= 0 ? "up" : "down"}`}>
                          <button className={`cy-chip ${pnl >= 0 ? "up" : "down"}`} onClick={() => { setActiveSymbol(p.symbol); setDialog({ k: "position", id: p.id }); }}>
                            <img src={COIN_LOGO[p.symbol]} alt="" width={18} height={18} />
                            <span><strong>{p.symbol}</strong><small className={`cy-chip-lev ${p.kind === "spot" ? "is-spot" : p.dir === 1 ? "is-long" : "is-short"}`}>{p.kind === "spot" ? "SPOT" : `${p.lev}x ${p.dir === 1 ? "LONG" : "SHORT"}`}</small></span>
                            <b>{pnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(pnl))}</b>
                            {p.kind === "perp" && <i className="cy-liq" style={{ width: `${liq}%` }} />}
                          </button>
                          {p.where !== "cold" && (
                            <button className="cy-chip-exit" title="Close this position now" aria-label={`Close ${p.symbol} now`} onClick={() => { playSfx("click"); quickClose(p.id); }}>✕</button>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="cy-chart-wrap">
                  <svg className="cy-chart" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`${focusSymbol} live quarter chart`}>
                    <defs>
                      <linearGradient id="cy-chart-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--journey-cyan)" stopOpacity=".34"/><stop offset="1" stopColor="var(--journey-cyan)" stopOpacity="0"/></linearGradient>
                      <clipPath id="cy-chart-reveal"><rect ref={chartRevealRef} x="0" y="0" width={currentChartX} height="100" /></clipPath>
                    </defs>
                    <polygon points={`0,100 ${chartPath} 100,100`} fill="url(#cy-chart-fill)" />
                    <g className="cy-candles" clipPath="url(#cy-chart-reveal)">
                      {candles.map((c, i) => (
                        <g key={i} className={c.up ? "is-up" : "is-down"}>
                          <line x1={c.x} x2={c.x} y1={c.wickTop} y2={c.wickBottom} vectorEffect="non-scaling-stroke" />
                          <rect x={c.x - 1.3} y={c.top} width="2.6" height={c.height} />
                        </g>
                      ))}
                    </g>

                    <polyline className="cy-chart-ghost" points={chartPath} fill="none" stroke="var(--journey-cyan)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
                    <polyline className="cy-chart-live-line" points={chartPath} fill="none" stroke="var(--journey-cyan)" strokeWidth="2" vectorEffect="non-scaling-stroke" clipPath="url(#cy-chart-reveal)" />
                    {entryChartY !== null && <line className="cy-entry-line" x1="0" x2="100" y1={entryChartY} y2={entryChartY} vectorEffect="non-scaling-stroke" />}
                    <line x1={currentChartX} x2={currentChartX} y1="8" y2="94" stroke="var(--journey-yellow)" strokeWidth=".7" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <i ref={chartMarkerRef} className="cy-now-marker" style={{ left: `${currentChartX}%`, top: `${currentChartY}%` }} aria-hidden />
                </div>
                <div className="cy-chart-foot">
                  <span>{focusPosition ? `ENTRY ${formatMoney(focusPosition.entry)}` : "NO POSITION"}</span>
                  <i className="cy-live-clock" ref={liveClockRef as never} style={{ width: `${Math.round(tick * 100)}%` }} aria-hidden />
                  <span>{waitingForFirstTrade ? "CHOOSE YOUR MOVE" : `${Math.round(tick * 100)}% OF QUARTER`}</span>
                </div>
              </div>
              {attack
                ? <p className="cy-ticker is-attack"><strong>{attack.name}:</strong> {attack.line}</p>
                : (run.stance !== "balanced" || run.convictionOn || run.heat > 0)
                  ? <p className="cy-ticker">{stanceOf(run.stance).name} PLAN{run.convictionOn ? " | CONVICTION 1.5x" : ""}{run.heat > 0 ? ` | HEAT x${run.heat} (+${Math.round((heatBonus(run.heat) - 1) * 100)}%)` : ""}</p>
                  : null}


              {/* Action bar: on phones this whole group is pinned above the browser bar. */}
              <div className="cy-actionbar">
              {guide !== null ? (

                <div className="cy-moves is-guided-row">
                  {guide === 0
                    ? <button type="button" className="cy-move is-risk is-guided" onClick={() => openSpot("BTC", run.cash > 0 ? guideBuy / run.cash : 0.25)}>
                        <span>STEP 1</span><strong>BUY {formatMoney(guideBuy)} BTC</strong><small>Your first position</small>
                      </button>
                    : <button type="button" className="cy-move is-risk is-guided" onClick={() => { setGuide(2); endChapter(); }}>
                        <span>STEP 2</span><strong>END QUARTER</strong><small>Reveal what the market did</small>
                      </button>}
                </div>
              ) : (
                <div className="cy-moves" aria-label="Your two moves this quarter">
                  <button type="button" className={`cy-move is-risk${riskTerms ? " has-terms" : ""}`} disabled={riskLocked} onClick={riskMove}>
                    <span><Flame />TAKE THE RISK</span>
                    <strong>{riskLabel}</strong>
                    <small>{moves.risk.sub}</small>
                    <em>{riskWhy}</em>

                  </button>
                  <button type="button" className="cy-move is-safe" disabled={ap <= 0} onClick={safeMove}>
                    <span><Shield />PLAY IT SAFE</span>
                    <strong>{moves.safe.label}</strong>
                    <small>{moves.safe.sub}</small>
                    <em>{moves.safe.why}</em>
                  </button>
                </div>
              )}
              {/* Spot and perps are the heart of the game, so they sit on the main
                  screen instead of hiding behind MORE. */}
              {guide === null && (
                <div className="cy-trade-row" aria-label="Open the trading desk">
                  <button type="button" className="cy-quick-btn is-spot" onClick={() => { playSfx("click"); setActiveSymbol(focusSymbol); setDialog({ k: "market", tab: "spot" }); }}>
                    <WalletCards />BUY SPOT
                  </button>
                  <button type="button" className="cy-quick-btn is-perp" onClick={() => { playSfx("click"); setActiveSymbol(focusSymbol); setDialog({ k: "market", tab: "perp" }); }}>
                    <Zap />PERPS | UP TO 50x
                  </button>
                </div>
              )}
              {guide === null && (!skillPilot || surviveUrgent) && (
                <div className="cy-quick-row">
                  {!skillPilot && (
                    <button type="button" className={`cy-quick-btn is-skill${skill && skill.chapter === run.chapter ? " is-done" : ""}`}
                      disabled={!!(skill && skill.chapter === run.chapter)}
                      onClick={() => { playSfx("click"); setDialog({ k: "mini", kind: check.kind, pending: { t: "skill" } }); }}>
                      <Target />{skill && skill.chapter === run.chapter ? "SKILL DONE" : `SKILL TEST | WIN ${formatMoney(Math.max(300, Math.round(net * 0.02)))}`}
                    </button>
                  )}
                  {surviveUrgent && (
                    <button type="button" className="cy-quick-btn is-urgent" onClick={() => { playSfx("click"); setDialog({ k: "survive" }); }}>
                      <HeartPulse />SURVIVE | {run.hunger >= 70 ? `HUNGER ${run.hunger}%` : `STRESS ${run.stress}%`}
                    </button>
                  )}
                </div>
              )}
              <div className="cy-tape-row">
                <button type="button" className="cy-tape-btn" disabled={guide !== null} onClick={() => { setFast(true); playSfx("click"); }}><Flame />{fast ? "MARKET RUNNING" : chapterPlay.tempo === "danger" ? "BRACE FOR IT" : "RUN THE TAPE"}</button>
                <button type="button" className="cy-tape-btn cy-tape-more" disabled={guide === 0} onClick={() => { playSfx("click"); setDialog({ k: "more" }); }}><Ellipsis />MORE</button>
                <button type="button" className={`cy-tape-btn cy-tape-end${guide === 1 ? " is-next" : ""}`} disabled={guide === 0} onClick={() => { if (guide === 1) setGuide(2); endChapter(); }}><ChevronRight />END QUARTER</button>
              </div>
              </div>



              {skill && skill.chapter === run.chapter && <p className={`cy-lastmove ${skill.delta >= 0 ? "positive" : "negative"}`}>SKILL | {skill.label} | {skill.delta >= 0 ? "+" : "−"}{formatMoney(Math.abs(skill.delta))}</p>}



            </article>
          )}

          {phase === "resolve" && resolution && (
            <article className={`cy-card tone-${resolution.tone}`} key={`res-${run.chapter}`}>
              <p className="journey-kicker">{chapterLabel(run.chapter)} | THE MARKET ANSWERS</p>
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
          <button className="cy-rules" onClick={() => setGuide(0)}>SHOW ME HOW TO PLAY</button>
          <button className="cy-rules" onClick={() => setDialog({ k: "rules" })}>HOW IT WORKS</button>
        </aside>
      </div>



      {flash && <div className={`cy-flash tone-${flash.tone}`} role="status">{flash.text}</div>}

      <div className="cy-pops" aria-live="polite">
        {pops.map((p) => <span key={p.id} className={`cy-pop tone-${p.tone}`}>{p.text}</span>)}
      </div>
      {levelUp !== null && <div className="cy-levelup" role="status">LEVEL {levelUp}<small>The Boss raised an eyebrow.</small></div>}

      {dialog && (
        <Sheet onClose={dialog.k === "decision" || dialog.k === "situation" || dialog.k === "mini" || dialog.k === "fight" || dialog.k === "offer" || dialog.k === "loot" || dialog.k === "relic" ? undefined : () => (dialog.k === "crash" || dialog.k === "failure" || dialog.k === "launchResult" ? nextInQueue() : setDialog(null))}>
          {dialog.k === "rules" && <Rules onClose={() => { setDialog(null); playOpening(0); }} />}
          {dialog.k === "how" && <HowToPlay onClose={() => setDialog(null)} />}
          {dialog.k === "sound" && <SoundSheet
            muted={muted} vols={vols}
            onMute={(v) => { setMuted(v); setMutedState(v); }}
            onMusic={(v) => { setMusicVol(v); setVols(getVolumes()); }}
            onSfx={(v) => { setSfxVol(v); setVols(getVolumes()); playSfx("click"); }}
            onClose={() => setDialog(null)} />}
          {dialog.k === "score" && <ScoreSheet net={net} chapters={run.chapter} diff={cfg.difficulty} crises={run.crises} streak={run.streak} score={score} onClose={() => setDialog(null)} />}
          {dialog.k === "market" && <TerminalSheet run={run} start={activeSymbol} startTab={dialog.tab ?? "spot"}
            onSpot={(s, f) => openSpot(s, f)}
            onPerp={(s, d, l, f) => openPerp(s, d, l, f)}
            onPosition={(id) => setDialog({ k: "position", id })} />}
          {dialog.k === "loot" && <LootSheet cards={dialog.cards} onPick={(card) => takeLoot(card)} />}
          {dialog.k === "relic" && <RelicSheet cards={dialog.cards} owned={run.relics ?? []} onPick={takeRelic} />}

          {dialog.k === "more" && <MoreSheet
            ap={ap}
            stance={run.stance}
            heat={run.heat}
            conviction={run.conviction}
            convictionOn={run.convictionOn}
            verified={verified}
            verifyCost={Math.max(150, Math.round(net * 0.01))}
            skillDone={!!(skill && skill.chapter === run.chapter)}
            skillHidden={skillPilot}
            skillHead={check.head}
            skillPrize={Math.max(300, Math.round(net * 0.02))}
            onStance={(id) => { playSfx("click"); rec({ t: "stance", c: run.chapter, stance: id }); setRun((r) => ({ ...r, stance: id })); say(`${stanceOf(id).name} | ${stanceOf(id).line}`, id === "degen" ? "pink" : "cyan"); }}
            onConviction={toggleConviction}
            onTerminal={() => setDialog({ k: "market" })}
            onSurvive={() => setDialog({ k: "survive" })}
            onSkill={() => { playSfx("click"); setDialog({ k: "mini", kind: check.kind, pending: { t: "skill" } }); }}
            onVerify={() => {
              if (verified) return;
              const fee = Math.max(150, Math.round(net * 0.01));
              if (run.cash < fee) return say("No cash for research. Trade on vibes then.", "pink");
              setRun((r) => book({ ...r, cash: r.cash - fee }, "Signal research", -fee));
              rec({ t: "signal", c: run.chapter, fee });
              setVerified(true);
              playSfx("click");
            }}
            onStorage={() => setDialog({ k: "custody" })}
            onHistory={() => setDialog({ k: "ledger" })}
            onGuide={() => { setGuide(0); setDialog(null); }}
            onEnd={() => setDialog({ k: "cashout" })}
          />}

          {dialog.k === "trade" && <TradeSheet run={run} symbol={dialog.symbol} onSpot={(f) => openSpot(dialog.symbol, f)} onPerp={(d, l, f) => openPerp(dialog.symbol, d, l, f)} />}
          {dialog.k === "position" && <PositionSheet run={run} id={dialog.id} onClose={(f) => askClose(dialog.id, f)} />}
          {dialog.k === "presale" && <PresaleSheet card={dialog.card} cash={run.cash} onTake={(size) => setDialog({ k: "mini", kind: run.chapter % 2 === 0 ? "rugcheck" : "gas", pending: { t: "presale", card: dialog.card, size } })} onPass={() => { setDialog(null); say(`${dialog.card.name} closed without you. Discipline is a position.`, "cyan"); }} />}
          {dialog.k === "launchResult" && <LaunchResultSheet res={dialog.res} onClose={nextInQueue} />}
          {dialog.k === "survive" && <SurviveSheet run={run} difficulty={cfg.difficulty} caps={diff.caps} onEat={() => recover("eat")} onCalm={() => recover("calm")} />}
          {dialog.k === "cashout" && <CashOutSheet run={run} net={net} score={score} onConfirm={cashOut} onClose={() => setDialog(null)} />}
          {dialog.k === "crash" && <CrashSheet chapter={dialog.chapter} onPanic={() => setDialog({ k: "mini", kind: "panic", pending: { t: "crash", chapter: dialog.chapter } })} onClose={nextInQueue} />}
          {dialog.k === "failure" && <FailureSheet chapter={dialog.chapter} run={run} onClose={nextInQueue} />}
          {dialog.k === "custody" && <CustodySheet run={run} onPick={setCustody} />}
          {dialog.k === "life" && <LifeSheet run={run} onPick={setLife} />}
          {dialog.k === "ledger" && <LedgerSheet run={run} onClose={() => setDialog(null)} />}
          {dialog.k === "mini" && <Minigame kind={dialog.kind} roll={det(run.seed, `mini-${run.chapter}-${dialog.kind}`)} hard={riskHard} onResult={(res) => finishMini(dialog.pending, res)} />}
          {dialog.k === "decision" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o)} />}
          {dialog.k === "situation" && <DecisionSheet card={dialog.card} onPick={(o) => resolveDecision(o, false)} />}
          {dialog.k === "fight" && <FightSheet chapter={dialog.chapter} cash={run.cash}
            onFight={(wager, kind) => setDialog({ k: "mini", kind, pending: { t: "fight", chapter: dialog.chapter, wager } })}
            onDuck={() => { setRun((r) => ({ ...r, stress: clamp(r.stress + 10), conviction: 0, fought: r.fought.includes(dialog.chapter) ? r.fought : [...r.fought, dialog.chapter] })); say("You walked past his table. He remembers that.", "pink"); nextInQueue(); }} />}
          {dialog.k === "offer" && <OfferSheet attack={dialog.attack} net={net}
            onTake={() => takeOffer(Math.max(2000, Math.round(net * 0.25)))}
            onRefuse={() => { nextInQueue(); setRun((r) => ({ ...r, conviction: clamp(r.conviction + 15) })); say("You told him no. Conviction up.", "yellow"); }} />}

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

function Count({ value, sign }: { value: number; sign?: boolean }) {
  const [shown, setShown] = useState(value);
  // Every material jump rolls the digits AND flashes the number green or red,
  // so money moving is something you see, not something you have to notice.
  const [flash, setFlash] = useState<"" | "up" | "down">("");
  const shownRef = useRef(value);
  useEffect(() => { shownRef.current = shown; }, [shown]);
  useEffect(() => {
    const from = shownRef.current;
    // Small live wobbles snap instead of animating, otherwise the number
    // restarts its count-up every few frames and the card looks like it flickers.
    if (Math.abs(value - from) < Math.max(2, Math.abs(value) * 0.01)) { setShown(value); return; }
    setFlash(value > from ? "up" : "down");
    const clear = window.setTimeout(() => setFlash(""), 760);
    const start = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 520);
      setShown(from + (value - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); window.clearTimeout(clear); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const rounded = Math.round(shown);
  return (
    <span className={`cy-count${flash ? ` is-${flash}` : ""}`}>
      {sign ? `${rounded >= 0 ? "+" : "−"}${formatMoney(Math.abs(rounded))}` : formatMoney(rounded)}
    </span>
  );
}

function ArcadeMoment({ fx, boss }: {
  fx: { kind: "god"; label: string; multiplier: number; amount?: number } | { kind: "liq"; symbol: CoinSymbol; leverage: number; amount: number };
  boss: string;
}) {
  if (fx.kind === "god") {
    // The headline scales with what was actually hit, and the number is the real multiple.
    const m = fx.multiplier;
    const tier = m >= 10 ? "god" : m >= 5 ? "moon" : "clean";
    const head = tier === "god" ? "GOD CANDLE" : tier === "moon" ? "MOONSHOT" : "CLEAN HIT";
    const kicker = tier === "god" ? "THE BOSS FELT THAT" : tier === "moon" ? "PERFECT EXECUTION" : "GREEN IS GREEN";
    return (
      <section className={`cy-arcade-fx is-god tier-${tier}`} role="status" aria-label={`${head} ${m.toFixed(1)} times`}>
        <div className="cy-god-lasers" aria-hidden><i /><i /><i /><i /></div>
        <div className="cy-candle-rain" aria-hidden>{Array.from({ length: tier === "god" ? 18 : tier === "moon" ? 12 : 7 }, (_, index) => <i key={index} />)}</div>
        <div className="cy-arcade-copy">
          <span>{kicker}</span>
          <strong>{m >= 10 ? m.toFixed(1) : m.toFixed(2)}×</strong>
          <h2>{head}</h2>
          <p>{fx.label}{fx.amount !== undefined ? ` | +${formatMoney(fx.amount)}` : ""}</p>
        </div>
      </section>
    );
  }
  return (
    <section className="cy-arcade-fx is-liq" role="alert" aria-label="Liquidation shock">
      <div className="cy-siren" aria-hidden />
      <div className="cy-cracks" aria-hidden>{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>
      <img className="cy-liq-boss" src={boss} alt="The Boss laughs at the liquidation" />
      <div className="cy-arcade-copy">
        <span>MARGIN ERASED</span>
        <strong>−{formatMoney(fx.amount)}</strong>
        <h2>LIQUIDATED</h2>
        <p>{fx.symbol} | {fx.leverage}× LEVERAGE</p>
        <blockquote>“That was not leverage. That was a donation.”</blockquote>
      </div>
    </section>
  );
}


function Sheet({ children, onClose }: { children: React.ReactNode; onClose?: (() => void) | undefined }) {
  // Escape and a tap on the dark backdrop both get you out — nobody should feel trapped.
  useEffect(() => {
    if (!onClose) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div className="cy-scrim" role="dialog" aria-modal="true" onClick={onClose ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}>
      <div className="cy-sheet">
        {onClose && <button className="cy-close" aria-label="Close" onClick={onClose}><X /></button>}
        {children}
      </div>
    </div>
  );
}


function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <>
      <p className="journey-kicker"><Crown /> FIVE LINES, THE WHOLE GAME</p>
      <h2>HOW TO PLAY</h2>
      <ol className="cy-steps">
        {HOW_TO_PLAY.map((row, i) => <li key={row.head}><b>{i + 1}</b><span><strong>{row.head}</strong> — {row.body}</span></li>)}
      </ol>
      <Button className="cy-primary" onClick={onClose}>BACK TO THE MARKET</Button>
    </>
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
        <li>Formula | (net worth × survival × difficulty + crises) × streak</li>
        <li>Net worth | {formatMoney(net)}</li>
        <li>Chapters survived | {chapters}/{CHAPTERS} = x{(Math.max(0.1, Math.min(1, chapters / CHAPTERS))).toFixed(2)}</li>
        <li>Difficulty {d.name} | x{d.cost.toFixed(2)}</li>
        <li>Crises survived | {crises} = +{formatMoney(crises * 500)}</li>
        <li>Streak | x{(1 + Math.min(0.5, streak * 0.05)).toFixed(2)}</li>
      </ul>
      <p className="cy-delta positive">{score.toLocaleString("en-US")}</p>
      <Button className="cy-primary" onClick={onClose}>GOT IT</Button>
    </>
  );
}

/**
 * The trading terminal. Everything a trade needs lives in this one popup:
 * the market strip, spot versus perp, leverage, the liquidation price in
 * plain numbers, and every open position with a one-tap exit.
 */
function TerminalSheet({ run, start, startTab = "spot", onSpot, onPerp, onPosition }: {
  run: Run; start: CoinSymbol; startTab?: Kind;
  onSpot: (s: CoinSymbol, f: number) => void;
  onPerp: (s: CoinSymbol, d: 1 | -1, l: number, f: number) => void;
  onPosition: (id: number) => void;
}) {
  const live = COINS.filter((c) => priceAt(c.symbol, run.chapter, run.noise) > 0);
  const [symbol, setSymbol] = useState<CoinSymbol>(live.some((c) => c.symbol === start) ? start : (live[0]?.symbol ?? "BTC"));
  const [tab, setTab] = useState<Kind>(startTab);
  const [dir, setDir] = useState<1 | -1>(1);
  const [lev, setLev] = useState<number>(5);
  const price = priceAt(symbol, run.chapter, run.noise);
  const before = priceAt(symbol, Math.max(0, run.chapter - 1), run.noise);
  const move = before && price ? (price / before - 1) * 100 : 0;
  const liqPrice = price * (1 - (dir / lev) * 0.92);
  const fmt = (v: number) => formatMoney(v);

  return (
    <>
      <p className="journey-kicker"><Zap /> TRADING TERMINAL | {chapterLabel(run.chapter)}</p>
      <div className="cy-term-strip" role="tablist" aria-label="Markets">
        {live.map((c) => {
          const p = priceAt(c.symbol, run.chapter, run.noise);
          const b = priceAt(c.symbol, Math.max(0, run.chapter - 1), run.noise);
          const m = b && p ? (p / b - 1) * 100 : 0;
          return (
            <button key={c.symbol} className={symbol === c.symbol ? "is-on" : ""} onClick={() => { setSymbol(c.symbol); playSfx("click"); }}>
              <img src={COIN_LOGO[c.symbol]} alt="" width={20} height={20} />
              <strong>{c.symbol}</strong>
              <em className={m >= 0 ? "positive" : "negative"}>{m >= 0 ? "+" : ""}{m.toFixed(1)}%</em>
            </button>
          );
        })}
      </div>

      <div className="cy-term-head">
        <img src={COIN_LOGO[symbol]} alt="" width={40} height={40} />
        <span><strong>{symbol}</strong><small>{fmt(price)} | this quarter {move >= 0 ? "+" : ""}{move.toFixed(1)}%</small></span>
        <b>CASH {fmt(run.cash)}</b>
      </div>

      <div className="cy-term-tabs">
        <button className={tab === "spot" ? "is-on" : ""} onClick={() => { setTab("spot"); playSfx("click"); }}>SPOT | YOU OWN IT</button>
        <button className={tab === "perp" ? "is-on" : ""} onClick={() => { setTab("perp"); playSfx("click"); }}>PERP | LEVERAGE</button>
      </div>

      {tab === "spot" ? (
        <div className="cy-term-body">
          <p className="cy-term-note">You buy the coin and keep it. No liquidation — the worst case is the price falling.</p>
          <div className="cy-term-sizes">
            <Button variant="secondary" onClick={() => onSpot(symbol, 0.25)}>BUY 25%<small>{fmt(run.cash * 0.25)}</small></Button>
            <Button variant="secondary" onClick={() => onSpot(symbol, 0.5)}>BUY 50%<small>{fmt(run.cash * 0.5)}</small></Button>
            <Button className="cy-primary" onClick={() => onSpot(symbol, 1)}>ALL IN<small>{fmt(run.cash)}</small></Button>
          </div>
        </div>
      ) : (
        <div className="cy-term-body">
          <div className="cy-toggle">
            <button className={dir === 1 ? "is-on is-long" : ""} onClick={() => { setDir(1); playSfx("click"); }}><TrendingUp />LONG | PRICE UP</button>
            <button className={dir === -1 ? "is-on is-short" : ""} onClick={() => { setDir(-1); playSfx("click"); }}><TrendingDown />SHORT | PRICE DOWN</button>
          </div>
          <div className="cy-toggle">{LEVERAGE.map((l) => <button key={l} className={lev === l ? "is-on" : ""} onClick={() => { setLev(l); playSfx("click"); }}>{l}x</button>)}</div>
          <div className="cy-term-risk">
            <span><small>ENTRY PRICE</small><strong>{fmt(price)}</strong></span>
            <span><small>LIQUIDATION AT</small><strong className="negative">{fmt(liqPrice)}</strong></span>
            <span><small>10% MOVE PAYS</small><strong className="positive">{(10 * lev).toFixed(0)}%</strong></span>
          </div>
          <p className="cy-term-note">If {symbol} reaches {fmt(liqPrice)}, the margin is gone. Funding is charged every quarter.</p>
          <div className="cy-term-sizes">
            <Button variant="secondary" onClick={() => onPerp(symbol, dir, lev, 0.25)}>OPEN 25%<small>{fmt(run.cash * 0.25)} margin</small></Button>
            <Button variant="secondary" onClick={() => onPerp(symbol, dir, lev, 0.5)}>OPEN 50%<small>{fmt(run.cash * 0.5)} margin</small></Button>
            <Button className="cy-primary" onClick={() => onPerp(symbol, dir, lev, 1)}>MAX<small>{fmt(run.cash)} margin</small></Button>
          </div>
        </div>
      )}

      {run.positions.length > 0 && (
        <div className="cy-term-open">
          <p className="journey-kicker">YOUR OPEN POSITIONS</p>
          {run.positions.map((p) => {
            const now = priceAt(p.symbol, run.chapter, run.noise);
            const pnl = pnlOf(p, now);
            return (
              <button key={p.id} className="cy-term-pos" onClick={() => onPosition(p.id)}>
                <img src={COIN_LOGO[p.symbol]} alt="" width={22} height={22} />
                <span><strong>{p.symbol}</strong><small>{p.kind === "spot" ? "SPOT" : `${p.dir === 1 ? "LONG" : "SHORT"} ${p.lev}x`} | from {fmt(p.entry)}</small></span>
                <b className={pnl >= 0 ? "positive" : "negative"}>{pnl >= 0 ? "+" : "−"}{fmt(Math.abs(pnl))}</b>
                <em>CLOSE</em>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

/** Quarter loot: three face-down cards, one pick, instant reward. */
function LootSheet({ cards, onPick }: { cards: LootCard[]; onPick: (c: LootCard) => void }) {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <>
      <p className="journey-kicker"><Rocket /> QUARTER SURVIVED</p>
      <h2>PICK ONE. NO TAKE-BACKS.</h2>
      <div className="cy-loot-grid">
        {cards.map((c, i) => (
          <button key={c.id} className={`cy-loot-card ${flipped === i ? "is-open" : ""}`} onClick={() => { if (flipped === i) return onPick(c); setFlipped(i); playSfx("click"); }}>
            {flipped === i ? <><strong>{c.name}</strong><small>{c.blurb}</small><em>TAP AGAIN TO TAKE IT</em></> : <><b>?</b><small>UNKNOWN DROP</small></>}
          </button>
        ))}
      </div>
      <small className="cy-note">Every player with the same seed gets the same three cards. Only your choice differs.</small>
    </>
  );
}

/**
 * The relic draft. Three artefacts, one kept forever, and the synergy list right
 * under them so the player can see the build they are aiming at.
 */
function RelicSheet({ cards, owned, onPick }: { cards: Relic[]; owned: string[]; onPick: (c: Relic) => void }) {
  const power = relicPower(owned);
  const next = SYNERGY_HINTS(owned);
  return (
    <>
      <h2>CHOOSE YOUR ARTEFACT</h2>
      <p className="cy-note">Kept for the rest of the run. It changes your numbers, never the market.</p>
      <div className="cy-relic-grid">
        {cards.map((c) => (
          <button key={c.id} className="cy-relic-card" onClick={() => { playSfx("click"); onPick(c); }}>
            <b>{c.glyph}</b>
            <strong>{c.name}</strong>
            <small>{c.effect}</small>
            <em>{c.line}</em>
          </button>
        ))}
      </div>
      {owned.length > 0 && (
        <p className="cy-relic-own">HELD {owned.map((id) => relicOf(id)?.glyph ?? "?").join(" ")}{power.synergies.length ? ` | SYNERGY ${power.synergies.map((s) => s.name).join(" + ")}` : ""}</p>
      )}
      {next && <small className="cy-note">{next}</small>}
    </>
  );
}

/** One gentle nudge toward the closest synergy the player could still complete. */
const SYNERGY_HINTS = (owned: string[]): string | null => {
  for (const s of SYNERGIES) {
    const missing = s.needs.filter((n) => !owned.includes(n));
    if (owned.some((o) => s.needs.includes(o as never)) && missing.length === 1) {
      return `One away from ${s.name}: add ${relicOf(missing[0]!)?.name}. ${s.line}`;
    }
  }
  return null;
};

/**
 * The Boss as an opponent you can actually hurt: his liquidity bar drains when
 * you out-trade him or win a duel, and his face changes state with it.
 */
function BossBar({ you, him, wins, phase }: { you: number; him: number; wins: number; phase: "SMUG" | "PRESSED" | "ENRAGED" | "BROKEN" }) {
  const total = Math.max(1, you + him);
  const hp = Math.max(4, Math.min(100, Math.round((him / total) * 100)));
  return (
    <div className={`cy-bossbar is-${phase.toLowerCase()}`}>
      <span className="cy-bossbar-head">THE FINAL BOSS <b>{phase}</b></span>
      <div className="cy-bossbar-track"><i style={{ width: `${hp}%` }} /><u style={{ left: `${hp}%` }} /></div>
      <span className="cy-bossbar-foot">HIS LIQUIDITY {formatMoney(him)} | DUELS WON {wins}/6</span>
    </div>
  );
}


function MoreSheet({ ap, stance, heat, conviction, convictionOn, verified, verifyCost, skillDone, skillHidden, skillHead, skillPrize, onStance, onConviction, onTerminal, onSurvive, onSkill, onVerify, onStorage, onHistory, onGuide, onEnd }: {
  ap: number; stance: Run["stance"]; heat: number; conviction: number; convictionOn: boolean;
  verified: boolean; verifyCost: number; skillDone: boolean; skillHidden?: boolean; skillHead: string; skillPrize: number;
  onStance: (id: Run["stance"]) => void; onConviction: () => void; onTerminal: () => void; onSurvive: () => void;
  onSkill: () => void; onVerify: () => void; onStorage: () => void; onHistory: () => void; onGuide: () => void; onEnd: () => void;
}) {
  return (
    <>
      <p className="journey-kicker"><Ellipsis /> MORE</p>
      <h2>RUN TOOLS</h2>
      <div className="cy-more-plan" aria-label="Your plan for this quarter">
        <div className="cy-plan-head">
          <span>YOUR PLAN FOR THIS QUARTER</span>
          <strong className={heat > 0 ? "is-hot" : ""}>HEAT x{heat} | WIN BONUS +{Math.round((heatBonus(heat) - 1) * 100)}%</strong>
        </div>
        <div className="cy-plan-row">
          {STANCES.map((s) => (
            <button key={s.id} type="button" className={`cy-plan-btn is-${s.id}${stance === s.id ? " is-on" : ""}`} onClick={() => onStance(s.id)}>
              <b>{s.name}</b>
              <small>{s.id === "survive" ? "−50% LOSS" : s.id === "degen" ? "±60% SWING" : "AS IT COMES"}</small>
            </button>
          ))}
        </div>
        <p>{stanceOf(stance).line}</p>
        <div className="cy-conviction">
          <span>CONVICTION {Math.round(conviction)}%</span>
          <div className="cy-conv-track"><i className={convictionOn ? "is-armed" : ""} style={{ width: `${Math.round(conviction)}%` }} /></div>
          <button type="button" className={`cy-conv-btn${convictionOn ? " is-on" : ""}`} onClick={onConviction}>{convictionOn ? "ARMED | 1.5x" : "RISK IT"}</button>
        </div>
      </div>
      <div className="cy-more-grid">
        <Button variant="secondary" disabled={ap <= 0} onClick={onTerminal}><TrendingUp />TRADE TERMINAL<small>All coins, spot and leverage</small></Button>
        <Button variant="secondary" onClick={onSurvive}><HeartPulse />SURVIVE<small>Eat, calm down, pay life</small></Button>
        {!skillHidden && <Button variant="secondary" disabled={skillDone} onClick={onSkill}><Target />{skillDone ? "SKILL DONE" : "SKILL TEST"}<small>{skillDone ? "Already played this quarter" : `${skillHead} | win ${formatMoney(skillPrize)}`}</small></Button>}
        <Button variant="secondary" disabled={verified} onClick={onVerify}><Zap />{verified ? "SIGNALS CHECKED" : "VERIFY SIGNALS"}<small>{verified ? "One of them was a lie" : `Costs ${formatMoney(verifyCost)}`}</small></Button>
        <Button variant="secondary" disabled={ap <= 0} onClick={onStorage}><Shield />STORAGE<small>Protect exposed coins</small></Button>
        <Button variant="secondary" onClick={onHistory}><Receipt />HISTORY<small>See every cash flow</small></Button>
        <Button variant="secondary" onClick={onGuide}><Target />SHOW ME HOW TO PLAY<small>Restart the 3-step guide</small></Button>
        <Button variant="destructive" onClick={onEnd}><Skull />END RUN<small>Cash out and submit</small></Button>
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
      <div className="cy-trade-head"><img src={COIN_LOGO[symbol]} alt="" width={44} height={44} /><span><strong>{symbol}</strong><small>{formatMoney(price)} | {chapterLabel(run.chapter)}</small></span></div>
      <div className="cy-trade-cols">
        <div>
          <p className="journey-kicker">SPOT | YOU OWN IT</p>
          <Button variant="secondary" onClick={() => onSpot(0.25)}>BUY 25% | {formatMoney(run.cash * 0.25)}</Button>
          <Button variant="secondary" onClick={() => onSpot(0.5)}>BUY 50% | {formatMoney(run.cash * 0.5)}</Button>
          <Button variant="secondary" onClick={() => onSpot(1)}>ALL IN | {formatMoney(run.cash)}</Button>
        </div>
        <div>
          <p className="journey-kicker">PERP | BORROWED COURAGE</p>
          <div className="cy-toggle">
            <button className={dir === 1 ? "is-on" : ""} onClick={() => setDir(1)}><TrendingUp />LONG</button>
            <button className={dir === -1 ? "is-on" : ""} onClick={() => setDir(-1)}><TrendingDown />SHORT</button>
          </div>
          <div className="cy-toggle">{LEVERAGE.map((l) => <button key={l} className={lev === l ? "is-on" : ""} onClick={() => setLev(l)}>{l}x</button>)}</div>
          <Button onClick={() => onPerp(dir, lev, 0.25)}>OPEN | {formatMoney(run.cash * 0.25)} MARGIN</Button>
          <Button onClick={() => onPerp(dir, lev, 0.5)}>OPEN | {formatMoney(run.cash * 0.5)} MARGIN</Button>
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
      <div className="cy-trade-head"><img src={COIN_LOGO[pos.symbol]} alt="" width={44} height={44} /><span><strong>{pos.symbol}</strong><small>entry {formatMoney(pos.entry)} | now {formatMoney(price)}</small></span></div>
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
      <p className="journey-kicker"><Rocket /> {card.tag} | ONE SHOT</p>
      <h2>{card.name}</h2>
      <p className="cy-lead">{card.blurb}</p>
      <ul className="cy-lines">
        <li>Rug risk | {Math.round(card.rug * 100)}%</li>
        <li>If it works | {card.upside[0]}x to {card.upside[1]}x</li>
        <li>Your cash | {formatMoney(cash)}</li>
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
      <p className="journey-kicker"><Rocket /> {res.tag} | RESULT</p>
      <h2 className={res.rugged ? "negative" : "positive"}>{res.rugged ? "RUGGED." : res.multi > 6 ? "MOONSHOT" : "IT PAID"}</h2>
      <p className={`cy-delta ${gain >= 0 ? "positive" : "negative"}`}>{gain >= 0 ? "+" : "−"}{formatMoney(Math.abs(gain))}</p>
      <ul className="cy-lines">
        <li>{res.name} | {res.multi.toFixed(2)}x</li>
        <li>Invested | {formatMoney(res.size)}</li>
        <li>Back in your pocket | {formatMoney(res.back)}</li>
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
      <p className="journey-kicker"><TrendingDown /> {chapterLabel(chapter)} | {monthRangeLabel(chapter)}</p>
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
      <p className="journey-kicker"><Crown /> SKILL DUEL | {chapterLabel(chapter)}</p>
      <h2>{fight.title}</h2>
      <p className="cy-lead">{fight.line}</p>
      <div className="cy-duel-stakes"><span><small>YOU RISK</small><strong>Choose below</strong></span><span><small>IF YOU WIN</small><strong>Up to 2× + {fight.perk}</strong></span><span><small>IF YOU LOSE</small><strong>Stake is gone</strong></span></div>
      <p className="cy-hint"><strong>WHAT TO DO:</strong> Choose a stake. The next screen tells you exactly when or where to tap. {PERK_BLURB[fight.perk]}</p>
      <div className="cy-grid">
        {stakes.map((s, i) => (
          <button key={i} className="cy-act" disabled={cash < s} onClick={() => onFight(s, fight.mini)}>
            <Zap /><strong>RISK {formatMoney(s)}</strong><small>{["Low stake", "Serious stake", "Maximum stake"][i]} | win up to {formatMoney(s * 2)}</small>
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
      <p className="journey-kicker"><Shield /> {chapterLabel(chapter)} | COUNTERPARTY</p>
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
            <em>Fee {(c.fee * 100).toFixed(1)}% | {c.id === "exchange" ? "exchange risk" : c.id === "hot" ? "drainer risk" : "slow fills"}</em>
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
      <p className="journey-kicker"><Home /> INCOME | RENT | SANITY</p>
      <h2>YOUR LIFE</h2>
      <div className="cy-pick-list">
        {JOBS.map((j) => (
          <button key={j.id} className={`cy-pick-row ${job === j.id ? "is-on" : ""}`} onClick={() => setJob(j.id)}>
            <strong>{j.name}</strong><small>{j.blurb}</small><em>{j.income ? `+${formatMoney(j.income)} / quarter` : "no income"} | stress +{j.stress}{j.ap ? ` | +${j.ap} move` : ""}</em>
          </button>
        ))}
      </div>
      <div className="cy-pick-list">
        {HOUSING.map((h) => (
          <button key={h.id} className={`cy-pick-row ${housing === h.id ? "is-on" : ""}`} onClick={() => setHousing(h.id)}>
            <strong>{h.name}</strong><small>{h.blurb}</small><em>−{formatMoney(h.rent)} / quarter | stress {h.calm >= 0 ? `−${h.calm}` : `+${-h.calm}`}</em>
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
          <p key={i}><span>{chapterLabel(e.chapter)} | {e.label}</span><strong className={e.amount >= 0 ? "positive" : "negative"}>{e.amount >= 0 ? "+" : "−"}{formatMoney(Math.abs(e.amount))}</strong></p>
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
      <p className="journey-kicker"><Skull /> {chapterLabel(run.chapter)} | WALK AWAY</p>
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
      <p className="journey-kicker"><HeartPulse /> STAY IN THE GAME | COSTS A MOVE</p>
      <h2>SURVIVAL</h2>
      <div className="cy-survive">
        <div><Activity /><span><small>HUNGER</small><strong>{run.hunger}%</strong></span><Button disabled={!left} onClick={onEat}>EAT | {formatMoney(careCost("eat", run.chapter, difficulty))}</Button></div>
        <div><HeartPulse /><span><small>STRESS</small><strong>{run.stress}%</strong></span><Button disabled={!left} onClick={onCalm}>CALM | {formatMoney(careCost("calm", run.chapter, difficulty))}</Button></div>
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

/** A visible way in: browsers block sound until a tap, so we ask for that tap. */
function SoundPrompt() {
  const [live, setLive] = useState(true);
  useEffect(() => {
    const check = () => setLive(audioLive());
    check();
    const id = window.setInterval(check, 800);
    return () => window.clearInterval(id);
  }, []);
  if (live) return null;
  return (
    <button className="cy-sound-prompt" type="button" onClick={() => { setMuted(false); unlockAudio(); playSfx("click"); setLive(audioLive()); }}>
      <Volume2 />TAP FOR SOUND
    </button>
  );
}

function MenuSound() {
  const [open, setOpen] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [vols, setVols] = useState({ musicVol: 0.35, sfxVol: 0.6 });
  useEffect(() => { setMutedState(isMuted()); setVols(getVolumes()); }, [open]);
  return (
    <>
      <button className="menu-sound" aria-label={muted ? "Sound on" : "Sound settings"} onClick={() => { unlockAudio(); playSfx("click"); setOpen(true); }}>
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

/** Loads the season leader's net worth once, then hands the same frozen value to every screen. */
function useTopMark(season: string): TopMark | null {
  const [mark, setMark] = useState<TopMark | null>(null);
  useEffect(() => {
    let live = true;
    void loadTopMark(season).then((m) => { if (live) setMark(m); });
    return () => { live = false; };
  }, [season]);
  return mark;
}

const markTag = (mark: TopMark): string =>
  mark.source === "season" ? "CURRENT SEASON LEADER" : mark.source === "alltime" ? "ALL-TIME BEST MARK" : "MARK TO BEAT";

/** The target, stated in plain numbers, before a run starts. */
function TargetMark({ mark }: { mark: TopMark | null }) {
  if (!mark) return null;
  return (
    <div className="cy-mark" aria-label="Target to beat">
      <span className="cy-mark-tag">[ {markTag(mark)} ]</span>
      <strong>{formatMoney(mark.net)}</strong>
      <em>{mark.source === "benchmark" ? "No entry yet this season — clear this mark and the board is yours." : `by ${mark.name} — beat him.`}</em>
    </div>
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
        <span className="season-live"><Trophy /> $TCFB TOURNAMENT | {seasonLabel(season)}</span>
        <strong>{left ? `ENDS IN ${left}` : "LIVE NOW"}</strong>
      </div>
      <p>Top 3 of the season leaderboard win {PRIZES.map((p) => `$${p}`).join(" | ")} in $TCFB, paid within 3 days after the token launch in October. Same seed for everyone: identical crashes, launches and rugs.</p>
      <p className="season-rules">One account per player. Multiple accounts, shared wallets or duplicate entries are disqualified. Only your best run of the season counts.</p>
      {onStart && <Button className="season-cta" onClick={() => { playSfx("win"); onStart(); }}><Trophy />PLAY THE TOURNAMENT <ChevronRight /></Button>}
    </div>
  );
}

function TournamentRules({ onClose }: { onClose: () => void }) {
  return (
    <>
      <p className="journey-kicker"><Trophy /> $TCFB TOURNAMENT | {seasonLabel(currentSeasonId())}</p>
      <h2>THE RULES</h2>
      <ol className="cy-steps">
        <li><b>1</b><span>Every tournament run of the month uses the same seed. Identical crashes, launches and rugs for everyone.</span></li>
        <li><b>2</b><span>Only your best run of the month counts. Play as often as you like.</span></li>
        <li><b>3</b><span>One account per player. Multiple accounts, shared wallets or duplicate entries are disqualified.</span></li>
        <li><b>4</b><span>Top 3 win {PRIZES.map((p) => `$${p}`).join(" / ")} in $TCFB, paid within 3 days after the token launch in October.</span></li>
        <li><b>5</b><span>A valid wallet is required to enter the prize leaderboard. Wallets stay private.</span></li>
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

function StartScreen({ resume, mark, onTournament, onFreeRun, onResume, onBoard }: { resume: boolean; mark: TopMark | null; onTournament: () => void; onFreeRun: () => void; onResume: () => void; onBoard: () => void }) {
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
      <SoundPrompt />
      <section className="start-stage">
        <div className="start-brand">
          <p className="journey-kicker">REAL CRYPTO HISTORY | ONE LIFE</p>
          <h1>THE CRYPTO<br /><span>FINAL BOSS</span></h1>
          <p>Trade the real 2020–2026 cycle. Beat the market. Survive the Boss.</p>
        </div>
        <div className="start-console">
          <SeasonBanner compact />
          <TargetMark mark={mark} />
          {profile && <RecordStrip profile={profile} onEndings={() => setEndings(true)} />}
          <div className="start-actions">
            {resume ? <Button className="start-main" onClick={onResume}><Flame />CONTINUE | YOUR RUN IS LIVE <ChevronRight /></Button> : <Button className="start-main" onClick={onTournament}><Trophy />PLAY NOW | $10,000 <ChevronRight /></Button>}
            <div className="start-secondary">
              <Button variant="outline" onClick={() => { playSfx("click"); onFreeRun(); }}>CUSTOM RUN</Button>
              <Button variant="outline" onClick={() => { playSfx("click"); onBoard(); }}><Trophy />LEADERBOARD</Button>
            </div>
          </div>
          <small className="start-footer">84 MONTHS | REAL PRICES | SAME SEED | <button className="start-rules" onClick={() => { playSfx("click"); setRules(true); }}>RULES</button></small>
        </div>
      </section>
      {rules && <Sheet onClose={() => setRules(false)}><TournamentRules onClose={() => setRules(false)} /></Sheet>}
      {endings && profile && <Sheet onClose={() => setEndings(false)}><EndingsSheet profile={profile} onClose={() => setEndings(false)} /></Sheet>}
    </main>
  );
}




function SetupScreen({ tournament, mark, onBack, onStart }: { tournament: boolean; mark: TopMark | null; onBack: () => void; onStart: (config: Config) => void }) {
  const season = currentSeasonId();
  // In the tournament everyone plays the same twist, so nobody picks an easier one.
  const locked = tournament ? tournamentModifier(season) : null;
  const [config, setConfig] = useState<Config>({
    ...defaultConfig, tournament, season, modifier: locked ?? "straight",
    ...(tournament ? { difficulty: TOURNAMENT_RULES.difficulty, mode: TOURNAMENT_RULES.mode, ironman: TOURNAMENT_RULES.ironman } : {}),
  });
  const set = <K extends keyof Config>(key: K, value: Config[K]) => { if (key !== "name") playSfx("click"); setConfig((c) => ({ ...c, [key]: value })); };
  const startCash = startCashFor(config);
  const [advanced, setAdvanced] = useState(false);
  const [preset, setPreset] = useState<string>("classic");
  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    playSfx("click");
    setPreset(id);
    setConfig((c) => ({ ...c, arch: p.arch, difficulty: p.difficulty, mode: p.mode, modifier: p.modifier, ironman: p.ironman }));
  };
  return (
    <main className="journey-setup">
      <header><div><p className="journey-kicker">{tournament ? `TOURNAMENT | ${seasonLabel(config.season)}` : "CUSTOM RUN"}</p><h1>{tournament ? "CHOOSE YOUR RUN" : "PICK A STYLE. PLAY."}</h1></div><MenuSound /><Button variant="ghost" size="icon" aria-label="Back" onClick={() => { playSfx("click"); onBack(); }}><X /></Button></header>
      {tournament && <SeasonBanner />}
      <TargetMark mark={mark} />

      <section className="setup-block setup-id"><p className="journey-kicker">YOU</p>
        <input className="setup-input" maxLength={18} placeholder="YOUR HANDLE" value={config.name} onChange={(e) => set("name", e.target.value)} aria-label="Player name" />
        <div className="avatar-row">{AVATARS.map((a) => <button key={a.id} className={`avatar-pick ${config.avatar === a.id ? "is-on" : ""}`} aria-label={`Avatar ${a.id}`} onClick={() => set("avatar", a.id)}><img src={a.url} alt={`${a.id} avatar`} /></button>)}</div>
        <div className="chip-row">{COUNTRIES.map((c) => <button key={c} className={`chip ${config.country === c ? "is-on" : ""}`} onClick={() => set("country", c)}><Flag code={c} size={18} />{c}</button>)}</div>
      </section>
      {tournament ? (
        <>
          <section className="setup-block"><p className="journey-kicker">ARCHETYPE | SAME MONEY FOR EVERYONE</p><div className="pick-grid">{ARCHETYPES.map((a) => <button key={a.id} className={`pick-card ${config.arch === a.id ? "is-on" : ""}`} onClick={() => set("arch", a.id)}><strong>{a.name}</strong><em>{formatMoney(startCashFor({ ...config, arch: a.id }))} START</em><small>{a.blurb}</small></button>)}</div></section>
          <section className="setup-block season-fixed"><p className="journey-kicker">TOURNAMENT CONDITIONS | IDENTICAL FOR EVERYONE</p>
            <ul>
              <li><b>SEED</b><span>{seasonLabel(season)} — same crashes, rugs, launches and minigames for all players.</span></li>
              <li><b>MONEY</b><span>{formatMoney(startCashFor(config))} start for everyone. Your archetype is style, not an edge.</span></li>
              <li><b>DIFFICULTY</b><span>{TOURNAMENT_RULES.difficulty}</span></li>
              <li><b>MARKET</b><span>{modeOf(TOURNAMENT_RULES.mode).name} — real 2020–2026 prices, no chaos mode.</span></li>
              <li><b>TWIST</b><span>{modifierOf(config.modifier).name} — {modifierOf(config.modifier).blurb}</span></li>
              <li><b>IRONMAN</b><span>OFF</span></li>
            </ul>
            <small>Only handle, country and avatar are yours to pick. Want free settings? Start a CUSTOM RUN instead.</small>
          </section>
        </>
      ) : (
        <>
          <section className="setup-block"><p className="journey-kicker">ONE TAP | PICK YOUR RUN</p>
            <div className="preset-grid">{PRESETS.map((p) => (
              <button key={p.id} className={`preset-card ${preset === p.id ? "is-on" : ""}`} onClick={() => applyPreset(p.id)}>
                <strong>{p.name}</strong>
                <em>{formatMoney(startCashFor({ ...config, arch: p.arch, modifier: p.modifier }))} START | SCORE x{(modifierOf(p.modifier).mul * diffOf(p.difficulty).cost).toFixed(2)}</em>
                <small>{p.line}</small>
              </button>
            ))}</div>
          </section>
          <button className={`setup-advanced ${advanced ? "is-on" : ""}`} onClick={() => { playSfx("click"); setAdvanced((a) => !a); }} aria-expanded={advanced}>
            {advanced ? "HIDE THE FINE TUNING" : "FINE TUNE IT MYSELF"}
          </button>
          {advanced && (
            <section className="setup-block setup-fine">
              <p className="journey-kicker">CHARACTER</p>
              <div className="seg-row">{ARCHETYPES.map((a) => <button key={a.id} className={config.arch === a.id ? "is-on" : ""} onClick={() => set("arch", a.id)}>{a.name}</button>)}</div>
              <p className="journey-kicker">DIFFICULTY</p>
              <div className="seg-row">{DIFFICULTIES.map((d) => <button key={d.id} className={config.difficulty === d.id ? "is-on" : ""} onClick={() => set("difficulty", d.id)}>{d.name}</button>)}</div>
              <p className="journey-kicker">MARKET</p>
              <div className="seg-row">{MODES.map((m) => <button key={m.id} className={config.mode === m.id ? "is-on" : ""} onClick={() => set("mode", m.id)}>{m.name}</button>)}</div>
              <p className="journey-kicker">TWIST</p>
              <div className="seg-row">{MODIFIERS.map((m) => <button key={m.id} className={config.modifier === m.id ? "is-on" : ""} onClick={() => set("modifier", m.id)}>{m.name}</button>)}</div>
              <button className={`iron-toggle ${config.ironman ? "is-on" : ""}`} onClick={() => set("ironman", !config.ironman)}><Flame /><span><strong>IRONMAN</strong><small>No saves, no second chances. Death is final.</small></span></button>
              <p className="setup-fine-note">{modeOf(config.mode).blurb} | {diffOf(config.difficulty).blurb}</p>
            </section>
          )}
        </>
      )}
      <div className="setup-cta">
        <div className="setup-summary">
          <img src={AVATARS.find((a) => a.id === config.avatar)?.url} alt="" />
          <span>
            <strong>{config.name.trim() || "anon"} <Flag code={config.country} size={14} /></strong>
            <small>{archOf(config.arch).name} | {formatMoney(startCash)} | {config.difficulty}{config.modifier !== "straight" ? ` | ${modifierOf(config.modifier).name}` : ""}{config.ironman ? " | IRONMAN" : ""}</small>
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
      loadBoard(50, view === "season" ? season : "all")
        .then((r) => { if (alive) setRows(r); })
        .catch(() => { if (alive) setError(true); });
    });
    return () => { alive = false; };
  }, [season, view]);
  return (
    <main className="journey-setup board-screen">
      <div className="board-shell">
        <header className="board-header"><div><p className="journey-kicker">BOSS SCORE | {view === "season" ? seasonLabel(season) : "ALL TIME"}</p><h1>LEADERBOARD</h1></div><div className="board-header-actions"><MenuSound /><Button variant="ghost" size="icon" aria-label="Back" onClick={() => { playSfx("click"); onBack(); }}><X /></Button></div></header>
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
                  <span className="board-player"><strong>{r.name}{r.prize ? <em className="board-prize">${r.prize} $TCFB</em> : null}</strong><small><Flag code={r.country} size={15} />{r.rank ? `${r.rank.toUpperCase()} | ` : ""}{r.arch.toUpperCase()} | {r.difficulty.toUpperCase()}</small></span>
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


function EndScreen({ run, net, score, ending, mark, onRestart, onRematch, onBoard }: { run: Run; net: number; score: number; ending: EndingKey; mark: TopMark | null; onRestart: () => void; onRematch: () => void; onBoard: () => void }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "queued" | "rejected">("idle");
  const [wallet, setWallet] = useState(() => readWallet());
  const [walletError, setWalletError] = useState(false);
  // Quick-start runs never pass the setup screen, so the player names the entry here.
  const [name, setName] = useState(() => run.config.name.trim() || readName());
  const [nameError, setNameError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const tournament = run.config.tournament;

  // THRONE belongs here too: it is the best ending, and leaving it out sent the
  // end screen looking for a death punchline that does not exist.
  const won = ending === "THRONE" || ending === "LEGEND" || ending === "SURVIVOR" || ending === "SELLOUT";
  const end = ENDINGS[ending];
  const badge = badgeFor(run, ending, net);
  const submission = useMemo<RunSubmission>(() => ({
    clientHash: crypto.randomUUID(),
    name: name.trim() || run.config.name.trim() || "anon", arch: run.config.arch, country: run.config.country,
    difficulty: run.config.difficulty, mode: modeId(run.config), net: Math.round(net),
    score, xp: run.xp, level: levelFor(run.xp), rank: badge, months: monthsSurvived(run.chapter), achievements: run.crises,
    trades: run.trades, survived: won, avatar: run.config.avatar,
    season: run.config.season, isTournament: tournament, playerKey: playerKey(),
    log: tournament ? run.audit : undefined,
  }), [badge, name, net, run, score, tournament, won]);
  const punchline = useMemo(() => {
    if (won) return null;
    const lines = DEATH_PUNCHLINES[ending as keyof typeof DEATH_PUNCHLINES];
    if (!lines?.length) return null;
    return lines[Math.abs(run.moves + run.trades + run.chapter) % lines.length] ?? null;
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
    const startCash = startCashFor(run.config);
    if (ending === "THRONE") return null;
    if (won && net >= startCash * 40) return `You were ${formatMoney(startCash * 60 - net)} short of LEGEND. One better exit and it was yours.`;
    if (!won) {
      const left = TOTAL_MONTHS - monthsSurvived(run.chapter);
      return `${left} months left on the clock. The Boss barely had to try.`;
    }
    return "Beat the Boss' own book and win 3 fights to take the THRONE.";
  }, [ending, net, run.chapter, run.config.arch, run.config.modifier, won]);

  // Wordle-style, spoiler-free result grid: crashes met vs. survived, boss duels,
  // and how far the 84 months got. Pure presentation of values already on the run.
  const crashTotal = 5;
  const crashRow = Array.from({ length: crashTotal }, (_, i) => (i < Math.min(run.crises, crashTotal) ? "🟩" : "⬛")).join("");
  const duelTotal = 3;
  const duelRow = Array.from({ length: duelTotal }, (_, i) => (i < Math.min(run.bossWins, duelTotal) ? "⚔️" : "⬛")).join("");
  const monthCells = 7;
  const monthsDone = monthsSurvived(run.chapter);
  const monthRow = Array.from({ length: monthCells }, (_, i) => (i < Math.round((monthsDone / TOTAL_MONTHS) * monthCells) ? "🟨" : "⬛")).join("");
  const shareText = `THE CRYPTO FINAL BOSS 🦍👑
${won ? "" : "REKT | "}${ENDINGS[ending].title} | ${badge}
Crashes ${crashRow} ${Math.min(run.crises, crashTotal)}/${crashTotal}
Boss    ${duelRow} ${Math.min(run.bossWins, duelTotal)}/${duelTotal}
Months  ${monthRow} ${monthsDone}/${TOTAL_MONTHS}
NET ${formatMoney(net)} | SCORE ${score.toLocaleString("en-US")}${run.config.modifier !== "straight" ? `\n${modifierOf(run.config.modifier).name}` : ""}${mark ? `\nVS RANK 1 ${net >= mark.net ? `👑 CRACKED +${formatMoney(net - mark.net)}` : `−${formatMoney(mark.net - net)} short`}` : ""}
Beat my run: thecryptofinalboss.app`;
  const share = async () => {
    playSfx("click");
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch { setCopied(false); }
  };

  // Trophy card: the same numbers drawn on a canvas so the result travels as an
  // image on X, not just as text.
  const [cardStatus, setCardStatus] = useState<"idle" | "copied" | "saved">("idle");
  const drawCard = () => {
    const c = document.createElement("canvas");
    c.width = 1200; c.height = 675;
    const g = c.getContext("2d");
    if (!g) return null;
    const BG = "#0B1117", STEEL = "#16222F", EDGE = "#24364A";
    const AMBER = "#F5A623", MINT = "#00E599", SHOCK = "#FF3366", TAPE = "#8B9EB0";
    const key = won ? MINT : SHOCK;
    const mono = (size: number, weight = 500) => `${weight} ${size}px "JetBrains Mono", ui-monospace, monospace`;
    const display = (size: number) => `700 ${size}px "Space Grotesk", sans-serif`;

    // Bunker slate plate with hard hardware edges and terminal scanlines.
    g.fillStyle = BG; g.fillRect(0, 0, 1200, 675);
    g.fillStyle = STEEL; g.fillRect(40, 40, 1120, 595);
    g.globalAlpha = 0.16; g.fillStyle = TAPE;
    for (let y = 40; y < 635; y += 4) g.fillRect(40, y, 1120, 1);
    g.globalAlpha = 1;
    g.strokeStyle = EDGE; g.lineWidth = 2; g.strokeRect(40, 40, 1120, 595);
    g.strokeStyle = key; g.lineWidth = 4; g.beginPath();
    g.moveTo(40, 40); g.lineTo(40, 635); g.stroke();
    // corner cut marks
    g.strokeStyle = AMBER; g.lineWidth = 2;
    for (const [x, y, dx, dy] of [[40, 40, 1, 1], [1160, 40, -1, 1], [40, 635, 1, -1], [1160, 635, -1, -1]] as const) {
      g.beginPath(); g.moveTo(x + dx * 26, y); g.lineTo(x, y); g.lineTo(x, y + dy * 26); g.stroke();
    }

    // Header tape
    g.fillStyle = AMBER; g.font = mono(20, 700);
    g.fillText("[ TERMINAL AUDIT // THE CRYPTO FINAL BOSS ]", 78, 92);
    g.fillStyle = TAPE; g.font = mono(16);
    g.fillText(`RUN ${monthsDone}/${TOTAL_MONTHS} MONTHS  |  ${run.config.difficulty.toUpperCase()}  |  RANK ${badge.toUpperCase()}`, 78, 120);

    // Verdict
    g.fillStyle = "#FFFFFF"; g.font = display(96);
    g.fillText(end.title.toUpperCase(), 74, 222);
    g.fillStyle = key; g.font = mono(18, 700);
    g.fillText(won ? ">> THE BOSS CONCEDED GROUND" : ">> THE BOSS KEPT THE CHAIR", 78, 258);

    // Tape rows: crashes / duels / months as hardware segments
    const row = (label: string, filled: number, total: number, y: number, colour: string) => {
      g.fillStyle = TAPE; g.font = mono(15);
      g.fillText(label, 78, y - 22);
      for (let i = 0; i < total; i++) {
        const x = 78 + i * 62;
        g.fillStyle = i < filled ? colour : EDGE;
        g.fillRect(x, y, 50, 26);
        g.strokeStyle = EDGE; g.lineWidth = 1; g.strokeRect(x, y, 50, 26);
      }
      g.fillStyle = "#FFFFFF"; g.font = mono(16, 700);
      g.fillText(`${filled}/${total}`, 78 + total * 62 + 10, y + 20);
    };
    row("CRASHES SURVIVED", Math.min(run.crises, crashTotal), crashTotal, 320, MINT);
    row("BOSS DUELS WON", Math.min(run.bossWins, duelTotal), duelTotal, 400, AMBER);
    row("MONTHS ON THE TAPE", Math.round((monthsDone / TOTAL_MONTHS) * monthCells), monthCells, 480, key);

    // Net / score block
    g.strokeStyle = EDGE; g.lineWidth = 2;
    g.beginPath(); g.moveTo(700, 300); g.lineTo(700, 560); g.stroke();
    g.fillStyle = TAPE; g.font = mono(15);
    g.fillText("FINAL TREASURY", 740, 322);
    g.fillStyle = key; g.font = display(64);
    g.fillText(formatMoney(net), 736, 386);
    g.fillStyle = TAPE; g.font = mono(15);
    g.fillText("BOSS SCORE", 740, 446);
    g.fillStyle = "#FFFFFF"; g.font = display(46);
    g.fillText(score.toLocaleString("en-US"), 736, 494);
    g.fillStyle = AMBER; g.font = mono(15, 700);
    g.fillText(`XP ${run.xp.toLocaleString("en-US")}  |  LVL ${levelFor(run.xp)}`, 740, 540);

    // Footer tape
    g.fillStyle = EDGE; g.fillRect(40, 588, 1120, 1);
    g.fillStyle = TAPE; g.font = mono(16);
    g.fillText("VERIFIED RUN // thecryptofinalboss.app", 78, 618);
    g.fillStyle = AMBER; g.font = mono(16, 700);
    g.fillText("$TCFB", 1060, 618);
    return c;
  };
  const shareCard = async () => {
    playSfx("click");
    // The card must never fall back to a system font — wait for the webfonts.
    try { await document.fonts.ready; } catch { /* older browsers just draw */ }
    const c = drawCard();
    if (!c) return;
    const blob = await new Promise<Blob | null>((res) => c.toBlob((b) => res(b), "image/png"));
    if (!blob) return;
    try {
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      setCardStatus("copied");
      return;
    } catch { /* clipboard images are not everywhere — fall back to a download */ }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "crypto-final-boss.png"; a.click();
    URL.revokeObjectURL(url);
    setCardStatus("saved");
  };

  const send = async () => {
    const trimmed = wallet.trim();
    const player = name.trim();
    if (!player) { setNameError(true); return; }
    if (tournament && !isWallet(trimmed)) { setWalletError(true); return; }
    if (tournament && run.config.season !== currentSeasonId()) { setStatus("rejected"); return; }
    setNameError(false);
    setWalletError(false);
    saveName(player);
    if (tournament && trimmed) saveWallet(trimmed);
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
            <span><small>LEVEL | XP</small><strong>{levelFor(run.xp)} | {run.xp.toLocaleString("en-US")}</strong></span>
            <span><small>CRISES</small><strong>{run.crises}</strong></span>
          </div>
          {run.statuses.length > 0 && <div className="cy-status-row end-statuses">{run.statuses.map((s) => <span key={s}>{s}</span>)}</div>}
          {newRecord && <p className="end-record">NEW PERSONAL RECORD | beat {before?.bestScore.toLocaleString("en-US")}</p>}
          {mark && (
            <p className={`end-rank1 ${net >= mark.net ? "is-ahead" : "is-behind"}`}>
              {net >= mark.net
                ? `RANK 1 CRACKED | ${formatMoney(net - mark.net)} above the mark of ${formatMoney(mark.net)}${mark.source === "season" ? ` (${mark.name})` : ""}.`
                : `You were ${formatMoney(mark.net - net)} short of rank 1 | mark ${formatMoney(mark.net)}${mark.source === "season" ? ` by ${mark.name}` : ""}.`}
            </p>
          )}
          {nearMiss && <p className="end-nearmiss">{nearMiss}</p>}
          {profile && <small className="end-progress">RUN {profile.runs} | ENDINGS {Object.keys(profile.endings).length}/{Object.keys(ENDINGS).length} | BEST {formatMoney(profile.bestNet)}</small>}
        </div>

        <div className="end-trophy">
          <p className="journey-kicker">YOUR TROPHY | SPOILER-FREE</p>
          <pre className="end-grid">{`Crashes ${crashRow} ${Math.min(run.crises, crashTotal)}/${crashTotal}
Boss    ${duelRow} ${Math.min(run.bossWins, duelTotal)}/${duelTotal}
Months  ${monthRow} ${monthsDone}/${TOTAL_MONTHS}`}</pre>
          <div className="end-trophy-actions">
            <Button variant="outline" onClick={() => void share()}><Share2 />{copied ? "COPIED" : "COPY TO SHARE"}</Button>
            <Button variant="outline" onClick={() => void shareCard()}>{cardStatus === "copied" ? "CARD COPIED" : cardStatus === "saved" ? "CARD SAVED" : "TROPHY CARD 📸"}</Button>
          </div>
        </div>



        {run.chronicle.length > 1 && (
          <div className="end-chronicle">
            <p className="journey-kicker">HOW IT WENT</p>
            <ol>{run.chronicle.slice(-7).map((line, i) => <li key={i}>{line}</li>)}</ol>
          </div>
        )}


        {status !== "done" && (
          <div className="end-wallet">
            <p className="journey-kicker">YOUR NAME ON THE BOARD</p>
            <input className="setup-input" placeholder="YOUR NAME" maxLength={18} value={name} onChange={(e) => { setName(e.target.value); setNameError(false); }} aria-label="Player name" />
            <small>{nameError ? "Enter a name so you can find your own entry on the board." : "This is how your run appears on the leaderboard."}</small>
          </div>
        )}

        {tournament && status !== "done" && (
          <div className="end-wallet">
            <p className="journey-kicker">TOURNAMENT {seasonLabel(run.config.season)} | PRIZES {PRIZES.map((p) => `$${p}`).join(" / ")}</p>
            <input className="setup-input" placeholder="YOUR WALLET | EVM OR SOLANA" maxLength={64} value={wallet} onChange={(e) => { setWallet(e.target.value); setWalletError(false); }} aria-label="Prize wallet" />
            <small>{walletError ? "Enter a valid EVM or Solana wallet to join the tournament leaderboard." : "Required for a prize-valid tournament entry. Wallets stay private — prizes are paid within 3 days after the October launch."}</small>

          </div>
        )}
        {tournament && status === "done" && wallet.trim() && <small className="end-message">Entered for {seasonLabel(run.config.season)} as {shortWallet(wallet.trim())}.</small>}

        <div className="start-actions end-actions">

          <Button onClick={() => { playSfx("win"); void send(); }} disabled={status === "sending" || status === "done" || status === "rejected" || !name.trim() || (tournament && !isWallet(wallet))}><Trophy />{status === "done" ? "SCORE SUBMITTED" : status === "sending" ? "SENDING…" : status === "queued" ? "TRY AGAIN" : status === "rejected" ? "RUN NOT ACCEPTED" : "CLAIM YOUR RANK"}</Button>
          <Button variant="outline" disabled={status === "sending"} onClick={() => { playSfx("click"); onBoard(); }}>LEADERBOARD</Button>
          <Button variant="outline" onClick={() => void share()}><Share2 />{copied ? "COPIED" : "SHARE RESULT"}</Button>
          <Button className="cy-revenge" disabled={status === "sending"} onClick={() => { playSfx("click"); onRematch(); }}><Swords />REVENGE RUN | 1 TAP</Button>
          <Button variant="secondary" disabled={status === "sending"} onClick={() => { playSfx("click"); onRestart(); }}>{won ? <Crown /> : <Skull />}NEW RUN</Button>
        </div>

        {status === "queued" && <small className="end-message">The board is unavailable. Your result is saved and will retry automatically.</small>}
        {status === "rejected" && <small className="end-message">{tournament && run.config.season !== currentSeasonId() ? "This season closed while you played. Your run stays saved locally, but cannot enter the new season." : "This result failed the board's integrity checks and cannot be submitted."}</small>}

      </section>
    </main>
  );
}

export const PRESALE_COUNT = PRESALES.length;
