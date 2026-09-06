# Mobile Terminal exakt an die gewählte blaue Command-Deck-Vorschau anpassen

## Ziel
Die aktuelle Petrol-Version wird nicht weiter kosmetisch ergänzt. Die Smartphone-Ansicht wird visuell an die ursprünglich gewählte **blaue Tactical-Command-Deck-Vorschau** angeglichen: deutlich sichtbare blaue Karten, moderne Instrumentenflächen und eine hochwertige untere Befehlsleiste. Gleichzeitig wird das Flackern der festen Knöpfe beseitigt.

## 1. Flackerfreie untere Befehlsleiste
- Den starken Live-Blur und andere GPU-kritische Effekte auf der festen Leiste entfernen; die Leiste erhält eine deckende, stabile Fläche.
- Keine dauerhafte Verschiebung des mittleren Knopfs per `transform`; alle fünf Bereiche liegen auf einem festen Pixelraster und verändern ihre Geometrie beim Aktivieren nicht.
- Die Leiste wird an die sichere Unterkante des Smartphones angepasst und bekommt einen eigenen reservierten Seitenbereich, damit darunter keine bewegten Inhalte weiterlaufen.
- Aktive Zustände ändern nur Farbe, Lichtkante und Icon – nie Größe oder Position.

## 2. Den gezeigten blauen Stil wirklich übernehmen
- Dunkles Marineblau als Bühne, klar blau leuchtende Kartenflächen, kühles Cyan für aktive Navigation und Gold nur für Boss-, Kontostand- und Belohnungswerte.
- Karten erhalten die visuelle Tiefe der Vorschau: helle obere Kante, präzise Innenlinien, kontrollierter blauer Schein und klar getrennte Informationszonen.
- Die bestehende grün-goldene Terminaloptik wird im Spielbereich ersetzt, nicht nur mit einer weiteren halbtransparenten Ebene überzogen.
- Grün und Rot bleiben ausschließlich für Gewinn/Verlust; Acid-Grün dominiert nicht mehr die gesamte Bedienung.

## 3. Moderne Handy-Navigation wie in der Vorschau
- `MARKET · CHART · MONTH · POSITIONS · MORE` bleibt funktional, wird aber als echte Command Rail neu gezeichnet.
- Klare, einheitliche Symbole statt der aktuellen gemischten Textzeichen; größere visuelle Mitte für `MONTH`, ohne dass sie aus der Leiste springt.
- Der aktive Bereich bekommt eine cyanblaue Lichtkante und eine kompakte Statusmarke; inaktive Bereiche bleiben ruhig und kontrastreich.
- Alle Tippflächen bleiben mindestens 44 px groß, Beschriftungen passen bei 393 px ohne Quetschen.

## 4. Mobile Karten und Hierarchie neu aufbauen
- Kontostand, Live-Positionen, Werteband, Markt und Mission werden als zusammengehörige blaue Command-Deck-Module gestaltet.
- Die Marktkarte wird zur Hauptbühne; Filter und Coin-Zeilen übernehmen Form, Tiefe und Kontrast der ausgewählten Vorschau.
- Der aktuell sichtbare rote Hinweis darf die Coin-Zeilen nicht dauerhaft überdecken; temporäre Meldungen sitzen oberhalb der Befehlsleiste und verschwinden kontrolliert.
- Weniger Rahmen gleichzeitig: Hauptkarte stark, Nebeninformationen ruhiger, damit der Unterschied nicht wieder nur minimal wirkt.

## 5. Umsetzung ohne weitere Style-Schichten
- Die bestehenden mobilen V17/V30/V39-Regeln für Dock, Karten und Farben werden konsolidiert und ersetzt, statt einen V40-Override anzuhängen.
- Spielmechanik, Preise, Trades, Perps, Positionen, Monatswechsel und Desktop-Funktionen bleiben unverändert.

## Abnahme
- Sichtvergleich mit der ausgewählten blauen Tactical-Command-Deck-Vorschau: Farben, Kartenwirkung, Navigation und Hierarchie müssen erkennbar übereinstimmen.
- Tests bei 375×677, 393×702, 390×844 und 430×932.
- Mehrfaches Scrollen und schnelles Wechseln zwischen allen fünf Bereichen: kein Flackern, kein Springen, kein Nachziehen der Leiste.
- Coin-Trade, acht Perp-Märkte, Positionen, Chart, MORE und Monatswechsel bleiben erreichbar.
- Kein verdeckter Marktinhalt, kein horizontales Scrollen und keine Konsolenfehler.
