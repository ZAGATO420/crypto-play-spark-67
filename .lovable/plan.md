# V39 — Tactical Command Deck: das Terminal wird zur Spielarena

## Zielbild

Das Terminal wird kein weiterer dunkler Skin, sondern eine neu geordnete Spielbühne im ausgewählten **Tactical Command Deck**-Aufbau. Die bereits gewählte Farbwelt bleibt verbindlich: tiefes Petrol, beleuchtetes Gold, Acid-Grün für Aktionen, Rot/Grün nur für Verlust/Gewinn. Überschriften nutzen **Archivo Black**, Bedienoberfläche **Hind**, Kurse und Kontowerte bleiben monospaced.

Historische Kurse 2020–2026, Trading, Perps, Positionen, Survival, Story, XP, Kosten, Leaderboard und sämtliche Berechnungen bleiben erhalten.

## 1. Eine dominante Markt-Bühne statt vieler gleichwertiger Kästen

- Der sichtbare Hauptbereich wird in drei klare Zonen neu aufgebaut:

```text
DESKTOP
┌ Konto, Monat, XP, Survival und Systemtasten ┐
├ Markt-/Chart-Bühne ─────────┬ Positionen ───┤
│ aktive Coin-Liste + Chart   │ Mission/Ops   │
├ Ergebnis des letzten Monats ┴───────────────┤
└ Zeitsteuerung ─────────────── NEXT MONTH ───┘

PHONE
┌ Konto · Monat · System ┐
├ kompakte Werte/Survival┤
├ aktive Vollbild-Bühne  ┤
│ Market/Chart/Positions │
├ Monatsergebnis         ┤
└ Dock mit NEXT MONTH ───┘
```

- Markt und Chart bekommen sichtbar mehr Raum; Sekundärbereiche öffnen weiterhin in den bestehenden Fenstern, wirken aber wie ein zusammengehöriges Command Deck.
- Die Desktop-Seitenkästen „Season Status“, „Player“ und „Sections“ werden zu schmalen, klar priorisierten Rails statt konkurrierender Hauptkarten.
- Die aktuelle Einführungsbox liegt nicht mehr über Coin-Liste und Chart. Hinweise werden als kurze, nicht blockierende Missionszeile eingebaut.

## 2. Neue Kopfzeile als Score Ribbon

- Net Worth, P&L, Cash, Coin-Wert, Perp-P&L, Risiko, Hunger und Stress bilden ein durchgängiges, präzises Werteband statt vieler einzelner Mini-Karten.
- Ton, Einstellungen und Beenden erhalten einen festen eigenen Platz rechts oben und überdecken keine Zahlen.
- Monat, Kapitel, XP und Fortschritt werden zu einer einzigen lesbaren Statuslinie verdichtet.
- Der Gorilla bleibt als kleiner reaktiver Boss-Kommunikator sichtbar, ohne Markt oder Chart zu verdecken.

## 3. Markt wie eine echte Börse, aber als Spiel

- Jede Coin-Zeile zeigt Logo, Symbol, Preis, Monatsbewegung und Bestand in einer klaren Tabellenhierarchie.
- Die aktive Coin-Zeile wird zur fokussierten Combat-Zeile; Kaufen, Verkaufen und Perp öffnen direkt das vorhandene Handelsfenster.
- Kurssprünge reagieren kurz und kontrolliert, ohne Dauerflackern.
- Der Chart erhält eine kräftigere Bühne mit gut lesbaren Achsen, Hoch/Tief/Änderung sowie Entry- und Liquidationslinien, sobald sie relevant sind.
- Offene Spot- und Perp-Positionen erscheinen als echte Positions-Rail mit P&L und Liquidationsdistanz, nicht als versteckte Zusatzansicht.

## 4. Mobile Command Rail komplett neu

- Die langweilige untere Leiste wird durch eine kompakte, taktile Command Rail ersetzt: **MARKET · CHART · MONTH · POSITIONS · MORE**.
- `MONTH` wird die visuell stärkste mittlere Aktion in Acid-Grün; die vier Ziele daneben bleiben ruhig, eindeutig und mindestens 44 px groß.
- Pro Ansicht ist genau eine Bühne sichtbar. Kein doppeltes Menü, kein verdeckter Inhalt und kein horizontales Scrollen.
- Coin-Liste, Chart und Perp-Auswahl nutzen die volle Breite; der sichtbare Inhalt reicht bis unmittelbar über die Command Rail.
- Hunger und Stress bleiben permanent sichtbar und direkt bedienbar.

## 5. Ein zusammenhängendes Premium-System

- Ein einziger finaler Terminal-Designblock definiert Farben, Typografie, Flächen, Linien, Abstände, Zustände und Animationen.
- Veraltete Präsentationsregeln der aktiven alten Terminal-Schichten werden gezielt neutralisiert oder entfernt, statt V39 nur darüberzustapeln.
- Bestehende IDs, Klickfunktionen und Berechnungen bleiben unverändert verdrahtet.
- Fenster für Trading, Perps, Portfolio, Launchpad, Ops, Shop und Trophäen erhalten dieselbe kantige Command-Deck-Sprache.
- Keine blauen oder violetten Cyberpunk-Farben aus dem Prototyp; übernommen werden dessen Hierarchie, Präzision und taktische Bedienlogik.

## Abnahme

- Visuelle Prüfung bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Aufnahmen jeweils ohne blockierende Einführung sowie mit offener Position und geöffnetem Perp-Desk.
- Markt, Chart, Positionen, Survival und NEXT MONTH sind ohne Suche erreichbar.
- Kein Element überdeckt Werte, Kurse oder Aktionen; kein horizontaler Überlauf.
- Jede Handy-Tippfläche mindestens 44 px.
- Kaufen/Verkaufen, Long/Short, Position schließen, EAT/CALM, Monatswechsel und alle fünf Dock-Ziele funktionieren.
- Zwölf schnelle Monate laufen mit korrekten Summen, höchstens einer Ereigniskarte pro Monat und ohne Konsolenfehler.

## Technische Umsetzung

- Ziel bleibt `public/game.html`; vorhandene Spiellogik wird nicht ausgelagert oder neu geschrieben.
- Für die Hauptbühne werden stabile semantische V39-Container um die bestehenden Terminal-, Chart-, Positions- und Rail-Elemente erzeugt; vorhandene Elemente werden versetzt, nicht dupliziert.
- Die endgültigen V39-Tokens und Layoutregeln werden zentral definiert. Widersprechende Layoutteile aus V17/V23/V29/V30/V31 werden für den laufenden Spielzustand außer Kraft gesetzt bzw. entfernt.
- Das bestehende View-/Sheet-System bleibt als Funktionsbasis erhalten, bekommt jedoch die neue sichtbare Hierarchie und Optik.
- `prefers-reduced-motion`, Safe Areas und die bestehende Render-Bündelung bleiben erhalten.
