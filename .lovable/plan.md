# V43 — Position Command Center und echtes Game-Feedback

## Ziel

Offene Spot-Käufe und Perp-Trades werden nicht länger in eine kleine scrollende Liste zwischen Chart und Handelsknöpfen gepresst. Direkt auf der Hauptbühne entsteht ein großes, immer erreichbares **Position Command Center**: klar lesbar, vollständig bedienbar und ohne den Umweg über `POSITIONS` oder `PERPS`.

## Bestätigte Ausgangslage

- Die aktuelle Hauptbühne setzt `OPEN RISK` direkt vor die BUY/SELL/PERP-Leiste, begrenzt die Liste am kleinen Smartphone aber auf nur 104 px und aktiviert internes Scrollen. Dadurch werden Positionen und Schließen-Knöpfe abgeschnitten.
- Perp-Zeilen besitzen dort aktuell nur `CLOSE`; die Zeile selbst öffnet keine Detailansicht.
- Spot-Zeilen zeigen nur Bestand, Prozentwert und Durchschnitt, bieten in diesem sichtbaren Bereich aber keine Kauf-/Verkaufsoption.
- Die vorhandenen Trade-Fenster und die bestehende Perp-, P&L-, Liquidations- und Spot-Mathematik können weiterverwendet werden; die Spielberechnung muss dafür nicht verändert werden.

## 1. Großes Position Command Center auf der Hauptbühne

- Der jetzige kleine `OPEN RISK`-Kasten wird durch eine eigenständige, große Positionsfläche ersetzt.
- Sobald mindestens eine Position offen ist, zeigt sie eine vollständige aktive Karte mit Coin-Logo, SPOT oder PERP, Richtung, Hebel, Positionswert, Einstieg, aktuellem Kurs, Gewinn/Verlust in Dollar und Prozent sowie Liquidationspreis und Sicherheitsabstand bei Perps.
- Mehrere Positionen werden nicht vertikal in einen Mini-Scrollbereich gequetscht: Eine große Karte bleibt sichtbar, weitere Positionen sind über klare Vor/Zurück-Pfeile und `1 / N` direkt in derselben Fläche erreichbar.
- Der zuletzt eröffnete Trade wird automatisch aktiv. Wird oben ein Coin gewählt, springt die Positionsfläche auf dessen offene Position, falls vorhanden.
- Ohne offene Position bleibt die Fläche kompakt und fordert zu einer ersten Aktion auf; der Chart bekommt dann automatisch mehr Raum.

## 2. Jede Position direkt anklickbar und vollständig steuerbar

- Antippen der großen Spot-Karte öffnet direkt das bestehende Handelsfenster für genau diesen Coin, bereits auf `SELL`; zusätzlich bleiben `BUY MORE` und `SELL` als klare Aktionen auf der Karte.
- Antippen einer Perp-Karte öffnet ein professionelles Positionsfenster für genau diesen laufenden Trade.
- Dieses Perp-Fenster zeigt Live-P&L, Margin, Notional, Entry, Mark Price, Funding, Liquidationspreis und Liquidationsabstand sowie `CLOSE 25%`, `CLOSE 50%` und `CLOSE ALL`.
- Kritische Perps erhalten eine klare rote Gefahrenstufe; sichere Positionen bleiben cyan/grün. Alle Aktionen haben mindestens 44 px Trefferfläche und eine eindeutige Bestätigung.
- BUY, SELL und PERP bleiben unter der Karte jederzeit erreichbar und werden nicht mehr von Positionen oder Meldungen überdeckt.

## 3. Fester Mobile-Aufbau ohne Abschneiden

- Die Hauptbühne wird für 375×677 und größere Smartphones neu aufgeteilt: kompakter Coin-Kopf, anpassbarer Chart, großes Positionsmodul, feste Handelsaktionen und feste Command Rail.
- Keine innere vertikale Scrollleiste im Positionsmodul, kein abgeschnittener CLOSE-Knopf und kein Inhalt unter BUY/SELL/PERP.
- Hunger, Stress, EAT und CALM bleiben als permanentes Band oberhalb der Bühne sichtbar und werden nicht durch die Positionsfläche verdrängt.
- Bei sehr geringer Höhe schrumpft zuerst der Chart; Positionsdaten, Überlebensaktionen und Hauptaktionen bleiben lesbar und bedienbar.
- Der separate `POSITIONS`-Reiter wird zur erweiterten Gesamtübersicht, ist aber für Beobachten oder Steuern eines laufenden Trades nicht mehr nötig.

## 4. Desktop als echtes Trading-Deck

- Desktop erhält dieselbe große aktive Positionskarte in der rechten Instrumentenspalte, nicht nur eine kleine Textliste.
- Spot und Perp nutzen dieselbe visuelle Sprache und dieselben direkten Aktionen wie auf dem Handy.
- Die Seitenleiste zeigt zusätzlich eine kompakte Übersicht aller offenen Positionen; Auswahl aktualisiert sofort die große Detailkarte.
- Portfolio, Quests, Launchpad, Perps, Degen Ops, Business, Shop, Trophies, EAT/CALM und NEXT MONTH bleiben direkt erreichbar.

## 5. Mehr Game-Feeling ohne Meldungsflut

- Eröffnung, Gewinnanstieg, Verlustwarnung, Teilverkauf und Schließen erzeugen sichtbares Feedback direkt an der Positionskarte: kurzer Zahlenimpuls, Rahmenreaktion und passende Boss-Reaktion.
- Der Boss kommentiert nur wichtige Zustände: erster Trade, starker Gewinn, kritische Liquidationsnähe und erfolgreicher Exit.
- Gewinn/Verlust zählt weich hoch; Liquidationsabstand reagiert sichtbar auf Kursänderungen. Effekte bleiben kurz und respektieren reduzierte Bewegung.
- Nullwerte werden sauber als `$0` statt `+$-0` dargestellt.

## Umsetzung

- Die bestehende V41-Miniliste wird ersetzt statt erneut mit weiteren Höhen-Overrides repariert.
- Das neue Positionsmodul verwendet weiterhin `state.holdings`, `state.avg`, `state.perps`, `perpPnl`, `perpLiq`, `perpLiqDist`, `v6Trade`, `v6Perp` und `closePerp`; Preis-, P&L- und Liquidationsregeln bleiben unverändert.
- Eine gemeinsame Auswahl verwaltet die aktive Position für Handy und Desktop. Rendern aktualisiert nur Werte und Zustände, damit Klicks und Eingaben nicht durch ständiges Neuerstellen verloren gehen.
- Die bestehenden V40/V41-Doppelanzeigen für Positionen werden aus dem sichtbaren Ablauf entfernt, damit es nur noch eine eindeutige Quelle gibt.

## Abnahme

- Tests bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Testfälle: ein Spot-Kauf; mehrere Spot-Käufe; ein Perp; drei Perps; gemischte Spot-/Perp-Positionen; Long/Short; Gewinn/Verlust; kritische Liquidationsnähe.
- Jede offene Position ist von der Hauptbühne aus ohne `POSITIONS`, `PERPS` oder `OPS` erreichbar.
- Spot: Karte öffnen, BUY MORE, Teilverkauf und Komplettverkauf funktionieren.
- Perp: Karte öffnen, 25 %, 50 % und vollständig schließen funktionieren; Werte aktualisieren sich sofort.
- EAT/CALM, BUY/SELL/PERP, MONTH und die untere Navigation bleiben sichtbar und funktionieren.
- Kein Abschneiden, keine innere Positions-Scrollbar, keine Überlagerungen, kein horizontales Scrollen und keine Fehler in Konsole oder Build.
