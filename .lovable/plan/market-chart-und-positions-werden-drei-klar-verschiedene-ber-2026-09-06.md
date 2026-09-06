# MARKET, CHART und POSITIONS werden drei klar verschiedene Bereiche

## Was aktuell wirklich passiert (geprüft im Code)

- Sobald eine Position offen ist, wird in `MARKET` die Coin-Leiste, der Kopf mit Kurs und der Chart komplett ausgeblendet. Deshalb siehst du nach dem ersten Trade keine anderen Coins mehr — nur noch deine Position.
- `CHART` zeigt denselben Kopf, dieselbe Coin-Leiste und dieselben BUY/SELL/PERP-Knöpfe wie `MARKET`, nur mit größerem Chart. Deshalb wirken die beiden Bereiche gleich.
- Die große Positionskarte mit Gewinn/Verlust erscheint gleichzeitig in `MARKET` und in `POSITIONS`. Dadurch ist dieselbe P&L-Anzeige doppelt vorhanden.

## 1. MARKET wird wieder die Börse

- Die Coin-Leiste, Kurs und Monatsänderung bleiben immer sichtbar — auch mit offenen Positionen. Die Regel, die sie versteckt, wird entfernt.
- Statt einzelner Kacheln wird eine echte Kursliste angezeigt: Logo, Symbol, Preis, Monatsänderung, und eine Markierung „POSITION OFFEN" bei gehaltenen Coins. Antippen wählt den Coin.
- Die große Positionskarte verschwindet aus `MARKET`. An ihre Stelle kommt eine einzige schmale Zeile: offene Positionen, Gesamtwert, Gesamt-P&L. Antippen springt direkt nach `POSITIONS`.
- BUY, SELL und PERP bleiben unten fest sichtbar und gelten für den gewählten Coin.

## 2. CHART wird echte Kursanalyse

- Keine Coin-Kursliste mehr, kein doppelter Handelskopf: oben nur eine kompakte Coin-Umschaltung.
- Der Chart nutzt die volle Höhe und bekommt eine Datenzeile mit Hoch, Tief, Monatsänderung und Zeitfenster.
- Ist für den gewählten Coin eine Position offen, zeigt der Chart Einstiegslinie und — bei Perps — Liquidationslinie mit Beschriftung.
- BUY/SELL/PERP bleiben erreichbar, damit man direkt aus dem Chart handeln kann.

## 3. POSITIONS wird der einzige Ort für offene Trades

- Nur hier steht das große Position Command Center mit Pager `1 / N`, allen Werten (Einstieg, Kurs, Margin, Größe, Liquidation, Sicherheitsabstand) und den direkten Aktionen (BUY MORE, SELL, OPEN DETAILS, CLOSE 50%, CLOSE ALL).
- Zusätzlich darüber eine Gesamtübersicht: Anzahl Positionen, Gesamtrisiko, Gesamt-P&L, Cash.
- Die doppelte alte Positionsliste in dieser Ansicht wird entfernt, damit es nur eine Quelle gibt.
- Wird in `MARKET` ein Coin mit offener Position gewählt, zeigt `POSITIONS` beim Wechsel direkt diese Position.

## 4. Damit sich das Spiel wieder unterhaltsam anfühlt

- Jede Ansicht hat eine eigene, klar erkennbare Aufgabe und einen eigenen Kopf, damit man nie zweimal dasselbe sieht.
- Kursänderungen blinken kurz grün/rot in der Kursliste; die Positions-Zeile in `MARKET` reagiert sichtbar auf Gewinn und Verlust.
- Survival (Hunger, Stress, EAT, CALM) und `MONTH` bleiben in allen drei Ansichten sichtbar.

## Abnahme

- Tests bei 375×677, 390×844, 430×932 und 1280×800, jeweils ohne Position, mit einem Spot-Kauf, mit einem Perp und mit gemischten Positionen.
- In `MARKET` sind nach dem ersten Trade weiterhin alle handelbaren Coins sichtbar und wählbar.
- `MARKET`, `CHART` und `POSITIONS` unterscheiden sich sichtbar; die P&L-Detailkarte erscheint nur in `POSITIONS`.
- Kein abgeschnittener Inhalt, kein horizontales Scrollen, keine Konsolenfehler, Build in Ordnung.

## Technische Notizen

Alles in `public/game.html`:
- Die Regeln `body.v40-live.v43-has-pos[data-v40-stage="market"] …` (ca. Zeile 14107–14109) werden gelöscht; `v43-has-pos` steuert künftig nur die kompakte Zusammenfassungszeile.
- `#v41-live` wird für `[data-v40-stage="market"]` ausgeblendet und nur in `positions` gerendert; die kompakte Zeile ist ein neues kleines Element im Market-Stage.
- Die Chart-Ansicht erhält eigene Regeln: `.v40-mobile-tape` kompakt, `.v40-stage-head` reduziert, `.v40-visual` volle Resthöhe plus neue Statistik-/Linienzeile aus `state.avg`, `state.perps` und `perpLiq`.
- Die alte Doppelliste `#v40-mobile-pos` wird in `positions` entfernt statt nur versteckt.
- Spielmechanik, Preise, Perp-Mathematik, P&L, Liquidation, XP und Monatslogik bleiben unverändert.
