# V22 — Vom Durchklicken zum Spiel: Karten-Diät, Terminal-Neudenken, Optik-Endstufe

Warum sich das Spiel nach Durchklicken anfühlt, ist im Code sichtbar: pro Monat können **mehrere unabhängige Quellen** gleichzeitig eine Karte auslösen — Random-Event (28 %), Decision (28 %), History-Karte, Presale-Ergebnis, New-Listing-Popup, Minigame (16 %). Alle laufen über die Warteschlange `pqEnqueue`, also erscheinen sie hintereinander statt gebündelt. Ergebnis: Karten-Kette, die man wegklickt, danach ein Monat ohne Entscheidung, dann NEXT MONTH. Genau das wird umgebaut.

## 1. Karten-Diät: ein Monat, ein Moment

- **Harte Regel: maximal eine Vollbild-Karte pro Monat.** Alles andere wird zu Zeilen im Ticker/Ledger statt zu einem Overlay. New-Listing, kleine Airdrops, Whale-Dump ohne Entscheidung → Ticker-Zeile plus kurzer Farb-Puls im Chart, kein Popup.
- **Monats-Budget statt Zufalls-Stapel:** Am Monatsanfang wird *ein* Moment gewählt (Priorität: History-Ereignis > Decision > Marktschock). Alles Übrige wird verworfen oder auf spätere Monate verschoben, statt sich zu stapeln.
- **Rhythmus statt Gleichverteilung:** 2 ruhige Monate (nur Traden), dann 1 Moment, im Kapitel-Finale ein großer. Dadurch entsteht Spannungsaufbau statt Dauerbeschallung.
- **Karten werden zu Entscheidungen mit Einsatz:** Jede Karte bekommt statt „OK" mindestens zwei Optionen mit sichtbarer Konsequenz-Vorschau („−$4.000 · Risiko −8" / „nichts tun · Stress +6"). Reine Info-Karten verschwinden komplett.
- **Karten unterbrechen nicht mehr blind:** Während eines offenen Trade-Fensters wird der Moment zurückgehalten und erst danach gezeigt.

## 2. Gameplay: Gründe, zwischen den Monaten zu handeln

Damit sich der Monat nicht wie ein Klick anfühlt, braucht es Druck *innerhalb* des Monats:

- **Boss-Auftrag pro Monat** (groß, eine Zeile, klare Belohnung): „Halte BTC bis Ende des Monats", „Mach $10k in 30 Tagen", „Überlebe ohne Liquidation". Erfüllt = XP + Shard-Fortschritt, verpasst = Boss-Taunt.
- **Live-Monat statt Sprung:** Der Monat läuft in 30 Tagen als sichtbarer Fortschrittsbalken; Kurse ticken. NEXT MONTH wird zum „Rest überspringen" — wer will, tradet aktiv, wer nicht, klickt. Das macht Timing zur Fähigkeit.
- **Streak & Combo:** Aufeinanderfolgende profitable Monate bauen einen Multiplikator, der bei einer Liquidation zerbricht — der wichtigste Grund, kein Blind-Risiko zu fahren.
- **Boss-Duelle an Kapitelenden** (Mai 2021 Crash, LUNA, FTX, ETF, TCFB): ein Vollbild-Duell mit einer Entscheidung, Musikszene `boss`, eigener Karte fürs Teilen.
- **Weniger Systeme gleichzeitig sichtbar:** Business, Shop, Trophies bleiben, aber öffnen erst ab dem Monat, in dem sie erzählerisch Sinn haben — der Einstieg wird dadurch drastisch einfacher, ohne Inhalte zu löschen.

## 3. Terminal neu gedacht: drei Zonen, keine Panel-Sammlung

Statt vieler kleiner Kästen ein Aufbau, wie echte Trader ihn erwarten:

```text
KOPF     Net Worth · Monat + Tagesbalken · Vitals · Shards
BÜHNE    großer Chart mit Einstiegslinie, Liquidationslinie, PnL live
LEISTE   Coin-Münzen-Reihe (Preis + Trend + Besitz), horizontal, ein Klick = Trade-Fenster
FUSS     Boss-Auftrag des Monats + NEXT MONTH
```

- Ops (Launchpad, Degen, Business, Shop, Trophies, Ledger) werden **ein einziger Button „OPS"** mit Zähler-Badge; darin die sechs Kacheln. Der Kopf wird ruhig.
- Der Chart wird zur Hauptfigur: Kerzen-Optik, Achsen, Referenzlinien, weicher Verlauf, Hover-Tooltip mit Datum und Preis.
- Alle Fenster im identischen Rahmen (Kopf/Body/sticky Fuß), 90 vh, innen scrollend — nichts wird mehr abgeschnitten.

## 4. Optik: die letzte Stufe

- **NEXT MONTH sofort korrigiert:** heller Acid→Cyan-Verlauf mit hellem Text = unlesbar. Neu: dunkle Schrift auf dem hellen Verlauf (oder dunkle Platte mit Acid-Rand), Untertitel in derselben Logik. Kontrast wird gegen WCAG geprüft.
- **Kontrast-Pass über alles:** kein heller Text auf hellem Verlauf, Zahlen in Tabellen-Ziffern, damit nichts flackert.
- **Aufräum-Pass:** derzeit **289 `!important`-Regeln** über 14 Style-Schichten — Ziel < 30, ein Layout-Layer. Das ist die Ursache für jede „an einer Breite kaputt"-Meldung.
- **Juice:** Zahlen zählen weich hoch, Gewinn/Verlust pulsiert kurz, Liquidation schüttelt den Screen mit Sub-Drop, Trade-Bestätigung mit Münz-Snap. Sparsam, nie im Dauerbetrieb.
- **Boss immer präsent:** kleiner Boss-Kopf im Fuß, der Mood wechselt (smug/stressed/enraged/crowned) und beim Moment groß in die Karte kommt.
- **Shareable Momente:** bei Liquidation, 10×-Gewinn, Kapitel-Sieg und Endcard eine Boss-Karte mit „SAVE IMAGE" — der Motor für Viralität.

## 5. Technisch

- Ein Layout-Layer, Breakpoints 720/1100/1600, innere Scrollzonen statt fester Höhen.
- Karten-Warteschlange wird zum **Moment-Manager** mit Budget und Prioritäten (ersetzt das heutige `pqEnqueue`-Stapeln).
- Chart auf `requestAnimationFrame`-Throttle, Münz-Sprites lazy — flüssig auch auf Handy.
- Abnahme per Playwright bei 390×844, 414×896, 768×1024, 1030×695, 1280×800, 1440×900, 1728×1117: nichts abgeschnitten, jeder Button klickbar und lesbar, maximal eine Karte pro Monat, keine Konsolenfehler.
- Nicht angetastet: historische Preise 2020–2026, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Story-Kapitel.

## Reihenfolge

1. NEXT-MONTH-Kontrast + Kontrast-Pass (sofort sichtbar)
2. Karten-Diät + Moment-Manager (größter Gameplay-Effekt)
3. Terminal-Umbau auf drei Zonen inkl. OPS-Bündelung
4. Boss-Auftrag, Streak, Boss-Duelle
5. Juice, Share-Karten, Aufräumen der Style-Schichten
