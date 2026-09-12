export type CoinSymbol = "BTC" | "ETH" | "SOL" | "DOGE" | "LINK" | "ADA" | "AVAX" | "SHIB" | "PEPE" | "UNI" | "DOT" | "MATIC" | "BONK" | "WIF";

export type Coin = {
  symbol: CoinSymbol;
  name: string;
  color: "cyan" | "pink" | "yellow";
  prices: number[];
};

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const COINS: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", color: "yellow", prices: [9353,8524,6410,8620,9448,9139,11335,11650,10777,13791,19696,28924,33093,45136,58741,57694,37254,35045,41462,47101,43824,61300,56951,46217,38467,43160,45510,37631,31801,19942,23293,20050,19423,20491,17164,16542,23125,23142,28465,29233,27210,30472,29232,25941,26963,34640,37724,42284,42580,61131,71280,60672,67540,62772,64628,58974,63328,70292,96408,93576,102430,84350,82550,94172,104592,107147,115764,108246,114049,109608,90360,87648,78741,66973,68284,76347,73674,58625,62888,78581,77324,81190,84823,88617] },
  { symbol: "ETH", name: "Ethereum", color: "cyan", prices: [179.99,217.21,132.72,206.08,231.57,225.6,346.33,433.79,359.83,386.46,616.66,736.42,1313,1419,1919,2772,2706,2276,2531,3429,3001,4287,4630,3676,2687,2921,3282,2727,1942,1071,1678,1554,1329,1573,1294,1196,1585,1605,1822,1870,1874,1934,1856,1646,1671,1815,2052,2282,2283,3340,3645,3014,3762,3438,3233,2513,2602,2519,3704,3338,3301,2238,1822,1794,2528,2485,3698,4392,4145,3848,2991,2972,2452,1965,2105,2258,2007,1572,1863,2468,2523,2699,2874,3059] },
  { symbol: "SOL", name: "Solana", color: "pink", prices: [0,0,0,0.7,0.55,0.8,1.6,4.74,2.9,1.55,1.97,1.51,4.25,13.09,19.39,42.79,32.75,35.51,36.74,108.27,141.37,202.49,208.53,169.99,99.49,99.68,122.77,84.63,45.77,33.76,42.35,31.5,33.25,32.56,14.16,9.97,23.92,21.89,21.16,22.74,20.81,18.86,23.73,19.74,21.37,38.4,59.3,101.72,96.96,125.68,202.45,126.77,165.65,146.61,171.71,135.35,152.49,168.69,237.6,189.31,231.77,148.18,124.54,147.54,156.45,154.81,172.22,200.62,208.68,187.21,133.48,124.65,105.58,84.35,83.2,83.09,82.44,73.67,72.87,103.06,101.72,109.86,118.05,126.86] },
  { symbol: "DOGE", name: "Dogecoin", color: "yellow", prices: [0.00238,0.00222,0.0018,0.00243,0.00256,0.00232,0.00322,0.00321,0.00264,0.00257,0.00356,0.00467,0.037,0.0482,0.0538,0.337,0.326,0.254,0.208,0.278,0.204,0.28,0.215,0.17,0.141,0.134,0.138,0.127,0.0859,0.0664,0.0681,0.0614,0.0617,0.127,0.107,0.0703,0.0961,0.0809,0.077,0.0795,0.0717,0.0665,0.0779,0.0638,0.0621,0.0683,0.0834,0.0896,0.0788,0.117,0.22,0.133,0.159,0.124,0.122,0.101,0.114,0.162,0.422,0.316,0.329,0.202,0.167,0.172,0.193,0.165,0.21,0.214,0.233,0.186,0.146,0.117,0.104,0.094,0.0923,0.106,0.1,0.0721,0.0696,0.0828,0.0844,0.0921,0.0998,0.108] },
  { symbol: "LINK", name: "Chainlink", color: "cyan", prices: [2.83,4.06,2.27,3.7,4.13,4.56,7.8,15.58,9.87,11.23,14.27,11.24,22.56,24.7,29.42,38.1,32.1,19.52,22.71,26.7,24,30,25.31,19.51,17.15,15.13,16.91,10.95,7.59,6.27,7.65,6.63,7.58,7.86,7.67,5.58,6.95,7.2,7.59,7.03,6.48,6.31,7.55,5.88,8.19,11.35,14.41,14.94,15.43,19.27,19.17,13.13,18.41,14.28,12.83,11.02,11.85,11.41,19,20.01,25.17,14.81,13.51,14.3,13.97,13.38,16.92,23.2,21.3,17.24,12.95,12.21,9.99,8.85,8.78,9.11,9.15,7.2,8.17,11.32,11.53,12.45,13.38,14.38] },
  { symbol: "ADA", name: "Cardano", color: "cyan", prices: [0.0539,0.0471,0.0305,0.0475,0.0739,0.083,0.139,0.123,0.101,0.093,0.172,0.181,0.345,1.31,1.19,1.35,1.74,1.39,1.32,2.77,2.12,1.96,1.55,1.31,1.05,0.962,1.14,0.756,0.627,0.46,0.516,0.446,0.435,0.406,0.319,0.246,0.39,0.352,0.399,0.396,0.374,0.287,0.307,0.255,0.254,0.293,0.376,0.594,0.498,0.655,0.65,0.441,0.447,0.392,0.388,0.345,0.373,0.342,1.08,0.845,0.943,0.633,0.662,0.682,0.686,0.572,0.739,0.811,0.807,0.609,0.414,0.334,0.294,0.281,0.242,0.246,0.236,0.144,0.168,0.198,0.208,0.222,0.237,0.252] },
  { symbol: "DOT", name: "Polkadot", color: "pink", prices: [0,0,0,0,0,0,0,6.27,4.35,4.19,5.38,9.26,16.11,33.8,37.08,36.52,23.26,16.4,16.78,31.35,28.62,42.77,37.95,26.66,19.37,18.94,21.33,14.5,10.35,7.06,8.62,7.03,6.32,6.62,5.46,4.31,6.26,6.35,6.34,5.88,5.32,5.18,5.11,4.27,4.1,4.45,5.47,8.2,6.65,8.26,9.65,6.42,6.98,6.21,5.39,4.26,4.43,3.96,8.95,6.64,6.32,4.71,4.02,4.07,4.08,3.4,3.68,3.74,3.91,2.88,2.21,1.79,1.55,1.66,1.25,1.2,1.19,0.822,0.759,0.84,1.05,1.12,1.19,1.27] },
  { symbol: "UNI", name: "Uniswap", color: "pink", prices: [0,0,0,0,0,0,0,0,4.16,2.27,3.78,5.15,17.72,22.21,28.03,40.62,28.24,19.28,21.77,29.38,23.53,24.98,21.25,17,11.77,10.53,11.29,6.75,5.7,5,8.32,6.15,6.46,6.96,5.86,5.17,6.56,6.5,6.06,5.45,5.03,5.27,6.53,4.37,4.46,4.15,5.96,7.22,6,11.12,12.95,7.04,9.96,9.29,7.17,5.94,7.39,7.61,12.78,13.24,11.77,7.5,5.97,5.27,6.05,7.13,9.34,9.62,7.64,5.74,6.04,5.64,3.96,3.81,3.54,3.19,3.02,2.78,4.35,5.23,6.28,6.78,7.29,7.83] },
  { symbol: "MATIC", name: "Polygon", color: "cyan", prices: [0.018,0.0202,0.011,0.0154,0.0205,0.019,0.0203,0.0265,0.0201,0.0137,0.0196,0.0176,0.0383,0.233,0.36,0.821,1.87,1.17,1.08,1.34,1.13,1.94,1.78,2.52,1.64,1.61,1.62,1.03,0.663,0.481,0.928,0.832,0.778,0.903,0.933,0.758,1.11,1.2,1.12,0.981,0.892,0.661,0.688,0.55,0.533,0.636,0.763,0.971,0.787,1,1,0.667,0.694,0.561,0.496,0.42,0.379,0.321,0.597,0.452,0.407,0.272,0.202,0.237,0.214,0.189,0.205,0.278,0.225,0.184,0.133,0.101,0.104,0.109,0.0912,0.0951,0.093,0.0685,0.0713,0.0906,0.0964,0.104,0.112,0.12] },
  { symbol: "AVAX", name: "Avalanche", color: "pink", prices: [0,0,0,0,0,0,0,0,4.33,3.65,3.7,3.19,13.47,23.96,28.72,32.8,18.14,11.95,13.53,39.5,66.63,64.5,120.41,109.43,69.87,84.54,97.41,56.98,26.42,16.99,23.72,19.14,17.2,19.28,13.15,10.9,19.8,17.09,17.7,17.1,14.11,13.03,12.82,9.98,9.24,11.33,21.39,38.55,33.17,40.97,54.06,32.71,36.02,29.36,25.7,22.81,27.71,25.03,44.81,35.71,34.42,22.37,18.77,20.92,20.8,17.96,22.47,23.4,30.01,18.19,13.71,12.32,10.12,9.16,8.91,9.09,8.98,6.54,6.39,7.23,7.44,8.03,8.63,9.28] },
  { symbol: "SHIB", name: "Shiba Inu", color: "pink", prices: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00000928,0.00000882,0.00000625,0.00000686,0.0000072,0.000067,0.0000474,0.0000334,0.0000214,0.0000258,0.0000259,0.0000202,0.0000117,0.0000103,0.0000117,0.0000121,0.0000113,0.0000124,0.00000935,0.00000808,0.0000118,0.000012,0.0000108,0.0000101,0.00000859,0.00000755,0.00000846,0.00000799,0.00000734,0.00000779,0.0000083,0.0000104,0.00000894,0.0000126,0.0000307,0.0000224,0.0000254,0.0000173,0.0000159,0.0000138,0.0000176,0.0000179,0.0000267,0.0000212,0.0000189,0.0000139,0.0000124,0.0000132,0.0000128,0.0000114,0.0000124,0.0000122,0.0000118,0.00001,0.00000837,0.00000691,0.00000681,0.00000578,0.00000596,0.00000622,0.00000552,0.0000042,0.00000471,0.00000507,0.00000522,0.00000574,0.00000628,0.00000688] },
  { symbol: "PEPE", name: "Pepe", color: "yellow", prices: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.00000126,0.00000162,0.00000124,8e-7,8e-7,0.00000114,0.00000109,0.0000013,9.2e-7,0.00000274,0.0000088,0.00000667,0.0000154,0.0000119,0.000011,0.00000759,0.0000105,0.00000911,0.0000202,0.00002,0.0000139,0.00000792,0.0000072,0.00000889,0.0000117,0.00000975,0.0000108,0.00000965,0.00000931,0.00000657,0.00000454,0.00000403,0.00000415,0.00000365,0.00000341,0.00000388,0.00000343,0.00000233,0.00000275,0.00000355,0.00000332,0.00000372,0.00000414,0.00000462] },
  { symbol: "BONK", name: "Bonk", color: "yellow", prices: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.0000133,0.0000106,0.0000221,0.0000281,0.0000227,0.0000344,0.0000227,0.0000245,0.0000173,0.0000238,0.0000202,0.0000449,0.0000306,0.0000248,0.0000136,0.0000113,0.0000195,0.0000166,0.0000145,0.0000261,0.0000222,0.0000192,0.000014,0.00000935,0.00000747,0.00000719,0.00000602,0.00000588,0.00000616,0.00000553,0.00000411,0.00000281,0.000003,0.0000028,0.00000314,0.00000349,0.00000389] },
  { symbol: "WIF", name: "dogwifhat", color: "yellow", prices: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.58,2.5,3.31,2.2,2.18,1.52,2.46,2.38,3.18,1.86,1.14,0.629,0.42,0.633,0.851,0.867,0.919,0.783,0.728,0.514,0.366,0.27,0.255,0.195,0.179,0.183,0.192,0.166,0.143,0.197,0.194,0.218,0.243,0.27] },
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
export type Difficulty = "EASY" | "NORMAL" | "BOSS" | "NIGHTMARE";
export type BaseMode = "classic" | "chaos" | "historical";

