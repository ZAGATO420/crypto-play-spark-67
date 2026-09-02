# Mobile First: das Game für Handy-Traffic aus X umbauen

Die Zahlen von heute: 58 von 65 Besuchen kommen vom Handy, Bounce 81 %, mittlere Sitzung ~19 Sekunden. Das heißt: die meisten Leute sehen den Thronsaal, tippen nicht, und sind weg. Der Hebel liegt nicht in mehr Features, sondern in den ersten 10 Sekunden am Handy und in der Bedienbarkeit mit einem Daumen.

## 1. Sofort spielen statt erst Formular

Heute steht zwischen "START SURVIVAL" und dem ersten Trade eine Karte mit Namen, Avatar-Auswahl, Modus und Schwierigkeit. Am Handy ist das eine Wand.

- Der CTA im Thronsaal startet **direkt einen Run**: Standardname ("ANON"), Standardmodus, zufälliger Avatar. Kein Formular, keine Auswahl.
- Name, Avatar und Modus werden erst gefragt, **wenn es zählt**: beim Eintrag ins Leaderboard am Ende, oder freiwillig über ein kleines "Profil"-Chip im Header.
- Wer bewusst konfigurieren will, bekommt unter dem CTA einen ruhigen Zweit-Link "Run einstellen".
- Der erste Monat läuft mit **drei Coach-Bubbles im Spiel** (Cash → Kaufen → Nächster Monat), nicht mit einem Tutorial-Overlay davor. Überspringbar, einmalig.

Ziel: vom Antippen bis zum ersten Kauf unter 8 Sekunden, ohne Lesearbeit.

## 2. Ein Daumen, eine Ansicht

Die Handy-Ansicht wird auf einen klaren Aufbau normiert:

```text
KOPF     Net Worth · Monat + Tagesbalken (kompakt, sticky)
BÜHNE    genau eine Zone: MARKT | CHART | POSITIONEN
DOCK     MARKT · CHART · POSITIONEN · OPS · NEXT MONTH
```

- Das Dock bekommt einen eigenen Reiter **POSITIONEN** (offene Trades und Perps mit PnL) — heute muss man dafür Fenster suchen.
- **OPS** bündelt Launchpad, Degen, Business, Shop, Trophies, Ledger als Kachelraster in einem Sheet mit Badge-Zähler.
- Alle Fenster sind **Bottom Sheets**: von unten, Wischen zum Schließen, sticky Fußzeile mit dem Bestätigungsbutton, innen scrollend, nie abgeschnitten.
- Alle Tap-Flächen mindestens 44 px, Regler 44 px hoch mit `touch-action:none`, Zahlen-Chips (25/50/MAX) statt feinem Ziehen als Hauptweg.
- Kein horizontales Scrollen irgendwo; Reiterleisten scrollen mit Snap statt Buttons abzuschneiden.
- Ein einziger Layout-Layer für Handy statt der heutigen Stapel aus `!important`-Regeln — das ist die Ursache dafür, dass an einer Breite immer etwas kaputtgeht.

## 3. Erste Sekunde: Ladezeit

`public/game.html` ist eine Datei mit 643 KB. Am Mobilfunknetz ist das der Grund, warum der Start "manchmal hängt".

- Startbildschirm zuerst: Chart-Bibliothek, Coin-Logos, Audio-Engine und Spiel-Daten werden **erst nach dem Tippen** geladen.
- Boss-Bild im Thronsaal vorgeladen und in Handy-Größe ausgeliefert, damit sofort ein Bild steht statt einer schwarzen Fläche.
- Bei "Bewegung reduzieren" und auf schwachen Geräten: Deko-Animationen aus, Chart-Updates gebündelt pro Frame.

## 4. Gemacht für den X-Feed

- **Kein Ton-Autostart**, aber ein sichtbarer Ton-Schalter im Kopf — im Feed kommt jeder stumm.
- Querformat abgefangen: Hinweis "dreh dein Handy zurück" statt zerlaufendes Layout.
- Endcard als **hochformatiges Share-Bild** (9:16) mit "SAVE IMAGE" plus fertigem Text — der Weg zurück nach X.
- Fortschritt wird lokal gesichert: wer wegwischt, kommt zurück auf "Weiter spielen, Monat 12" statt bei null.
- Nach dem 2. Monat einmalig "Zum Startbildschirm hinzufügen"-Hinweis (PWA-Manifest + Icon).

## 5. Einfacher verständlich

- Jargon bekommt eine Zeile Klartext direkt darunter ("Liquidation = deine Position wird zwangsverkauft").
- Der Startmonat zeigt genau **eine** Aufgabe, nicht Airdrops, Launchpad, Perps und Business gleichzeitig; riskante Systeme öffnen sich erst später.
- Verluste und Gewinne werden am Handy groß und farbig quittiert, statt nur in einer Tabelle.

## Abnahme

Playwright bei 390×844, 414×896, 360×740 und 430×932, jeweils mit gedrosseltem Netz:
Zeit bis Startbild sichtbar, Zeit bis erster Kauf möglich, kein Element abgeschnitten, jeder Button vollständig tippbar, NEXT MONTH immer erreichbar, keine Konsolenfehler, plus Screenshot-Vergleich pro Ansicht.

## Technische Notizen

Alles in `public/game.html`:
- Gate-CTA ruft `startGame()` mit Defaults; Formularfelder wandern in ein optionales Profil-Sheet und in den Leaderboard-Eintrag.
- Neuer `<style id="mob-layout">` als einzige Handy-Layout-Quelle; die Handy-Teile aus `v17`/`v22`-Layern werden entfernt statt überschrieben (`body.v17-mob`-Regeln ab ~8425 konsolidiert).
- Dock (`#v17-dock`, ~8711) auf 5 Einträge inkl. `positions`; `setView` steuert genau eine Bühne, Chart-Resize nach Wechsel bleibt.
- Sheets: gemeinsamer Rahmen Kopf/Body/sticky Fuß, `max-height:92vh`, Swipe-to-close per Pointer-Events.
- Lazy-Load: Chart.js, `coin-icons.js` und Audio-Init erst im Start-Handler; `<link rel=preload>` nur für das Boss-Bild.
- `localStorage`-Snapshot des Runs pro Monatswechsel; `manifest.webmanifest` + Icons neu.
- Nicht angetastet: historische Preise 2020–2026, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Story-Kapitel.
