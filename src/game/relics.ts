/**
 * Roguelike relics. Every few quarters the run offers three crypto artefacts and
 * the player keeps one forever. Relics never touch historical prices or the
 * score formula — they only bend the player's own numbers: how much a risk
 * moment stakes, how much a fumble costs, how fast HEAT climbs, and how loud
 * ordinary life is. Two relics that fit each other unlock a named synergy, so
 * collecting is a plan instead of a shopping list.
 */

export type RelicId =
  | "laser_eyes" | "diamond_gloves" | "cold_vault" | "mev_bot" | "heat_core"
  | "whale_radar" | "gas_burner" | "copium_tank" | "ramen_reserve" | "boss_tax"
  | "airdrop_farm" | "paper_shredder" | "titanium_vault";

export type Relic = {
  id: RelicId;
  name: string;
  glyph: string;
  /** What it does, in the player's words. */
  line: string;
  /** The exact number, so nothing is mysterious. */
  effect: string;
  tag: "PAYOUT" | "SKILL" | "LIFE" | "HEAT";
};

export const RELICS: Relic[] = [
  { id: "laser_eyes", name: "LASER EYES", glyph: "👁", tag: "PAYOUT", line: "You see the move before the room does.", effect: "Winning risk moments pay +15%." },
  { id: "diamond_gloves", name: "DIAMOND GLOVES", glyph: "💎", tag: "SKILL", line: "Your hands stop shaking when it matters.", effect: "A fumbled skill moment costs 25% less." },
  { id: "cold_vault", name: "COLD VAULT", glyph: "🧊", tag: "LIFE", line: "Keys offline, nerves offline.", effect: "Rent and living costs drop 25%." },
  { id: "mev_bot", name: "MEV BOT", glyph: "🤖", tag: "SKILL", line: "A little machine cleans up behind you.", effect: "A fumble never grades below 0.35, so misses cost less." },
  { id: "heat_core", name: "HEAT CORE", glyph: "🔥", tag: "HEAT", line: "Every correct read burns hotter.", effect: "Each HEAT step is worth +6% more." },
  { id: "whale_radar", name: "WHALE RADAR", glyph: "🐋", tag: "PAYOUT", line: "You feel the wick before it prints.", effect: "Your entry timing counts double." },
  { id: "gas_burner", name: "GAS BURNER", glyph: "⛽", tag: "PAYOUT", line: "You size up when the block is yours.", effect: "Risk moments stake 25% more, win or lose." },
  { id: "copium_tank", name: "COPIUM TANK", glyph: "🫧", tag: "LIFE", line: "It is fine. Everything is fine.", effect: "Stress grows 35% slower." },
  { id: "ramen_reserve", name: "RAMEN RESERVE", glyph: "🍜", tag: "LIFE", line: "A pantry that outlives the bear.", effect: "Hunger grows 50% slower." },
  { id: "boss_tax", name: "BOSS TAX", glyph: "👑", tag: "PAYOUT", line: "Beating him costs him extra.", effect: "Duel winnings pay +50%." },
  { id: "airdrop_farm", name: "AIRDROP FARM", glyph: "🪂", tag: "SKILL", line: "Twelve wallets, one farmer.", effect: "All XP gains +25%." },
  { id: "paper_shredder", name: "PAPER SHREDDER", glyph: "📄", tag: "SKILL", line: "Losses get filed, not felt.", effect: "Red quarters cut your damage by another 20%." },
];

/** Unlockable relic (BOSS SLAYER). Kept out of RELICS so tournament offers and the replay never change. */
export const BONUS_RELIC: Relic = { id: "titanium_vault", name: "TITANIUM VAULT", glyph: "🛡", tag: "LIFE", line: "Earned by beating him face to face.", effect: "Stress grows 30% slower." };

export const relicOf = (id: string): Relic | undefined => RELICS.find((r) => r.id === id) ?? (id === BONUS_RELIC.id ? BONUS_RELIC : undefined);

