export type CoinSymbol = "BTC" | "ETH" | "SOL" | "DOGE" | "LINK" | "ADA" | "AVAX" | "SHIB" | "PEPE" | "UNI" | "DOT" | "MATIC" | "BONK" | "WIF";

export type Coin = {
  symbol: CoinSymbol;
  name: string;
  color: "cyan" | "pink" | "yellow";
  prices: number[];
};

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const COINS: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", color: "yellow", prices: [7200,9600,6400,8600,9500,9100,11300,11600,10800,13800,19700,28900,37100,45100,58900,54900,37400,35800,43800,47100,48100,61300,56900,46200,38400,38700,45500,38500,31700,20000,23300,20200,19400,20400,17100,16500,23100,24600,28400,29200,28000,30400,29200,26900,26900,34500,37700,42200,42500,61200,71300,60600,67500,62700,64600,58900,63300,70200,96400,93500,102400,84400,82500,94200,104600,107100,115700,108800,114000,110000,86000,87000,85000,75000,68000,72000,78000,82000,88000,95000,105000,113000,125000,138000] },
  { symbol: "ETH", name: "Ethereum", color: "cyan", prices: [130,220,135,185,215,230,345,430,360,385,510,740,1310,1420,1920,2770,2630,2270,2530,3430,3000,4290,4630,3680,2690,2790,3280,2820,1810,1070,1680,1630,1580,1580,1290,1200,1580,1610,1830,1900,1870,1930,1860,1650,1670,1810,2050,2280,2280,3390,3640,3010,3760,3440,3230,2510,2600,2510,3700,3350,2520,2220,1820,1790,2530,2490,3700,4390,4150,3800,2900,3000,2950,2400,2100,2250,2500,2650,2800,2900,3200,3500,3900,4300] },
  { symbol: "SOL", name: "Solana", color: "pink", prices: [0,0,.6,.7,.55,.8,1.6,3.2,3.5,2.3,1.9,1.5,4.5,13.5,19,30,35,32,33,110,145,200,195,170,90,96,102,88,42,33,39,32,33,29,13,9.6,24,22,20,22,20,15,24,19,19,32,59,101,96,128,187,132,166,146,166,131,155,169,237,190,215,140,125,148,155,150,183,204,195,175,125,132,128,95,78,84,90,84,79,73,88,96,108,122] },
  { symbol: "DOGE", name: "Dogecoin", color: "yellow", prices: [.002,.0025,.0018,.0022,.0025,.0023,.003,.0032,.0027,.0026,.0035,.0045,.01,.05,.06,.3,.32,.25,.2,.28,.24,.26,.21,.17,.14,.12,.14,.13,.08,.067,.069,.06,.06,.126,.1,.07,.086,.081,.075,.079,.072,.067,.075,.062,.06,.068,.08,.09,.08,.12,.2,.14,.16,.12,.11,.096,.11,.16,.42,.32,.33,.2,.17,.18,.19,.16,.2,.21,.24,.17,.14,.15,.14,.11,.09,.1,.11,.1,.095,.09,.11,.13,.15,.18] },
];

export const EVENTS: Record<number, { title: string; body: string; tone: "danger" | "win" | "boss" }> = {
  2: { title: "BLACK THURSDAY", body: "COVID panic nukes the market. The Boss wants to know if you still have hands.", tone: "danger" },
  4: { title: "THE HALVING", body: "Bitcoin supply tightens. Conviction is cheap before the crowd arrives.", tone: "win" },
  12: { title: "TESLA BUYS BTC", body: "Institutions enter the arena. Euphoria is now a weapon.", tone: "win" },
  16: { title: "MINING BAN", body: "China hits the miners. Weak hands are already running.", tone: "danger" },
  21: { title: "BTC: $69K", body: "Everyone is a genius at the top. The Boss is smiling.", tone: "boss" },
  28: { title: "LUNA COLLAPSE", body: "The stablecoin is not stable. Contagion is spreading.", tone: "danger" },
  33: { title: "FTX COLLAPSE", body: "Trust is dead. Cash suddenly feels like a position.", tone: "danger" },
  39: { title: "PEPE ARRIVES", body: "A frog enters the timeline. Fundamentals have left the chat.", tone: "win" },
  49: { title: "ETF FEVER", body: "Wall Street wants in. The next chapter starts now.", tone: "win" },
  58: { title: "BTC BREAKS $100K", body: "The impossible print is on the board. Do not blink.", tone: "boss" },
  71: { title: "THE FINAL CYCLE", body: "One year remains. Every choice now writes your rank.", tone: "boss" },
};

export const XP_LEVELS = [0, 400, 1200, 2600, 4800, 8000, 12500, 18500, 26000, 36000, 50000, 70000, 95000, 130000, 180000, 250000];

export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: Math.abs(value) < 1 ? 4 : 0 }).format(value);

export const levelFor = (xp: number) => Math.max(1, XP_LEVELS.filter((threshold) => xp >= threshold).length);
export type Archetype = "degen" | "trader" | "influencer" | "hodler";
export type Difficulty = "EASY" | "NORMAL" | "BOSS";
export type BaseMode = "classic" | "chaos" | "historical";

export const ARCHETYPES: { id: Archetype; name: string; cash: number; blurb: string; risk: number; xp: number }[] = [
  { id: "degen", name: "DEGEN", cash: 6000, blurb: "Thin bankroll, fat payouts. Launch cards pay 40% more — and rug you harder.", risk: 1.25, xp: 1.1 },
  { id: "trader", name: "TRADER", cash: 10000, blurb: "Balanced stack, cheaper trades, calmer nerves. The professional route.", risk: 1, xp: 1 },
  { id: "influencer", name: "INFLUENCER", cash: 7500, blurb: "The crowd follows you. More XP per move, but stress builds fast.", risk: 1.1, xp: 1.25 },
  { id: "hodler", name: "HODLER", cash: 12000, blurb: "Deep pockets, iron stomach. Hunger and stress grow slower.", risk: 0.85, xp: 0.9 },
];

