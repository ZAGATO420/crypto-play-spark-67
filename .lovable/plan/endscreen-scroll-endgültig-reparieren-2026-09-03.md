# Endscreen-Scroll endgültig reparieren

## Bestätigtes Problem

Der aktuelle Fix setzt `html` und `body` nach Game Over auf `overflow:auto`. Das reicht hier nicht zuverlässig, weil das eigentliche Spiel in einem feststehenden Vollbild-Frame läuft. Im Chrome-Test kann der innere Dokument-Scroll zwar künstlich bewegt werden, aber der Endscreen besitzt keinen eigenen Scrollbereich und bleibt dadurch abhängig davon, ob Chrome das Scroll-/Touch-Ereignis korrekt an das Frame-Dokument weitergibt.

Zusätzlich wird der Avatar-Picker vor das Namensfeld eingefügt. Dadurch liegt das Namensfeld bei der im Screenshot gezeigten Fensterhöhe wieder unterhalb des sichtbaren Bereichs, obwohl der Submit-Bereich bereits direkt unter die Ergebnis-Karte verschoben wurde.

## Umsetzung

### 1. Endscreen als eigener Scroll-Container
- `#end-screen` bekommt im Game-Over-Zustand `position:fixed`, `inset:0`, eine feste Viewport-Höhe und `overflow-y:auto`.
- Touch-Scrolling wird mit `touch-action:pan-y` und `-webkit-overflow-scrolling:touch` explizit erlaubt.
- Der Endscreen scrollt damit unabhängig von `html`, `body`, dem Vollbild-Frame und älteren Game-Layout-Sperren.
- Beim Öffnen wird direkt `#end-screen.scrollTop = 0` gesetzt; Scroll-Fokus und Tastaturbedienung bleiben innerhalb des Endscreens.

### 2. Namensfeld sofort erreichbar machen
- Reihenfolge im Submit-Bereich: Score-Zeile → Namensfeld → SUBMIT SCORE → Avatar-Auswahl.
- Damit sind Name und Submit-Button direkt unter der Ergebnis-Karte sichtbar; die Avatar-Auswahl darf darunter weiterlaufen.
- Der feste „SUBMIT YOUR SCORE“-Sprung bleibt als zusätzliche Hilfe auf kleinen Viewports bestehen und scrollt künftig den Endscreen-Container statt die Seite.

### 3. Alte Locks vollständig neutralisieren
- Beim Game Over werden verbleibende Inline-Styles und Klassen für `html`, `body`, Coach, Rotate-Hinweis, Sheets, Modals und Docks entfernt bzw. deaktiviert.
- Endscreen-Erkennung wird unmittelbar an den echten `endGame()`-Ablauf gebunden statt erst auf das 400-ms-Intervall zu warten.
- Der bisherige `:has(...)`-Ansatz wird nicht mehr als Voraussetzung für das Scrollen verwendet.

### 4. Prüfung am echten Einstieg
- Chrome-Test über die öffentliche Hauptseite mit eingebettetem Spiel, nicht nur direkt über `/game.html`.
- Desktop in der Screenshot-Größe sowie Mobile Portrait und Landscape.
- Echte Mausrolle, Touch-Wischgeste, Tastatur/PageDown und der Sprungbutton werden geprüft.
- Sichtbar verifizieren: Namensfeld erreichbar, Avatar wählbar, Submit anklickbar, POST erfolgreich und keine überlagernden Elemente.

## Technische Grenze

Keine Änderung an Gameplay, Score, XP, Preisen oder Leaderboard-Ranking. Nur Endscreen-Layout, Scroll-Ziel und Bedienbarkeit werden korrigiert.
