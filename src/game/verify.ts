/**
 * Server-side tournament verifier. Replays a submitted run log against the
 * same deterministic data the client used (historical prices, season seed,
 * relics, boss fights) and rejects runs whose reported result cannot be
 * produced by those events. Pure module — no React, no browser APIs.
 */
import {
  ARCHETYPES, CHAPTERS, COINS, DIFFICULTIES, TAX_RATE, TOURNAMENT_RULES, XP, XP_EXTRA,
  attackFor, bossFightFor, careCost, chapterMonth, chapterPlayFor, crashFor, custodyOf,
  decisionForChapter, failureFor, housingOf, isTaxChapter, jobOf, levelFor,
  MODIFIERS, levelPerk, lootDraw, missionFor, monthsSurvived, personaFor, pickLifeEvent,
  presaleFor, situationFor, skillCheckFor,
  type CoinSymbol, type CustodyId, type HousingId, type JobId,
} from "./journey-data";
import { relicChapter, relicOffer, relicPower, type RelicId } from "./relics";
import { det, hashString } from "./rng";
import type { LogEvent } from "./runlog";

export interface VerifyInput {
  archetype: string;
  season: string;
  log: LogEvent[];
  netWorth: number;
  xp: number;
  trades: number;
  achievements: number;
  months: number;
  survived: boolean;
}

export type VerifyResult = { ok: true } | { ok: false; reason: string };


// Mirrors the client's STANCES table (CryptoJourney.tsx) — kept local so this
// module stays importable from the server without pulling in the game screen.
type VStance = "survive" | "balanced" | "degen";
const STANCES: { id: VStance; win: number; loss: number; xp: number }[] = [
  { id: "survive", win: 0.6, loss: 0.5, xp: 60 },
  { id: "balanced", win: 1, loss: 1, xp: 40 },
  { id: "degen", win: 1.6, loss: 1.6, xp: 120 },
];
const stanceOf = (id: VStance) => STANCES.find((s) => s.id === id) ?? STANCES[1]!;