export const DIFFICULTIES: { id: Difficulty; name: string; blurb: string; cost: number; risk: number }[] = [
  { id: "EASY", name: "EASY", blurb: "Cheap living, forgiving markets.", cost: 0.8, risk: 0.85 },
  { id: "NORMAL", name: "NORMAL", blurb: "The honest run.", cost: 1, risk: 1 },
  { id: "BOSS", name: "BOSS", blurb: "Costs bite, rugs are everywhere.", cost: 1.4, risk: 1.3 },
];

export const MODES: { id: BaseMode; name: string; blurb: string; xpLabel: string }[] = [
  { id: "classic", name: "CLASSIC", blurb: "Real history with a little noise.", xpLabel: "1.00x XP" },
  { id: "historical", name: "HISTORICAL", blurb: "Exact timeline. Knowledge pays less.", xpLabel: "0.75x XP" },
  { id: "chaos", name: "CHAOS", blurb: "Prices swing wild. Highest reward.", xpLabel: "1.25x XP" },
];

export const COUNTRIES = [
  "DE", "CH", "AT", "GB", "USA", "CA", "BR", "AR", "FR", "IT", "ES", "PT",
  "NL", "PL", "SE", "TR", "AE", "NG", "ZA", "IN", "SG", "JP", "KR", "AU",
] as const;

export type FlagKind = "h" | "v" | "cross" | "circle" | "usa";
export const COUNTRY_FLAGS: Record<string, { name: string; kind: FlagKind; colors: string[] }> = {
  DE: { name: "Germany", kind: "h", colors: ["#000000", "#dd0000", "#ffce00"] },
  CH: { name: "Switzerland", kind: "cross", colors: ["#d52b1e", "#ffffff"] },
  AT: { name: "Austria", kind: "h", colors: ["#ed2939", "#ffffff", "#ed2939"] },
  GB: { name: "United Kingdom", kind: "cross", colors: ["#012169", "#ffffff"] },
  USA: { name: "United States", kind: "usa", colors: ["#b22234", "#ffffff", "#3c3b6e"] },
  CA: { name: "Canada", kind: "v", colors: ["#ff0000", "#ffffff", "#ff0000"] },
  BR: { name: "Brazil", kind: "circle", colors: ["#009c3b", "#ffdf00"] },
  AR: { name: "Argentina", kind: "h", colors: ["#74acdf", "#ffffff", "#74acdf"] },
  FR: { name: "France", kind: "v", colors: ["#002395", "#ffffff", "#ed2939"] },
  IT: { name: "Italy", kind: "v", colors: ["#009246", "#ffffff", "#ce2b37"] },
  ES: { name: "Spain", kind: "h", colors: ["#aa151b", "#f1bf00", "#aa151b"] },
  PT: { name: "Portugal", kind: "v", colors: ["#046a38", "#da291c", "#da291c"] },
  NL: { name: "Netherlands", kind: "h", colors: ["#ae1c28", "#ffffff", "#21468b"] },
  PL: { name: "Poland", kind: "h", colors: ["#ffffff", "#ffffff", "#dc143c"] },
  SE: { name: "Sweden", kind: "cross", colors: ["#006aa7", "#fecc00"] },
  TR: { name: "Turkey", kind: "circle", colors: ["#e30a17", "#ffffff"] },
  AE: { name: "United Arab Emirates", kind: "h", colors: ["#00732f", "#ffffff", "#000000"] },
  NG: { name: "Nigeria", kind: "v", colors: ["#008751", "#ffffff", "#008751"] },
  ZA: { name: "South Africa", kind: "h", colors: ["#007a4d", "#ffffff", "#de3831"] },
  IN: { name: "India", kind: "h", colors: ["#ff9933", "#ffffff", "#138808"] },
  SG: { name: "Singapore", kind: "h", colors: ["#ed2939", "#ffffff", "#ffffff"] },
  JP: { name: "Japan", kind: "circle", colors: ["#ffffff", "#bc002d"] },
  KR: { name: "South Korea", kind: "circle", colors: ["#ffffff", "#cd2e3a"] },
  AU: { name: "Australia", kind: "cross", colors: ["#012169", "#ffffff"] },
};
export type Country = (typeof COUNTRIES)[number];

export type ChanceKind = "launch" | "airdrop" | "perp" | "tax";
export type Chance = { kind: ChanceKind; title: string; body: string; stake: number; actionLabel: string };

export const CHANCES: Chance[] = [
  { kind: "launch", title: "STEALTH LAUNCH", body: "An unaudited token opens for 60 seconds. The chart could 10x — or the deployer takes everything.", stake: 0.2, actionLabel: "SNIPE 20%" },
  { kind: "launch", title: "PRESALE WHITELIST", body: "You got a whitelist spot nobody can verify. Fill it or walk away.", stake: 0.15, actionLabel: "FILL 15%" },
  { kind: "airdrop", title: "AIRDROP FARM", body: "Bridge and farm this chain for a season. Costs gas now, might print later.", stake: 0.08, actionLabel: "FARM 8%" },
  { kind: "perp", title: "LEVERAGE DESK", body: "10x perps are open. One clean candle doubles your stake, one wick liquidates it.", stake: 0.12, actionLabel: "LONG 10x" },
  { kind: "tax", title: "THE BOSS COLLECTS", body: "The Boss demands tribute this month. Pay him, or take the stress of refusing.", stake: 0.06, actionLabel: "PAY TRIBUTE" },
];

export const RANK_TITLES = ["Early Rekt", "Certified Rekt", "Late Game Rekt", "Solid Survivor", "Top 8% Survivor", "Top 3% Diamond Hands", "Final Boss Material"] as const;

export const rankTitle = (net: number, months: number, survived: boolean) => {
  if (!survived) return months < 18 ? "Early Rekt" : months < 54 ? "Certified Rekt" : "Late Game Rekt";
  if (net > 5_000_000) return "Final Boss Material";
  if (net > 1_000_000) return "Top 3% Diamond Hands";
  if (net > 250_000) return "Top 8% Survivor";
  return "Solid Survivor";
};

