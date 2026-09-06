# V44 — Feedback, Wärme und klare Trennung von MARKET und CHART

## Was ich im Code geprüft habe

- **CHART abgeschnitten:** In der Chart-Ansicht liegt die Aktionsreihe (BUY / SELL / PERP) über der Kennzahlenzeile HIGH / LOW / MONTH / ENTRY / LIQ — die Werte sind halb verdeckt (siehe Screenshot). Ursache: die Chart-Regeln geben dem Kursbild und den Kennzahlen zusammen mehr Höhe, als die Bühne hat.
- **Launchpad/Snipes ohne Ergebnis-Moment:** Beim Auflösen eines Snipes (`processLaunches`) gibt es nur eine kleine, nach 2,8 s verschwindende Kurzmeldung plus Verlaufseintrag — keine Ergebniskarte. Rug, Honeypot, Bleed und Moonshot fühlen sich deshalb wie nichts an. Presales haben eine Ergebniskarte, sie ist aber optisch die alte, kalte Karte.
- **MARKET und CHART noch zu ähnlich:** Beide zeigen dieselbe Coin-Leiste, denselben Kopf und dieselbe Aktionsreihe.
- **Fortschritt:** Das Level-/XP-Band existiert, ist am Handy aber gestaucht und ohne Ereignis-Wirkung — Aufstieg wird nicht gefeiert, deshalb wirkt es, als gäbe es keinen Fortschritt.

## 1. Chart-Ansicht ohne Abschneiden

- Die Chart-Bühne wird eine feste Höhenfolge: Coin-Umschalter, Kursbild (flexibel), Kennzahlenzeile, Aktionsreihe — nichts überlappt mehr, auch bei 375×677 und niedrigen Displays.
- Die Kennzahlen werden kompakter (zwei Zeilen bei sehr schmalen Geräten), immer vollständig lesbar.
- Kontrolle an jeder Kennzahl: der Mittelpunkt darf nicht von einem Knopf überdeckt sein.

## 2. Jedes Ergebnis bekommt einen Moment

- **Launchpad/Snipe-Auflösung** erhält eine echte Ergebniskarte im Stil des Spiels: großes Symbol, RUG / HONEYPOT / BLEED / MOON, Name, eingesetztes Geld, Rückfluss, Vielfaches, XP-Gewinn und eine Boss-Zeile. Ton passend (dumpfer Schlag bei Rug, Fanfare bei Moon), Bildschirmruck bei Rug, Funken bei Moon.
- **Presale-Ergebnis** nutzt dieselbe neue Karte statt der alten Ansicht.
- **Airdrops, Quests, Steuern, Notverkauf, Liquidation** bekommen jeweils sichtbares Feedback am Ort der Zahl: Zahl blitzt, zählt hoch, farbiger Chip mit Betrag.
- Weiterhin höchstens eine Vollbildkarte pro Monat: mehrere Ergebnisse in einem Monat werden zu einer Karte mit Liste zusammengefasst, damit es nie zur Klickflut wird.
- Jede Karte landet zusätzlich im Verlauf (RUN LOG), damit man später nachlesen kann, was passiert ist.

## 3. MARKET und CHART werden eindeutig verschieden

- **MARKET** = Handeln: Kursliste aller freigeschalteten Coins mit Logo, Preis, Monatsänderung, Positionsmarke, kurze Positionszeile, BUY / SELL / PERP. Kein Kursbild, keine Chart-Kennzahlen.
- **CHART** = Analysieren: schmale Coin-Umschalter, großes Kursbild mit Einstiegs- und Liquidationslinie, Kennzahlenzeile, Zeitfenster-Umschaltung (30 T / 6 M / Gesamt) und Hoch/Tief-Markierungen. Handeln nur über einen einzigen Knopf „TRADE", nicht über eine zweite volle Aktionsreihe.
- Beide Ansichten bekommen sichtbar unterschiedliche Köpfe und Beschriftungen.

## 4. Fortschritt wird spürbar

- Level-Band am Handy wieder groß und lesbar: Abzeichen, Titel, XP-Balken, `XP / nächstes Level`, Streak und Monatsziel.
- Jeder XP-Gewinn: `+40 XP` fliegt an der Aktion auf, der Balken läuft sichtbar weiter.
- Level-Up: Goldblitz über dem Band, kurzer Sound, Boss-Kommentar, neuer Titel — ohne Klickzwang.
- Meilensteine (erste $100k, Level 10, Kapitel überlebt) mit kurzem Vollbild-Moment (max. 1,5 s).

## 5. Wärme und Charme zurück

- Weniger kalte Blau-Flächen: warme Goldkanten für Kontostand und Belohnung, Acid nur für Aktionen, weiche Innenlichter statt harter Linien.
- Boss dauerhaft in der Ecke mit wechselnder Stimmung und einem Satz zu jedem größeren Ereignis.
- Weiche Übergänge (150 ms), Zahlen zählen hoch, Gewinn pulst grün, Verlust rot; `prefers-reduced-motion` schaltet alles ruhig.

## Abnahme

Playwright bei 375×677, 390×844, 430×932, 768×1024 und 1280×800: Chart-Kennzahlen vollständig sichtbar und unverdeckt, Snipe mit Rug und mit Moon erzeugt jeweils eine Ergebniskarte, MARKET und CHART sichtbar verschieden, Level-Band lesbar, XP-Gewinn und Level-Up sichtbar, kein horizontales Scrollen, keine Konsolenfehler, Build in Ordnung.

## Technische Notizen

Alles in `public/game.html`:
- Chart-Stage: Höhenfolge über Grid statt Flex-Wachstum; `#v43-cstat` und `.v40-actions` in eigene Zeilen, `.v40-visual` als `minmax(0,1fr)`.
- Neue Ergebniskarte `v44Result(kind, payload)` als ein Renderer, genutzt von `processLaunches()` und `_showPresaleResultNow()`; Einreihung über bestehendes `pqEnqueue`/`pqRelease` mit Monatsbudget und Sammel-Liste.
- Chart-Zeitfenster über `points(sym,s)` mit Fensterparameter; Entry/Liq-Linien aus `state.avg`, `state.perps`, `perpLiq`.
- XP-Feedback über `awardXP()`-Hook, `#xp-layer` und `#v41-prog`; Sounds über `playSound()`.
- Unberührt: historische Kurse 2020–2026, XP-Formeln, Perp-/Liquidationsmathematik, Kosten, Save-State, Leaderboard, Startscreen, Endscreen.
