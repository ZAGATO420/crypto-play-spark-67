# V30: Terminal komplett neu — wie eine echte Trading-Plattform

Das Terminal ist über 28 Style-Schichten gewachsen, die sich mit 364 `!important`-Regeln gegenseitig überschreiben. Deshalb wirkt es kalt, unübersichtlich und ruckelt beim schnellen Spielen. Wir bauen das Terminal einmal neu — Startbild und Endkarte bleiben, wie sie sind.

## 1. Ein Bildschirm, alles sichtbar, kein Ausklappen

Handy, immer dieselbe Reihenfolge, nichts versteckt:

```text
KOPF       Net Worth (groß)  ·  Monat 7/84  ·  Ton · Beenden
STREIFEN   PNL heute +$412 (+8,2%)  ·  Cash  ·  Coins  ·  Hunger ▮▮▯  ·  Stress ▮▯▯
SURVIVAL   [ EAT $120 ]   [ CALM $90 ]     (nur wenn nötig, sonst ruhig)
POSITION   ETH 2x LONG  +$412  ·  Liq in 14%   [ CLOSE ]  [ 50% ]
BÜHNE      MARKET | CHART | POSITIONS  (genau eine)
LEISTE     MARKET · CHART · POSITIONS · MORE · NEXT MONTH
```

- Die Ausklapp-Leiste „STATS & SPEED" verschwindet ganz. Hunger, Stress, Cash, Coin-Wert und Tages-PNL stehen dauerhaft in einem schmalen Werte-Streifen direkt unter dem Kontostand.
- Der Gesamt-PNL und der PNL jeder Hebel-Position stehen ohne einen einzigen Klick auf dem Startbildschirm des Terminals.
- Kein Element hat mehr eine feste Höhe, die Inhalt abschneidet; Bühnen scrollen innen.

## 2. Optik: es soll sich anfassen wie eine Börse, nicht wie eine Tabelle

- Ruhiges dunkles Nachtblau statt Fast-Schwarz, feines Raster, klare Karten mit einer einzigen Kantenstärke.
- Preise und Zahlen in Mono-Schrift, Auf/Ab in Grün/Rot, Gold nur für Net Worth und Bestätigen.
- Zahlen zählen weich hoch statt zu springen; Gewinn pulst kurz grün, Verlust rot, Liquidation schüttelt den Bildschirm einmal.
- Chart bekommt Einstiegslinie und Liquidationslinie eingezeichnet — man sieht sofort, wie nah es wird.
- Der Gorilla-Boss kommentiert Momente mit einem Satz in einer festen Ecke, nicht in Sprechblasen über dem Spiel.
- Nur **eine** Meldung gleichzeitig: Story-Karte, Hinweis, Toast und Boss-Kommentar laufen durch eine Warteschlange.

## 3. Mittelweg beim Umfang

- Immer sichtbar und direkt bedienbar: Markt, Chart, Positionen, Perps, Survival, Monatswechsel.
- Launchpad, Airdrops, Presales, Business, Shop, Trophies, Quests und Ledger bleiben alle erhalten, wandern aber in **ein** Fenster „MORE" als großes Kachelraster mit Symbol, Name, einer Erklärzeile und einem Zähler, wenn dort etwas zu tun ist. Nichts wird gestrichen, nichts liegt mehr in versteckten Reitern.
- Hebel-Trade in zwei Tipps: von jeder Coin-Kachel und vom Chart direkt LONG/SHORT, Richtung + Hebel-Chips + Einsatz-Chips + Klartext-Vorschau („Liquidation bei $2.840, das sind −18 % von hier").

## 4. Ruckeln beim schnellen Spielen

- Das Terminal wird nur noch bei echten Änderungen neu gezeichnet, gebündelt pro Bild (statt bei jedem Ereignis mehrfach).
- Chart aktualisiert Daten statt sich neu aufzubauen; Coin-Logos werden einmal erzeugt und wiederverwendet.
- Schnelles Tippen auf NEXT MONTH wird sauber in eine Reihe gestellt, damit sich Monatswechsel nicht überlappen.
- Ziel: Monatswechsel unter 100 ms auf dem Handy, kein Hängen bei 12 schnellen Monaten hintereinander.

## 5. Ton neu gebaut

- Die alten prozeduralen Töne (Ursache der Knackser und komischen Geräusche) werden ersetzt: ein moderner ruhiger Loop plus wenige klare Effekte für Kauf, Verkauf, Liquidation, Level-Up, Monatswechsel.
- Jeder Ton bekommt eine weiche Ein-/Ausblende, damit es nicht mehr knackst; gleichzeitige Töne werden begrenzt.
- Musik und Effekte getrennt regelbar, Musik leise als Standard, Pause bei Tab-Wechsel, weiches Ausblenden im Endscreen.

## 6. Abnahme

Playwright bei 390×844, 414×896, 430×932, 768×1024 und 1280×800: Hunger/Stress/PNL ohne Klick sichtbar, nie mehr als eine Meldung gleichzeitig, Perp in zwei Tipps offen und danach in der Positionszeile sichtbar, jede Tippfläche ≥ 44 px, kein horizontales Scrollen, NEXT MONTH immer erreichbar, 12 schnelle Monate ohne Hänger, keine Konsolenfehler, keine Knackser im Ton.

## Technische Notizen

Alles in `public/game.html`:
- Neuer Layer `<style id="v30">` als **einzige** Layout-Quelle für Terminal (Handy + Desktop). Die Layout-Anteile aus `v4`–`v29` (`v4-skin`, `v5-skin(+tail)`, `v6-skin`, `v7-skin`, `v8-polish`, `v10-story`, `terminal-layout`, `v13`–`v18`, `v20`–`v24`, `v28`, `v29`) werden gelöscht statt überschrieben; Ziel unter 40 `!important` (heute 364). `v9-endcard`, `v26-end`, `v27-gate` bleiben unangetastet.
- Neuer Werte-Streifen `#v30-stats` (PNL/Cash/Coins/Hunger/Stress + EAT/CALM) ersetzt die `STATS & SPEED`-Collapsibles aus `v23-slimhead`/`v28-surv-css`.
- Ein `render()`-Scheduler via `requestAnimationFrame` mit Dirty-Flags ersetzt die direkten `updateHeader`/`updateSidePanels`/`renderMarket`-Mehrfachaufrufe; `nextMonth()` erhält einen Re-Entry-Guard.
- Chart: `chart.data`-Update + `update('none')`, plus Annotation-Linien für Entry/Liquidation.
- `attention()`-Queue serialisiert Coach-Marks, `pqEnqueue`-Karten, Toasts und Boss-Kommentare.
- Audio: neuer `sfx()`-Bus mit ADSR-Hüllkurve, Voice-Limit und Master-Limiter ersetzt die rohen Oszillator-Aufrufe; `musicBed` als ein Loop mit Crossfade.
- Dock: `market`, `chart`, `positions`, `more`, `month`; `MORE`-Sheet bündelt die bestehenden Section-Aufrufe ohne neue Logik.
- Unberührt: historische Preise 2020–2026, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Story-Kapitel, Startscreen (V27), Endkarte (V26).
