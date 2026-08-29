# V19 Audio Rebuild — Lo-Fi Neon Synthwave

Der aktuelle Soundtrack ist ein generischer WebAudio-Akkord-Pad (Sinus-Chords, Noise-Hats) und die Effekte sind nackte Sinus-Töne. Beides wird komplett ersetzt: produzierte Synthwave-Loops als Basis, dazu eine reaktive WebAudio-Schicht für Spielmomente.

## Musik: 4 produzierte Loops

Erzeugt mit ElevenLabs Music, jeweils als nahtlos loopbarer Track (~40-60 s, komprimiert, über den Lovable-CDN ausgeliefert, nicht im Repo):

| Track | Einsatz | Charakter |
|---|---|---|
| `menu` | Startscreen, How-To, Leaderboard | Warmes Synthwave-Arpeggio, entspannt, einladend |
| `trade` | Normales Spielen (Survival gesund) | Lo-Fi-Groove, weiche Bassline, Tape-Sättigung, Neon-Pads |
| `heat` | Survival niedrig / hoher Leverage / Crash-Monat | Gleiches Tempo, dunklere Harmonie, treibendere Percussion |
| `end` | Endscreen | Ruhiger, verhallter Synthwave-Ausklang |

Umschalten immer per Crossfade (2-3 s), niemals harter Cut. `menu` → `trade` beim Spielstart, `trade` ↔ `heat` je Spielzustand, `end` beim Runde-Ende.

## Reaktive Layer (WebAudio, live erzeugt)

Läuft synchron über der Musik, damit das Spiel hörbar reagiert:

- Riser/Shimmer bei Pump oder Airdrop-Claim
- Sub-Drop + Alarm-Drone bei Liquidation / Rug
- Kurzes Ducking der Musik bei wichtigen Meldungen (bleibt erhalten, aber sauberer)
- Sanfter Tiefpass-Filter-Sweep, wenn Survival kritisch wird

## Neue Sound-Effekte

Alle Effekte werden auf den Synthwave-Look neu gebaut (kurze FM-/Wavetable-Klänge mit leichtem Delay statt reiner Sinus-Töne):

- `buy` / `sell`: weiche Doppel-Blips, tonal zur Musik passend
- `moon` / `survive`: aufsteigendes Arpeggio mit Shimmer-Tail
- `rug` / `rekt` / `critical`: verzerrter Sub-Hit mit Downsweep
- `quest` / `decision` / `click`: knappe, leise UI-Klicks (kein Ermüdungsfaktor)

## Steuerung & Verhalten

- Bestehende Slider „Music Volume" und „SFX Volume" bleiben und steuern die neuen Layer; gespeicherte Einstellungen und Mute-Button bleiben kompatibel.
- Musik startet erst nach der ersten Nutzerinteraktion (Autoplay-Regeln), pausiert bei Tab-Wechsel.
- Loops werden erst geladen, wenn Sound aktiv ist — kein zusätzliches Ladevolumen für stummgeschaltete Spieler; bis der Loop da ist, greift die WebAudio-Schicht als Übergang.
- Bei Ladefehler oder langsamer Verbindung läuft alles rein auf WebAudio weiter (kein Stille-Bug).

## Technische Details

- ElevenLabs-Connector wird für die Musikerzeugung verbunden (falls noch nicht vorhanden); die fertigen Audiodateien werden als statische CDN-Assets abgelegt, es gibt keinen Laufzeit-API-Call und keine Kosten pro Spieler.
- Neue Audio-Engine in `public/game.html`: `musicBed` (HTMLAudio/AudioBuffer-Quellen mit Crossfade-Gains) ersetzt `musicPad`/`MUSIC_PROG`; `playSound()` behält seine Signatur, damit alle bestehenden Aufrufer unverändert bleiben.
- Spiel-, Trading- und Finanzlogik wird nicht angefasst.
- Abnahme mit Playwright auf Mobile und Desktop: Musikwechsel Menü → Spiel → Heat → Endscreen, Slider, Mute, Tab-Wechsel, keine Console-Fehler.
