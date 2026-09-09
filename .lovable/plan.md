# Warm, klar, süchtig: das Spiel bekommt ein Gefühl

Das Problem ist nicht, dass Inhalte fehlen — es sind zu viele Systeme gleichzeitig sichtbar, und keines reagiert emotional. Man liest Zahlen statt etwas zu erleben. Drei Baustellen: Verständlichkeit, Gefühl, Sog.

## 1. Der Einstieg erklärt sich beim Spielen

- Die ersten drei Kapitel führen: immer nur **eine** grosse Aufgabe unten gross sichtbar ("Kauf für $2.000 BTC", "Verkauf bevor der Crash kommt", "Bring deine Coins in Sicherheit"). Alles Übrige ist in dieser Zeit ruhig gestellt, nicht versteckt.
- Dauerhaft eine Klartextzeile "Was jetzt zu tun ist" über den Aktionen, in normaler Sprache, kein Fachjargon.
- Der Kopf zeigt nur noch drei grosse Werte: Vermögen, Bargeld, Zeit bis Ende. Alles Weitere (XP, Level, Streak, Steuern, Boss-Depot) rutscht in eine ausklappbare zweite Reihe.
- Jede Zahl bekommt bei Antippen einen Satz Erklärung ("Boss-Score: Vermögen mal Schwierigkeit, minus jede Krise, die dich getroffen hat").
- Positionen werden als Karten mit Klartext gelesen: "SOL, gekauft bei $22, jetzt $41, du bist $1.900 im Plus".

## 2. Wärme und Emotion: das Spiel reagiert auf mich

- **Der Boss lebt:** sein Gesicht wechselt sichtbar die Stimmung, er kommentiert jeden echten Moment mit einem kurzen frechen Satz statt einer Systemzeile. Bei Gewinn wird er sauer, bei Verlust hämisch.
- **Körperliche Rückmeldung:** Gewinn = goldener Blitz plus Münzton und hochzählende Zahl; Verlust = roter Puls, dumpfer Ton, Bild ruckelt kurz; Liquidation = harter Schlag mit Blackout-Frame; Rettung in der letzten Sekunde = Zeitlupe.
- **Nahe dran ist ein Erlebnis:** verpasste Ausstiege, knapp überlebte Liquidationen, um Haaresbreite verpasste Ziele werden benannt ("Zwei Tage früher raus und du hättest $12.000 mehr").
- **Ich-Stimme:** nach Meilensteinen (erste $100k, erste Liquidation, erster Steuerbescheid) eine kurze persönliche Zeile statt einer Meldung.
- **Wärmere Optik:** mehr Kontrast auf Gold und Grün, weniger graue Flächen, lebendiger Hintergrund im Rhythmus des Marktes (ruhig im Bärenmarkt, unruhig im Pump).
- **Ton pro Moment:** Musik wechselt hörbar zwischen Bullen- und Bärenphase, wird im Crash-Quartal dünn und angespannt.

## 3. Sog: warum man sofort nochmal startet

- **Zwischenstopp am Jahresende:** kurze Bilanz mit einer Zeile Chronik, Vergleich zum Boss und zum eigenen besten Run. Kein Menü, ein Klick weiter.
- **Countdown auf Unheil:** "irgendwas kommt in 2 Quartalen" — sichtbar, ohne zu verraten was. Erzeugt Anspannung statt Klickerei.
- **Chronik am Ende:** 5–7 Zeilen erzählen den Run ("Im Mai 2021 verkauft. Den Winter durchgehalten. FTX hat dich erwischt."), direkt teilbar als Bild.
- **Sofort-Revanche:** gleicher Seed, ein Knopf, mit Anzeige des eigenen Vorlaufs an derselben Stelle — man will die eigene Zeit schlagen.
- **Sichtbarer Fortschritt zwischen Runs:** wie viele Enden schon gesehen, was noch fehlt, direkt im Startbild als kleine Vitrine.

## 4. Weniger Fenster

- Kaufen und Verkaufen ohne Popup: drei Beträge direkt in der Marktzeile, ein Tipp genügt.
- Fenster bleiben nur für echte Entscheidungen (Boss-Kampf, Verwahrung, Leben, Cash Out) und schliessen sich nach der Wahl selbst.
- Höchstens eine Unterbrechung pro Kapitel; alles Übrige läuft in den Verlauf.

## Abnahme

- Ein neuer Spieler weiss in den ersten 20 Sekunden ohne Text zum Lesen, was er tun soll.
- In jedem Kapitel gibt es mindestens einen Moment mit sichtbarer und hörbarer Reaktion.
- Test bei 393 und 1440 Pixel Breite: kein Überlauf, keine Fehler, kein Flackern.

## Technische Notizen

- Alles in `src/game/CryptoJourney.tsx`, `src/game/journey-data.ts`, `src/game/audio.ts`, `src/game/minigames.tsx`, `src/styles.css`. Keine neuen Pakete.
- HUD wird in eine Primär-Reihe (drei Werte) und eine ausklappbare Detail-Reihe getrennt; Tooltips über ein kleines gemeinsames `Explain`-Element.
- Onboarding als Datenliste `GUIDE_STEPS` (Kapitel, Zielprüfung, Text) statt Sonderfälle im Code; Prüfung gegen den bestehenden Run-Zustand.
- Reaktionslayer: eine `feel(kind)`-Funktion bündelt Sound, Flash, Shake, Zahl-Animation und Boss-Stimmung; alle bestehenden Aufrufstellen (Trade, Liquidation, Crash, Minigame, Steuer) rufen nur diese.
- Musikphasen über den bestehenden Crossfade in `audio.ts`, gesteuert vom Kapitel-Trend; keine neuen Assets nötig.
- Chronik als `run.chronicle[]`, gefüllt an denselben Stellen, die heute schon ins Kassenbuch schreiben; Endscreen rendert daraus.
- Determinismus bleibt: alle neuen Zufallsmomente ziehen aus `src/game/rng.ts` mit dem Saison-Seed, damit Turniere fair bleiben.
- Preise, P&L-Formeln, Steuerlogik, Boss-Score und Leaderboard-API bleiben unangetastet.
