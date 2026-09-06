# V38 — Vom Durchklicken zum Spiel: Action, Klartext, Arcade-Look

Drei Ursachen dafür, dass es sich nach Formular statt Spiel anfühlt: die einzige echte Action (Timing-Balken) liegt hinter einer 16-%-Zufallschance tief im Quest-System, jeder Monatswechsel feuert eine Kette einzelner Meldungen (Bills, Auto-Verkauf, Airdrop, Steuer, Event, Story) statt eines Ergebnisses, und das Terminal quittiert Erfolg nur mit Zahlen in Tabellen.

## 1. Action: der Timing-Balken kommt nach vorne

- Der Balken wird ein eigenes, sichtbares Spielelement mit Rhythmus: **ein Timing-Moment pro Kapitel-Abschnitt** (2–3 ruhige Monate, dann einer) plus **immer** bei großen Ereignissen — Crash, Pump, Presale-Allocation, Liquidationsgefahr, Kapitel-Finale.
- Der Moment hat immer echten Einsatz und wird vorher angekündigt: „HIT THE ZONE — perfekt = besserer Einstieg, verpasst = Slippage". Ergebnis in drei Stufen (PERFECT / GOOD / MISS) mit sichtbarer Wirkung auf Preis, Bonus oder Schaden.
- Schwerer werdende Zonen über die 84 Monate, kurze Combo-Kette bei mehreren Treffern hintereinander.
- Zusätzlich ein „Boss-Duell" am Kapitelende: drei Timing-Runden gegen den Gorilla, Sieg gibt Shard/XP, Niederlage einen Taunt.
- Der Quest-Zugang bleibt, ist aber nicht mehr der einzige Weg dorthin.

## 2. Meldungen: Streifen statt Flut, Karte nur wenn es zählt

- Normaler Monat: **keine einzige Meldung zum Wegklicken.** Die Zahlen im Kopf animieren, darunter ein Ergebnisstreifen in Klartext:
  `MONAT 14 · +$8.240 (+12%) · Bester: SOL +31% · Bills −$1.900 bezahlt`
- Echte Ereignisse (Crash, Liquidation, Notverkauf, Steuerbescheid, Story-Entscheidung, Kapitelende) bekommen **genau eine** Karte pro Monat, mit Boss-Reaktion und Entscheidung statt „OK".
- Alle übrigen Ereignisse laufen in den Verlauf/Ticker, nicht als Toast. Höchstens ein Toast gleichzeitig, Warteschlange statt Stapel.
- Jede Karte und jeder Streifen sagt immer, **was mit dem Geld passiert ist** — kein Jargon ohne eine Zeile Klartext darunter.

## 3. Optik: Arcade statt Tabelle

- Das Terminal übernimmt die Bühne des Startscreens: warmes Petrol/Nachtblau, Gold für Net Worth, Acid nur für Aktionen, dunkler Boss-Hintergrund statt flachem Grau.
- Zahlen zählen weich hoch, Gewinn pulst grün, Verlust rot, Liquidation schüttelt den Bildschirm einmal mit Sub-Drop, Kauf schnappt mit Münzeffekt.
- **Boss immer präsent:** kleiner Gorilla-Kopf in einer festen Ecke, wechselt Stimmung (smug / stressed / enraged / crowned) und kommentiert Momente mit einem Satz.
- **Combo- und Streak-Anzeige** dauerhaft sichtbar: profitable Monate bauen einen Multiplikator, eine Liquidation bricht ihn — der stärkste Grund weiterzuspielen.
- **Fortschrittsleiste zum nächsten Kapitel** mit Teaser („in 2 Monaten öffnet sich Perps") — man sieht, worauf man zuspielt.
- Am Handy größer und fetter: Ergebnisstreifen und Timing-Balken bekommen volle Breite, alle Tippflächen ≥ 44 px.

## 4. Erste Minute: sofort etwas tun

- Monat 1–3 zeigen jeweils **eine** Aufgabe groß im Fuß („Kauf für $2.000 BTC", „Erwisch die Zone", „Überlebe den Monat") statt aller Systeme gleichzeitig.
- Der erste Timing-Moment kommt spätestens in Monat 2 — damit jeder Spieler die Action sieht, nicht nur 16 %.
- Kein Tutorial-Text zum Lesen; Erklärung passiert im Tun, eine Zeile pro Schritt.

## 5. Abnahme

Playwright bei 390×844, 430×932, 768×1024 und 1280×800:
Timing-Moment erscheint in Monat 2, PERFECT/GOOD/MISS wirken sichtbar, ruhiger Monat erzeugt null Overlays, Ereignis-Monat genau eines, Ergebnisstreifen immer korrekt gefüllt, Combo bricht bei Liquidation, Boss-Stimmung wechselt, kein Querscrollen, keine Konsolenfehler, 12 schnelle Monate ohne Hänger.

## Technische Notizen

Alles in `public/game.html`:
- `startMinigame()` wird zur allgemeinen `timingMoment(ctx)`-Engine mit Stufen und Wirkung; Trigger über einen Rhythmus-Zähler im Monats-Manager statt `Math.random()<0.16`.
- Der Monatswechsel sammelt Effekte in ein `monthReport`-Objekt; `toast()`/`addNews()`-Aufrufe in `nextMonth()` schreiben dorthin statt direkt zu feuern. Ein Renderer schreibt den Streifen, `pqEnqueue` bekommt ein Budget von einer Karte pro Monat.
- Neuer Layer `<style id="v38">` für Bühne, Boss-Ecke, Combo-Chip, Ergebnisstreifen und Timing-Overlay; Reste der kalten Terminal-Flächen aus älteren Layern werden dabei entfernt statt überschrieben.
- Unangetastet: historische Preise 2020–2026, Perp-Mathematik, XP-Formeln, Schwierigkeitsgrade, Kostenlogik inkl. V37-Guard, Leaderboard-API, Startscreen (V35) und Endcard (V36).