const clamp = (v: number, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const heatBonus = (streak: number, step = 0.12) => 1 + Math.min(9, Math.max(0, streak)) * step;

type VPos = {
  id: number; symbol: CoinSymbol; kind: "spot" | "perp"; dir: 1 | -1;
  lev: number; margin: number; entry: number; qty: number; where: CustodyId;
};

type VState = {
  cash: number; positions: VPos[]; nextId: number;
  risk: number; realized: number; taxDebt: number; xp: number; trades: number;
  crises: number; bossWins: number; custody: CustodyId; job: JobId; housing: HousingId;
  relics: RelicId[]; perks: string[]; statuses: string[]; fought: number[];
  stance: VStance; heat: number; streak: number; conviction: number; convictionOn: boolean;
  moves: number; cares: number; chapter: number; ended: boolean;
  riskPlay: null | { chapter: number; quality: number; stake: number; mode: string; symbol: CoinSymbol; settled: boolean; timingR: number | null };
};

export function verifyRun(input: VerifyInput): VerifyResult {
  const arch = ARCHETYPES.find((a) => a.id === input.archetype);
  if (!arch) return { ok: false, reason: "archetype" };
  const diff = DIFFICULTIES.find((d) => d.id === "NORMAL")!; // tournaments always run NORMAL rules
  const seed = hashString(`tcfb-season-${input.season}`);
  const modifier = MODIFIERS[Math.floor(det(seed, "modifier") * MODIFIERS.length) % MODIFIERS.length]!.id;
  const bias = personaFor(det(seed, "persona")).bias;
  // Mirrors the client's makeNoise for the CLASSIC market (tournament rules):
  // a capped random-walk multiplier per month, not an independent jitter.
  let drift = 0;
  const noise = Array.from({ length: 84 }, (_, i) => {
    drift = Math.max(-0.12, Math.min(0.12, drift + (det(seed, `noise-${i}`) * 2 - 1) * 0.018));
    return 1 + drift;
  });

  const coin = (symbol: string) => COINS.find((c) => c.symbol === symbol);
  const monthOf = (chapter: number) => chapterMonth(Math.min(Math.max(chapter, 0), CHAPTERS - 1));
  const rawAt = (symbol: CoinSymbol, chapter: number) => {
    const price = coin(symbol)?.prices[monthOf(chapter)] ?? 0;
    return Number.isFinite(price) && price > 0 ? price : 0;
  };
  const priceAt = (symbol: CoinSymbol, chapter: number) =>
    Math.max(rawAt(symbol, chapter) * (noise[monthOf(chapter)] ?? 1), 0.00000001);

  // Live price range for a chapter: entries use the live tape, so accept any
  // price the tape could have shown (with and without a sweep wick).
  const liveRange = (symbol: CoinSymbol, chapter: number): [number, number] => {
    const attack = attackFor(chapter, det(seed, `attack-${chapter}`), bias);
    const sweeping = attack?.id === "SWEEP";
    // Exact client livePrice() (classic market), sampled densely across the quarter.
    const a = priceAt(symbol, chapter);
    const b = priceAt(symbol, chapter + 1) || a;
    const span = Math.abs(b / a - 1);
    const phase = det(seed, `wick-${chapter}-${symbol}`) * Math.PI * 2;
    const amp = (0.35 + det(seed, `amp-${chapter}-${symbol}`) * 0.7) * Math.max(0.05, span);
    let lo = a, hi = a;
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const wick = Math.sin(t * Math.PI * 3 + phase) * amp * (1 - t * 0.55);
      for (const sw of sweeping ? [false, true] : [false]) {
        const hunt = sw ? -Math.max(0, Math.sin(t * Math.PI * 2)) * (0.05 + span * 0.5) : 0;
        const p = Math.max(a * 0.02, (a + (b - a) * t) * (1 + wick + hunt));
        if (p < lo) lo = p;
        if (p > hi) hi = p;
      }
    }
    return [lo * 0.97, hi * 1.03];
  };
  const inRange = (symbol: CoinSymbol, chapter: number, price: number) => {
    const [lo, hi] = liveRange(symbol, chapter);
    return price >= lo && price <= hi;
  };

  const st: VState = {
    cash: TOURNAMENT_RULES.cash, positions: [], nextId: 1,
    risk: 0, realized: 0, taxDebt: modifier === "debt" ? 8000 : 0, xp: 0,
    trades: 0, crises: 0, bossWins: 0, custody: "exchange", job: "dayjob",
    housing: "shared", relics: [], perks: [],
    statuses: modifier !== "straight" ? [MODIFIERS.find((m) => m.id === modifier)!.name] : [],
    fought: [], stance: "balanced", heat: 0, streak: 0, conviction: 0, convictionOn: false,
    moves: 0, cares: 0, chapter: 0, ended: false, riskPlay: null,
  };

  const power = () => relicPower(st.relics);
  const perkFee = () => (st.perks.includes("CHEAP FEES") ? 0.5 : 1);
  const grantXp = (amount: number) => Math.max(1, Math.round(amount * arch.xp * power().xpMul));
  const pnlOf = (p: VPos, price: number) =>
    p.kind === "perp" ? (price / p.entry - 1) * p.dir * p.lev * p.margin : 0;
  const valueOf = (p: VPos, price: number) =>
    p.kind === "spot" ? p.qty * price : p.margin + pnlOf(p, price);
  const netOf = (chapter: number) =>
    st.cash + st.positions.reduce((a, p) => a + valueOf(p, priceAt(p.symbol, chapter)), 0) - st.taxDebt;
  const spotValue = (chapter: number) =>
    st.positions.filter((p) => p.kind === "spot").reduce((a, p) => a + valueOf(p, priceAt(p.symbol, chapter)), 0);

  const fail = (reason: string): VerifyResult => ({ ok: false, reason });
  const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

  const settleQuarter = (from: number): void => {
    const next = from + 1;
    const startNet = netOf(from);
    const realizedBefore = st.realized;
    const preRisk = st.risk; // force-close checks the risk you ENDED the quarter with
    st.risk = clamp(st.risk - 10);

    // Quarterly risk play, paid against the real market move
    if (st.riskPlay && st.riskPlay.chapter === from && !st.riskPlay.settled) {
      const rp = st.riskPlay;
      const before = priceAt(rp.symbol, from), after = priceAt(rp.symbol, next);
      const ret = before > 0 ? after / before - 1 : 0;
      const m = clamp(ret * 3, -1, 1.4);
      const raw = rp.quality < 0.6
        ? -Math.round(rp.stake * 0.5 * power().fumbleCut)
        : m >= 0
          ? Math.round(rp.stake * m * rp.quality * power().payoutMul)
          : Math.round(rp.stake * m * (1 - rp.quality) * power().redCut);
      const edge = rp.quality >= 0.6 ? (rp.timingR ?? 0) * power().timingMul : 0;
      const paid = edge === 0 ? raw : Math.round(raw * (raw >= 0 ? 1 + edge : 1 - edge));
      st.cash = Math.max(0, st.cash + paid);
      st.riskPlay = { ...rp, settled: true };
    }

    // Liquidations on the new prices
    const still: VPos[] = [];
    for (const p of st.positions) {
      if (p.kind === "perp" && pnlOf(p, priceAt(p.symbol, next)) <= -p.margin * 0.97) {
        st.risk = clamp(st.risk + 14);
      } else still.push(p);
    }
    st.positions = still;

    // Margin call at extreme stress (checked against pre-decay risk, like the client)
    if (preRisk >= 95 && st.positions.some((p) => p.kind === "perp")) {
      for (const p of st.positions.filter((x) => x.kind === "perp")) {
        st.cash += Math.round(valueOf(p, priceAt(p.symbol, next)));
      }
      st.positions = st.positions.filter((p) => p.kind !== "perp");
      st.risk = 40;
    }

    // Funding
    const attack = attackFor(from, det(seed, `attack-${from}`), bias);
    const squeeze = attack?.id === "SQUEEZE" ? 2.2 : 1;
    const funding = Math.round(
      st.positions.filter((p) => p.kind === "perp")
        .reduce((a, p) => a + p.margin * p.lev * 0.018 * squeeze, 0));
    if (funding > 0) st.cash -= funding;

    // Boss debt
    if (st.statuses.includes("BOSS DEBT")) {
      st.cash -= Math.round(Math.max(600, startNet * 0.02));
    }

    // Exchange failure: everything on the exchange takes the haircut, perps included
    const failure = failureFor(next);
    if (failure) {
      let hit = 0;
      st.positions = st.positions.map((p) => {
        if (p.where === "exchange") {
          hit += 1;
          return { ...p, qty: p.qty * (1 - failure.haircut), margin: p.margin * (1 - failure.haircut) };
        }
        return p;
      });
      if (hit > 0) st.crises += 1;
    }

    // Hot wallet drainer (only when something is actually in the hot wallet)
    if (st.positions.some((p) => p.where === "hot") && det(seed, `drain-${next}`) < custodyOf("hot").drain) {
      st.positions = st.positions.map((p) =>
        p.where === "hot" ? { ...p, qty: p.qty * 0.88, margin: p.margin * 0.88 } : p);
    }

    // Income, debt service, living costs
    st.cash += jobOf(st.job).income;
    if (st.taxDebt > 0) {
      const paid = Math.min(st.cash, st.taxDebt);
      st.cash -= paid;
      st.taxDebt -= paid;
    }
    const rent = Math.round(housingOf(st.housing).rent * diff.cost * power().lifeCut);
    const food = Math.round((520 + Math.floor(next / 4) * 190) * diff.cost * levelPerk(levelFor(st.xp)) * power().lifeCut);
    st.cash -= rent + food;

    // Taxes
    if (isTaxChapter(next) && st.realized > 0) {
      const bill = Math.round(st.realized * TAX_RATE);
      const paid = Math.min(st.cash, bill);
      st.cash -= paid;
      if (paid < bill) st.taxDebt += Math.round((bill - paid) * 1.2);
      st.realized = 0;
    } else if (st.taxDebt > 0 && !isTaxChapter(next)) {
      st.taxDebt = Math.round(st.taxDebt * 1.05);
    }
    st.cash = Math.max(0, st.cash);

    // Life event
    if (next > 1 && det(seed, `life-${next}`) < 0.42) {
      const ev = pickLifeEvent(det(seed, `life-pick-${next}`));
      st.cash = ev.cash < 0 ? Math.max(0, st.cash + ev.cash) : st.cash + ev.cash;
    }

    const endNet = netOf(next);
    const delta = endNet - startNet;
    const idle = st.moves === 0;

    // Conviction payout
    if (st.convictionOn) {
      st.cash = Math.max(0, st.cash + Math.round(delta * 0.5));
    }

    // Stance plan + heat
    const plan = stanceOf(st.stance);
    const calledRight =
      (st.stance === "degen" && delta > 0) ||
      (st.stance === "survive" && delta < 0) ||
      (st.stance === "balanced" && Math.abs(delta) < Math.max(1, startNet * 0.03));
    let planCash = 0;
    if (delta > 0) planCash = Math.round(delta * (plan.win - 1) * (calledRight ? heatBonus(st.heat) : 1));
    else if (delta < 0) planCash = Math.round(Math.abs(delta) * (1 - plan.loss));
    st.cash = Math.max(0, st.cash + planCash);
    const newHeat = calledRight ? Math.min(9, st.heat + 1) : 0;
    st.heat = newHeat;
    st.stance = "balanced";

    // Streak
    st.streak = delta > 0 && !idle ? st.streak + 1 : 0;

    // Mission
    const activeMission = missionFor(from);
    const missionWon =
      activeMission.id === "grow" ? delta > 0
        : activeMission.id === "spread" ? new Set(st.positions.map((p) => p.symbol)).size >= 3
          : activeMission.id === "sniper" ? st.moves === 1
            : activeMission.id === "profit8" ? endNet >= startNet * 1.08
              : activeMission.id === "cashout" ? st.trades > 0 && st.realized !== realizedBefore
                : activeMission.id === "patience" ? st.moves === 0
                  : delta > 0 && st.moves > 0;

    // XP
    st.xp += grantXp(
      (idle ? 0 : XP.chapter) +
      (delta >= 0 && !idle ? XP.greenQuarter : 0) +
      st.streak * XP.streakStep +
      (missionWon ? activeMission.reward : 0) +
      (calledRight ? plan.xp + newHeat * 25 : 0));

    // Conviction meter
    st.conviction = st.convictionOn ? 0 : clamp(st.conviction + (delta > 0 && !idle ? 22 : delta < 0 ? -12 : 4));
    st.convictionOn = false;
    st.moves = 0;
    st.cares = 0;
    st.chapter = next;
  };

  for (let i = 0; i < input.log.length; i++) {
    const e = input.log[i]!;
    if (st.ended) return fail(`event-after-end@${i}`);
    if (typeof e.c !== "number" || e.c < 0) return fail(`chapter-order@${i}`);
    const c = e.c;
    if (e.t === "quarter") {
      if (c !== st.chapter) return fail(`quarter-order@${i}`);
      if (typeof e.n === "number" && !near(netOf(c), e.n, Math.max(250, Math.abs(e.n) * 0.005))) {
        return fail(`quarter-net@${c}:${Math.round(netOf(c))}vs${e.n}`);
      }
      settleQuarter(c);
      if (netOf(st.chapter) <= 0) st.ended = true;
      continue;
    }
    if (c !== st.chapter) return fail(`stale-chapter@${i}`);

    switch (e.t) {
      case "spot": {
        const sym = e.s as CoinSymbol;
        if (!coin(sym)) return fail(`spot-symbol@${i}`);
        if (e.size < 50 || e.size + e.fee > st.cash + 1) return fail(`spot-size@${i}`);
        if (!inRange(sym, c, e.price)) return fail(`spot-price@${i}`);
        const fee = Math.round(e.size * custodyOf(st.custody).fee * perkFee());
        if (!near(e.fee, fee, 2)) return fail(`spot-fee@${i}`);
        st.cash -= e.size + e.fee;
        st.positions.push({ id: st.nextId++, symbol: sym, kind: "spot", dir: 1, lev: 1, margin: e.size, entry: e.price, qty: e.size / e.price, where: st.custody });
        st.moves += 1; st.trades += 1; st.xp += grantXp(XP.trade);
        break;
      }
      case "perp": {
        const sym = e.s as CoinSymbol;
        if (!coin(sym)) return fail(`perp-symbol@${i}`);
        if (e.margin < 50 || e.margin > st.cash + 1) return fail(`perp-margin@${i}`);
        if (e.lev < 2 || e.lev > 50 || (e.dir !== 1 && e.dir !== -1)) return fail(`perp-shape@${i}`);
        if (!inRange(sym, c, e.price)) return fail(`perp-price@${i}`);
        st.cash -= e.margin;
        st.positions.push({ id: st.nextId++, symbol: sym, kind: "perp", dir: e.dir, lev: e.lev, margin: e.margin, entry: e.price, qty: 0, where: "exchange" });
        st.risk = clamp(st.risk + e.lev * 6 * arch.risk);
        st.moves += 1; st.trades += 1; st.xp += grantXp(XP.trade + e.lev * 8);
        break;
      }
      case "close": {
        const pos = st.positions.find((p) => p.id === e.id);
        if (!pos) return fail(`close-missing@${i}`);
        if (e.frac <= 0 || e.frac > 1 || e.q < 0 || e.q > 1) return fail(`close-shape@${i}`);
        const price = pos.where === "cold" ? priceAt(pos.symbol, c - 1) : e.price;
        if (pos.where !== "cold" && !inRange(pos.symbol, c, e.price)) return fail(`close-price@${i}`);
        const slip = 0.94 + e.q * 0.08;
        const whole = valueOf(pos, price) * slip;
        const back = Math.round(whole * e.frac);
        if (!near(e.back, back, Math.max(2, Math.abs(back) * 0.02))) return fail(`close-back@${i}`);
        const fee = Math.round(back * custodyOf(pos.where).fee * perkFee());
        if (!near(e.fee, fee, Math.max(2, Math.abs(fee) * 0.02))) return fail(`close-fee@${i}`);
        const cost = pos.margin * e.frac;
        const gain = back - fee - cost;
        st.cash += back - fee;
        st.realized += gain;
        st.trades += 1;
        if (pos.kind === "perp") st.risk = clamp(st.risk - pos.lev * 4 * e.frac);
        if (e.frac >= 0.999) st.positions = st.positions.filter((p) => p.id !== pos.id);
        else { pos.margin -= cost; pos.qty *= 1 - e.frac; }
        if (pos.where === "cold") st.moves += 1;
        st.xp += grantXp((gain >= 0 ? XP.closeWin : XP.closeLoss) + (e.q >= 1 ? XP_EXTRA.minigamePerfect : e.q > 0.5 ? XP_EXTRA.minigameOk : 0));
        break;
      }
      case "risk": {
        const play = chapterPlayFor(c);
        if (play.mode !== e.mode) return fail(`risk-mode@${i}`);
        if (play.mode === "HUNT" || play.mode === "BOSS DUEL") return fail(`risk-kind@${i}`);
        const sym = e.sym as CoinSymbol;
        if (!coin(sym)) return fail(`risk-symbol@${i}`);
        if (play.mode !== "ACCUMULATE" && play.mode !== "MOMENTUM" && sym !== "BTC") return fail(`risk-btc@${i}`);
        const expected = Math.min(Math.max(400, Math.round(netOf(c) * 0.03)), Math.max(0, Math.round(st.cash * 0.25)));
        if (!near(e.stake, expected, Math.max(10, expected * 0.12))) return fail(`risk-stake@${i}`);
        if (e.q < 0 || e.q > 1) return fail(`risk-q@${i}`);
        st.riskPlay = { chapter: c, quality: e.q, stake: e.stake, mode: play.mode, symbol: sym, settled: false, timingR: e.timingR };
        if (play.mode !== "ACCUMULATE") st.moves += 1;
        // client adds this XP raw (no multipliers) and bumps HEAT on a perfect
        st.xp += e.q >= 0.9 ? 700 : e.q >= 0.6 ? 450 : 120;
        st.heat = e.q >= 0.9 ? st.heat + 1 : e.q >= 0.6 ? st.heat : 0;
        break;
      }
      case "presale": {
        const card = presaleFor(c);
        if (!card || card.name !== e.name) return fail(`presale-card@${i}`);
        if (e.size < card.min || e.size > st.cash + 1) return fail(`presale-size@${i}`);
        if (e.q < 0 || e.q > 1) return fail(`presale-q@${i}`);
        st.moves += 1;
        if (e.q < 0.2) {
          const gas = Math.round(e.size * 0.06);
          if (!near(e.gas ?? -1, gas, 2) || e.back !== 0) return fail(`presale-gas@${i}`);
          st.cash = Math.max(0, st.cash - gas);
        } else {
          const rugged = det(seed, `rug-${c}-${card.name}`) < card.rug / (arch.risk || 1);
          const multi = rugged ? 0.08
            : (card.upside[0] + det(seed, `multi-${c}-${card.name}`) * (card.upside[1] - card.upside[0])) * (0.85 + e.q * 0.3);
          const back = Math.round(e.size * multi);
          if (!near(e.back, back, Math.max(2, Math.abs(back) * 0.02))) return fail(`presale-back@${i}`);
          st.cash += back - e.size;
          st.realized += back - e.size;
          st.trades += 1;
          st.xp += grantXp(rugged ? XP.presaleRug : XP.presaleHit);
        }
        st.risk = clamp(st.risk + 10);
        st.riskPlay = { chapter: c, quality: e.q, stake: e.size, mode: "HUNT", symbol: "BTC", settled: true, timingR: null };
        break;
      }
      case "fight": {
        const fight = bossFightFor(c);
        if (!fight || st.fought.includes(c)) return fail(`fight-card@${i}`);
        if (e.wager < 200 || e.wager > st.cash + 1) return fail(`fight-wager@${i}`);
        if (e.q < 0 || e.q > 1) return fail(`fight-q@${i}`);
        st.fought.push(c);
        st.riskPlay = { chapter: c, quality: e.q, stake: e.wager, mode: "BOSS DUEL", symbol: "BTC", settled: true, timingR: null };
        if (e.q >= 0.9) {
          const won = Math.round(e.wager * 2 * power().duelMul);
          if (e.delta !== won) return fail(`fight-delta@${i}`);
          st.cash += won;
          st.perks.push(fight.perk);
          st.bossWins += 1;
          st.conviction = clamp(st.conviction + 35);
          st.xp += grantXp(XP_EXTRA.escape * 2);
        } else if (e.q >= 0.5) {
          if (e.delta !== 0) return fail(`fight-delta@${i}`);
          st.conviction = clamp(st.conviction + 10);
          st.xp += grantXp(XP_EXTRA.minigameOk);
        } else {
          if (e.delta !== -e.wager) return fail(`fight-delta@${i}`);
          st.cash = Math.max(0, st.cash - e.wager);
          st.conviction = 0;
          st.convictionOn = false;
        }
        break;
      }
      case "decision": {
        const card = decisionForChapter(c);
        const sit = situationFor(c);
        const inCard = card?.options.find((o) => o.label === e.label);
        const option = inCard ?? sit?.options.find((o) => o.label === e.label);
        if (!option) return fail(`decision-option@${i}`);
        if (option.bagMul) st.positions = st.positions.map((p) => ({ ...p, margin: p.margin * option.bagMul!, qty: p.qty * option.bagMul! }));
        st.cash = Math.max(0, Math.round(st.cash * (option.cashMul ?? 1) + (option.cash ?? 0)));
        if (inCard) st.crises += 1;
        st.xp += grantXp(option.xp ?? (inCard ? XP.crisis : 200));
        break;
      }
      case "skill": {
        const check = skillCheckFor(c);
        const stake = Math.max(300, Math.round(netOf(c) * 0.02));
        const expected = e.q >= 0.6 ? Math.round(stake * e.q) : -Math.round(stake * 0.5);
        if (e.q < 0 || e.q > 1) return fail(`skill-q@${i}`);
        if (!near(e.delta, expected, Math.max(4, Math.abs(expected) * 0.12))) return fail(`skill-delta@${i}`);
        st.cash = Math.max(0, st.cash + e.delta);
        st.xp += Math.round(check.reward * e.q); // client adds raw, no multipliers
        break;
      }
      case "crash": {
        if (!crashFor(c)) return fail(`crash-card@${i}`);
        if (e.q < 0 || e.q > 1) return fail(`crash-q@${i}`);
        if (e.q >= 0.9) st.xp += grantXp(XP_EXTRA.escape);
        else if (e.q >= 0.5) {
          st.positions = st.positions.map((p) => ({ ...p, qty: p.qty * 0.94, margin: p.margin * 0.94 }));
          st.xp += grantXp(XP_EXTRA.minigameOk);
        } else {
          st.positions = st.positions.map((p) => ({ ...p, qty: p.qty * 0.84, margin: p.margin * 0.84 }));
        }
        break;
      }
      case "seedphrase": {
        if (e.q < 0 || e.q > 1) return fail(`seed-q@${i}`);
        if (e.q >= 0.9) st.xp += grantXp(XP_EXTRA.escape);
        else if (e.q >= 0.5) st.cash = Math.max(0, st.cash - 400);
        else st.positions = st.positions.map((p) =>
          p.where === "cold" ? { ...p, qty: p.qty * 0.5, margin: p.margin * 0.5 } : p);
        break;
      }
      case "care": {
        const cost = careCost(e.kind, c, diff.id);
        if (e.cost !== cost) return fail(`care-cost@${i}`);
        if (st.cares >= diff.caps || st.cash < cost) return fail(`care-cap@${i}`);
        st.cash -= cost;
        st.moves += 1; st.cares += 1;
        st.xp += grantXp(XP.survive);
        break;
      }
      case "custody": {
        const to = e.to as CustodyId;
        if (!["exchange", "hot", "cold"].includes(to)) return fail(`custody-to@${i}`);
        if (modifier === "keys" && to === "cold") return fail(`custody-locked@${i}`);
        const fee = Math.round(spotValue(c) * 0.004);
        if (!near(e.fee, fee, Math.max(2, fee * 0.02))) return fail(`custody-fee@${i}`);
        if (st.cash < fee) return fail(`custody-cash@${i}`);
        st.cash -= fee;
        st.positions = st.positions.map((p) => p.kind === "spot" ? { ...p, where: to } : p);
        st.custody = to;
        st.moves += 1;
        st.xp += grantXp(XP_EXTRA.custody);
        break;
      }
      case "life": {
        st.job = e.job as JobId;
        st.housing = e.housing as HousingId;
        st.moves += 1;
        st.xp += grantXp(XP_EXTRA.life);
        break;
      }
      case "offer": {
        const attack = attackFor(c, det(seed, `attack-${c}`), bias);
        if (attack?.id !== "OFFER") return fail(`offer-attack@${i}`);
        const expected = Math.max(2000, Math.round(netOf(c) * 0.25));
        if (!near(e.amount, expected, Math.max(50, expected * 0.15))) return fail(`offer-amount@${i}`);
        st.cash += e.amount;
        if (!st.statuses.includes("BOSS DEBT")) st.statuses.push("BOSS DEBT");
        break;
      }
      case "loot": {
        if (c < 1) return fail(`loot-chapter@${i}`);
        const cards = lootDraw((salt: string) => det(seed, salt), c);
        if (!cards.some((card) => card.kind === e.kind)) return fail(`loot-kind@${i}`);
        if (e.kind === "cash" || e.kind === "tcfb") {
          const expected = Math.max(500, Math.round(netOf(c) * 0.02));
          if (!near(e.bonus, expected, Math.max(20, expected * 0.15))) return fail(`loot-bonus@${i}`);
          st.cash += e.bonus;
          if (e.kind === "tcfb") st.xp += grantXp(250);
        } else if (e.kind === "xp") st.xp += grantXp(400);
        else if (e.kind === "move") st.perks.push("+1 MOVE");
        break;
      }
      case "relic": {
        if (!relicChapter(c)) return fail(`relic-chapter@${i}`);
        const offer = relicOffer(st.relics, (salt: string) => det(seed, salt), c);
        if (!offer.some((r) => r.id === e.id)) return fail(`relic-offer@${i}`);
        st.relics.push(e.id as RelicId);
        st.xp += grantXp(300);
        break;
      }
      case "conviction": {
        if (e.on && st.conviction < 100) return fail(`conviction-gate@${i}`);
        st.convictionOn = e.on;
        break;
      }
      case "stance": {
        if (!["survive", "balanced", "degen"].includes(e.stance)) return fail(`stance@${i}`);
        st.stance = e.stance as VStance;
        break;
      }
      case "bank": {
        st.moves += 1;
        break;
      }
      case "signal": {
        const expected = Math.max(150, Math.round(netOf(c) * 0.01));
        if (!near(e.fee, expected, Math.max(10, expected * 0.15))) return fail(`signal-fee@${i}`);
        if (st.cash < e.fee) return fail(`signal-cash@${i}`);
        st.cash -= e.fee;
        break;
      }
      case "sellout": {
        for (const p of st.positions) {
          const gross = Math.round(valueOf(p, priceAt(p.symbol, c)) * 0.96);
          const fee = Math.round(gross * custodyOf(p.where).fee);
          st.cash += gross - fee;
          st.realized += gross - fee - p.margin;
        }
        st.positions = [];
        if (st.realized > 0) st.cash -= Math.round(st.realized * TAX_RATE);
        if (st.taxDebt > 0) {
          const paid = Math.min(Math.max(0, st.cash), st.taxDebt);
          st.cash -= paid;
          st.taxDebt -= paid;
        }
        st.cash = Math.max(0, Math.round(st.cash));
        st.ended = true;
        break;
      }
      default:
        return fail(`unknown@${i}`);
    }
  }

  // Final cross-checks against the reported result
  const finalNet = netOf(st.chapter);
  if (!near(finalNet, input.netWorth, Math.max(250, Math.abs(input.netWorth) * 0.005))) {
    return fail(`net-mismatch:${Math.round(finalNet)}vs${Math.round(input.netWorth)}`);
  }
  if (Math.abs(st.xp - input.xp) > 300) return fail(`xp-mismatch:${st.xp}vs${input.xp}`);
  if (st.trades !== input.trades) return fail(`trades-mismatch:${st.trades}vs${input.trades}`);
  if (input.achievements > st.crises + 1) return fail(`crises-mismatch`);
  const expectedMonths = monthsSurvived(st.chapter);
  if (Math.abs(expectedMonths - input.months) > 3) return fail(`months-mismatch:${expectedMonths}vs${input.months}`);
  if (input.survived && finalNet <= 0) return fail(`survived-broke`);

  return { ok: true };
}