export const ARCHETYPES: { id: Archetype; name: string; cash: number; blurb: string; risk: number; xp: number }[] = [
  { id: "degen", name: "DEGEN", cash: 6000, blurb: "Thin bankroll, fat payouts. Launch cards pay 40% more — and rug you harder.", risk: 1.25, xp: 1.1 },
  { id: "trader", name: "TRADER", cash: 10000, blurb: "Balanced stack, cheaper trades, calmer nerves. The professional route.", risk: 1, xp: 1 },
  { id: "influencer", name: "INFLUENCER", cash: 7500, blurb: "The crowd follows you. More XP per move, but stress builds fast.", risk: 1.1, xp: 1.25 },
  { id: "hodler", name: "HODLER", cash: 12000, blurb: "Deep pockets, iron stomach. Hunger and stress grow slower.", risk: 0.85, xp: 0.9 },
];

export const DIFFICULTIES: {
  id: Difficulty; name: string; blurb: string; cost: number; risk: number;
  hunger: number; stress: number; care: number; careCost: number; rug: number; caps: number;
}[] = [
  { id: "EASY", name: "EASY", blurb: "Cheap living, forgiving markets, food is never the problem.", cost: 0.8, risk: 0.85, hunger: 0.8, stress: 0.8, care: 1, careCost: 0.8, rug: 0.85, caps: 3 },
  { id: "NORMAL", name: "NORMAL", blurb: "The honest run. Eating costs a move like everything else.", cost: 1, risk: 1, hunger: 1, stress: 1, care: 0.85, careCost: 1, rug: 1, caps: 2 },
  { id: "BOSS", name: "BOSS", blurb: "Costs bite, rugs everywhere, hunger and nerves climb fast.", cost: 1.4, risk: 1.3, hunger: 1.35, stress: 1.35, care: 0.7, careCost: 1.5, rug: 1.25, caps: 2 },
  { id: "NIGHTMARE", name: "NIGHTMARE", blurb: "Expensive life, constant crises, food and calm barely help. One mistake ends it.", cost: 1.9, risk: 1.6, hunger: 1.7, stress: 1.7, care: 0.5, careCost: 2.2, rug: 1.5, caps: 1 },
];

