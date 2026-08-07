# Perp-Popup, scrollfreie Panels & Regler-Fix

## 1. Perp-Trading als Popup (wie das Coin-Trade-Fenster)
Im Terminal-Modus ⚡ PERPS zeigt das Grid künftig nur noch:
- **Perp-Tiles** für BTC / ETH / SOL im gleichen Look wie die Coin-Kacheln (Symbol, Mark-Preis, Monatsänderung, kleiner "⚡ LEVERAGE"-Hinweis). Klick öffnet das Perp-Popup.
- **Offene Positionen** als kompakte Karten: Leverage + Richtung, Margin/Size/Entry, PnL in $ und %, Risiko-Balken zur Liquidation, Buttons CLOSE 50 % / CLOSE ALL. Keine Sparkline und kein Net-Worth-Chart mehr im Grid — der PnL-Verlauf wandert ins Popup der Position.

Das Perp-Popup enthält alles, was heute die lange Karte aufbläht, in einem festen, nicht scrollenden Fenster:
- Leverage-Chips 2x–50x plus Slider
- **MARGIN ($)** mit Eingabefeld, Slider und Chips 10/25/50/MAX
- **POSITION SIZE ($)** mit Eingabefeld, live verkoppelt mit Margin
- Vorschau: Coins, Fee, Liq-Preis Long/Short, benötigtes Cash
- LONG (grün) / SHORT (rot) als Abschlussbuttons, Warnhinweis bei Cash- oder Leverage-Grenze
- Bei einer offenen Position: PnL-Chart, Risiko-Balken, Teil-Schliessung

## 2. Stufenlose Regler & manuelle Eingabe reparieren
Ursache: jede Eingabe baut heute das komplette Fenster bzw. das ganze Terminal neu auf. Der gerade gezogene Slider wird dabei ersetzt, deshalb bricht der Zug ab; das Zahlenfeld verliert den Fokus und wirkt "tot". Ausserdem rendert ein Timer alle 0,9 s neu.

Fix:
- Popup-Markup wird **einmal** gebaut; Eingaben aktualisieren nur noch Textwerte und Balkenbreiten, nicht das DOM-Gerüst.
- Während einer aktiven Eingabe (Drag oder Tastatur) ist das Auto-Refresh gesperrt, das Feld wird nicht überschrieben.
- Slider: `step=1` beim Coin-Trade, Margin-Slider wird stufenlos (kein 10er-Raster) und arbeitet auf einer prozentualen Skala, damit auch grosse Cash-Beträge feinfühlig einstellbar sind.
- Manuelle Eingabe im Perp-Fenster (Margin **und** Size) greift sofort und rechnet das jeweils andere Feld nach.
- Touch: `touch-action:none` auf den Reglern, damit mobil kein Scroll den Drag klaut.

## 3. Panels: PNL, Ein- und Ausgaben, Ledger ohne Scrollen
Jedes Panel bekommt eine feste Kompaktansicht plus Vollbild-Popup:
- **PNL / Chart-Panel**: Chart + Kennzahlenzeile (Unrealised, Realised, Fees, Steuern) in einer 2-spaltigen Kachelreihe, Schrift skaliert mit der Panelhöhe. Button "DETAILS" öffnet die volle Auswertung als Popup.
- **INCOME / COSTS / CASHFLOW**: nur die drei Summen plus grösster Kostenblock; "ALLE POSTEN" öffnet die Aufschlüsselung im Popup.
- **CASH LEDGER**: die letzten 5 Buchungen, Button "ALLE BUCHUNGEN" öffnet das Popup mit der vollen Liste (dort darf gescrollt werden).
- `overflow:hidden` auf allen Panels im Single-Screen-Layout, damit nirgends mehr eine Scrollbar auftaucht; Popups selbst sind auf 88 vh begrenzt.

## 4. Optischer Feinschliff
- Perp-Tiles, Positionskarten und Popups nutzen das gleiche Glas-/Hairline-Design wie die Coin-Kacheln — Gold nur als Akzent, Grün/Rot nur für Richtung und PnL.
- Einheitliche Popup-Kopfzeile (Icon, Titel, Untertitel, ✕) für Trade, Perp, Ledger und Details.
- Mobile: Popups full-width am unteren Rand, Buttons mit 44 px Trefferfläche, Regler höher.

## Technische Notizen
Alles in `public/game.html`:
- Neues Popup `#pp-modal` mit `ppOpen(sym)` / `ppClose()` / `ppRender()`; `renderPerpDesk()` reduziert auf Tiles + Positionskarten, `dxPerp()` ruft `ppOpen(sym)`.
- `setPerpMargin` / `setPerpSize` / `setPerpLevSym` rufen nicht mehr `renderMarket()`, sondern `ppPatch()` (nur Werte-Update); `_dragLock`-Flag pausiert `setInterval`-Refresh und `updatePerpLive`-Overwrites.
- `dxRender(skipInput)` wird auf ein einmaliges `build` + `patch` umgestellt, damit der Slider beim Ziehen erhalten bleibt.
- Neue Detail-Popups `panelModal(kind)` für PNL / Cashflow / Ledger; Panels bekommen `overflow:hidden` und `clamp()`-Typografie.
