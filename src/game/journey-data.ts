export type CoinSymbol = "BTC" | "ETH" | "SOL" | "DOGE";

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

export const COUNTRIES = ["DE", "USA", "CH", "SG", "PT", "NG"] as const;
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