/** Private life hits the run whether the chart cares or not. */
export const LIFE_EVENTS: { label: string; line: string; cash: number; hunger?: number; stress?: number; weight: number }[] = [
  { label: "Emergency dentist", line: "A molar cracked at 3am while you were watching funding rates.", cash: -900, stress: 8, weight: 3 },
  { label: "Car broke down", line: "The gearbox died. The mechanic does not accept altcoins.", cash: -1400, stress: 10, weight: 3 },
  { label: "Friend needs a loan", line: "Your cousin heard you are 'in crypto'. He is not asking politely.", cash: -1200, stress: 12, weight: 2 },
  { label: "Phone stolen", line: "Someone took your phone. Your 2FA lived there. It cost you.", cash: -750, stress: 14, weight: 2 },
  { label: "Laid off", line: "Your team was restructured. You are now a full-time chart watcher.", cash: -600, stress: 18, weight: 2 },
  { label: "Tax refund", line: "The state overcharged you last year and quietly paid it back.", cash: 1100, stress: -6, weight: 2 },
  { label: "Freelance gig", line: "Someone paid you real money to explain wallets to their boss.", cash: 1600, stress: 4, weight: 2 },
  { label: "Family dinner", line: "You ate properly for once. Someone else even paid.", cash: -120, hunger: -14, stress: -8, weight: 2 },
  { label: "Sleepless month", line: "You watched Asian hours every night. Your body sent an invoice.", cash: -260, hunger: 8, stress: 16, weight: 3 },
  { label: "Rent hike", line: "Your landlord read about crypto and drew conclusions.", cash: -1000, stress: 9, weight: 2 },
];

