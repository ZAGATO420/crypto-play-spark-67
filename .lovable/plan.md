# V13 — "Neon Trading Pit": Optik-Sprung + Brutal-Balance + faire Modi

Die Prototypen waren flacher als dein Live-Terminal — deshalb keine generische Variante, sondern ein Ausbau deines bestehenden Terminals mit einer klaren Kunstrichtung. Layout, Panels und Mechanik bleiben exakt wie jetzt; alles davor ist Haut, Licht und Detail.

## 1. Die Richtung: "Neon Trading Pit"

Metapher: ein beleuchteter Handelsraum um 3 Uhr morgens. Grünes Tape läuft heiß, Blattgold auf der Boss-Krone, warmes CRT-Licht statt kaltes Mondlicht. Weg vom blauen Nachtmodus, hin zu warmem Schwarz mit lebendigem Neon.

**Farbsystem (CI bleibt)**
- Basis: warmes Schwarz statt Blauschwarz (`#050505` / Panels `#0b0b0d`), Ränder in warmem Grau — das nimmt sofort die Kühle raus.
- Aktion = Neon-Grün (`#39ff14` gedämpft für Flächen, voll für Glow): Execute, Buy, Long, NEXT MONTH, aktive Chips.
- Gold `#f0b429` bleibt Geld und Prestige: Net Worth, Rank, Achievements, Boss-Momente.
- Violett `#8b5cf6` bleibt Story und Risiko: Decisions, Presales, XP.
- Rot nur für echten Schmerz: Short, Loss, Liquidation.
- Regel: pro Panel höchstens eine Leuchtfarbe. Kein Regenbogen.

**Licht und Material**
- Jedes Panel bekommt eine gebürstete Metallplatte statt flaches Grau: leichter Innen-Verlauf, 1px heller Oberkante, tiefer Schatten unten. Das erzeugt Tiefe ohne neue Elemente.
- Sehr feine Scanline- und Grain-Textur über dem Terminal (Deckkraft ~3 %), abschaltbar in den Settings für schwache Geräte.
- Gewinne/Verluste pulsieren die Panel-Kante kurz grün/rot statt nur die Zahl zu färben.
- Aktive Panels erhalten Ecken-Klammern (Tactical-Brackets) — kostet nichts, wirkt teuer.

**Typografie**
- Headlines und Zahlen: Archivo Black, sehr eng gesetzt. Net Worth wird die größte Type auf dem Screen.
- Body und Labels: Hind.
- Monospace nur noch für Kurse, Ticker und Log — dadurch fühlt sich der Rest wärmer an.

**Bilder (Dichte 6/10)**
- Coin-Logos in den Market-Tiles größer und mit farbigem Halo pro Coin.
- Der gekrönte Boss-Affe kehrt zurück, aber als Wasserzeichen/Sigil: sehr dezent im Chart-Hintergrund und im Endscreen groß.
- Kleine Illustrationen als Panel-Marken: Airdrop, Launchpad, Perps, Shop.
- Ein laufendes Tape (Ticker) unter dem HUD als lebendiges Detail.
- Charakter-Portrait des Archetyps im Player-Panel größer und beleuchtet.

**Micro-Details, die den Unterschied machen**
- Zahlen zählen animiert hoch/ab statt zu springen.
- Buttons drücken sich physisch (1px Versatz + kurzer Glow), Execute hat einen Aufblitz.
- Chart: warme Grid-Linien, grüner Verlauf unter der Kurve, Liquidations-Linie in Rot mit Beschriftung.
- Monatswechsel: kurze Lichtwelle über das Terminal.

Startscreen, How-to, Decisions und Endscreen bekommen dieselbe Sprache, damit alles wie eine Serie wirkt.

## 2. Difficulty: "Brutal" — 17 Billionen sind vorbei

Die Wirtschaft skaliert derzeit ungebremst, deshalb explodiert alles Richtung Bull. Neue Bremsen, alle sichtbar im UI:

