# Startscreen: vom Menü zur Arena

Heute stehen PLAY NOW, CUSTOMIZE RUN und darunter LEADERBOARD/HOW/SOUND/SETTINGS als fünf gleichwertige Kästen unter dem Boss. Das liest sich wie eine Website-Navigation, nicht wie ein Spiel. Der Boss verliert dadurch die Bühne.

## 1. Ein einziger Einstieg

- **Genau ein großer CTA**: `ENTER THE ARENA` — schwerer Acid-Button mit langsamem Puls, leichtem Glow, Klick-Feedback (kurzes Einsinken + Sound).
- **CUSTOMIZE RUN verschwindet als Button** und wird zum Profil-Chip direkt darüber: Avatar + `ANON · DEGEN · NORMAL` + kleines Zahnrad. Wer will, tippt drauf und bekommt das Setup-Sheet — der Rest spielt einfach.
- Die vier Fußzeilen-Pillen werden **eine feine Textzeile** (`BOARD · HOW · SOUND · SETTINGS`), klein, gedeckt, unter dem CTA. Kein Kasten-Raster mehr.

Ergebnis: Boss, Wortmarke, ein Knopf. Alles andere ist Nebenweg.

## 2. Der Thronsaal lebt

Der Screen soll sich anfühlen wie eine Spielszene, nicht wie ein Bild:

- **Lichtkegel** wandert langsam über den Thron, **Vignette** schließt den Rand, feiner **Filmkorn-Layer** darüber.
- **Parallax**: Boss reagiert minimal auf Mausbewegung (Desktop) bzw. Gerätelage/Scroll (Mobile) — 6–10 px, kaum bewusst wahrnehmbar, macht die Szene aber räumlich.
- **Krone pulsiert** im Takt der Musik-Beat-Grid (bestehende Audio-Engine, kein neuer Sound).
- **Cold Open**: beim ersten Laden 1,2 s Schwarz mit Kurs-Ticker, dann fährt der Boss aus dem Dunkel hoch und der CTA erscheint. Nur einmal pro Sitzung, überspringbar durch Antippen.
- Bei „Bewegung reduzieren" und schwachen Geräten: alles statisch, nur der CTA pulst.

## 3. Der Boss spricht dich an

- Über dem CTA eine **Boss-Taunt-Zeile**, die pro Aufruf wechselt: „nobody has beaten me yet.", „$5,000. 84 months. good luck.", „last one lasted 19 months."
- Wer schon gespielt hat, wird persönlich adressiert: „back for more, {NAME}?" plus zweiter Weg `CONTINUE — MONTH 12` (nutzt den bestehenden Snapshot).
- Nach dem Antippen kommentiert der Boss den Start mit einem Satz, bevor Monat 1 erscheint — der Übergang ist eine Szene, kein Bildwechsel.

## 4. Lebendige Zahlen statt Werbetext

Die Zeile `FREE · NO WALLET · 2 MIN TO START` klingt nach Landingpage. Stattdessen eine schmale **Arena-Leiste** direkt unter dem CTA:

```text
412 RUNS TODAY   ·   TOP $1.2M by DEGENKING   ·   0 SURVIVORS
```

Zahlen kommen aus dem bestehenden Leaderboard-Endpoint, laufen kurz hoch (Count-Up) und aktualisieren sich still.

## 5. Mobile

Gleiche Struktur, gestapelt: Boss oben halbformatig im Anschnitt, Wortmarke, Taunt, ein CTA über der Falz, Profil-Chip darüber, Textzeile darunter. Nichts anderes above the fold, kein Scrollzwang für den Start.

## Abnahme

Screenshots bei 390×844, 430×932, 768×1024, 1280×800, 1440×900: Boss ungestört, genau ein CTA über der Falz, keine abgeschnittenen Elemente, keine Konsolenfehler, Start-Flow und CONTINUE funktionieren.

## Technische Notizen

Alles in `public/game.html`:
- Neuer Layer `v27-gate` als einzige Quelle für den Startscreen; die Button-Regeln aus `v23`/`v24` (PLAY NOW-Clone Zeile ~10121, `v23-cust` ~10131, Gate-Zeile ~10548) werden dort ersetzt statt überschrieben.
- Fußzeilen-Pillen (`data-v21l`) behalten ihre Handler, bekommen nur Text-Link-Styling.
- Szene: `#start-screen` erhält Lichtkegel/Grain/Vignette als Pseudo-Elemente, Parallax über einen gedrosselten `pointermove`/`deviceorientation`-Listener, alles hinter `prefers-reduced-motion`.
- Cold Open als einmaliger Overlay-Zustand mit `sessionStorage`-Flag.
- Arena-Leiste nutzt den vorhandenen Leaderboard-Fetch; kein neuer Endpoint.
- Unberührt: Spiellogik, historische Preise, XP, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Endscreen (V26).
