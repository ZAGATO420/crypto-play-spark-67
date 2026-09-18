# Einfach verstehen, Können zeigen, jedes Quartal anders

Drei Probleme, eine Ursache: Der Spieler drückt Knöpfe, ohne vorher zu wissen, was passiert, und danach ohne zu sehen, warum es gut oder schlecht war.

## 1. Vor jedem Knopf steht, was passiert

Jeder gelbe Hauptknopf zeigt künftig in Alltagssprache drei Zeilen — sichtbar, bevor man drückt:

- **Du gibst:** z. B. `$2.500 von deinem Bargeld`
- **Du bekommst:** z. B. `Bitcoin im Wert von $2.500 zum Preis von heute`
- **Danach:** `Steigt der Preis, steigt dein Vermögen. Fällt er, verlierst du.`

Nach dem Druck erscheint an derselben Stelle die Antwort in einem Satz: `Gekauft: 0,027 BTC zu $92.400. Dein Geld: $7.500.` Keine Fachbegriffe, keine Abkürzungen im Hauptbild.

Der laufende Kurs bekommt eine dauerhafte Zeile: **Der Kurs läuft von allein. Du musst nichts antippen.** Der gelbe Punkt heißt `JETZT` und erklärt sich selbst in einem Tooltip-Satz.

## 2. Ein Können-Moment in jedem Quartal

Heute kann man ein Quartal komplett durchklicken. Neu hat jedes Quartal genau **eine Prüfung**, die man gut oder schlecht machen kann, immer mit sichtbarem Ergebnis und kleinem Bonus:

- **Einstieg treffen:** Balken läuft, tiefe Zone ist markiert — Treffer gibt besseren Einstiegspreis.
- **Gewinn mitnehmen:** Kurs läuft hoch, man wählt den Moment für 25 / 50 / 100 Prozent.
- **Panik-Flucht:** Countdown, Orderbuch dünnt aus — früh raus kostet wenig, spät raus kostet viel.
- **Launch prüfen:** drei Hinweise, zwei sind Warnsignale — richtig gedeutet, kein Rug.
- **Sichern:** Geld vor dem Ausfall in die richtige Verwahrung bringen.
- **Bossduell:** klarer Einsatz, klare Belohnung, kurzer Timing-Test.

Am Quartalsende steht eine Zeile: `Deine Prüfung: gut gespielt (+X)` oder `verpasst (−Y)`. So sieht der Spieler, dass sein Können zählt und nicht nur Glück.

## 3. Jedes Quartal fühlt sich anders an

- Die Prüfung aus Punkt 2 wechselt sichtbar mit der Phase — anderes Bild, andere Farbe, andere Hauptfrage, anderer Knopftext.
- Keine zwei Quartale hintereinander mit derselben Prüfung.
- Presales und ICOs behalten ihre eigene Bühne; historische Ereignisse (Luna, FTX, ETF, 100k) bleiben in ihrer Reihenfolge.
- Die Werkzeugleiste unten bleibt gleich, damit die Orientierung nicht leidet.

## 4. Handelslogik in fünf Zeilen erklärt

Die Karte `WIE MAN SPIELT` wird auf fünf einfache Sätze gekürzt und direkt in der Hauptansicht als kleiner Knopf `?` erreichbar:

1. Du hast Bargeld. Kaufen wandelt Bargeld in Coins.
2. Coins steigen und fallen mit dem echten Kurs von damals.
3. Verkaufen wandelt Coins zurück in Bargeld — der Gewinn ist der Unterschied zum Kaufpreis.
4. Essen und Erholung kosten Geld, sonst endet der Lauf.
5. Am Ende zählt dein Vermögen gegen den Boss.

Hebel, Funding und Steuern bleiben im Spiel, wandern aber komplett in die Detailbereiche und tauchen in der Hauptansicht nur mit einer Klartextzeile auf.

## Unverändert

Historische Preise, P&L-, Steuer- und Boss-Score-Formeln, Startkapital, Turnier-Seed und -Bedingungen, Wallet-Schutz, Gewinnerermittlung, bestehende Leaderboard-Einträge.

## Technische Umsetzung

- `src/game/journey-data.ts`: pro Phase ein `skillCheck`-Deskriptor (Typ, Ziel, Bonus, Strafe), Klartext-Vorschau (`gives` / `gets` / `then`) je Hauptaktion, gekürzte `HOW_TO_PLAY`.
- `src/game/minigames.tsx`: bestehende Minispiele auf die sechs Prüfungen erweitern, einheitliches Ergebnisobjekt `{ ok, delta, line }`.
- `src/game/CryptoJourney.tsx`: Vorschau-Block über den Hauptaktionen, Ergebniszeile nach jeder Aktion, garantierte Prüfung pro Quartal ohne Wiederholung der Vorrunde, Prüfergebnis in der Quartalsauswertung, `?`-Knopf für die Hilfekarte.
- `src/styles.css`: Vorschau-Block, Ergebniszeile, Prüf-Bühnen je Phase, mobile Priorität auf 375×677.

## Prüfung

- Vollständiger Lauf über alle 28 Quartale auf 375×677, 393×852 und 1440×900: jede Prüfung erscheint, keine zwei gleichen hintereinander, kein Overflow.
- Vorschau und Ergebniszeile bei jeder Hauptaktion vorhanden und korrekt gerechnet.
- Zwei Browser mit gleichem Saison-Seed erzeugen identische Prüfungen und Ergebnisse.
- Keine Konsolen-, Laufzeit- oder Buildfehler.
