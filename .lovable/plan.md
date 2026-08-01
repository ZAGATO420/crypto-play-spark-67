## Umfang

Historical-Wissen bleibt unangetastet — wer die echten Projekte kennt, soll in diesem Modus belohnt werden. Stattdessen: Side Quests limitieren, alle Stufen (inklusive EASY und NORMAL) härter machen, End-Screen im CI neu bauen, plus neue Features.

## 1. Side Quests begrenzen

Aktuell ist der Button „PLAY SIDE QUEST" in `public/game.html` dauerhaft aktiv (nur durch Cash begrenzt), zusätzlich 22% Zufallschance pro Monat. Der Erwartungswert ist positiv (Gas War zahlt 2.6×, „Backrun" gibt den Einsatz voll zurück) — damit ist es eine Geldmaschine.

- **Ticket-System:** 1 Ticket pro Quartal, weitere nur als Belohnung aus Quests/Achievements. Sichtbarer Ticket-Zähler im Ops-Panel.
- Zufalls-Trigger bleibt, wird aber kontextgebunden: Gas War beim Sniping, Rug Detector bei Launches, Candle Call bei hoher Volatilität.
- Erwartungswert wird negativ: „Backrun" zahlt nur 0.6×, das Gas-Fenster schrumpft mit steigendem Monat, Einsätze skalieren mit dem Netto. Side Quests = Gamble, nicht Einkommen.

## 2. Härtere Balance auf allen Stufen

- **Startkapital-Boni runter:** EASY 1.25× (statt 1.5×), NORMAL 1.05× (statt 1.2×), BOSS 0.85×.
- **Kostenfaktoren rauf:** EASY 0.85 (statt 0.6), NORMAL 1.0 (statt 0.8), BOSS 1.25.
- **Risikofaktoren rauf:** EASY 0.75 (statt 0.5), NORMAL 0.9 (statt 0.75) — auch auf EASY tut ein Drainer weh.
- **Inflation:** Miete, Essen und Fees steigen jährlich um 8–12%, mit sichtbarem Hinweis im Kostenpanel. Fixkosten wachsen also über die 84 Monate mit.
- **Sicherheitsnetze entschärfen:** Zwangsverkauf nur noch mit 6% Notverkaufs-Abschlag plus Stress-Strafe und maximal 3× pro Run; Auto-Mahlzeit kostet mehr und greift nur bei ausreichend Cash.
- **Jahresende-Steuer:** realisierte Gewinne werden mit dem echten Ländersatz nachversteuert statt pauschal 35% — CH bleibt günstig, DE/USA tun weh.
- **Schulden verzinsen sich** monatlich, Margin-Call bei zu hohem Perp-Risiko, harte Verlust-Events (CEX-Insolvenz, Wallet-Drainer) bekommen echtes Gewicht.

## 3. End-Screen komplett neu im CI

Aktuell technisch alt: doppelte `id="end-lb-list"` (lokales und globales Board kollidieren), doppelte `style`-Attribute, Label „RUN RECAP // v2.1 DEV", per JS nachgehängte CTA-Box, keine CI-Farben.

- Neuer Aufbau: Boss-Rank-Karte mit Affe, Gold/Purple-Verlauf, animierte Zähler für Netto/XP/Monate.
- Kacheln für Trades, Rugs, Moons, Liquidationen, Airdrops; Achievements als Grid.
- Globales und lokales Leaderboard klar getrennt (ID-Kollision behoben), Submit-Feld im neuen Stil, durchgehend Englisch.
- Share-Card als Bild-Export im CI plus X-Share mit vorformuliertem Text und Score.

## 4. Neue Features

1. **Daily Challenge / Seed-Run** — täglich fester Seed, alle spielen dasselbe Szenario, direkt vergleichbare Scores. Ideal für X-Posts und tägliche Rückkehr.
2. **Rivalen** — 3 KI-Degens mit eigenem Portfolio, laufender Vergleich während des Runs.
3. **Prestige** — nach dem Run permanente Perks freischalten, NG+ mit härteren Modifikatoren.

## Technische Details

- Alles im Single-File `public/game.html`: Balance-Konstanten, Minigame-Gating, End-Screen-Markup und Renderer.
- `src/routes/api/public/leaderboard.ts`: Plausibilitätsgrenzen an die neue Ökonomie anpassen, `mode`-Enum um die Daily-Challenge-Modi erweitern.
- Verifikation per Playwright: automatisierte Runs auf EASY/NORMAL/BOSS (je mit und ohne Ironman) mit „nur essen und durchklicken"-Strategie. Ziel: diese Strategie überlebt keine 84 Monate mehr, auch nicht auf EASY.