// ---- extra markets: real quarter-end history 2020-2026 ----------------------
// One value per quarter (Q1 2020 -> Q1 2027 = 29 anchors), taken from real
// quarter-end prices, so every crash of the cycle is actually in the chart.
// Months inside a quarter are interpolated with a small deterministic wiggle.
const WIG = [1, 1.035, 0.972];

const fromQuarters = (q: number[]) =>
  Array.from({ length: 84 }, (_, m) => {
    const qi = Math.floor(m / 3);
    const a = q[qi] ?? 0;
    const b = q[qi + 1] ?? a;
    if (!a) return 0;
    if (!b) return a;
    const t = (m % 3) / 3;
    const raw = Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t) * (WIG[m % 3] ?? 1);
    return raw < 0.01 ? Number(raw.toPrecision(3)) : Number(raw.toFixed(raw < 1 ? 4 : 2));
  });

COINS.push(
  { symbol: "LINK", name: "Chainlink", color: "cyan", prices: fromQuarters([2.1,4.7,10.4,11.3,29,19,25,20,15,6.6,7.8,5.7,7.2,6.2,7.6,15,18,14,11,22,14,13,22,15,18,22,26,30,32]) },
  { symbol: "ADA", name: "Cardano", color: "cyan", prices: fromQuarters([0.034,0.078,0.1,0.18,1.2,1.4,2.2,1.31,1.16,0.46,0.43,0.25,0.34,0.28,0.25,0.6,0.59,0.39,0.35,0.85,0.65,0.58,0.8,0.55,0.6,0.7,0.85,1,1.05]) },
  { symbol: "DOT", name: "Polkadot", color: "pink", prices: fromQuarters([0,0,4.5,9.3,19,15,29,26,17.7,6.7,6.4,4.5,6.1,5.2,4.1,8.2,9.2,6,4.2,7.5,4.2,3.5,4.2,3.2,3.8,4.5,5.2,6,6.3]) },
  { symbol: "UNI", name: "Uniswap", color: "pink", prices: fromQuarters([0,0,4.6,5.2,29,22,24,17,9.7,5.2,6.9,5.6,6.3,5.1,4.3,6.1,12.6,9.5,7.5,13.5,6.2,7.5,10,7.5,9,11,13,15,16]) },
  { symbol: "MATIC", name: "Polygon", color: "cyan", prices: fromQuarters([0.012,0.018,0.026,0.018,0.43,1,1.2,2.5,1.5,0.51,0.79,0.76,1.1,0.66,0.52,0.97,1,0.58,0.4,0.5,0.24,0.2,0.25,0.19,0.23,0.28,0.33,0.4,0.42]) },
  { symbol: "AVAX", name: "Avalanche", color: "pink", prices: fromQuarters([0,0,3.6,3.3,51,10.4,65,110,70,16,17,11,17.6,12,9.3,39,51,27,26,38,19,20,29,20,24,28,33,38,40]) },
  { symbol: "SHIB", name: "Shiba Inu", color: "pink", prices: fromQuarters([0,0,0,0,0,0.0000073,0.0000075,0.0000345,0.0000239,0.0000073,0.0000105,0.0000082,0.0000108,0.0000073,0.0000075,0.0000103,0.0000283,0.0000174,0.0000135,0.0000215,0.0000125,0.0000122,0.0000125,0.0000098,0.000012,0.0000145,0.0000175,0.00002,0.000021]) },
  { symbol: "PEPE", name: "Pepe", color: "yellow", prices: fromQuarters([0,0,0,0,0,0,0,0,0,0,0,0,0,0.0000015,0.00000073,0.0000015,0.0000079,0.0000117,0.0000075,0.0000187,0.0000073,0.0000107,0.0000105,0.0000075,0.000009,0.000011,0.0000135,0.000016,0.0000168]) },
  { symbol: "BONK", name: "Bonk", color: "yellow", prices: fromQuarters([0,0,0,0,0,0,0,0,0,0,0,0.00000018,0.0000004,0.00000037,0.00000045,0.0000094,0.0000283,0.0000278,0.0000188,0.0000335,0.0000149,0.0000138,0.0000215,0.0000135,0.0000165,0.00002,0.0000235,0.0000275,0.000029]) },
  { symbol: "WIF", name: "dogwifhat", color: "yellow", prices: fromQuarters([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0032,2.6,2,2.4,3.15,0.55,0.79,1.05,0.62,0.75,0.9,1.1,1.3,1.35]) },
);


// ---- boss missions: one objective per month ---------------------------------
export type Mission = { id: string; text: string; reward: number; check: (s: MissionSnapshot) => boolean };
export type MissionSnapshot = { netStart: number; netEnd: number; buys: number; sells: number; markets: number; spent: number; called: boolean; callRight: boolean };

export const MISSIONS: Mission[] = [
  { id: "grow", text: "Close the month with a bigger net worth than you opened it.", reward: 600, check: (s) => s.netEnd > s.netStart },
  { id: "spread", text: "Hold at least 3 different markets when the month closes.", reward: 750, check: (s) => s.markets >= 3 },
  { id: "sniper", text: "Make exactly one trade this month. Precision over noise.", reward: 800, check: (s) => s.buys + s.sells === 1 },
  { id: "profit8", text: "Grow your net worth by 8% or more this month.", reward: 1200, check: (s) => s.netEnd >= s.netStart * 1.08 },
  { id: "cashout", text: "Take profit: sell at least once before the month closes.", reward: 550, check: (s) => s.sells >= 1 },
  { id: "read", text: "Call the market direction correctly.", reward: 900, check: (s) => s.called && s.callRight },
  { id: "patience", text: "Spend nothing on new positions. Let the bags cook.", reward: 700, check: (s) => s.buys === 0 },
];

export const missionFor = (month: number) => MISSIONS[(month * 3 + 1) % MISSIONS.length]!;

