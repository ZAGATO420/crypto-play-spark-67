# Technische Optimierung: Ladezeit & Handy-Ruckler

## Was gemessen wurde
`public/game.html` ist aktuell **1,81 MB** — und davon ist fast nichts Spiellogik:

| Block | Größe | Was es ist |
|---|---|---|
| Bild-Daten direkt im Code | ~800 KB | Affe (504 KB) + 5x Popup-Logo (je 43 KB) + Header-Logo |
| Schriften direkt im Code | ~400 KB | 8 eingebettete Font-Schnitte (Inter + JetBrains) |
| Chart-Bibliothek | ~197 KB | Chart.js komplett hineinkopiert |
| **Eigentliches Spiel** | **~250 KB** | HTML, CSS, Spiellogik, Preisdaten |

Das Handy muss also beim ersten Aufruf 1,8 MB in **einem einzigen Stück** laden und den Text komplett durchparsen, bevor überhaupt etwas erscheint — Bilder als Text (Base64) sind dabei ~33 % größer als die Originaldatei und lassen sich nicht separat zwischenspeichern. Genau das ist der Hänger am Anfang, und er tritt nur "manchmal" auf, weil er von der Mobilfunkverbindung abhängt.

## Der Umbau

### 1. Bilder raus aus der Datei
Affe, Header-Logo und Popup-Logos werden echte Bilddateien auf dem CDN (weltweit verteilt, dauerhaft im Browser-Cache). Zusätzlich in modernem Format (WebP) und in passender Größe statt in Originalauflösung — der Affe wird als Bild allein von ~1 MB auf unter 150 KB kommen. Das Bild wird zudem erst geladen, wenn es gebraucht wird; die Popup-Logos blockieren den Start nicht mehr.

### 2. Schriften raus aus der Datei
Die Fonts kommen als eigene CDN-Dateien mit `font-display:swap`: Text ist sofort lesbar, die Schrift tauscht nach. Ungenutzte Schnitte fliegen raus, die verbleibenden werden auf die tatsächlich benutzten Zeichen reduziert.

### 3. Chart-Bibliothek nachladen
Chart.js wird erst geladen, wenn das Spiel wirklich startet — nicht schon auf dem Startscreen. Der erste Bildschirm braucht sie nicht.

### 4. Auslieferung schärfen
Kompression und Cache-Regeln prüfen, damit die verbleibende Spieldatei komprimiert ausgeliefert und beim zweiten Besuch sofort da ist. Der Startscreen-Affe wird vorgeladen (`preload`), damit er trotz CDN sofort steht.

### 5. Laufzeit-Ruckler auf dem Handy
Zusätzlich zum Laden werden die typischen Stotterstellen entschärft:
- Dauerlaufende Glow-/Float-Animationen auf günstige Eigenschaften umstellen, damit sie auf der GPU laufen
- Chart-Updates entkoppeln, damit sie das Antippen von Buttons nicht blockieren
- Auf Geräten mit "Bewegung reduzieren" laufen Deko-Animationen aus

### Was sich **nicht** ändert
Keine neue Sprache, keine Umstellung auf React, keine Änderung an Spiellogik, Preisen, Schwierigkeit, XP oder Leaderboard. Das Spiel bleibt eine HTML-Datei mit demselben Code — nur ohne die Ballast-Anhänge.

## Ergebnis
Spieldatei von 1,81 MB auf **ca. 250 KB** (komprimiert deutlich weniger). Erster sichtbarer Inhalt auf dem Handy in Bruchteilen der heutigen Zeit; zweiter Besuch nahezu sofort.

## Kontrolle
Vorher/Nachher gemessen: Übertragungsgröße pro Datei, Zeit bis der Startscreen steht, Zeit bis das Spiel bedienbar ist — im Handy- und Desktop-Format, plus Screenshot-Vergleich, dass optisch alles identisch aussieht (Affe, Schrift, Logos, Chart).

## Technische Notizen
- Bilder/Fonts über `lovable-assets` als `.asset.json`-Pointer, Base64-`data:`-URLs in `public/game.html` durch die CDN-URLs ersetzt; PNG→WebP mit `ffmpeg`, Affe auf max. 1147 px Höhe.
- `@font-face`-Blöcke (Zeilen 34–96) auf CDN-`url()` + `font-display:swap` umgestellt, ungenutzte Schnitte entfernt.
- Inline-Chart.js (Zeile ~29, 197 KB) entfällt; stattdessen `<script defer src="…chart.umd.js">` vom CDN-Asset, mit `await` auf `window.Chart` vor dem ersten `renderChart()`.
- `loading="lazy"` + `decoding="async"` für Popup-Logos, `<link rel="preload" as="image">` für den Startscreen-Affen im `<head>`.
- Animationen auf `transform`/`opacity` beschränken, `will-change` sparsam; `@media (prefers-reduced-motion)` ergänzen.
- Chart-Update über `requestAnimationFrame` statt synchron im Klick-Handler.
