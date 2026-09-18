# Game-Rebuild: klar, lebendig und emotional

## Ziel
Das Spiel soll in den ersten Sekunden verständlich sein und sich nicht mehr wie ein Dashboard anfühlen. Pro Moment gibt es genau **eine erkennbare Aufgabe**, **eine Hauptentscheidung** und eine sichtbare Konsequenz. Historische Preise, P&L, Steuern, Boss-Score, Turnierbedingungen, Seed, Wallet-Schutz und Gewinnerermittlung bleiben unverändert.

## 1. Die dunkle Einführung ersetzen
- Die doppelte Abdunklung vollständig entfernen.
- Keine Tour mehr, die fünf Bereiche nacheinander beschreibt.
- Stattdessen wird der erste Turnierlauf selbst zum kurzen, spielbaren Tutorial:
  1. `$2,500 BTC kaufen` — nur dieser Zug ist aktiv und sichtbar markiert.
  2. Kurs reagiert, Geld und Position bewegen sich sichtbar.
  3. `QUARTER BEENDEN` — das historische Ergebnis wird gezeigt.
  4. Danach öffnet sich das normale Spiel.
- Hinweise erscheinen direkt neben der aktiven Handlung, ohne den restlichen Bildschirm unlesbar zu machen.
- „SHOW ME HOW TO PLAY“ startet diese klare Einführung jederzeit erneut.

## 2. Chart verständlich machen
- Der Chart ist standardmäßig eine **Anzeige**, kein unbekanntes Minispiel. Ein klarer Text sagt: `WATCH THE PRICE — CHOOSE BELOW`.
- Der gelbe Punkt zeigt nur, wo der aktuelle Preis im Quartal steht. Spieler müssen ihn nicht anklicken.
- Wenn echtes Timing verlangt wird, wechselt der Chart sichtbar in den Modus `TAP NOW`: Zielzone, Countdown, große Tippfläche und kurzer Ton machen eindeutig, wann geklickt werden soll.
- Einstiegspreis, aktueller Preis und Gewinn/Verlust werden direkt am Chart beschriftet statt in kleinen Fußzeilen versteckt.
- Die automatische Zeit wird in den ersten beiden Quartalen pausiert, bis der Spieler gehandelt hat; niemand verliert den Einstieg beim Lesen.

## 3. Aus „Face the Boss“ wird eine verständliche Entscheidung
- `FACE THE BOSS` wird durch eine konkrete Aufgabe ersetzt, zum Beispiel `DUEL: RISK $1,000`.
- Direkt darunter stehen Einsatz, mögliche Belohnung und Risiko in einem Satz.
- Der Bosskampf öffnet keine abstrakte Karte, sondern eine eigene kurze Szene mit Bossbild, klarer Wette und sichtbarem Skill-Moment.
- Gewinnen und Verlieren erhalten unterschiedliche Animation, Musikakzent, Bossreaktion und Geldbewegung.

## 4. Mobile Spielansicht radikal ordnen
Die erste Bildschirmhöhe zeigt nur:
1. Monat und Reise 2020–2026
2. Geld, Stress und Hunger
3. aktuelle Aufgabe in Alltagssprache
4. großes Markt-/Ereignisbild
5. eine gelbe Hauptaktion plus eine sichere Alternative

Alles Weitere kommt in eine kompakte untere Werkzeugleiste:
- Portfolio
- Überleben
- Aufbewahrung
- Verlauf
- Ende

Boss-Score, XP, Signale, Missionstext, Bücher und Detailwerte verschwinden aus der Hauptansicht und bleiben über diese Bereiche erreichbar. Dadurch ist sofort klar, was jetzt zählt.

## 5. Mehr Spiel statt monatlich gleicher Oberfläche
- Jeder Abschnitt bekommt eine klar andere Spielsituation:
  - **Kaufen:** Betrag wählen und Einstieg bestätigen.
  - **Halten:** Risiko aushalten oder absichern.
  - **Crash:** unter Zeitdruck verkaufen, hedgen oder durchhalten.
  - **Presale:** Vertragshinweise prüfen und Rug-Risiko bewerten.
  - **Exchange-Ausfall:** Gelder rechtzeitig verschieben.
  - **Bossduell:** echten Einsatz mit Skill-Moment spielen.
  - **Privatleben:** zwischen Cash, Stress und Zeit entscheiden.
- Nicht jede Periode zeigt alle Werkzeuge. Nur Handlungen, die gerade sinnvoll sind, erscheinen.
- Historische Story-Ereignisse werden als sichtbare Szenen ins Spielfeld integriert und nicht als weitere gleichartige Textkarte behandelt.

## 6. Optische Aufwertung: Cyber-Jungle als Spielwelt
- Die drei vorhandenen Aktbilder werden dauerhaft sichtbar und wechseln mit Mania, Collapse und Endgame.
- Die Arena bekommt Tiefe: Vordergrund-Chart, reagierender Boss im Hintergrund, leichte Partikel/Regen/Marktimpulse und klare Lichtwechsel für Gewinn, Gefahr und Crash.
- Weniger kleine Boxen und Rahmen; stattdessen eine große Spielszene mit überlagerter Handlung.
- Stärkere Figurenpräsenz: gewählter Avatar im HUD, Boss mit Zuständen ruhig / spöttisch / wütend / geschlagen.
- Animationen zeigen Bedeutung statt Dekoration: Geld fließt ins Portfolio, Verluste schlagen sichtbar ein, Verwahrung bewegt Coins, Crashs stören die Arena.
- Reduced-Motion bleibt vollständig unterstützt.

## 7. Sound und Gefühl
- Musikphasen bleiben an die drei Akte gekoppelt, Übergänge werden beim Aktwechsel hörbar.
- Jede Hauptentscheidung erhält einen klaren, kurzen Sound; Gewinne, Verluste, Warnungen und Bossduelle unterscheiden sich deutlich.
- In den ersten Sekunden startet Audio nach dem ersten Nutzerkontakt zuverlässig und bleibt nicht unbemerkt stumm.
- Keine zufälligen Geräusche; Ton bestätigt immer eine sichtbare Handlung.

## 8. Verständlichkeit und Turnier-Sicherheit
- Vor jeder Hauptaktion steht klar: `Du setzt ...`, `Du kannst gewinnen ...`, `Du riskierst ...`.
- Nach jeder Aktion steht klar: `Was geschah`, `Geld rein`, `Geld raus`, `Was jetzt`.
- Die Einführung und neue Darstellung verändern keine Spielwerte und geben im Turnier keinen Vorteil.
- Alle Aktionen bleiben deterministisch mit demselben Saison-Seed.

## Prüfung
- Erster unbekannter Spieler kann ohne Erklärung den ersten Kauf und das erste Quartal abschließen.
- Vollständiger Lauf über alle 28 Quartale; jede Spielsituation und jeder historische Ereignistyp mindestens einmal.
- Zwei getrennte Browser erhalten im Turnier dieselben Ereignisse und Ergebnisse.
- Prüfung auf 393×852, 430×932 und 1440×900: lesbar, kein dunkler Coach, kein Überlappen, keine horizontale Verschiebung.
- Chart-Timing, Bossduell, Crash, Presale, Verwahrung, Überleben, Endscreen und Leaderboard-Eintrag werden einzeln geprüft.
- Build, Laufzeit, Konsole, Netzwerk, Musik und Soundeffekte ohne Fehler.