export const pickLifeEvent = (roll: number) => {
  const total = LIFE_EVENTS.reduce((s, e) => s + e.weight, 0);
  let cursor = roll * total;
  for (const e of LIFE_EVENTS) { cursor -= e.weight; if (cursor <= 0) return e; }
  return LIFE_EVENTS[0]!;
};

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

// All 14 markets now carry real monthly closing prices (Binance monthly klines,
// Jan 2020 - Sep 2026). Months before a coin traded are 0, so it simply does not
// appear on the board yet. Oct-Dec 2026 has no history and continues bullish.


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

/** Food and calm get more expensive over the years and per difficulty. */
export const careCost = (kind: "eat" | "calm", chapter: number, diff: Difficulty) => {
  const d = DIFFICULTIES.find((x) => x.id === diff) ?? DIFFICULTIES[1]!;
  const base = kind === "eat" ? 180 : 320;
  return Math.round(base * (1 + chapter * 0.09) * d.careCost);
};

export const ENDINGS = {
  THRONE: { title: "THRONE TAKEN", line: "You finished richer than the Boss himself. The chair is yours until someone takes it." },
  LEGEND: { title: "LEGEND", line: "You walked through every crash, every rug, every euphoric top — and left richer than the Boss." },
  SURVIVOR: { title: "SURVIVOR", line: "Seven years, still standing, still solvent. Most people did not make it this far." },
  CASINO: { title: "CASINO CASUALTY", line: "Leverage found you. It always finds the ones who like it most." },
  STARVED: { title: "STARVED OUT", line: "You watched charts until your own life ran out of runway. The Boss finds this hilarious." },
  BROKEN: { title: "BURNED OUT", line: "Stress hit the ceiling. The market kept going without you, as it always does." },
  BROKE: { title: "REKT", line: "Zero. No cash, no bags, no excuses left." },
  SELLOUT: { title: "SELLOUT", line: "You cashed out early and walked away with the bag. Safe. Boring. Respectable." },
} as const;
export type EndingKey = keyof typeof ENDINGS;