// ---- real history decisions: the moments everybody remembers ----------------
export type DecisionOption = {
  label: string;
  result: string;
  tone: "win" | "danger" | "neutral";
  cashMul?: number;   // multiplies free cash
  bagMul?: number;    // multiplies every open position
  cash?: number;      // flat cash change
  xp?: number;
  stress?: number;
  hunger?: number;
};
export type Decision = { month: number; kicker: string; title: string; body: string; options: DecisionOption[] };

export const DECISIONS: Decision[] = [
  { month: 2, kicker: "MAR 2020 · BLACK THURSDAY", title: "BITCOIN IS DOWN 50% IN A DAY", body: "COVID panic. BTC prints $3,800. Everyone on your timeline says it goes to zero. The Boss just watches your hands.",
    options: [
      { label: "BUY THE PANIC", result: "You bought blood. Sixty percent of your cash went in at the exact bottom nobody believed in. History says thank you.", tone: "win", cashMul: 0.4, bagMul: 1.6, xp: 700, stress: 12 },
      { label: "SELL EVERYTHING", result: "You panicked with the crowd and locked in the loss. Classic. The chart never asked your permission to recover.", tone: "danger", bagMul: 0.55, cashMul: 1.15, xp: 120, stress: 8 },
      { label: "DO NOTHING", result: "Frozen. Not wrong, not brave. You survived the day with your hands in your pockets.", tone: "neutral", xp: 200, stress: 6 },
    ] },
  { month: 4, kicker: "MAY 2020 · THE HALVING", title: "BLOCK REWARD CUTS IN HALF", body: "Miner supply drops overnight. Every cycle before this one paid the patient. Every cycle also ate the impatient.",
    options: [
      { label: "STACK HARD", result: "You bought supply shock before it was a Twitter thread. Slow money, real money.", tone: "win", cashMul: 0.55, bagMul: 1.35, xp: 600, stress: 6 },
      { label: "STAY IN CASH", result: "Dry powder feels smart right up to the moment the candle leaves without you.", tone: "neutral", xp: 150, stress: 4 },
    ] },
  { month: 12, kicker: "JAN 2021 · TESLA BUYS BTC", title: "$1.5 BILLION FROM ONE COMPANY", body: "Wall Street finally shows up. Retail is euphoric. The Boss loves euphoria, it makes exits expensive.",
    options: [
      { label: "RIDE THE HYPE", result: "You added into institutional FOMO and the market handed you the easiest money of the cycle.", tone: "win", cashMul: 0.5, bagMul: 1.45, xp: 700, stress: 14 },
      { label: "TRIM 30%", result: "You sold strength into strength. Boring, profitable, adult behaviour.", tone: "neutral", bagMul: 0.7, cashMul: 1.35, xp: 350, stress: -6 },
    ] },
  { month: 16, kicker: "MAY 2021 · CHINA BANS MINING", title: "HALF THE HASHRATE GOES DARK", body: "Miners flee, the chart drops 50% in weeks, and the group chat is very quiet.",
    options: [
      { label: "BUY THE FEAR", result: "You bought a state-level ban. Brave. It paid — eventually, and painfully.", tone: "win", cashMul: 0.5, bagMul: 1.25, xp: 550, stress: 18 },
      { label: "DE-RISK TO CASH", result: "You cut size before the summer bleed. The Boss hates admitting you were right.", tone: "win", bagMul: 0.5, cashMul: 1.4, xp: 400, stress: -8 },
      { label: "HOLD AND PRAY", result: "You held through -50% on pure hopium. Your stomach paid the fee.", tone: "neutral", xp: 220, stress: 20 },
    ] },
  { month: 21, kicker: "NOV 2021 · BTC $69,000", title: "THE TOP NOBODY SELLS", body: "Every account is a genius. NFTs of rocks cost more than houses. This is the exact month legends were supposed to take profit.",
    options: [
      { label: "SELL THE TOP", result: "You actually sold the top. One in a thousand does this. The Boss removes his crown for a second.", tone: "win", bagMul: 0.25, cashMul: 2.1, xp: 1400, stress: -10 },
      { label: "SELL HALF", result: "Half off the table at the top. Nobody ever went broke doing this.", tone: "win", bagMul: 0.5, cashMul: 1.55, xp: 800, stress: -4 },
      { label: "IT GOES TO $100K", result: "It did not go to $100K. Not that year. You are now a long term investor by accident.", tone: "danger", xp: 200, stress: 24 },
    ] },
  { month: 28, kicker: "MAY 2022 · LUNA COLLAPSE", title: "UST BREAKS THE PEG", body: "A $40 billion 'stablecoin' unpegs live. Anchor still shows 19.5% APY. There is a queue to buy the dip on LUNA at $1.",
    options: [
      { label: "BUY LUNA AT $1", result: "LUNA went to $0.0001. You caught the falling knife with both hands and your teeth.", tone: "danger", cashMul: 0.35, xp: 200, stress: 30 },
      { label: "EXIT ALL DEFI", result: "You pulled out before contagion ate the lenders. Boring hands, still-alive portfolio.", tone: "win", bagMul: 0.75, cashMul: 1.3, xp: 900, stress: -6 },
      { label: "SHORT THE CONTAGION", result: "You shorted the collapse and got paid by the funeral. Cold. Effective.", tone: "win", cashMul: 1.75, xp: 1100, stress: 16 },
    ] },
  { month: 31, kicker: "AUG 2022 · 3AC & CELSIUS", title: "THE LENDERS ARE INSOLVENT", body: "Celsius freezes withdrawals. 3AC is gone. Your coins on that yield platform are 'safe', they say.",
    options: [
      { label: "WITHDRAW EVERYTHING", result: "Not your keys, not your coins. You got out days before the freeze became forever.", tone: "win", xp: 850, stress: -6 },
      { label: "KEEP EARNING 9%", result: "The 9% cost you the principal. Withdrawals are paused. Permanently.", tone: "danger", bagMul: 0.6, cashMul: 0.8, xp: 150, stress: 28 },
    ] },
  { month: 33, kicker: "NOV 2022 · FTX COLLAPSE", title: "THE SECOND BIGGEST EXCHANGE IS A HOLE", body: "$8 billion missing. SBF is tweeting one letter at a time. Your balance still shows on the app.",
    options: [
      { label: "WITHDRAW NOW", result: "You got your funds out while the withdrawal queue still moved. Ten minutes later it never moved again.", tone: "win", xp: 1200, stress: 10 },
      { label: "BELIEVE THE TWEETS", result: "'Assets are fine.' They were not fine. Your exchange balance is now a bankruptcy claim.", tone: "danger", cashMul: 0.45, bagMul: 0.5, xp: 150, stress: 34 },
      { label: "BUY THE BOTTOM", result: "$15,500 BTC in the middle of maximum fear. This was the cycle low. Enjoy the next two years.", tone: "win", cashMul: 0.45, bagMul: 1.7, xp: 1300, stress: 20 },
    ] },
  { month: 39, kicker: "MAY 2023 · PEPE ARRIVES", title: "A FROG WITH NO UTILITY", body: "A meme coin does $1 billion in weeks. Fundamentals have left the building. So has your patience.",
    options: [
      { label: "APE THE FROG", result: "You aped a frog and it printed. Nobody respects you. Your balance does.", tone: "win", cashMul: 0.7, bagMul: 1.5, xp: 600, stress: 12 },
      { label: "STAY SERIOUS", result: "You stayed serious while a frog outperformed your whole thesis. Dignity intact.", tone: "neutral", xp: 250, stress: 8 },
    ] },
  { month: 49, kicker: "JAN 2024 · SPOT ETF APPROVED", title: "BLACKROCK GETS THE GREEN LIGHT", body: "Eleven ETFs go live at once. The 'sell the news' crowd is loud. The inflow numbers are louder.",
    options: [
      { label: "FRONT-RUN THE INFLOWS", result: "You bought before the biggest bid in crypto history showed up daily. That was the trade.", tone: "win", cashMul: 0.5, bagMul: 1.4, xp: 900, stress: 10 },
      { label: "SELL THE NEWS", result: "You sold the news and watched the news buy every dip for a year.", tone: "danger", bagMul: 0.5, cashMul: 1.25, xp: 250, stress: 14 },
    ] },
  { month: 58, kicker: "OCT 2024 · MEME SUPERCYCLE", title: "PUMP.FUN PRINTS 20,000 TOKENS A DAY", body: "Solana is on fire. 97% of these tokens rug within a day. The other 3% make life-changing money.",
    options: [
      { label: "FARM THE CASINO", result: "You played the casino with size and the casino paid this time. Do not tell your accountant.", tone: "win", cashMul: 0.65, bagMul: 1.45, xp: 700, stress: 22 },
      { label: "BUY MAJORS ONLY", result: "Majors, no drama, no 4am charts. You slept and still made money.", tone: "win", cashMul: 0.7, bagMul: 1.2, xp: 450, stress: -4 },
    ] },
  { month: 62, kicker: "DEC 2024 · BTC BREAKS $100,000", title: "SIX FIGURES IS ON THE BOARD", body: "The number that was a joke in 2017 is printed. Leverage across the market is at an all-time high.",
    options: [
      { label: "TAKE REAL PROFIT", result: "You took profit at six figures. The people who did not are still explaining themselves.", tone: "win", bagMul: 0.55, cashMul: 1.6, xp: 950, stress: -8 },
      { label: "MAX LONG", result: "You levered into euphoria. It worked for a few glorious weeks, then the wick found you.", tone: "danger", cashMul: 0.6, bagMul: 1.15, xp: 400, stress: 26 },
    ] },
  { month: 70, kicker: "AUG 2025 · THE LEVERAGE FLUSH", title: "$19 BILLION LIQUIDATED IN 24 HOURS", body: "The largest liquidation cascade ever recorded. Order books go paper thin. Your positions are still open.",
    options: [
      { label: "BUY THE WICK", result: "You bid the wick everyone else got liquidated into. Ruthless. Correct.", tone: "win", cashMul: 0.5, bagMul: 1.5, xp: 1000, stress: 24 },
      { label: "GO FULL CASH", result: "You raised cash into chaos and slept through the worst week of the year.", tone: "neutral", bagMul: 0.6, cashMul: 1.35, xp: 400, stress: -10 },
    ] },
  { month: 78, kicker: "JUL 2026 · THE LAST SETUP", title: "ONE CYCLE LEFT TO DECIDE YOUR RANK", body: "Six months on the clock. The Boss has your whole run on his desk. Whatever you do now is what people remember.",
    options: [
      { label: "GO FOR THE LEADERBOARD", result: "All-in on the final stretch. Glory or a story. Either way the Boss is entertained.", tone: "win", cashMul: 0.35, bagMul: 1.65, xp: 1200, stress: 26 },
      { label: "PROTECT THE BAG", result: "You protected the run and walked to the finish line with your net worth intact.", tone: "neutral", bagMul: 0.7, cashMul: 1.3, xp: 600, stress: -12 },
    ] },
];