export type Synergy = { name: string; needs: RelicId[]; line: string };

export const SYNERGIES: Synergy[] = [
  { name: "LEVERAGE OF BELIEF", needs: ["laser_eyes", "heat_core"], line: "Conviction compounds: winning moments pay another +20%." },
  { name: "ZEN DEGEN", needs: ["diamond_gloves", "copium_tank"], line: "Nothing rattles you: fumbles cost another 20% less." },
  { name: "SNIPER RIG", needs: ["whale_radar", "gas_burner"], line: "Big size, perfect entries: timing counts triple." },
  { name: "OFF THE GRID", needs: ["ramen_reserve", "cold_vault"], line: "Life gets cheap: another 20% off rent and food." },
  { name: "HOUSE EDGE", needs: ["boss_tax", "mev_bot"], line: "The machine fights him for you: a fumble never grades below 0.5, so it hurts far less." },
];

export type RelicPower = {
  payoutMul: number;
  fumbleCut: number;
  lifeCut: number;
  heatStep: number;
  skillFloor: number;
  timingMul: number;
  stakeMul: number;
  stressCut: number;
  hungerCut: number;
  xpMul: number;
  duelMul: number;
  redCut: number;
  synergies: Synergy[];
};

/** One place turns a bag of relics into the numbers the run actually uses. */
export const relicPower = (owned: string[]): RelicPower => {
  const has = (id: RelicId) => owned.includes(id);
  const active = SYNERGIES.filter((s) => s.needs.every((n) => owned.includes(n)));
  const on = (name: string) => active.some((s) => s.name === name);

  let payoutMul = 1;
  if (has("laser_eyes")) payoutMul += 0.15;
  if (on("LEVERAGE OF BELIEF")) payoutMul += 0.2;

  let fumbleCut = 1;
  if (has("diamond_gloves")) fumbleCut *= 0.75;
  if (on("ZEN DEGEN")) fumbleCut *= 0.8;

  let lifeCut = 1;
  if (has("cold_vault")) lifeCut *= 0.75;
  if (on("OFF THE GRID")) lifeCut *= 0.8;

  let timingMul = 1;
  if (has("whale_radar")) timingMul = 2;
  if (on("SNIPER RIG")) timingMul = 3;

  let skillFloor = 0;
  if (has("mev_bot")) skillFloor = 0.35;
  if (on("HOUSE EDGE")) skillFloor = 0.5;

  return {
    payoutMul,
    fumbleCut,
    lifeCut,
    heatStep: has("heat_core") ? 0.18 : 0.12,
    skillFloor,
    timingMul,
    stakeMul: has("gas_burner") ? 1.25 : 1,
    stressCut: (has("copium_tank") ? 0.65 : 1) * (has("titanium_vault") ? 0.7 : 1),
    hungerCut: has("ramen_reserve") ? 0.5 : 1,
    xpMul: has("airdrop_farm") ? 1.25 : 1,
    duelMul: has("boss_tax") ? 1.5 : 1,
    redCut: has("paper_shredder") ? 0.8 : 1,
    synergies: active,
  };
};

/** Quarters that hand out a relic: early, then every fourth quarter. */
export const relicChapter = (chapter: number): boolean => chapter === 2 || (chapter > 2 && chapter % 4 === 0);

/**
 * Three offers, deterministic per chapter and seed, never a relic you own and
 * never a duplicate inside one offer.
 */
export const relicOffer = (owned: string[], roll: (key: string) => number, chapter: number): Relic[] => {
  const pool = RELICS.filter((r) => !owned.includes(r.id));
  const picked: Relic[] = [];
  let guard = 0;
  while (picked.length < Math.min(3, pool.length) && guard < 60) {
    const idx = Math.floor(roll(`relic-${chapter}-${guard}`) * pool.length) % Math.max(1, pool.length);
    const card = pool[idx];
    guard += 1;
    if (card && !picked.some((p) => p.id === card.id)) picked.push(card);
  }
  return picked;
};
