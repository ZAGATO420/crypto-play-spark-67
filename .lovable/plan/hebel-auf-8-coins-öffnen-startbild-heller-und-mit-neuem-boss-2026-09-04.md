# Hebel auf 8 Coins öffnen + Startbild heller und mit neuem Boss

## 1. Hebel-Trading: 8 Coins statt heimlich nur drei

Heute sind nur BTC, ETH und SOL hebelbar, und der ⚡-PERP-Knopf in der Positionszeile springt fest auf BTC — deshalb landet man immer bei BTC.

- Hebelbar werden acht Coins: **BTC, ETH, SOL, DOGE, AVAX, LINK, ADA, DOT**. Coins, die im jeweiligen Jahr noch nicht existieren, erscheinen ausgegraut mit dem Jahr ihres Starts statt zu verschwinden.
- Der ⚡-PERP-Knopf öffnet nicht mehr direkt BTC, sondern eine **Auswahl-Ansicht**: pro Coin eine Zeile mit Logo, Symbol, Preis, Monatsänderung und LONG/SHORT — daraus geht es in ein Tippen weiter ins Hebel-Fenster.
- Jede Coin-Zeile im Markt und der Chart bekommen weiterhin direkt ⚡ LONG/SHORT für genau diesen Coin; nicht hebelbare Coins zeigen dort klar "SPOT ONLY" statt eines toten Knopfes.
- Unverändert: Hebel 2×–50×, Mindest-Margin, maximal 3 offene Positionen, Liquidations- und Funding-Rechnung.

## 2. Startbild: heller, wärmer, lebendiger

- Der Hintergrund geht von Fast-Schwarz auf ein tiefes, aber sichtbar beleuchtetes Nachtblau mit Gold-/Acid-Licht von hinten; Textblöcke behalten lokalen Kontrast, damit alles lesbar bleibt.
- Mehr Leben: sanft fallende Coins, ein laufender Kurs-Ticker am Rand, weich hochzählende Zahlen (Spieler, Rekord), leichtes Pulsieren am ENTER-Knopf.
- Der große CTA bleibt der einzige Blickfang; Nebeninformationen rücken optisch zurück.

## 3. Neues Boss-Motiv zur Auswahl

Ich erzeuge drei neue Hauptmotive und zeige sie dir zum Aussuchen, bevor eines eingebaut wird:

1. **Thron-König** — Boss auf einem Thron aus Chart-Kerzen, Gold und Acid-Grün, scharf und hell ausgeleuchtet.
2. **Silhouette gegen die Kurve** — dunkle Figur vor einem riesigen, leuchtenden Kursverlauf; mysteriös, weniger Kreatur-Detail.
3. **Maskierter Trader** — moderner Boss mit Maske/Helm vor Terminal-Wand, klar als Spielfigur lesbar.

Du wählst eins, das wird eingebaut; die anderen bleiben unbenutzt. Wenn dir alle drei nicht passen, mache ich eine zweite Runde.

## 4. Abnahme

Playwright bei 390×844 und 1280×800: Hebel-Auswahl zeigt alle acht Coins, jeder öffnet eine Position im richtigen Coin, gesperrte Coins sind erklärt, Positionszeile zeigt danach genau diesen Trade; Startbild ohne Querscrollen, Text auf jedem Motiv lesbar, keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`:
- `perpSyms()` → Liste `PERP_SET=['BTC','ETH','SOL','DOGE','AVAX','LINK','ADA','DOT']`, gefiltert nach `state.prices[s]>0`, gesperrte Coins separat für die Anzeige.
- `data-v29="newperp"` (fester `sym='BTC'`) wird durch einen Picker ersetzt, der `v6Perp(sym)` mit dem gewählten Symbol aufruft.
- Coin-Fenster/Markt-Zeile: ⚡-Knopf nur für Coins aus `PERP_SET`, sonst "SPOT ONLY"-Hinweis.
- Startbild: `v27-gate`/`v21`-Layer aufhellen (Hintergrund, Vignette, Boss-Opacity), Ticker + Coin-Regen als leichte CSS/Canvas-Ebene, kein neuer Layout-Layer.
- Boss-Motiv als neues WebP über `lovable-assets` (CDN), ersetzt nur die Bildquelle des Titelmotivs.
- Unberührt: Perp-Mathematik, historische Preise, XP, Leaderboard, Endkarte, Terminal-Layout V30/V31.
