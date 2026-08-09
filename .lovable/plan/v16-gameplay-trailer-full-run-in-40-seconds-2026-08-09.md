# V16 Gameplay Trailer — "Full Run in 40 Seconds"

Ein neuer 1920x1080 Trailer im aktuellen V13-V16 Look (warmes Schwarz, Gold, Neon-Grün), gebaut aus **echtem, frisch aufgenommenem Gameplay** des Live-Games — nicht aus den alten V5-Screenshots. Struktur und Schnitt-Rhythmus wie tcfb-trailer-v5.mp4, nur moderner, schneller und mit mehr Info pro Sekunde.

## Was neu aufgenommen wird

Per Playwright wird das Game im Sandbox durchgespielt und als Video mitgeschnitten. Aufgenommene Beats (je 3-6s Rohmaterial, sauber getimt):

1. Startscreen mit Boss-Affe + Archetyp-/Avatar-Auswahl
2. Run-Mode Karten inkl. Ironman-Karte mit Live-XP-Vorschau (×6.25)
3. Terminal 3-Spalten, Chart + P&L
4. Trade-Modal: Coin antippen, Slider ziehen, Buy
5. Perp Desk: Leverage bis 50x, Liquidationsdistanz, offene Position live
6. Airdrop / Launchpad / Presale Ops
7. Decision-Dossier-Karte (Story-Moment)
8. Season Status + Daily Missions + XP-Level-Up
9. Monate durchklicken (Zeitraffer 2020 → 2026), Preise laufen mit
10. Endscreen / Identity-Card + Global Leaderboard mit Avatar
11. Mobile: No-Scroll Terminal + Bottom-Dock

## Schnitt und Aufbau (ca. 40s, 30fps)

```text
0.0-2.5  HOOK      "i played 84 months of crypto." harter Cut auf Rekt-Zahl
2.5-6    IDENTITY  Archetyp + Ironman Karte, XP x6.25 Callout
6-11     TERMINAL  "one screen. zero scroll."
11-16    TRADE     Modal, Slider, Slippage-Callout
16-22    PERPS     50x, Liquidation, live PnL rot/grün
22-27    OPS       Airdrops, Launchpad, Presale, Scam-Karte
27-32    PROGRESS  XP, Level, Season, Missions, Leaderboard
32-36    TIMEWARP  2020 -> 2026 Monatsraffer, echte Preise
36-40    CTA       Logo, "thecryptofinalboss.app", "still got rekt."
```

Motion-System: ein Standard-Entrance (Clip-Path-Reveal + leichter Push-In), Springs nur für Hero-Momente, Kicker-Zeilen in Mono mit weitem Tracking, Zahlen-Callouts als Glass-Chips. Transitions nur wipe / slide / clockWipe — kein Fade-to-Black. Slow-Zoom auf jedem Clip, damit kein Frame steht.

## Technisch

- Aufnahme: Playwright mit `record_video` auf `public/game.html` (Viewport 1920x1080 und 430x932 für Mobile), Clips nach `remotion/public/clips/v16/*.webm` konvertiert und getrimmt (ffmpeg).
- Neue Remotion-Komposition `v16` unter `remotion/src/v16/` (eigene Scene-Files + geteilte `Clip`/`Type`-Komponenten wiederverwendet), registriert in `Root.tsx`. Bestehende Kompositionen bleiben unangetastet.
- Farben aus `remotion/src/theme.ts` auf die aktuelle V13-Palette angeglichen (warmes Schwarz #0b0908, Gold, Neon-Grün).
- Render via `remotion/scripts/render-remotion.mjs` nach `/mnt/documents/x-assets/tcfb-trailer-v16.mp4`, danach Frame-Spotchecks auf Clipping/Textüberlauf.
- Dazu ein kurzer X-Post-Text (lowercase, degen, kein Hashtag) als `x-assets/x-post-v16-trailer.md`.

Kein Audio (Rendering ist stumm) — Musik kann beim Posten drüber gelegt werden, falls gewünscht.