export const decisionFor = (month: number) => DECISIONS.find((d) => d.month === month);

// ---- THE CYCLE: chapters, presales, statuses, endings -----------------------
export const CHAPTERS = 28; // 2020 Q1 -> 2026 Q4
export const chapterMonth = (ch: number) => Math.min(83, Math.max(0, ch * 3 + 2));
export const chapterLabel = (ch: number) => `Q${(ch % 4) + 1} ${2020 + Math.floor(ch / 4)}`;
export const chapterOfMonth = (m: number) => Math.floor(m / 3);

export type Presale = {
  chapter: number;
  name: string;
  tag: "PRESALE" | "FAIR LAUNCH" | "ICO";
  blurb: string;
  min: number;
  rug: number;          // probability the whole thing is a rug
  upside: [number, number]; // multiplier range when it works
};

export const PRESALES: Presale[] = [
  { chapter: 1, name: "YAM FINANCE", tag: "FAIR LAUNCH", blurb: "Elastic supply, no audit, a rebase bug nobody found yet.", min: 300, rug: 0.6, upside: [2, 9] },
  { chapter: 3, name: "SUSHI VAMPIRE", tag: "FAIR LAUNCH", blurb: "A masked dev drains a bigger exchange live. Yields are absurd.", min: 400, rug: 0.45, upside: [2.5, 7] },
  { chapter: 5, name: "SAFEMOON", tag: "PRESALE", blurb: "10% tax on every sell. The chart only goes up until it doesn't.", min: 350, rug: 0.62, upside: [3, 14] },
  { chapter: 7, name: "AXIE LAND SALE", tag: "ICO", blurb: "Play to earn is printing money in Manila. Land is finite, they say.", min: 600, rug: 0.4, upside: [2, 8] },
  { chapter: 9, name: "ANCHOR 19.5%", tag: "ICO", blurb: "Risk-free yield on a stablecoin. Nothing has ever gone wrong with that sentence.", min: 500, rug: 0.55, upside: [1.4, 2.2] },
  { chapter: 12, name: "APTOS AIRDROP", tag: "PRESALE", blurb: "VC chain, huge valuation, tokens nobody can price yet.", min: 450, rug: 0.42, upside: [1.8, 5] },
  { chapter: 14, name: "BLUR SEASON 2", tag: "FAIR LAUNCH", blurb: "Farm bids on dead NFTs for a token that may or may not exist.", min: 300, rug: 0.45, upside: [2, 6] },
  { chapter: 16, name: "PEPE STEALTH", tag: "FAIR LAUNCH", blurb: "No roadmap, no team, one frog. Sixty seconds to decide.", min: 250, rug: 0.6, upside: [4, 22] },
  { chapter: 18, name: "JITO DROP", tag: "PRESALE", blurb: "Solana MEV rewards for people who never left. Loyalty pays sometimes.", min: 500, rug: 0.3, upside: [2, 6] },
  { chapter: 20, name: "EIGENLAYER POINTS", tag: "PRESALE", blurb: "Points for a token with no date. The whole market is farming it anyway.", min: 550, rug: 0.4, upside: [1.8, 5.5] },
  { chapter: 22, name: "PUMP.FUN ROULETTE", tag: "FAIR LAUNCH", blurb: "20,000 launches a day. 97% rug inside an hour. You only need one.", min: 200, rug: 0.72, upside: [5, 35] },
  { chapter: 24, name: "TRUMP COIN", tag: "FAIR LAUNCH", blurb: "A president launches a memecoin at 2am. Liquidity is thin and loud.", min: 400, rug: 0.55, upside: [3, 16] },
  { chapter: 26, name: "$TCFB GENESIS", tag: "PRESALE", blurb: "The Boss launches his own token and lets you in first. Suspicious. Tempting.", min: 600, rug: 0.35, upside: [3, 12] },
];

