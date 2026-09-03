# TCFB Product Trailer — 9:16 Cinema Ad (28s, mit Sound)

Ein vertikaler Kino-Trailer (1080x1920, 30fps, ca. 28 Sekunden) fürs X-Ad-Format: echtes, frisch aufgenommenes Gameplay kombiniert mit cinematischen Gorilla-Boss-Shots, grosse Trailer-Typo, Trailer-Musik plus Impact-Hits und Riser.

## Look & Motion

- Palette aus dem aktuellen Game: warmes Schwarz, Acid-Grün, Gold. Kein Fade-to-Black, keine Neon-Lila-Klischees.
- Ein Motion-System: Clip-Path-Reveal + langsamer Push-In auf jedem Shot, Springs nur für Hero-Momente. Kein Frame steht still.
- Typo: Display-Font gross und formatfüllend (2-4 Wörter pro Karte), Mono-Kicker mit weitem Tracking, Zahlen als Glass-Chips.
- Letterbox-Streifen, Filmkorn, Vignette und Halation für den Kino-Look; harte Cuts auf den Musik-Hits.
- Kein abgeschnittener Inhalt: jeder Gameplay-Clip wird beschnitten und skaliert, damit der relevante Bildbereich mittig und vollständig sichtbar ist; danach Frame-Spotchecks.

## Schnitt (28s)

```text
0.0-3.0   COLD OPEN   Boss-Thron KI-Shot, Riser        "2020. YOU HAD $10K."
3.0-6.0   HOOK        Startscreen / Throne Room        "84 MONTHS. ONE LIFE."
6.0-9.5   TERMINAL    Terminal, Chart, Net Worth       "ONE SCREEN. ZERO NOISE."
9.5-13.0  TRADE       Trade-Sheet, Size, Send it       "22 COINS. REAL PRICES."
13.0-17.0 PERPS       Leverage 50x, Liquidationslinie  "50x. ONE CANDLE."
17.0-20.0 REKT        Liquidation, Boss verspottet     "97% GET REKT."
20.0-23.5 OPS         Airdrops, Presales, Rugs, XP     "AIRDROPS. RUGS. RANKS."
23.5-28.0 CTA         Boss-Krone + Logo                "PLAY FREE" / "$TCFB — OCTOBER"
```

## Material

- **Gameplay:** Das Live-Game wird automatisiert im 1080x1920-Viewport durchgespielt und mitgeschnitten (Throne Room, Terminal, Trade-Sheet, Perp-Desk mit Liquidation, Ops, Endcard). Clips werden getrimmt und als Remotion-Assets abgelegt.
- **Cinematische Boss-Shots:** 2-3 kurze generierte Clips (Gorilla-König auf dem Thron, Krone im Licht, Blick in die Kamera) für Cold Open, Rekt-Moment und Finale.
- **Audio:** ein durchgehender Trailer-Track (dunkler Trap/Drill mit Braams) plus 4-6 SFX (Riser, Impact-Braam, Glitch, Coin/Liquidation-Hit), erzeugt über ElevenLabs Music/SFX. Musik und Hits liegen exakt auf den Cuts.

## Technisch

- Neue Remotion-Komposition `ad` unter `remotion/src/ad/` (eigene Scene-Files, geteilte Clip-/Type-Bausteine), registriert in `remotion/src/Root.tsx`, 1080x1920 @ 30fps. Bestehende Kompositionen bleiben unangetastet.
- Aufnahme per Playwright (`record_video`) auf `public/game.html`, Konvertierung/Trim mit ffmpeg nach `remotion/public/clips/ad/`.
- Der Sandbox-Renderer rendert stumm; Musik und SFX werden nach dem Render mit ffmpeg auf die Tonspur gemischt (Ducking der Musik unter den Hits).
- Ausgabe: `/mnt/documents/x-assets/tcfb-ad-vertical.mp4`, dazu ein 16:9-Reframe nur, falls du es später willst.
- Dazu ein kurzer X-Ad-Text (lowercase, degen, kein Hashtag) in `x-assets/x-ad-trailer-copy.md`.

## Prüfung vor Abgabe

Frame-Spotchecks an jedem Cut (kein Clipping, keine überlaufenden Texte), Audio-Sync am Ende, Dateigrösse und Dauer für X-Ads bestätigen.
