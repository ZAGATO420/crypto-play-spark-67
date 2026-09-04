# Kopf und Fuß aufräumen, Terminal wie eine echte Börse

Auf deinem Screenshot liegen die drei Knöpfe (Ton, Einstellungen, Beenden) mitten über dem Werte-Streifen: „THIS MONTH" und „PERP PNL" sind dahinter nicht lesbar. Unten links deckt der STREAK-Chip die Monatsanzeige und den Fortschrittsbalken ab. Beides sind Platzierungsfehler, keine fehlenden Funktionen.

## 1. Die drei Knöpfe bekommen einen eigenen Platz

- Am Desktop wandern Ton, Einstellungen und Beenden in die rechte Ecke der Kopfzeile, in einer eigenen Spur — sie liegen nie mehr über Werten.
- Der Werte-Streifen beginnt erst nach dieser Spur, alle Kacheln bleiben vollständig lesbar.
- Am Handy bleiben sie oben rechts, mindestens 44 px, mit Abstand zur Statusleiste. Beenden behält die rote Kontur.
- Kontrolle: an jedem Kachel-Mittelpunkt wird geprüft, dass kein Knopf darüber liegt.

## 2. Fußzeile ohne Überlappung

- Die Fußzeile wird eine echte Reihe: links Spieler-/Streak-Info, Mitte Tempo und Pause, rechts P&L und NEXT MONTH — nichts liegt mehr übereinander.
- Der STREAK-Chip wird ein schmales Element in dieser Reihe statt ein schwebender Aufkleber; Monat und Balken bleiben immer sichtbar.
- Am Handy: Streak und Monat in einer Zeile über der Leiste, NEXT MONTH immer erreichbar.

## 3. Börsen-Gefühl statt Kacheln

- Der Markt wird eine echte Kursliste: Coin mit Logo, Preis in Mono-Schrift rechtsbündig, Monatsänderung als farbige Zahl, Besitz darunter, ein Balken für relative Größe. Zeilen blinken kurz grün/rot bei Preisänderung — wie ein Orderbuch.
- Der Chart bekommt Einstiegslinie, Liquidationslinie und Achsen mit klaren Beschriftungen; darunter eine Zeile mit Hoch/Tief/Änderung.
- Jede Zeile trägt direkt BUY und LONG/SHORT — Hebel-Trade bleibt zwei Tipps entfernt.
- Ruhigeres Nachtblau, eine einzige Kantenstärke, Gold nur für Kontostand und Bestätigen, Grün/Rot nur für Auf/Ab. Kein Neon-Overkill mehr.
- Am Handy dieselbe Liste, nur eine Bühne gleichzeitig (MARKET · CHART · POSITIONS · MORE · NEXT MONTH).

## 4. Alle Summen laufen wirklich

- Jede Zahl im Streifen wird bei jedem Monatswechsel und nach jedem Trade neu berechnet und weich hochgezählt: Kontostand, Gesamt-P&L, Monats-P&L, Perp-P&L, Cash, Coin-Wert, Risiko, Hunger, Stress.
- Ein Prüf-Durchlauf über 12 Monate vergleicht: Cash + Coin-Wert + offene Positionen = Kontostand, und Summe der Einzel-P&L = Gesamt-P&L. Abweichungen werden behoben.
- „none" bei Perp-P&L wird zu „$0", damit keine Kachel leer wirkt.

## Abnahme

Playwright bei 390×844, 414×896, 430×932, 768×1024 und 1280×800: kein Knopf über einer Wertekachel, Fußzeile ohne Überlappung, Monat und Balken sichtbar, jede Tippfläche ≥ 44 px, kein horizontales Scrollen, 12 Monate mit stimmenden Summen, keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`:
- `body.v30 .hud-sys` (Zeile ~11987) verliert `position:absolute; left:50%`; stattdessen eigene Grid-Spur im HUD, `z-index` über dem Streifen, ohne Überdeckung.
- `#v22-order`/`.ostreak` als Inline-Element in eine neue Footer-Grid-Zeile statt fixiert; alte `position:fixed`-Regeln aus `v22-core` entfernen.
- Marktliste als neue Listenansicht im `v30`-Layer (Ersatz für die Kachel-Regeln aus `v17`/`v29`), Flash-Klasse per Preis-Diff im bestehenden Render.
- Chart: Annotation-Linien für Entry/Liquidation, `update('none')` statt Neuaufbau.
- Werte-Streifen: `renderV30Bar()` an den `requestAnimationFrame`-Scheduler und an `nextMonth()`/Trade-Ende hängen; Tween für Zahlen.
- Unberührt: historische Preise 2020–2026, XP, Perp-Mathematik, Leaderboard, Story, Startscreen (V27), Endkarte (V26).