/** What it takes to unlock each ending — shown as a hint while it is still locked. */
export const ENDING_HINTS: Record<EndingKey, string> = {
  THRONE: "Beat the Boss' own book, win 3 fights, never hit a critical state.",
  LEGEND: "Reach 60x your start money, survive 6 crises, trade at least 12 times, stay out of the red zones.",
  SURVIVOR: "Reach the last quarter of 2026 with money left.",
  CASINO: "Get liquidated until nothing is left.",
  STARVED: "Let hunger hit 100.",
  BROKEN: "Let stress hit 100.",
  BROKE: "Lose every dollar without leverage doing it for you.",
  SELLOUT: "Use CASH OUT before the last chapter.",
};

/* ---- run modifiers: no two runs start the same way -------------------- */

export type ModifierId = "straight" | "glass" | "keys" | "debt";
export const MODIFIERS: { id: ModifierId; name: string; blurb: string; mul: number }[] = [
  { id: "straight", name: "STRAIGHT UP", blurb: "The honest run. Your archetype's money, all options open.", mul: 1 },
  { id: "glass", name: "GLASS CANNON", blurb: "Half the starting money. Every score counts far more.", mul: 1.6 },
  { id: "keys", name: "NO COLD STORAGE", blurb: "The Ledger is locked. Exchange and hot wallet only — drainers and failures can reach you.", mul: 1.35 },
  { id: "debt", name: "DEEP IN DEBT", blurb: "You start owing $8,000 to the taxman. It grows until you pay it.", mul: 1.4 },
];
export const modifierOf = (id: ModifierId) => MODIFIERS.find((m) => m.id === id) ?? MODIFIERS[0]!;

/* ---- tournament: identical conditions for every player ----------------
 * The season seed already gives everyone the same crashes, rugs and
 * minigames. These fixed settings make the rest of the run comparable too:
 * same difficulty, same market mode, same starting money, no ironman.
 * Only handle, country and avatar stay free. */
export const TOURNAMENT_RULES = {
  difficulty: "NORMAL" as Difficulty,
  mode: "classic" as BaseMode,
  ironman: false,
  cash: 10000,
} as const;

/* ---- the Boss has a different personality every run ------------------- */

export type PersonaId = "hunter" | "banker" | "puppeteer";
export const PERSONAS: { id: PersonaId; name: string; line: string; bias: "SWEEP" | "SQUEEZE" | "OFFER" }[] = [
  { id: "hunter", name: "THE HUNTER", line: "This one hunts liquidations. He can smell leverage through the screen.", bias: "SWEEP" },
  { id: "banker", name: "THE BANKER", line: "This one owns the funding rate. Holding a position is going to cost you.", bias: "SQUEEZE" },
  { id: "puppeteer", name: "THE PUPPETEER", line: "This one buys people, not coins. He will offer you money to quit.", bias: "OFFER" },
];
export const personaFor = (roll: number) => PERSONAS[Math.floor(roll * PERSONAS.length) % PERSONAS.length]!;

/* ---- three acts, rising pressure ------------------------------------- */

export const ACTS = [
  { n: 1, name: "ACT I · THE BOOM", from: 0, line: "Money is easy, everyone is a genius. Build something before it breaks." },
  { n: 2, name: "ACT II · THE COLLAPSE", from: 8, line: "Luna, Celsius, FTX. Counterparties matter more than charts now." },
  { n: 3, name: "ACT III · THE ENDGAME", from: 14, line: "ETFs, six figures, record leverage. The Boss is writing your rank." },
] as const;
export const actFor = (chapter: number) => [...ACTS].reverse().find((a) => chapter >= a.from) ?? ACTS[0];


/* ---- the Boss plays against you --------------------------------------- */

export type BossAttack = { id: "SWEEP" | "SQUEEZE" | "OFFER"; name: string; line: string };
const ATTACKS: BossAttack[] = [
  { id: "SWEEP", name: "LIQUIDITY SWEEP", line: "He is hunting stops this quarter. The wick will look like the end of the world." },
  { id: "SQUEEZE", name: "FUNDING SQUEEZE", line: "He doubled the cost of holding leverage. Rent your convictions carefully." },
  { id: "OFFER", name: "THE OFFER", line: "He wants to buy you out cheap. Cash today, a leash forever." },
];
/**
 * Deterministic: the same seed gives every tournament player the same attacks.
 * The Boss' personality bends which attack shows up — a Hunter sweeps more.
 */