export const presaleFor = (chapter: number) => PRESALES.find((p) => p.chapter === chapter);

export const STATUS_BY_CHOICE: Record<string, string> = {
  "SELL EVERYTHING": "PANIC SELLER",
  "BUY THE PANIC": "DIAMOND HANDS",
  "HOLD AND PRAY": "DIAMOND HANDS",
  "SELL THE TOP": "TOP SELLER",
  "IT GOES TO $100K": "BAG HOLDER",
  "BUY LUNA AT $1": "KNIFE CATCHER",
  "KEEP EARNING 9%": "EXCHANGE VICTIM",
  "BELIEVE THE TWEETS": "EXCHANGE VICTIM",
  "WITHDRAW NOW": "SELF CUSTODY",
  "WITHDRAW EVERYTHING": "SELF CUSTODY",
  "APE THE FROG": "CASINO DEGEN",
  "FARM THE CASINO": "CASINO DEGEN",
  "MAX LONG": "LEVERAGE JUNKIE",
  "BUY THE WICK": "COLD BLOODED",
  "GO FOR THE LEADERBOARD": "ALL IN",
  "PROTECT THE BAG": "CAPITAL PRESERVER",
};

export const CHAPTER_WARNINGS: Record<number, string> = {
  0: "Nobody outside crypto is watching. That is the whole edge.",
  1: "Free money farms are everywhere. So are unaudited contracts.",
  3: "Retail is waking up. Leverage is getting cheap.",
  4: "Everyone on your feed is suddenly a genius.",
  5: "Euphoria. Exits get expensive from here.",
  7: "The top is somewhere in this room and nobody rings a bell.",
  9: "Yields that cannot exist are being marketed as safe.",
  10: "Contagion season. Counterparties matter more than charts.",
  11: "Trust is about to become the scarcest asset in crypto.",
  13: "Nothing moves. Boredom kills more runs than crashes.",
  16: "Memes are outperforming everything with a whitepaper.",
  19: "Wall Street is at the door with a very large bid.",
  22: "The casino is open 24/7 and the house still wins.",
  24: "Six figures on the board. Leverage at record highs.",
  26: "Final stretch. The Boss is already writing your rank.",
};

export const ENDINGS = {
  LEGEND: { title: "LEGEND", line: "You walked through every crash, every rug, every euphoric top — and left richer than the Boss." },
  SURVIVOR: { title: "SURVIVOR", line: "Seven years, still standing, still solvent. Most people did not make it this far." },
  CASINO: { title: "CASINO CASUALTY", line: "Leverage found you. It always finds the ones who like it most." },
  STARVED: { title: "STARVED OUT", line: "You watched charts until your own life ran out of runway. The Boss finds this hilarious." },
  BROKEN: { title: "BURNED OUT", line: "Stress hit the ceiling. The market kept going without you, as it always does." },
  BROKE: { title: "REKT", line: "Zero. No cash, no bags, no excuses left." },
  SELLOUT: { title: "SELLOUT", line: "You cashed out early and walked away with the bag. Safe. Boring. Respectable." },
} as const;
export type EndingKey = keyof typeof ENDINGS;

