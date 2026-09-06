# V47 — XP zurück, echte Historie, mehr Wucht

Fünf Baustellen, die du genannt hast, plus konkrete Vorschläge, wie der Run spannender wird. Optik und Farben bleiben genau so.

## 1. Rangliste: Flaggen, Emojis, XP

- Länder werden als **eigene kleine Flaggen-Grafiken** gezeichnet (schlichte Farbbalken/SVG, kein Emoji) — dadurch sehen Windows-Nutzer sie garantiert, statt Kürzeln oder leeren Kästchen.
- Jede Zeile bekommt: Platz, Avatar, Name, Flagge, Archetyp-Symbol, Level-Abzeichen, Boss Score, Netto, Kapitel. Kürzel wie `DE · CLASSIC · 9 CH` verschwinden aus der Hauptzeile und wandern in eine zweite, ruhige Zeile.
- Länderauswahl wird erweitert (aktuell nur 6) und zeigt im Setup dieselbe Flagge wie im Board.

## 2. XP-System kommt zurück — sichtbar und belohnend

- XP für konkrete Aktionen: erster Trade eines Kapitels, Position im Gewinn geschlossen, Krise überlebt, Entscheidung mit gutem Ausgang, Launch getroffen, Survival gepflegt, Streak gehalten.
- **Jede XP-Vergabe fliegt als kleines `+250 XP` am Bildschirm auf** und der XP-Balken füllt sich sichtbar. Level-Up gibt einen kurzen goldenen Blitz plus Rangtitel.
- XP und Level stehen im Kopf des Spiels, auf der Endkarte und wieder in der Rangliste — der Boss Score bleibt aber die Sortierung, damit die Liste nachvollziehbar bleibt.
- Level geben einen kleinen echten Vorteil (leicht niedrigere Lebenskosten pro Level), damit XP nicht nur Deko ist.

## 3. "84 Monate" wieder stimmig

Die Werbevideos versprechen 84 Monate — das Spiel zeigt Kapitel. Lösung ohne Umbau: **Monate sind die Sprache, Kapitel die Struktur.** Der Kopf zeigt `MONTH 07–09 / 84`, die Fortschrittsleiste läuft über 84 Monate, das Ende sagt "X von 84 Monaten überlebt". Das Wort "Kapitel" verschwindet aus der Oberfläche.

## 4. Echte Preise und alle Crashes

- Heute haben nur BTC, ETH, SOL und DOGE echte Monatsreihen; die anderen zehn Coins werden aus einer Formel erfunden. **Alle Märkte bekommen echte Monatsreihen 2020–2026** mit korrektem Listing-Monat (PEPE 2023, WIF 2024 usw.), inklusive der echten Einbrüche.
- Damit sind auch die Crashes im Chart sichtbar: März 2020, Mai 2021, Luna, FTX, der Flush 2025. Zusätzlich blitzt bei einem Quartal mit über 25% Minus eine **Crash-Karte** auf ("BLACK THURSDAY · −50%"), damit man den Einbruch nicht überklickt.

## 5. Entscheidungen und Elon-Momente zurück

- Die 15 historischen Entscheidungen bleiben, kommen aber **garantiert** und stehen im Kopf als "DECISION INCOMING", statt eventuell übersprungen zu werden.
- Dazu kommen etwa 20 neue kurze Karten im alten Ton: Elon tweetet, Exchange friert Abhebungen ein, Freund fragt nach einem Coin-Tipp, Steuerbrief, Influencer-Deal, Hack, Insider-Gruppe, Stromausfall beim Mining. Jede hat 2–3 Antworten mit echten Folgen für Cash, Bestand, Stress und XP.
- **Antworten prägen den Run dauerhaft**: sie setzen Status wie `PANIC SELLER`, `DIAMOND HANDS`, `CASINO DEGEN`, `TAX GHOST` — die Status verändern danach Preise, Risiko, Bosstexte und das Ende.

## 6. Launch-Fehler beheben + Feedback

- Der Bug: du hattest 3x `$400`, weil die drei Größen bei kleinem Cash alle auf den Mindestbetrag fallen. Neu sind die Optionen immer **verschieden und lesbar**: `MIN`, `25% deines Cash`, `50% deines Cash` — jede mit dem echten Betrag darunter, doppelte Werte werden ausgeblendet.
- Nach dem Zeichnen kommt eine **Ergebniskarte**: Name, was du reingesteckt hast, was rauskam, `RUGGED` rot mit Ruck oder `MOONSHOT` gold mit Blitz, plus ein frecher Bosskommentar. Kein stiller Streifen mehr.

## 7. Mehr Animation und Gefühl

- Net Worth zählt bei jeder Änderung hoch/runter und färbt sich kurz grün oder rot; Gewinn gibt einen goldenen Impuls, Verlust einen roten Ruck.
- Fliegende `+XP` und `+$` Zahlen, pulsende P&L-Chips, Knopf-Aufleuchten bei jedem Tap, Monatswechsel als kurzer Wisch mit groß aufblitzender Jahreszahl.
- Boss-Bild und Ton reagieren auf Status und Kontostand (ruhig, spöttisch, wütend, krönend).
- Liquidation und Crash bekommen einen eigenen kurzen Screen-Shake, damit Schmerz auch wehtut.

## Weitere Vorschläge für Spannung (in dieser Runde mit drin)

- **Streak-Multiplikator sichtbar** oben im Kopf: gute Züge in Folge erhöhen XP und Boss Score, ein Fehler bricht ihn — man spielt vorsichtiger, wenn die Serie steht.
- **Boss-Wetten**: alle paar Monate fordert dich der Boss direkt heraus ("Schlag mich diesen Quartal um 10%") — Sieg gibt viel XP, Niederlage kostet Cash.
- **Zeitdruck-Momente**: bei Crash und Launch läuft ein kurzer Balken; wer nicht handelt, verpasst.

## Technische Notizen

- `src/game/journey-data.ts`: echte 84-Monatsreihen für alle Coins statt `buildSeries`-Formel; neue `SITUATIONS`-Liste (Elon & Co.) getrennt von `DECISIONS`; XP-Tabelle und XP-Events; Crash-Erkennung aus den Preisreihen.
- `src/game/CryptoJourney.tsx`: XP-State plus `grantXp()` mit Floating-Number-Queue; Monatsanzeige `chapter*3` statt Kapitel; `PresaleSheet`-Größen dedupliziert; neue `ResultSheet` für Launch-Ausgang; Decision-Zuordnung garantiert (Warteschlange statt Monatsvergleich).
- `src/game/leaderboard.ts` + `src/routes/api/public/leaderboard.ts`: `xp`/`level` wieder echt senden und prüfen; Sortierung bleibt Boss Score.
- Flaggen als kleine Inline-SVG-Komponente in `src/game/flags.tsx` — keine Emojis, damit Windows sie darstellt.
- Animationen als CSS-Keyframes im `.cy-*`-Block in `src/styles.css`, keine neuen Abhängigkeiten.
- Test: Playwright-Vollrun bei 390x844 und 1280x800 — Launch-Größen unterschiedlich, XP-Popups sichtbar, kein horizontaler Overflow, keine Konsolenfehler.
