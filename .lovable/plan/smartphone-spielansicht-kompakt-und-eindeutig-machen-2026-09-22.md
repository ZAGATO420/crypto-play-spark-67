# Smartphone-Spielansicht kompakt und eindeutig machen

## Ziel
Auf dem Smartphone sollen Aufgabe, Spielstand, Chart, Hauptaktion und die wichtigen Bereiche ohne langes Suchen erreichbar sein. `PORTFOLIO`, `SURVIVE`, `STORAGE`, `HISTORY` und `END QUARTER` werden groß und dauerhaft sichtbar; keine Spielfunktion oder Berechnung ändert sich.

## Umbau

1. **Feste große Bedienleiste**
   - Die kleinen Knöpfe am Kartenende werden auf Mobil durch eine feste Leiste am unteren Bildschirmrand ersetzt.
   - Vier gleich große Bereiche: `PORTFOLIO`, `SURVIVE`, `MORE` und ein deutlich hervorgehobenes `END QUARTER`.
   - `MORE` öffnet die vorhandenen Funktionen `STORAGE`, `HISTORY` und `END RUN`; nichts fällt weg.
   - Jeder Bereich erhält Symbol, gut lesbare Beschriftung und mindestens 48 px Tippfläche.

2. **Weniger Höhe vor der Hauptaktion**
   - Monatsleiste, Stand gegen den Boss und Net Worth/Cash/Stress/Hunger werden zu einem kompakten Statuskopf zusammengezogen.
   - Wiederholte Erklärtexte werden auf Mobil verkürzt; die vollständige Erklärung bleibt über `HOW TO PLAY` erreichbar.
   - Offene Positionen bleiben sichtbar, werden aber zu einer horizontalen, kompakten Positionsleiste.

3. **Chart und Aktion in einem Bildschirmbereich**
   - Chart-Höhe, Abstände und Nebenanzeigen werden auf kleinen Smartphones reduziert, ohne Kursdaten oder Animation zu verändern.
   - Der gelbe Hauptknopf sitzt direkt unter dem Chart; Vorschau und letzte Aktion werden kompakter dargestellt.
   - Skill-Test und Presale/ICO bleiben vorhanden, erscheinen aber als klare nächste Spielstufe statt als zusätzlicher langer Block.

4. **Sicheres Scrollen**
   - Die feste Leiste reserviert unten Platz, sodass kein Inhalt verdeckt wird.
   - Dialoge und Endscreen bleiben unabhängig scrollbar.
   - Desktop bleibt unverändert.

## Prüfung
- Sichttest bei 375×677, 393×852 und 430×932.
- Aufgabe, Status, Chart und Hauptaktion sind ohne langes Scrollen erfassbar.
- Alle Bereiche der unteren Leiste sind mindestens 48 px hoch und funktionieren.
- Positionen, Überleben, Verwahrung, Verlauf, Run beenden und Quartal beenden bleiben erreichbar.
- Kein horizontaler Überlauf, keine verdeckten Inhalte und keine Konsolenfehler.

## Unverändert
Historische Preise, Handelslogik, P&L, Survival-Kosten, Steuern, Boss-Score, Turnierbedingungen, Gewinnerermittlung und Leaderboard-Daten bleiben unverändert.