export const attackFor = (chapter: number, roll: number, bias?: BossAttack["id"]): BossAttack | null => {
  if (chapter < 2 || roll >= 0.42) return null;
  const scaled = roll / 0.42;
  if (bias && scaled < 0.5) return ATTACKS.find((a) => a.id === bias)!;
  return ATTACKS[Math.floor(scaled * ATTACKS.length) % ATTACKS.length]!;
};


export type BossFight = { title: string; line: string; mini: "timing" | "panic" | "gas" | "seed"; perk: string };
export const BOSS_FIGHTS: Record<number, BossFight> = {
  0: { title: "ROUND 1 · BLACK THURSDAY", line: "He froze the exchanges and put your account on the table. Get an order out.", mini: "panic", perk: "STEEL NERVES" },
  5: { title: "ROUND 2 · THE MINING BAN", line: "He is selling hashrate into your face. Land the exit or wear it.", mini: "timing", perk: "CHEAP FEES" },
  9: { title: "ROUND 3 · LUNA", line: "A death spiral with your name on it. Out in seconds or not at all.", mini: "panic", perk: "+1 MOVE" },
  11: { title: "ROUND 4 · FTX", line: "The withdrawal queue is a race and he is at the front of it.", mini: "gas", perk: "CHEAP FEES" },
  19: { title: "ROUND 5 · THE ETF BID", line: "Wall Street is bidding. He wants your allocation before you can take it.", mini: "gas", perk: "+1 MOVE" },
  22: { title: "FINAL ROUND · THE FLUSH", line: "Nineteen billion liquidated. Books are paper thin. Prove the hands.", mini: "timing", perk: "STEEL NERVES" },
};
export const bossFightFor = (chapter: number) => BOSS_FIGHTS[chapter];
export const PERK_BLURB: Record<string, string> = {
  "STEEL NERVES": "Stress climbs slower for the rest of the run.",
  "CHEAP FEES": "Every fee you pay is halved.",
  "+1 MOVE": "One extra move every quarter.",
};