- **Whale-Slippage:** je größer die Order relativ zur Marktgröße des Coins, desto schlechter der Fill. Ab 7-stelligen Orders spürbar, ab 8-stelligen brutal. Wird vor dem Klick angezeigt.
- **Marktimpakt:** große Käufe treiben den Preis, große Verkäufe drücken ihn — Ein- und Ausstieg kosten echtes Geld.
- **Verwaltungs-/Vermögenssteuer:** progressive Jahresabgabe auf realisierte Gewinne und ab 7-stellig auch auf Vermögenszuwachs, nach Land gestaffelt.
- **Perp-Funding und Haltekosten** steigen mit Positionsgröße und Dauer.
- **Rampe verkürzt:** die günstigen ersten Monate laufen schneller aus, Inflation und Bärenfenster greifen härter.
- **Soft-Cap auf Exponentialwachstum:** über bestimmten Schwellen sinkt die Effizienz von Presales/Airdrops (Allokation wird gedeckelt, nicht der Preis manipuliert) — ein Milliarden-Run wird eine Ausnahme, keine Regel.

Ziel: EASY = Lernmodus, NORMAL = mit Disziplin schaffbar im Millionenbereich, BOSS = die wenigsten kommen bis 2027 durch. Nach dem Bau simuliere ich mehrere Runs pro Stufe und justiere die Zahlen, bis sich das trifft.

## 3. Historical vs Chaos: gerecht gerechnet

Problem: Historical ist vorhersehbar (wer die Geschichte kennt, gewinnt sicher), Chaos ist echtes Risiko. Gleiche XP sind damit ungerecht.

- **Historical:** Ergebnisse folgen der echten Historie. XP-Faktor **0,75**, Presale-Auszahlungen leicht gedeckelt. Belohnt Wissen, nicht Glück.
- **Chaos:** Ausgang offen, mehr Rugs und mehr Moonshots. XP-Faktor **1,25**, plus kleiner Streak-Bonus für richtige Risikoentscheidungen in Folge.
- Der Leaderboard-Score gewichtet dieselben Faktoren, damit ein Historical-Run einen Chaos-Run nicht allein durch Vorwissen überholt.
- **Sichtbar in der Auswahlbox:** jede Mode-Karte bekommt Titel, einen Satz Erklärung und einen deutlichen XP-Badge (`XP x0.75 · vorhersehbar` / `XP x1.25 · unvorhersehbar`). Dazu ein Hinweis unter dem Block, warum das so gerechnet wird.
- Ironman (x2) und Difficulty-Multiplikator bleiben und multiplizieren sich damit.

## Technische Notizen
- Alles in `public/game.html`. Neue Token-Ebene in `:root` (`--bg` warm, `--neon`, `--plate`, `--grain`), neue Style-Sektion `v13-skin`, die bestehende Panel-, Button- und Tile-Klassen überschreibt — kein Umbau des Markups.
- Textur-Overlay als ein fixed Layer mit `pointer-events:none`, per Settings-Flag abschaltbar; Zahl-Animation über einen kleinen Tween-Helfer.
- Balance: `DIFF`-Tabelle neu, `rampMult()` kürzer, neue Funktionen `slippage(sym, usd)`, `marketImpact()`, `wealthTax()`, Funding in `processPerps()`, Allokations-Cap in `refreshPresales()`/`refreshAirdrops()`.
- XP: `getXPMultiplier()` erhält den Mode-Faktor; `rankScore()` in `src/routes/api/public/leaderboard.ts` gewichtet Mode analog, Plausibilitäts-Obergrenze wird an die neue Wirtschaft angepasst.
- QA per Playwright: Screenshots von Startscreen, Terminal, Decision, Perp-Desk und Endscreen in Laptop-, Tablet- und Handybreite (scrollfrei, kein Überlauf) plus mehrere simulierte Runs zur Balance-Kontrolle.

Nicht angetastet: Layout und Panel-Anordnung, historische Preisdaten, Quest-Inhalte, Sound.