export const bossScore = (input: { net: number; chapters: number; difficulty: Difficulty; crises: number; streak: number }) => {
  const diff = DIFFICULTIES.find((d) => d.id === input.difficulty)?.cost ?? 1;
  const chapterFactor = Math.max(0.1, Math.min(1, input.chapters / CHAPTERS));
  const streakMul = 1 + Math.min(0.5, input.streak * 0.05);
  return Math.round((Math.max(0, input.net) * chapterFactor * diff + input.crises * 500) * streakMul);
};

// ---- months language: the run is still 84 months ----------------------------
export const TOTAL_MONTHS = 84;
export const chapterMonthRange = (ch: number): [number, number] => [ch * 3 + 1, Math.min(TOTAL_MONTHS, ch * 3 + 3)];
export const monthsSurvived = (ch: number) => Math.min(TOTAL_MONTHS, ch * 3);
export const monthRangeLabel = (ch: number) => {
  const [a, b] = chapterMonthRange(ch);
  return `MONTH ${String(a).padStart(2, "0")}–${String(b).padStart(2, "0")} / ${TOTAL_MONTHS}`;
};

// ---- crash cards: the moments the chart actually broke -----------------------
export const CRASHES: Record<number, { title: string; line: string }> = {
  0: { title: "BLACK THURSDAY", line: "COVID panic wipes half the market in a single day. Exchanges freeze." },
  5: { title: "MINING BAN CRASH", line: "China kills half the hashrate. Down 50% in six weeks." },
  8: { title: "THE TOP IS IN", line: "Nobody rang the bell. The bear market started while everyone celebrated." },
  9: { title: "LUNA GOES TO ZERO", line: "$40 billion evaporates. Contagion starts eating the lenders." },
  11: { title: "FTX IMPLODES", line: "The second biggest exchange was a hole. Cycle bottom, maximum fear." },
  22: { title: "THE LEVERAGE FLUSH", line: "$19 billion liquidated in 24 hours. Order books go paper thin." },
  25: { title: "FINAL SHAKEOUT", line: "One last brutal flush before the year closes. Weak hands out." },
};
export const crashFor = (chapter: number) => CRASHES[chapter];

// ---- XP: every good move pays ------------------------------------------------
export const XP = {
  trade: 60,
  closeWin: 140,
  closeLoss: 25,
  presaleHit: 320,
  presaleRug: 60,
  greenQuarter: 180,
  streakStep: 70,
  survive: 45,
  crisis: 260,
  chapter: 90,
} as const;

export const levelPerk = (level: number) => Math.max(0.7, 1 - (level - 1) * 0.02); // living costs shrink slightly per level
export const xpProgress = (xp: number) => {
  const level = levelFor(xp);
  const floor = XP_LEVELS[level - 1] ?? 0;
  const ceil = XP_LEVELS[level] ?? floor + 40000;
  return { level, pct: Math.max(4, Math.min(100, ((xp - floor) / (ceil - floor)) * 100)), next: ceil };
};

// ---- situations: the small moments that made the timeline fun ----------------
export type Situation = { chapter: number; kicker: string; title: string; body: string; options: DecisionOption[] };

