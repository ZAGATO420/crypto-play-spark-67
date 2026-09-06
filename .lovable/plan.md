# Härter, emotionaler, mit Ausstieg: Survival wird echt

## Was ich geprüft habe

- Essen und Beruhigen sind unbegrenzt und billig: jeder Klick senkt Hunger bzw. Stress um 46 Punkte, kostet nur rund 90 bzw. 130 Dollar pro Quartal. Wer Geld hat, kann Survival komplett wegkaufen — es gibt keine Begrenzung pro Quartal, keine Kosten in Zeit oder Zügen.
- Ein vorzeitiges Beenden existiert nicht. Das Ende `SELLOUT` ("früh ausgestiegen, Bag gerettet") ist im Spiel beschrieben, aber es gibt keine Stelle, an der man es auslösen kann. Der Run endet nur bei Hunger 100, Stress 100, null Vermögen oder nach dem letzten Kapitel.
- Die drei Stufen unterscheiden sich fast nur über Kosten und Risiko-Faktoren (0.8 / 1.0 / 1.4). Hunger und Stress steigen unabhängig von der Stufe gleich schnell.

## 1. Survival wird eine echte Entscheidung

- Essen und Beruhigen kosten künftig einen Zug. Pro Quartal hat man zwei Züge — jede Mahlzeit ist ein nicht getradeter Trade.
- Höchstens zweimal Pflege pro Quartal, und die Wirkung nimmt ab: der zweite Einsatz bringt deutlich weniger.
- Preise steigen mit dem Verlauf und mit der Stufe: Grundnahrung wird über die Jahre teurer, in BOSS deutlich schneller.
- Stress und Hunger steigen zusätzlich, wenn viel Kapital in Hebelpositionen liegt und wenn Verluste kommen — Erfolg beruhigt, Rot frisst.
- Ab kritischen Werten (über 80) kommen echte Folgen statt nur Warnfarben: Züge fallen aus, Minispiele werden schwerer, Zittern beim Antippen, der Boss redet.

## 2. Vorzeitig beenden: CASH OUT

- Neuer Knopf im Run: `CASH OUT` beendet den Run sofort. Vorher eine klare Karte, was das bedeutet: alle Positionen werden zum aktuellen Kurs geschlossen, Steuern und Schulden abgezogen, dann Endabrechnung.
- Wer vor Kapitel 28 aussteigt, bekommt das Ende `SELLOUT` mit eigenem Text und Abzeichen. Der Boss-Score bleibt gültig, wird aber über den Überlebensanteil kleiner — früh raus heißt sicher, aber nicht Spitze.
- Zusätzlich Boss-Angebote im Spiel: an ausgewählten Krisenmomenten bietet er einen Ausstieg mit Sofortgeld an. Annehmen beendet den Run.

## 3. Höher schrauben, klar spürbar

- Jede Stufe bekommt eigene Werte für Hungerdruck, Stressdruck, Pflegekosten, Rug-Häufigkeit und Liquidationsnähe, nicht nur einen Kostenfaktor.
- Neue vierte Stufe `NIGHTMARE`: teures Leben, ständige Krisen, Pflege wirkt halb, ein Fehler kostet den Run. Score-Faktor entsprechend hoch.
- `LEGEND` wird schwerer und ehrlicher benannt: Zielvermögen, überlebte Krisen, und nie ein Quartal mit kritischem Hunger oder Stress.
- Reines Halten wird bestraft: mehr Passivitäts-Druck, laufende Kosten und Zwangsverkäufe, wenn Bargeld fehlt.

## 4. Mehr Emotion, mehr Action

- Zufallsereignisse im Privatleben, die weh tun oder retten: Zahnarzt, Autopanne, Freund will Geld leihen, Job weg, unerwartete Rückzahlung. Immer mit sichtbarer Geldbewegung.
- Der Boss reagiert lauter: hämische Zeilen bei Fehlern, Spott bei Passivität, Anerkennung bei echten Treffern, sichtbarer Stimmungswechsel im Bild.
- Feedback wird körperlicher: Bildschirm ruckelt bei Liquidation, roter Puls bei Crashs, goldener Blitz bei großen Gewinnen, Zahlen zählen hoch, Ton passt zum Moment.
- Häufigere Minispiele mit Einsatz: kritische Momente (Crash, Einstieg, Presale, Liquidationsgefahr) verlangen einen Treffer, und ein Fehlschlag kostet echt.
- Ein Countdown-Gefühl: Anzeige, wie viele Quartale noch, und Warnung vor der nächsten historischen Katastrophe ohne zu verraten, was genau kommt.

## Abnahme

- Ein Run, in dem nur gegessen und beruhigt wird, kommt nicht durch: das Geld reicht nicht, und die Züge fehlen.
- `CASH OUT` funktioniert in jedem Kapitel, schließt alle Positionen korrekt ab und trägt sich ins Board ein.
- Alle vier Stufen fühlen sich messbar unterschiedlich an; NIGHTMARE endet ohne saubere Strategie früh.
- Test bei 390 und 1280 Pixel Breite: nichts abgeschnitten, keine Fehler, Ton und Effekte passen.

## Technische Notizen

- Alles in `src/game/CryptoJourney.tsx`, `src/game/journey-data.ts`, `src/game/minigames.tsx` und `src/styles.css`.
- `care()` verbraucht einen Zug, führt Quartalszähler und abnehmende Wirkung, Preis aus einer Funktion mit Kapitel- und Stufenfaktor.
- `finish("SELLOUT")` wird über eine neue Aktion erreichbar; Positionen werden über dieselbe Schließ-Funktion wie ein normaler Verkauf abgewickelt, damit Geldflüsse und Kassenbuch stimmen.
- `DIFFICULTIES` wird um Felder für Hunger-, Stress-, Pflege- und Rug-Faktoren sowie den Eintrag `NIGHTMARE` erweitert; alle Nutzungsstellen ziehen aus diesen Feldern.
- Boss-Score und Leaderboard-Prüfung bekommen den neuen Schwierigkeitsfaktor; bestehende Einträge bleiben gültig.
