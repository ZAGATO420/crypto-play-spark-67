# Das Spiel wird verständlich, abwechslungsreich und fertig

Vier Probleme, die alle denselben Effekt haben: Es fühlt sich nicht wie ein Spiel an.

## 1. Ton am Start endgültig sauber

Aktuell können in den ersten Sekunden zwei Musikspuren kurz gleichzeitig laufen (Menü-Loop und Spiel-Loop), weil beide eigene Abspieler haben und der erste Klick sie fast gleichzeitig freischaltet.

- Es gibt künftig **nur einen einzigen Musikabspieler**. Ein Wechsel tauscht die Spur in genau diesem Abspieler — zwei Musikstücke können technisch nicht mehr übereinanderliegen.
- Der erste Klick schaltet den Ton frei und startet **genau die Spur, die zum aktuellen Bildschirm gehört** — keine Verzögerung, kein Menü-Loop, der nachträglich hochkommt.
- Effekte bleiben unverändert, aber derselbe Effekt kann nicht mehr zweimal im gleichen Moment doppelt klingen.

## 2. Spiellogik in einem Satz verständlich

Heute stehen Ziel, Chart, Boss, Signale und fünf Werkzeuge gleichzeitig da. Neu gilt pro Quartal eine feste, immer gleiche Leserichtung:

1. **Lage** — ein Satz, was gerade im Markt passiert.
2. **Deine Aufgabe** — ein Satz in Alltagssprache: „Kaufe günstig ein“, „Nimm Gewinn mit“, „Bring dein Geld in Sicherheit“.
3. **Deine Züge** — du hast sichtbar 2 Züge. Jeder Knopf zeigt, was er kostet und was er bringt.
4. **Quartal beenden** — Ergebnis wird aufgedeckt: rein, raus, Fazit.

Dazu eine dauerhaft erreichbare Karte **WIE MAN SPIELT** mit fünf Zeilen: Ziel des Runs, was Züge sind, wie man Geld verdient, wie man stirbt, wie der Boss-Score entsteht. Kein dunkler Vorhang, keine Tour.

## 3. Der Spieler sieht jederzeit, wie gut er dasteht

Neu im Kopfbereich eine **Standanzeige** gegen den Boss:

- eigener Stand in Dollar gegen den Boss-Stand desselben Quartals
- eine klare Wertung: `WEIT VORNE · VORNE · KNAPP · HINTEN · AM ABGRUND`
- Fortschritt: Quartal x von 28, Ziel für LEGEND und Abstand dazu
- nach jedem Quartal eine Zeile: „Du hast + / − X gemacht, der Boss + / − Y.“

Damit ist in jeder Sekunde ohne Rechnen klar, ob der Run gut läuft.

## 4. Jedes Quartal spielt sich anders — und Presales sind wieder da

Die sechs Phasen existieren, aber die Hauptaktion sieht trotzdem fast immer gleich aus, und **Presales/ICOs erscheinen nur, wenn Phase und Kapitel zufällig zusammenpassen** — bei Chapter 5, 9, 14, 20, 22 tauchen sie heute nie auf. Das wird korrigiert:

- Jede Launch-, Presale- und ICO-Gelegenheit bekommt ihr eigenes Quartal als **eigene Bühne** mit Name, Tag (PRESALE / ICO / FAIR LAUNCH), Rug-Risiko, Mindesteinsatz und möglicher Rendite — sichtbar, bevor man zahlt. Keine Gelegenheit wird mehr von einer Phase verdeckt.
- Jede Phase erhält eine sichtbar andere Bühne, nicht nur einen anderen Knopftext:
  - **Einsammeln:** Marktauswahl mit Preisvergleich und Größenwahl.
  - **Momentum:** Gewinn-mitnehmen-Leiste mit 25 / 50 / 100 Prozent.
  - **Panik:** Countdown, dünnes Orderbuch, Flucht oder Durchhalten.
  - **Jagd:** Launch-Karte mit Prüfung und Timing-Aufgabe.
  - **Verteidigen:** Verwahrung, Börsenausfall, Geld verschieben.
  - **Bossduell:** klarer Einsatz, klare Belohnung, klares Risiko.
- Zwischen den Phasen wechseln Bild, Farbe und Ton, damit der Wechsel spürbar ist.
- Historische Ereignisse (Luna, FTX, ETF, 100k) bleiben in ihrer Reihenfolge und werden nie übersprungen.

## Unverändert

Historische Preise, P&L-, Steuer- und Boss-Score-Formeln, Startkapital, Turnier-Seed und -Bedingungen, Wallet-Schutz, Gewinnerermittlung, bestehende Leaderboard-Einträge.

## Technische Umsetzung

- `src/game/audio.ts`: ein einziges `HTMLAudioElement` für Musik, Quellwechsel statt zweitem Abspieler, Freischaltung startet direkt die Spur des aktuellen Bildschirms.
- `src/game/journey-data.ts`: Phasenplan an die Presale-/ICO-Kapitel gekoppelt, Standbewertung (`standingFor`) und Aufgabentexte in Alltagssprache.
- `src/game/CryptoJourney.tsx`: feste Leserichtung Lage → Aufgabe → Züge → Beenden, Standanzeige gegen den Boss, Hilfekarte, phasenspezifische Bühnen, garantierte Presale-Bühne.
- `src/styles.css`: eigene Optik pro Phase, Standanzeige, Hilfekarte, mobile Hierarchie.

## Prüfung

- Vollständiger Lauf über alle 28 Quartale auf 393×852 und 1440×900: jede Phase, jeder Presale/ICO, jedes historische Ereignis erscheint.
- Ton beim Start: genau eine Musikspur, kein Überschlagen, geprüft mit frisch geleertem Speicher.
- Zwei Browser mit gleichem Saison-Seed erzeugen identische Ereignisse.
- Keine Konsolen-, Laufzeit- oder Buildfehler.