export const SITUATIONS: Situation[] = [
  { chapter: 2, kicker: "JUL 2020 · DEFI SUMMER", title: "A FARM PAYS 4,000% APY", body: "The contract is unaudited, the dev is a cartoon avatar, and your timeline is already rich.",
    options: [
      { label: "FARM IT", result: "You farmed the yield and got out before the rebase bug. Degenerate genius.", tone: "win", cashMul: 1.35, xp: 420, stress: 10 },
      { label: "READ THE CODE", result: "You read the contract, found the mint function, and walked away. Nerd. Alive.", tone: "neutral", xp: 300, stress: 2 },
    ] },
  { chapter: 3, kicker: "OCT 2020 · SQUARE BUYS BTC", title: "A PAYMENTS GIANT BUYS $50M OF BTC", body: "The suits are testing the water. Your feed calls it the beginning.",
    options: [
      { label: "ADD TO THE BAG", result: "You bought before the institutional wave. That was the cheap seat.", tone: "win", cashMul: 0.75, bagMul: 1.2, xp: 380, stress: 4 },
      { label: "WAIT FOR A DIP", result: "The dip never came. You waited yourself out of the trade.", tone: "neutral", xp: 120, stress: 6 },
    ] },
  { chapter: 6, kicker: "AUG 2021 · ELON TWEETS", title: "ELON TWEETS A DOGE PICTURE", body: "No caption. No context. DOGE is up 30% in eleven minutes and your phone will not stop.",
    options: [
      { label: "APE DOGE NOW", result: "You bought the tweet in the first minute and sold into the crowd. Free money, zero dignity.", tone: "win", cashMul: 1.4, xp: 400, stress: 14 },
      { label: "SHORT THE HYPE", result: "You shorted a billionaire's meme. It squeezed you first, then it worked. Barely.", tone: "danger", cashMul: 0.85, xp: 220, stress: 20 },
      { label: "IGNORE IT", result: "You ignored a dog picture and kept your plan. The Boss respects it and finds it boring.", tone: "neutral", xp: 160, stress: -4 },
    ] },
  { chapter: 8, kicker: "JAN 2022 · THE TAX LETTER", title: "YOUR COUNTRY WANTS ITS CUT", body: "A very official envelope lists trades you forgot you made. Paying is expensive. Not paying is a different kind of expensive.",
    options: [
      { label: "PAY IN FULL", result: "You paid, you are clean, you sleep at night. Cash hurts, stress drops.", tone: "neutral", cashMul: 0.82, xp: 260, stress: -8 },
      { label: "GHOST THEM", result: "You ignored the letter. Stress climbs, and the letters get bigger.", tone: "danger", xp: 100, stress: 22 },
    ] },
  { chapter: 12, kicker: "APR 2023 · THE FRIEND CALL", title: "YOUR COUSIN WANTS A COIN TIP", body: "He has $5,000 of savings and zero patience. He will tell everyone whose fault it was.",
    options: [
      { label: "TELL HIM BITCOIN", result: "Boring advice, decent outcome, family intact. Reputation up.", tone: "win", xp: 300, stress: -4 },
      { label: "SHILL HIM A MEME", result: "It rugged in nine hours. You are now the family's crypto guy. Forever.", tone: "danger", xp: 120, stress: 18 },
    ] },
  { chapter: 14, kicker: "SEP 2023 · THE INFLUENCER DEAL", title: "A PROJECT OFFERS YOU $20,000 TO POST", body: "They want one thread. They do not want you to read the tokenomics.",
    options: [
      { label: "TAKE THE BAG", result: "You took the money, the token dumped 90%, and the replies remember everything.", tone: "danger", cash: 20000, xp: 200, stress: 20 },
      { label: "DECLINE", result: "You said no to easy money to keep your name. Rare. The Boss notices.", tone: "win", xp: 420, stress: -6 },
    ] },
  { chapter: 15, kicker: "DEC 2023 · THE HACK", title: "YOUR WALLET APPROVAL GETS DRAINED", body: "You signed something months ago. A bot just remembered it.",
    options: [
      { label: "REVOKE EVERYTHING", result: "You revoked in time and lost only gas. Paranoia paid again.", tone: "win", cashMul: 0.96, xp: 380, stress: 12 },
      { label: "IGNORE THE WARNING", result: "The bot took a slice of your bag while you scrolled. Signed, sealed, gone.", tone: "danger", bagMul: 0.85, xp: 80, stress: 24 },
    ] },
  { chapter: 17, kicker: "JUN 2024 · THE INSIDER GROUP", title: "A PAID GROUP PROMISES 'EARLY CALLS'", body: "$2,000 a month for alpha. The screenshots are definitely real. Definitely.",
    options: [
      { label: "JOIN THE GROUP", result: "You paid for the privilege of being someone's exit liquidity. Twice.", tone: "danger", cashMul: 0.9, xp: 120, stress: 12 },
      { label: "TRADE YOUR OWN PLAN", result: "You kept the money and your own read. Slower, cleaner, yours.", tone: "win", xp: 340, stress: -4 },
    ] },
  { chapter: 18, kicker: "SEP 2024 · THE POWER BILL", title: "YOUR MINING RIG IS EATING YOUR RENT", body: "Two GPUs, one hot room, one very angry electricity provider.",
    options: [
      { label: "SELL THE RIG", result: "You sold the hardware into strong demand and kept the cash. Adult decision.", tone: "win", cash: 3500, xp: 260, stress: -6 },
      { label: "KEEP MINING", result: "You kept mining at a loss because stopping felt like quitting. It was quitting, with extra steps.", tone: "danger", cashMul: 0.93, xp: 140, stress: 10 },
    ] },
  { chapter: 21, kicker: "JUN 2025 · THE EXCHANGE FREEZE", title: "WITHDRAWALS ARE 'TEMPORARILY PAUSED'", body: "Support says it is a maintenance window. The CEO is tweeting about hiring.",
    options: [
      { label: "MOVE TO SELF CUSTODY", result: "You got out during the window. Not your keys, not your coins — you finally learned it.", tone: "win", xp: 460, stress: 8 },
      { label: "TRUST THE ANNOUNCEMENT", result: "The maintenance window is still open. So is the bankruptcy filing.", tone: "danger", cashMul: 0.7, xp: 90, stress: 26 },
    ] },
  { chapter: 22, kicker: "SEP 2025 · THE AI AGENT MANIA", title: "AI AGENTS ARE LAUNCHING THEIR OWN TOKENS", body: "A bot with 400,000 followers just deployed a coin about itself. It is up 60x.",
    options: [
      { label: "APE THE AGENT", result: "You bought a robot's memecoin and it printed. The future is stupid and profitable.", tone: "win", cashMul: 1.45, xp: 380, stress: 16 },
      { label: "STAY IN MAJORS", result: "You skipped the robot casino. Slept fine, missed a 60x, kept your stack.", tone: "neutral", xp: 200, stress: -4 },
    ] },
  { chapter: 24, kicker: "MAR 2026 · THE BOSS OFFER", title: "THE BOSS OFFERS YOU A SEAT", body: "Hand him 20% of your net worth and he guarantees you finish the run. Guarantees, in his words.",
    options: [
      { label: "PAY THE BOSS", result: "You paid the crown tax. Stress gone, wallet lighter, and he is still smiling.", tone: "neutral", cashMul: 0.8, xp: 300, stress: -20 },
      { label: "TELL HIM NO", result: "You told the Final Boss no. He respects it and makes the next quarter personal.", tone: "win", xp: 520, stress: 14 },
    ] },
  { chapter: 25, kicker: "JUN 2026 · THE LAST BULL TRAP", title: "EVERYONE CALLS FOR A BLOW-OFF TOP", body: "Funding is extreme, your feed is euphoric, and your own bag is deep in profit.",
    options: [
      { label: "TAKE PROFIT NOW", result: "You banked real money into euphoria. The Boss hates how correct that was.", tone: "win", bagMul: 0.6, cashMul: 1.5, xp: 480, stress: -10 },
      { label: "RIDE IT OUT", result: "You rode the euphoria with your whole book. Brave. Expensive if wrong.", tone: "danger", xp: 220, stress: 20 },
    ] },
  { chapter: 27, kicker: "DEC 2026 · THE FINAL WORD", title: "LAST QUARTER. LAST DECISION.", body: "The Boss has your whole run on his desk and one question left: do you cash out or swing once more?",
    options: [
      { label: "CASH OUT CLEAN", result: "You closed the cycle on your terms with your money in your hands.", tone: "win", bagMul: 0.5, cashMul: 1.45, xp: 560, stress: -14 },
      { label: "ONE LAST SWING", result: "You swung one last time for the leaderboard. Legends and cautionary tales come from the same move.", tone: "danger", cashMul: 0.6, bagMul: 1.6, xp: 620, stress: 22 },
    ] },
];

export const situationFor = (chapter: number) => SITUATIONS.find((s) => s.chapter === chapter);

// every historical decision, mapped to the chapter it belongs to
export const decisionForChapter = (chapter: number) => DECISIONS.find((d) => chapterOfMonth(d.month) === chapter);
