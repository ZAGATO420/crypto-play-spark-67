# Prüfrunde statt neuer Features

Keine neuen Spielsysteme. Diese Runde prüft und härtet nur das, was die Review offen lässt.

## 1. Alter Speicherstand fortsetzen
- Im Code geprüft: Fortsetzen füllt fehlende Felder aus einem frischen Run auf, und Relikte werden überall mit Leerliste-Rückfall gelesen. Ein alter Stand sollte also laden.
- Trotzdem echt testen: einen Speicherstand im alten Format (ohne Relikte, ohne Risk-Sperre) einsetzen, FORTSETZEN drücken, ein Quartal spielen. Bricht etwas, wird das Auffüllen repariert.

## 2. Relikt-Quartal durchklicken
- Bis Quartal 2 spielen: Auswahl mit drei Karten erscheint, eine wählen, Fenster schließt sich, Relikt steht oben in der Leiste, Quartal läuft normal weiter.
- Zusätzlich Quartal 4 prüfen (zweite Auswahl, keine Dopplung) und Neuladen mitten in der Auswahl.

## 3. Leaderboard: Server prüft, vertraut aber noch dem Spiel
Ist-Zustand (im Code gelesen): Der Server prüft nur grobe Grenzen. Die Vermögensgrenze wächst pro Monat mit Faktor 2,1 und ist damit praktisch wirkungslos; der Score wird auf "8 × Vermögen + 250k" gedeckelt. Wer die Anfrage fälscht, kann also ein plausibel wirkendes Fantasie-Vermögen eintragen.

Härtung:
- Realistische Obergrenze: das maximal mögliche Vermögen aus Startgeld, Kapitelzahl und den historischen Höchstbewegungen (bei 50x Hebel) — alles darüber wird abgelehnt.
- Score wird auf dem Server aus Vermögen, Kapiteln, Schwierigkeit und Krisen neu berechnet statt übernommen.
- Turnier-Einträge: Das Spiel schickt das Zugprotokoll mit (Seed + Züge pro Quartal). Der Server rechnet die Turnier-Einträge ab Platz-relevantem Wert nach, bevor sie auf die Preisgeld-Plätze dürfen; sonst Status "wird geprüft".
- Rate-Limit pro Spieler-Schlüssel.

## 4. Kleine Korrekturen
- HOUSE EDGE / MEV BOT Text ehrlich formulieren: "Ein Patzer kostet nie mehr als bei Note 0.5" statt "Skill floor 0.5".
- BUY SPOT / PERPS auf dem Hauptscreen: deine Entscheidung (siehe Frage unten). Standard: bleiben vorne, weil Trading der Kern ist und MEHR am Handy versteckt war.

## Abnahme
- Alter Stand lädt und spielt ohne Fehler.
- Relikt-Auswahl erscheint und verschwindet sauber, auch nach Neuladen.
- Gefälschter Eintrag mit absurdem Vermögen wird abgelehnt; echter Run kommt durch. Laufende Board-Einträge bleiben unangetastet.

## Technische Notizen
- `restore()` in `src/game/CryptoJourney.tsx` merged bereits `freshRun()`; Test via Playwright mit injiziertem `tcfb_cycle_v2`-Stand.
- `src/routes/api/public/leaderboard.ts`: `implausibleReason` bekommt eine Kapitel-basierte Obergrenze; `finalScore` aus serverseitiger Score-Formel; optionales Feld `log` (Seed + Züge) für Turnier-Replay mit der deterministischen Spiellogik aus `src/game/` (reine Funktionen, kein Client-Code).
- Text in `src/game/relics.ts` (SYNERGIES / RELICS).
