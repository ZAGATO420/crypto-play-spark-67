# Clean Startscreen + neues Boss-Bild

Der Startscreen ist durch das lange Turnier-Feld, die Regelzeile, das Laufband und drei Buttons überladen, und der Boss wird davon verdeckt. Ziel: ruhige, klare Startseite mit einem scharfen, neuen Boss-Bild.

## Neues Bild

- Neues Startbild in neuer Bildsprache: der Boss im Halbschatten, von Chart-Licht (Grün/Rot) angeschnitten, Gesicht frei, viel dunkler Raum unten für Text.
- In hoher Auflösung erzeugt (breites Desktop-Format), damit es auf großen Bildschirmen scharf bleibt; zusätzlich ein hochkantiger Bildausschnitt für Handy.
- Bildmitte bleibt frei von Text; Titel und Buttons sitzen im dunklen unteren Bereich.

## Aufgeräumter Aufbau

Von oben nach unten, mit klaren Abständen:

1. Laufband mit Live-Preisen und `$TCFB SOON` ganz oben, schmaler und dezenter.
2. Boss-Bild als Bühne, Gesicht sichtbar, sanfter Verlauf nur im unteren Drittel.
3. Titel `THE CRYPTO FINAL BOSS` und ein kurzer Satz statt drei Zeilen Text.
4. Kompaktes Turnier-Feld: Monat, Countdown und die drei Preise `$20 / $10 / $5` als kleine Marken – ohne Beschreibungstext, ohne Regelzeile.
5. Buttons: `PLAY THE TOURNAMENT` als Hauptaktion, darunter in einer Reihe `FREE RUN`, `LEADERBOARD` und – nur wenn ein Lauf offen ist – `CONTINUE RUN`.
6. Eine Fußzeile: `84 MONTHS · FREE TO PLAY · WALLET ONLY FOR PRIZES` plus Link `RULES`.

## Regeln bleiben sichtbar, aber nicht im Weg

- `RULES` öffnet ein kleines Fenster mit: gleicher Seed für alle, bester Lauf pro Monat zählt, ein Konto pro Spieler (Mehrfachkonten und doppelte Einträge werden disqualifiziert), Auszahlung innerhalb von 3 Tagen nach dem Token-Launch im Oktober.
- Beim Wallet-Feld am Ende des Laufs bleibt der Hinweis kurz, mit demselben Regel-Link.

## Technische Punkte

- `StartScreen` und `SeasonBanner` in `src/game/CryptoJourney.tsx` umbauen; `SeasonBanner` erhält eine kompakte Variante für den Startscreen und behält die ausführliche Variante im Setup.
- Neues Bild über `lovable-assets` einbinden (Desktop- und Portrait-Version, Auswahl per `picture`/`srcset`), altes `boss/crowned.webp` bleibt für den Endscreen erhalten.
- Bildschärfe: `object-fit: cover` mit passender Quellauflösung statt Hochskalieren, `filter` nur leicht abdunkeln.
- Regel-Dialog über die vorhandene Dialog-/Sheet-Komponente, kein zusätzliches Overlay über dem Spielbrett.
- Styles in `src/styles.css`: `.journey-start`, `.season-banner` kompakt, `.price-tape`, neue `.start-footer`/`.start-rules`; `.season-rules` entfällt vom Startscreen.
- Prüfung: Typecheck, Build sowie Screenshots bei 393px und 1440px auf Schärfe, Lesbarkeit und freie Boss-Augen.
