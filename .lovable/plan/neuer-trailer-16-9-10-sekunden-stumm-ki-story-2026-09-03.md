# Neuer Trailer — 16:9, 10 Sekunden, stumm, KI-Story

Kurzer Kino-Teaser im Breitformat (1920x1080, 30fps, 10s), komplett ohne Ton. 70% cineastische KI-Story-Clips, 30% echtes Gameplay. Story: "84 Monate Chaos" — Zeitreise 2020 → 2026 mit dem Gorilla-Boss als Erzähler.

## Schnitt (10s)

```text
0.0-2.0  BOSS      KI-Clip: Gorilla-König auf dem Thron, Kamera-Push   "2020. YOU HAD $10K."
2.0-4.0  CHAOS     KI-Clip: brennende Charts, Panik, Luna/FTX-Kollaps  "84 MONTHS OF CARNAGE."
4.0-6.0  GAMEPLAY  echtes Terminal + 50x Perp + Liquidation            "REAL PRICES. ONE LIFE."
6.0-8.0  REKT      KI-Clip: Boss lacht, Krone im Licht                 "97% GET REKT."
8.0-10.0 CTA       Logo + Boss                                         "PLAY FREE — thecryptofinalboss.app"
```

## Look

- Schwarz, Acid-Grün, Gold (Game-Palette). Kein Fade-to-Black, keine Neon-Lila-Klischees.
- Ein Motion-System: langsamer Push-In pro Shot, harte Cuts, Filmkorn, Vignette, Halation.
- Grosse Display-Typo, 3-5 Wörter pro Karte, garantiert innerhalb der Safe Area — keine abgeschnittenen Texte.

## Material

- 3 neue KI-Story-Clips (Thron, Chaos/Crash, lachender Boss mit Krone) — generierte Videoclips, keine Standbilder.
- Gameplay: vorhandene 16:9-Clips aus dem Repo; falls die Bildlage nicht passt, wird ein frischer Mitschnitt im 1920x1080-Viewport aufgenommen und beschnitten.

## Technisch

- Neue Remotion-Komposition `teaser16` unter `remotion/src/teaser/`, registriert in `remotion/src/Root.tsx`, 1920x1080 @ 30fps, 300 Frames. Bestehende Kompositionen bleiben unangetastet.
- Render stumm (`muted: true`), kein Audio-Track in der Datei.
- Ausgabe: `/mnt/documents/x-assets/tcfb-teaser-16x9.mp4`.

## Prüfung

Frame-Spotchecks an jedem Cut (kein Clipping, keine überlaufenden Zeilen), Dauer/Auflösung per ffprobe, Bestätigung dass keine Tonspur enthalten ist.

Hinweis: Bei nur noch 10 Credits halte ich mich strikt an 3 KI-Clips und einen einzigen Render-Durchgang.
