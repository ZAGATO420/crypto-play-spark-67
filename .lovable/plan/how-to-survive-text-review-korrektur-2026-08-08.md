# How-To-Survive Text Review & Korrektur

## Review deiner Version

**Stark:** Kurz, gescannt, deutlich besser lesbar als der alte Text. Core Loop, XP, Airdrop und Ton passen.

**Faktenfehler, die korrigiert werden müssen:**

1. **"84 months (2020-2027)" / "Game over at month 85"**
   - Falsch: Das Spiel läuft Jan 2020 → Dez 2026 = 84 Monate. Monat 85 existiert nicht. Ende ist bei `state.month >= 84`.
2. **"Hit 85 on either = Game Over" (Hunger / Stress)**
   - Falsch: Game Over ist bei Hunger >= 100 oder Stress >= 100. 85 ist nur die Schwelle für die "CRITICAL"-Warnung.
3. **"Top 3 by XP earn $TCFB airdrop"**
   - Falsch: Das Leaderboard sortiert nach Net Worth (Score = Net Worth + XP×10 + Monate×500 + Achievements×250). XP ist nur ein Teil des Scores, nicht das alleinige Kriterium.
4. **"Perps can 10x your gains"**
   - Untertrieben / irreführend: Im Perp-System sind 2x–50x Leverage möglich (`openPerp` clamped 2–50).
5. **"Wallet → One hack = you lose everything"**
   - Falsch: Exchange = 6% Chance auf Hack/Freeze mit Teil-Verlust; Ledger = 4% Chance, aber deutlich reduzierter Schaden. Ledger ist nicht 100% immun.
6. **"Start with $1.2k/month"**
   - Nur bedingt richtig: Nur bei "Keep the day job" = $1.200. Hybrid = $550. Full degen = $0.

## Vorgeschlagener korrigierter Text

```
HOW TO SURVIVE

🎯 THE GOAL
Survive 84 months (Jan 2020 → Dec 2026). Reach month 84 alive.
Almost nobody makes it past year one. Can you?

⚡ YOUR SETUP
Pick your country → sets rent & tax rate.
Pick your job → safe ($1.2k/mo), hybrid ($550/mo) or full degen ($0).
Pick custody → exchange is convenient but risky; Ledger costs $120 and cuts hack damage.
You get one life. Game over when hunger, stress, risk or health hits the limit.

🎮 THE CORE LOOP

1️⃣ Trade Coins
Use the slider to size each trade (-25% / +25% shortcuts).
Don't go all-in — one rug can wipe you out.
Spread your risk across multiple coins.

2️⃣ Watch Your Bars
🍔 Hunger & 😰 Stress climb every month.
Either hitting 100 = Game Over.
Keep them low with food, therapy, gym.

3️⃣ Manage Your Money
📊 Taxes → check the tax hint when you sell.
💳 Leverage → Perps allow 2x–50x. Gains scale fast; so do liquidations.
🔐 Wallet → Ledger reduces hack damage; exchange custody can freeze or drain part of your bag.

4️⃣ Autosave Every Month
Your progress saves automatically.
But you still need to make it through.

💰 GET XP & CLIMB
Every month survived, every dollar stacked and every achievement unlocked feeds XP.
Higher difficulty = bigger XP multiplier.
Your final score = Net Worth + XP×10 + Months×500 + Achievements×250.

🏆 THE TOP 3 WIN
October 2026:
Top 3 leaderboard scores earn a $TCFB airdrop.
Global leaderboard. Real stakes.

⚠️ REMEMBER
You start as a nobody with a boring job.
The degen life is waiting, but it's dangerous.
One mistake and you're done.
One smart trade and you're rich.
The crypto market from 2020–2026 is real.
Your decisions matter.
```

## Zusätzlich zu korrigieren

Das In-Game-Tutorial (`tutorial-overlay`) behauptet ebenfalls "Over 85 and your run is over" für Hunger/Stress. Das muss auf "100" geändert werden, damit Text und Code konsistent sind.

## Umsetzung

- `public/game.html` Zeile ~938: `<div class="howto">…</div>` durch den korrigierten Text ersetzen.
- `public/game.html` Zeile ~4196: Tutorial-Schritt 3 "Over 85" → "100" korrigieren.
- Optional: Start-Screen-Subline "Survive January 2020 → December 2026" ist bereits korrekt, bleibt.
