# Level: Pro End Gegner — aus Klickerei wird ein Duell

## Was ich im Code gesehen habe

- Ein Quartal ist heute statisch: Boss-Text, zwei Züge, Preis springt beim Kapitelwechsel auf den nächsten Wert. Es gibt keinen Moment, in dem sich etwas bewegt, während man zusieht.
- Fast jede Aktion läuft über ein Fenster mit Auswahlknöpfen (Markt, Trade, Position, Presale, Survival). Das ist übersichtlich, erzeugt aber Formular-Gefühl statt Druck.
- Der Boss ist nur Sprecher: er kommentiert, aber er spielt nicht mit und man kann ihn nicht schlagen. Es gibt keinen Gegner, nur eine Zahl am Ende.
- Können zählt nur in vier kleinen Minispielen; alles andere ist Auswahl ohne Zeitdruck.

Daraus kommt das Problem: man klickt, wartet, klickt. Die drei Punkte unten drehen genau das.

## 1. Das Quartal wird live

- Jedes Quartal läuft als kurzer Live-Tick (ca. 8–12 Sekunden): der Kurs bewegt sich sichtbar Tag für Tag auf den historischen Endwert zu, mit echten Zwischenausschlägen.
- Kaufen und Verkaufen passiert **während** der Bewegung, mit einem Tipp, ohne Bestätigungsfenster. Wer zu früh kauft, sieht sich selbst ins Minus laufen. Wer zu lange wartet, verpasst.
- Ein `HOLD`-Knopf beschleunigt den Tick, wenn man wirklich nichts tun will — Passivität ist erlaubt, aber sie ist eine sichtbare Entscheidung, kein Standard.
- P&L, Cash und Liquidationsabstand zählen live mit. Bei Liquidationsgefahr blinkt ein Countdown: reagieren oder verlieren.

## 2. Der Boss wird ein echter Gegner

- Der Boss hat ein eigenes Depot und einen eigenen Kontostand. Oben läuft eine `YOU vs BOSS`-Leiste: wer führt, wie viel Abstand.
- Er spielt gegen dich: er kauft, wenn du panisch verkaufst, er hebelt in Bullenphasen, er kassiert dich aus, wenn du überzieht. Seine Züge sind sichtbar in einer kurzen Zeile pro Quartal.
- Boss-Angriffe: `LIQUIDITY SWEEP` (kurzer Fake-Ausbruch, der Stops holt), `FUNDING SQUEEZE` (Hebelkosten verdoppeln sich ein Quartal), `RUG OFFER` (Sofortgeld gegen dauerhaften Nachteil). Jeder Angriff braucht eine Antwort innerhalb des Ticks.
- Ende: Wer den Boss im Endvermögen schlägt, bekommt ein eigenes Ende `THRONE TAKEN` und ein Abzeichen im Board. Wer nur überlebt, bleibt SURVIVOR.

## 3. Boss-Kämpfe an den historischen Wendepunkten

- An sechs Momenten (Black Thursday, China-Ban, Luna, FTX, ETF, Leverage-Flush) wird der Boss zum Gegner in einer kurzen Runde über drei Schläge: Einsatz setzen, Skill-Moment bestehen, Konsequenz kassieren.
- Einsatz ist echtes Geld oder ein Status. Gewinnen bringt Kapital und eine Stärke (z. B. günstigere Gebühren, ein zusätzlicher Zug pro Quartal). Verlieren kostet und setzt eine Schwäche.
- Die Minispiele werden härter und passen zum Moment: bei FTX der Abzugs-Wettlauf, bei Luna der Panic-Exit, beim Flush die Timing-Bar mit engem Fenster.

## 4. Wissen statt Raten

- Vor jedem Quartal drei Signale, davon eines gelogen: Funding-Rate, Open Interest, Stimmung. Für Geld kann man ein Signal prüfen lassen.
- Wer die Historie kennt, liest die Signale richtig; wer nicht, lernt über die Runs. Das macht den zweiten Run besser als den ersten, ohne Zufallsglück abzuschaffen.
- `CONVICTION`: ein Balken, der mit richtigen Zügen in Folge steigt. Er lässt sich einsetzen, um eine Position doppelt zählen zu lassen — verliert man, ist der Balken weg und der Boss lacht.

## 5. Weniger Fenster, mehr Gefühl

- Kaufen/Verkaufen ohne Popup: Betrag über drei feste Chips direkt in der Marktzeile, ein Tipp = Order.
- Fenster bleiben nur für echte Entscheidungen (Boss-Kampf, Verwahrung, Leben, Cash Out).
- Rückmeldung wird körperlich: Ruck bei Liquidation, goldener Blitz bei Treffern, Ton pro Ereignis, Zahlen zählen hoch, Boss-Bild wechselt die Stimmung sichtbar.
- Ein Countdown auf die nächste Katastrophe: „irgendwas kommt in 2 Quartalen“, ohne zu verraten was.

## Abnahme

- Ein Quartal dauert gefühlt Sekunden und man greift mindestens einmal ein, ohne dass ein Fenster aufgeht.
- Der Boss führt in mindestens der Hälfte der Runs zwischenzeitlich — ihn zu schlagen ist möglich, aber nicht Standard.
- Reines Durchklicken (immer HOLD) endet vor 2026 im Minus.
- Test bei 393 und 1440 Pixel Breite: kein Überlauf, keine Fehler, Ton und Effekte passen.

## Technische Notizen

- Neuer Tick-Layer in `src/game/CryptoJourney.tsx`: `useQuarterTick` interpoliert zwischen `priceAt(chapter)` und `priceAt(chapter+1)` mit deterministischem Rauschen aus `src/game/rng.ts` (Turniersaat bleibt reproduzierbar, gleicher Seed = gleicher Tick für alle).
- Boss-Depot als eigenes Feld im `Run` (`boss: { cash, positions, plays }`), Züge über eine reine Funktion `bossMove(run, chapter, rng)` — deterministisch, damit das Turnier fair bleibt.
- Boss-Angriffe und Boss-Kämpfe als Daten in `src/game/journey-data.ts`, nicht als Sonderfälle im Code.
- Liquidation und P&L weiterhin aus der einen bestehenden Formelstelle, damit Live-Anzeige, Chip und Endabrechnung identisch rechnen.
- Neues Ende `THRONE_TAKEN` in Endings, Score-Bonus über `bossScore`; Board bekommt ein Abzeichen. Bestehende Einträge bleiben gültig.
- Kein neues Paket: Live-Chart über Canvas/SVG, Animationen als Keyframes in `src/styles.css`.
