# Perps-Desk verbessern + Schwierigkeitsgrade schärfen

## 1. Liquidations-Balken umdrehen (Risiko-Balken)
Heute zeigt der Balken "Abstand zur Liquidation" und ist beim Einstieg deshalb immer voll — das sieht aus wie ein Fehler.

Neu: **RISK TO LIQ** füllt sich von links, startet bei 0 %.
- 0 % beim Entry, 100 % bei Liquidation
- Farben: grün unter 40 %, gold 40–70 %, rot über 70 %, ab 85 % pulsiert der Balken
- Zusatzzeile unter dem Balken: "Liq bei $X · Y % Kursbewegung entfernt" — damit sofort sichtbar ist, dass 50x nur ~1,8 % Bewegung erlaubt und 2x fast 46 %
- Kleiner Marker im Balken zeigt die aktuelle Mark-Position

## 2. PnL-Diagramme direkt an der Anzeige
- **Mini-Chart pro Position**: schmale Sparkline unmittelbar unter dem Risiko-Balken auf jeder offenen Perp-Karte, gefüttert aus dem täglichen Tick (grün im Plus, rot im Minus)
- **Portfolio-Chart oben im Perps-Desk**: das bestehende Net-Worth-Diagramm erscheint im ⚡ PERPS-Modus zusätzlich als breite Karte über den Positionen, damit man Perp-Wirkung und Gesamtvermögen zusammen sieht

## 3. Positionsgrösse in Dollar eingeben
Antwort auf deine Frage: ja, das gehört dazu. Künftig sind Margin und Positionsgrösse zwei verbundene Felder:
- Feld **MARGIN ($)** — was du aus dem Cash riskierst
- Feld **POSITION SIZE ($)** — die Notional-Grösse (Margin x Leverage)
- Änderst du eines, rechnet das andere live nach; setzt du beide, passt sich die Leverage im erlaubten Rahmen an
- Schnell-Chips bleiben, dazu Warnhinweis, wenn Size das Cash-Limit oder die Leverage-Grenze reisst

## 4. Schwierigkeitsgrade neu austariert
Heute liegen NORMAL und BOSS fast gleich (Kostenfaktor 1.00 vs 1.04, gleiches Startkapital) — deshalb fühlt sich BOSS nicht wie BOSS an.

Neue Spreizung:

| | EASY | NORMAL | BOSS |
|---|---|---|---|
| Startkapital | grosszügig | knapp | sehr knapp |
| Lebenskosten | niedrig | real | deutlich höher |
| Inflation p. a. | ~5 % | ~8 % | ~11 %, steigend |
| Gebühren/Steuern | mild | real | hart |
| Stress/Hunger-Tempo | langsam | real | schnell |
| Katastrophen-Rate | selten | real | häufig und teurer |

Zusätzlich für alle Stufen:
- Kosten-Rampe: der Rabatt der ersten Monate wird kürzer, die "Gratis-Jahre" am Anfang fallen weg
- Perps kosten mehr Nerven: höherer Stress- und Risikoaufschlag pro offener Position, Liquidationen ziehen extra Stress
- Monatliche Funding-Kosten auf offene Perps, damit Dauer-Leverage nicht gratis ist
- "Rekt-Fenster": in den Bärenphasen (2022, 2025) sind Kosten und Ereignisse härter

Ziel: EASY = Lernmodus, NORMAL = schaffbar mit Disziplin, BOSS = nur wenige kommen bis 2027 durch.

## 5. Boss-Belohnung
Wer BOSS bis 2027 überlebt, bekommt eine eigene Endkarte:
- Titel **FINAL BOSS DEFEATED** mit Gold/Violett-Rahmen und Affen-Siegel
- BOSS-XP-Multiplikator und Abschluss-Bonus klar über NORMAL
- eigenes Achievement plus Kennzeichnung im globalen Leaderboard
- eigene Boss-Variante im Share-Text

## Technische Notizen
Alles in `public/game.html`:
- `perpLiqDist()` wird zu `perpRisk()` (invertiert), `.liq-bar` bekommt Marker- und Pulse-Klasse
- `renderPerpDesk()`: Portfolio-Chart-Karte oben, Sparkline-Canvas pro Position, gefüttert aus `p.hist` (Push in `advanceDays` / `updatePerpLive`)
- `perpDraft(sym)` erhält `size`; `setPerpSize()` / `setPerpMargin()` halten Margin x Lev = Size synchron
- `DIFF` neu gesetzt, `rampMult()` kürzere Rampe, Funding in `processPerps()`
- Endscreen: BOSS-Win-Zweig in `endGame()` und Recap-Karte, Bonus in `calculateXP()`