export const bossScore = (input: { net: number; chapters: number; difficulty: Difficulty; crises: number; streak: number; modifier?: ModifierId }) => {
  const diff = DIFFICULTIES.find((d) => d.id === input.difficulty)?.cost ?? 1;
  const chapterFactor = Math.max(0.1, Math.min(1, input.chapters / CHAPTERS));
  const streakMul = 1 + Math.min(0.5, input.streak * 0.05);
  const mod = modifierOf(input.modifier ?? "straight").mul;
  return Math.round((Math.max(0, input.net) * chapterFactor * diff * mod + input.crises * 500) * streakMul);
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

// ---- V48: custody, life, tax, strategy --------------------------------------

export type CustodyId = "exchange" | "hot" | "cold";
export const CUSTODY: { id: CustodyId; name: string; short: string; blurb: string; fee: number; drain: number; risk: number }[] = [
  { id: "exchange", name: "EXCHANGE", short: "CEX", blurb: "Instant trades, zero friction — and somebody else holds your coins when they blow up.", fee: 0.001, drain: 0, risk: 1 },
  { id: "hot", name: "HOT WALLET", short: "HOT", blurb: "Your keys, your gas. A bad signature can still cost you a slice of the bag.", fee: 0.006, drain: 0.07, risk: 0 },
  { id: "cold", name: "LEDGER (COLD)", short: "COLD", blurb: "Untouchable by exchanges and drainers. Selling costs an extra move and fills a quarter late.", fee: 0.002, drain: 0, risk: 0 },
];
export const custodyOf = (id: CustodyId) => CUSTODY.find((c) => c.id === id) ?? CUSTODY[0]!;

/** Real counterparty failures: everything still sitting on an exchange takes the hit. */
export const EXCHANGE_FAILURES: Record<number, { name: string; line: string; haircut: number }> = {
  9: { name: "CELSIUS FREEZES WITHDRAWALS", line: "The 9% yield desk stops paying. Customer coins are now bankruptcy claims.", haircut: 0.45 },
  11: { name: "FTX GOES TO ZERO", line: "The second biggest exchange was a hole in the ground. Balances are gone.", haircut: 0.85 },
  21: { name: "MID-TIER CEX HALTS", line: "'Temporary maintenance.' The domain expires two weeks later.", haircut: 0.35 },
};
export const failureFor = (chapter: number) => EXCHANGE_FAILURES[chapter];

export type JobId = "dayjob" | "parttime" | "fulltime";
export const JOBS: { id: JobId; name: string; income: number; stress: number; ap: number; blurb: string }[] = [
  { id: "dayjob", name: "DAY JOB", income: 5200, stress: 8, ap: 0, blurb: "Boring salary every quarter. Keeps you alive when the market doesn't." },
  { id: "parttime", name: "PART TIME", income: 2600, stress: 4, ap: 0, blurb: "Half the money, half the boss, more screen time for charts." },
  { id: "fulltime", name: "FULL TIME TRADER", income: 0, stress: 12, ap: 1, blurb: "No paycheck ever again. One extra move per quarter. Pure ego." },
];
export const jobOf = (id: JobId) => JOBS.find((j) => j.id === id) ?? JOBS[0]!;

export type HousingId = "parents" | "shared" | "flat" | "penthouse";
export const HOUSING: { id: HousingId; name: string; rent: number; calm: number; blurb: string }[] = [
  { id: "parents", name: "MUM'S BASEMENT", rent: 300, calm: -6, blurb: "Almost free. Everyone has an opinion about your charts." },
  { id: "shared", name: "SHARED FLAT", rent: 1400, calm: 0, blurb: "Normal rent, normal noise, normal life." },
  { id: "flat", name: "OWN FLAT", rent: 3200, calm: 7, blurb: "Quiet, yours, expensive. Stress drops every quarter." },
  { id: "penthouse", name: "PENTHOUSE", rent: 9000, calm: 14, blurb: "Pure flex. Costs more than most people's runs are worth." },
];
export const housingOf = (id: HousingId) => HOUSING.find((h) => h.id === id) ?? HOUSING[1]!;

export const TAX_RATE = 0.27;
export const isTaxChapter = (chapter: number) => chapter > 0 && chapter % 4 === 0;

export const XP_EXTRA = { minigamePerfect: 260, minigameOk: 120, custody: 180, escape: 520, life: 150 } as const;

/** The knowledge nudges: a whisper, never an arrow. */
export const HINTS: Record<number, string> = {
  8: "A lending desk is advertising 9% on your coins. Everyone you know already moved their stack there.",
  10: "A large exchange keeps posting screenshots of its 'audited' balance sheet.",
  20: "Withdrawal times on your exchange got noticeably slower this month.",
};
export const hintFor = (chapter: number) => HINTS[chapter];


/* ==================================================================== */
/*  Warmth, clarity and pull: everything below exists so the run reads   */
/*  like a story you are inside of, not a form you are filling in.       */
/* ==================================================================== */

/** The guided opening. One goal at a time, in plain words, no jargon. */
export type Guide = { chapter: number; goal: string; why: string };
export const GUIDE_STEPS: Guide[] = [
  { chapter: 0, goal: "Buy Bitcoin with a quarter of your cash", why: "One tap on the QUICK BUY row does it. You cannot win a cycle from the sidelines." },
  { chapter: 1, goal: "Survive the quarter and end it yourself", why: "END QUARTER lets the market answer. Your money moves, then you see exactly where it went." },
  { chapter: 2, goal: "Get your coins off the exchange", why: "CUSTODY moves your bag to a wallet you own. Exchanges in this game really do collapse." },
];
export const guideFor = (chapter: number) => GUIDE_STEPS.find((g) => g.chapter === chapter);

export type Objective = { goal: string; why: string; urgent: boolean };

/** What the player should do right now, in one sentence a beginner understands. */
export const objectiveFor = (s: {
  chapter: number; positions: number; cash: number; hunger: number; stress: number;
  taxDebt: number; crash: boolean; presale: boolean; moves: number; net: number; bossNet: number;
}): Objective => {
  const guide = guideFor(s.chapter);
  if (guide) return { goal: guide.goal, why: guide.why, urgent: false };
  if (s.hunger >= 75) return { goal: "Eat something before hunger ends the run", why: "Hunger at 100 is game over. SURVIVE costs a move and some money — pay it.", urgent: true };
  if (s.stress >= 75) return { goal: "Calm down before your head goes", why: "Stress at 100 ends the run just like broke does. Take the move.", urgent: true };
  if (s.crash) return { goal: "Protect the bag: this quarter breaks charts", why: "Sell part of it, or hit the exit when the crash card comes. Frozen hands pay full price.", urgent: true };
  if (s.taxDebt > 0) return { goal: "Clear your tax debt before it grows", why: "Unpaid tax grows 5% every quarter and eats every green quarter you have.", urgent: true };
  if (!s.positions && s.cash > 0) return { goal: "Get money into the market", why: "Cash does not compound. The Boss is fully invested and he is ahead of you.", urgent: false };
  if (s.net < s.bossNet) return { goal: `Close the gap: he is ${Math.round(((s.bossNet - s.net) / Math.max(1, s.bossNet)) * 100)}% ahead`, why: "Out-trade his book. Beating him on net worth is the only way to the throne.", urgent: false };
  if (s.presale) return { goal: "Decide on the launch that is live", why: "Early tickets are the fastest money in the game and the fastest way to get rugged.", urgent: false };
  return { goal: "Take profit or add — but make the quarter count", why: "Doing nothing costs stress, hunger and money. Idle quarters are punished.", urgent: false };
};

/** Every number on screen can explain itself in one sentence. */
export const EXPLAIN: Record<string, string> = {
  net: "NET WORTH: your cash plus everything your positions are worth right now, minus tax you still owe.",
  cash: "CASH: money you can spend this quarter. Rent, food and tax come out of it whether you like it or not.",
  left: "QUARTERS LEFT: how much of 2020–2026 is still ahead of you. Surviving longer multiplies your score.",
  score: "BOSS SCORE: net worth × how far you survived × difficulty, plus every crisis you lived through, times your streak. Only this counts on the board.",
  moves: "MOVES: actions per quarter. Trading, moving coins, eating and changing your life each cost one.",
  risk: "RISK: how exposed you are through leverage. Above 95% the exchange force-closes your perps.",
  hunger: "HUNGER: reaches 100 and the run ends. Eating costs a move and real money.",
  stress: "STRESS: reaches 100 and you break. Cheap rent and leverage push it up, calm and green quarters bring it down.",
  streak: "STREAK: green quarters in a row. Each one multiplies your score, one red quarter resets it.",
  boss: "THE BOSS' BOOK: he trades his own money against you every quarter. Finish above him and you take the throne.",
  conviction: "CONVICTION: fills with good quarters. Armed, the next quarter counts 1.5x — up or down.",
  xp: "LEVEL: experience from every trade, crisis and survived quarter. Higher levels shave your living costs.",
};

/** The Boss talks back. Short, mean, and always about what just happened. */
export const BOSS_REACTIONS: Record<"win" | "loss" | "liq" | "crash" | "save" | "green" | "red" | "idle", string[]> = {
  win: ["Lucky. Do it twice.", "Careful, you almost looked like a trader.", "Screenshot it. It will not last."],
  loss: ["That one is going in my scrapbook.", "You paid tuition. Again.", "I felt that from across the room."],
  liq: ["Liquidated. My favourite sound.", "Your margin was my liquidity.", "Borrowed courage, returned empty."],
  crash: ["Everybody panics. Only the timing differs.", "This is the part where most people quit.", "Charts do not care about your plans."],
  save: ["Fast hands. Annoying.", "You got out. I noticed.", "Fine. That was actually good."],
  green: ["Green quarter. Do not get attached.", "You are up. Statistically, that is temporary.", "Enjoy it. I am still ahead of you."],
  red: ["Red again. The market is not confused, you are.", "Down. Predictably.", "You are funding somebody else's yacht."],
  idle: ["You did nothing. Doing nothing has a price.", "Sitting still is a position, and it is losing.", "The chart moved. You did not."],
};
export const bossReaction = (kind: keyof typeof BOSS_REACTIONS, salt: number) => {
  const list = BOSS_REACTIONS[kind];
  return list[Math.abs(salt) % list.length]!;
};

/** First-person beats: the moments a player actually remembers. */
export const MILESTONES: { id: string; net: number; line: string }[] = [
  { id: "m10k", net: 10_000, line: "Five figures. I stopped telling people it was a hobby." },
  { id: "m100k", net: 100_000, line: "Six figures. I sat in the dark and refreshed the screen for an hour." },
  { id: "m500k", net: 500_000, line: "Half a million. I started sleeping badly for entirely new reasons." },
  { id: "m1m", net: 1_000_000, line: "A million. Nobody in my family would believe the number, so I never said it." },
];

/** How many quarters until history hits again — the dread, without the spoiler. */
export const doomIn = (chapter: number) => {
  for (let c = chapter + 1; c <= CHAPTERS; c++) if (CRASHES[c] || EXCHANGE_FAILURES[c]) return c - chapter;
  return null;
};
