# Ton ab der ersten Sekunde + Ideen für mehr Reichweite

## 1. Warum es am Anfang still ist

Der Ton ist im Spiel eingebaut, aber:

- Effekte gibt es bisher nur im laufenden Run. Startbild, Charakterauswahl, Land, Schwierigkeit, Bestenliste: alles klickt lautlos.
- Die Musik erwacht zwar beim ersten Tippen, aber die Tondateien werden erst danach geladen, sodass die ersten Klicks trotzdem stumm bleiben.
- Der Lautsprecher-Knopf existiert nur im Run, nicht auf dem Startbild — es wirkt, als müsse man den Ton irgendwo selbst suchen und einschalten.

## 2. Was sich ändert

- **Ton ist von Anfang an an** (Standard: Musik leise, Effekte deutlich). Der Menü-Loop startet mit der allerersten Berührung des Bildschirms, nicht erst im Run.
- **Effekte im ganzen Menü**: Klick auf PLAY / CONTINUE / LEADERBOARD, Auswahl von Avatar, Land, Archetyp, Schwierigkeit und Ironman, Zurück-Knopf, Namenseingabe-Bestätigung, Eintrag in die Bestenliste. Leise, kurz, nicht nervig — Auswahl bekommt einen etwas satteren Ton als normale Klicks.
- **Vorladen**: die kurzen Effektdateien werden direkt beim Öffnen im Hintergrund geladen, damit schon der erste Klick hörbar ist.
- **Lautsprecher-Knopf auch auf Start- und Auswahlbildschirm** (oben rechts, gleiche Optik wie im Run) mit denselben zwei Reglern für Musik und Effekte.
- Stummschaltung bleibt gespeichert: wer bewusst mutet, bleibt gemutet.

## 3. Optionen für mehr Viralität

Vorschläge zur Auswahl (nicht Teil dieser Umsetzung, sag welche du willst):

1. **Teilbares Ergebnisbild**: am Ende ein fertiges Bild (Avatar, Rang, Endkapital, überlebte Monate, größter Trade, größter Fehler) plus Knopf "Copy for X" mit vorformuliertem, trockenem Text.
2. **Daily Seed / Tages-Challenge**: alle Spieler bekommen an einem Tag denselben Run (gleiche Ereignisse). Eigenes Tages-Leaderboard — vergleichbar, deshalb teilbar.
3. **Challenge-Link**: "beat my score" Link mit deinem Score als Ziel; wer klickt, sieht deinen Rekord im Startbild.
4. **Run-Zusammenfassung als Timeline**: 6 Zeilen Story ("2021: du hast bei 64k verkauft. 2022: du warst auf FTX.") — sehr screenshot-freundlich.
5. **Death-Screen-Punchlines**: pro Todesart eine harte Zeile, zufällig aus einem Pool — Leute posten Sprüche.
6. **Streak/Rang-Abzeichen**: sichtbare Titel (PAPER HANDS, EXIT LIQUIDITY, FINAL BOSS), die im Board und im Teilbild auftauchen.
7. **Wöchentliches Saison-Reset** mit Top-3-Post auf X — regelmäßiger Grund wiederzukommen.

## Technische Notizen

- `src/game/audio.ts`: `preloadSfx()` (alle Buffer im Hintergrund), Unlock-Handler ruft zusätzlich `setTrack("menu")` und Vorladen; Standard-Mute bleibt `false`.
- `src/game/CryptoJourney.tsx`: `playSfx("click")` / `"vault"` an den Menü-Handlern (Start, Resume, Board, Setup-Auswahlen, Back, Submit); Sound-Knopf als kleine gemeinsame Komponente auf `StartScreen`, `SetupScreen`, `BoardScreen` und im Run-Header.
- `src/styles.css`: Positionierung des Sound-Knopfs auf den Menü-Screens (Safe-Area beachten, überlappt nichts).
- Keine Änderung an Spiel-Logik, Preisen, Board-API oder bestehenden Sounddateien.
