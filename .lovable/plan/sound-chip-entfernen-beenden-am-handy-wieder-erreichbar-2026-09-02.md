# Sound-Chip entfernen, Beenden am Handy wieder erreichbar

Am Handy liegt der schwebende SOUND-Knopf oben rechts genau über den drei HUD-Knöpfen (🔊 Sound, ⚙️ Settings, ✕ Quit). Dadurch kann man einen Run nicht mehr vorzeitig beenden.

## Was sich ändert

- Der schwebende SOUND-Chip verschwindet vom Handy. Das Spiel hat oben rechts bereits einen eigenen Sound-Knopf — zwei Regler für dasselbe sind unnötig.
- Die drei Knöpfe oben rechts (Sound, Einstellungen, Beenden) werden am Handy garantiert sichtbar, nicht überlappt und mit mindestens 44 px Tippfläche dargestellt, inklusive Abstand zur Statusleiste (Notch).
- Der Beenden-Knopf (✕) bekommt am Handy eine klar erkennbare rote Kontur, damit er als "Run beenden" lesbar ist und nicht versehentlich mit dem Schließen eines Fensters verwechselt wird.
- Der bestehende Zweck des Chips bleibt erhalten: Ton startet weiterhin nicht automatisch, aber der erste Tap auf den HUD-Sound-Knopf initialisiert die Audio-Engine (Feed-Nutzer kommen stumm).

## Abnahme

Playwright bei 390×844 und 360×740: Startbild → PLAY NOW → prüfen, dass kein Element die drei HUD-Knöpfe überdeckt (Hit-Test auf ihre Mittelpunkte), ✕ tippen beendet den Run, Sound-Knopf schaltet Ton, keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`, im `v23-mobile`-Layer am Dateiende:
- `#v23-sound` (Style ~10021 und Erzeugung in `chrome()` ~10249) entfernen; `#v23-rotate` bleibt.
- Neue Handy-Regeln für `.hud-sys` / `.hud-ic`: `z-index` über dem Sticky-Header, `min-width/min-height:44px`, Safe-Area-Abstand, `hud-ic-quit` mit roter Kontur.
- Audio-Init beim ersten Tap auf `#sound-btn` sicherstellen (`initAudio()` vor `toggleSoundBtn()`), ohne die bestehende Sound-Logik zu verändern.
- Nicht angetastet: Spiel-Logik, Preise, XP, Perps, Leaderboard, Desktop-Layout.
