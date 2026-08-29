# V17 — Der optische Neubau: Terminal wie ein AAA-Spiel

Ausgangslage, geprüft in `public/game.html` (8.000 Zeilen): über der Basis liegen **13 Style-Schichten** (`v4-skin` … `v16-fix`), **257 `!important`-Regeln** und **38 Media-Queries**. Diese Schichten überschreiben sich gegenseitig — das ist der Grund, warum das Terminal unruhig wirkt, Panels unterschiedlich aussehen und jede Korrektur an einer anderen Breite etwas kaputt macht. Ein weiterer Politur-Layer würde es schlimmer machen. Deshalb: **ein Design-System, ein Layout-System, ein Panel-Konzept.**

## 1. Ein Design-System statt 13 Schichten

- Neuer Block `<style id="v17-core">` als **einzige Quelle** für Farbe, Typografie, Abstand, Radius, Schatten, Panel- und Button-Optik. Alle alten Skins werden auf ihre reinen Funktionsreste reduziert bzw. gelöscht — nicht überschrieben.
- Feste Token-Skala: Flächen (4 Ebenen von Hintergrund bis Modal), Text (3 Stufen), Linien (2 Stärken), Abstände 4/8/12/16/24/32, Radien 8/12/16, drei Schattenstufen. Kein `!important` mehr im Layout.
- Farblogik streng: Gold = Besitz/Status/Bestätigen. Violett = Hauptaktion. Grün/Rot **ausschließlich** Gewinn/Verlust und Long/Short. Alles andere neutral. Der Hintergrund wird ein tiefes, warmes Nachtblau-Schwarz mit sehr feinem Grid und leichtem Vignette-Verlauf statt flachem Schwarz — Karten lösen sich dadurch sichtbar ab.
- Typografie-Hierarchie: eine Display-Schrift für Titel und große Zahlen, Mono ausschließlich für Preise/Zahlen (tabellarische Ziffern, damit nichts flackert), eine Sans für Text. Sechs definierte Größen, `clamp()`-gesteuert.
- HQ-Optik: alle Icons/Sticker auf eine Größenlogik und gleiche optische Gewichtung gebracht, 2× Rendering für scharfe Darstellung auf Retina/4K, Chart-Linien und Hairlines pixelgenau statt verwaschen.

## 2. Trading-Bereich: alles im Popup, Terminal wird ruhig

Das Trade-Popup funktioniert — dieses Muster wird zum Standard für den ganzen Desk.

Das Terminal zeigt künftig nur noch **vier ruhige Zonen**:

```text
KOPF     Net Worth, Monat, Vitals, Zeitsteuerung   (fix)
LINKS    Chart + PnL-Kennzahlen                    (eine Karte)
MITTE    Markt-Kacheln (Coins + Perps)             (Grid, klickbar)
RECHTS   Positionen + Ops-Zugänge als Kacheln      (kompakt)
FUSS     Monatsaktion / NEXT MONTH                 (fix)
```

Alles Tiefergehende öffnet als Popup im **identischen Fenster-Design** (gleiche Kopfzeile, gleicher Rahmen, gleiche Fußleiste): Coin-Trade, Perp-Desk, Position schließen, PnL-Details, Cashflow, Ledger, Airdrops, Launchpad, Business, Shop, Trophies. Dadurch verschwinden die heutigen gequetschten Panels — jedes Thema bekommt Platz statt eines abgeschnittenen Kastens.

- Die Ops-Reiter (Launchpad, Degen Ops, Business, Shop, Trophies, Ledger) werden **sechs gleich große Kacheln** mit Icon, Titel und Live-Zähler statt einer überlaufenden Reiter-Leiste. Ein Klick = ein Popup.
- Popups: max. 90 vh, eigener Scrollbereich **nur innen**, sticky Fußzeile mit der Hauptaktion, weiche Abblende unten, ESC/Backdrop schließt.
- Kein abgeschnittenes Element mehr — auch die letzte Zeile jeder Liste ist immer erreichbar.

## 3. Desktop: alles in einem Fenster

- Vier definierte Stufen, keine Zwischenzonen: `< 720` Handy, `720–1099` Tablet, `1100–1599` Laptop, `≥ 1600` Groß.
- Ab 1100 px: das Spiel passt ohne Seiten-Scroll in ein Fenster. Erreicht wird das über gemessene Restflächen und innere Scrollzonen pro Karte, **nicht** über feste Höhen, die Inhalte kappen.
- Ab 1600 px: mehr Luft, größere Zahlen, breiterer Chart — der Screen wirkt nicht leer, sondern wie ein echter Trading-Arbeitsplatz.

## 4. Smartphone: kein Scroll-Chaos mehr

Handy wird als **eigenes Layout** gebaut, nicht als geschrumpfter Desktop:

- Fixer Kopf (Net Worth, Monat, Vitals als schmale Balken), fixe Fußleiste mit fünf Zielen: **Markt · Chart · Positionen · Ops · Monat**.
- Jeweils **eine** Ansicht füllt den Bildschirm, kein Seiten-Scroll — gescrollt wird nur innerhalb einer Liste, und dort mit klarer Abblende, damit man sieht, dass es weitergeht.
- Popups kommen als Sheet von unten, groß, mit 44-px-Trefferflächen, hohen Reglern und `touch-action`-Schutz, damit Drags nicht vom Scrollen geklaut werden.
- Kein Sprung nach oben beim Umschalten, Scroll-Position pro Ansicht gemerkt.
- Ein Tap = eine Aktion (keine doppelten Taps mehr nötig), sofortiges optisches Feedback beim Drücken.

## 5. Feinschliff, der professionell wirken lässt

- Zahlen animieren sanft beim Wechsel statt zu springen; Gewinn/Verlust kurz farbig pulsierend.
- Leere Zustände bekommen einen Satz und ein Icon statt einer leeren Fläche.
- Hover/Aktiv ohne Layoutsprung, ruhige Übergänge (150–200 ms), keine Dauer-Animationen im Sichtfeld.
- Chart im Börsen-Look: klare Achsen, dezentes Raster, Referenzlinie beim Einstieg, weicher Verlauf unter der Kurve.
- Start-, How-to-, Decision- und End-Screen werden auf das gleiche Design-System gezogen, damit alles wie ein Produkt wirkt.

## 6. Abnahme

Playwright-Durchlauf bei 390×844, 414×896, 768×1024, 1060×682, 1280×720, 1440×900, 1728×1117, 2560×1440. Pro Breite geprüft: nichts abgeschnitten, jeder Button vollständig klickbar, NEXT MONTH erreichbar, alle Popups öffnen und schließen, keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`:
- Neuer `<style id="v17-core">` ganz am Ende als einzige Layout-/Design-Quelle; `v11`-Reste, `terminal-layout`, `v13-skin`, `v14-modern`, `v15-skin`, `v16-fix` werden zusammengeführt und die alten Blöcke entschlackt (Ziel: `!important` von 257 auf < 20).
- Generisches Fenster-System `modal(kind, payload)` mit einheitlichem Kopf/Body/Fuß; `dxOpen`, `ppOpen`, `panelModal` werden darauf umgestellt und behalten ihre Signaturen.
- `renderMarket` / `renderPerpDesk` / `renderDegenOps` liefern nur noch Kacheln; die Detailinhalte ziehen in Popup-Renderer.
- Mobile: eigener Layout-Zweig mit `data-view`-Umschaltung statt Media-Query-Flickwerk; `fold()` arbeitet weiter gegen gemessene Restflächen.
- Nicht angetastet: Preise, historische Kurven, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard, Story/Pacing.
