# Musik rein, Charakter auf dem Board sichtbar

## 1. Echte Musik statt Geräusche

Aktuell hat das Spiel keinerlei Ton — es gibt im Code keine einzige Audio-Zeile. Neu kommt richtige, produzierte Musik in Hip-Hop-Richtung, glasklar gemastert:

- **Zwei Loops** (je ca. 60–90 s, sauber schleifend, moderner Boom-Bap/Lo-Fi-Hip-Hop mit sattem Sub-Bass, knackigen Drums, dezenten Neon-Keys — clean, kein Rauschteppich):
  - `MENU` — Startbild, Setup, Bestenliste, Endscreen: entspannter Groove
  - `RUN` — während des Runs: härterer Beat, mehr Druck
- Wechsel immer per weichem Übergang (2 s), niemals harter Schnitt.
- Musik startet erst beim ersten Tippen/Klicken (Browser erlauben Ton nicht vorher), pausiert bei inaktivem Tab.
- Kein generiertes Gepiepse und keine synthetischen Zufallstöne — nur die fertigen Musikdateien.

## 2. HD-Sounds für alle Aktionen

Für jede Aktion ein sauberer, knackiger Sound (echte Aufnahmen/produzierte Effekte, nicht synthetisches Piepsen) — passend zum Hip-Hop-Ton, glasklar und kurz:

- Kauf und Verkauf: satter Cash-/Klick-Hit
- Guter Launch, Level-Up, Streak: hell aufsteigender Erfolgs-Sound mit Tail
- Crash, Liquidation, Exchange-Ausfall: tiefer Sub-Impact mit kurzem Alarm
- Essen/Beruhigen, Verwahrungs-Wechsel, Quartalsende: eigene, klar unterscheidbare Klänge
- Karten-/Menü-Auswahl und Minigame-Treffer: knappe, leise UI-Klicks (kein Ermüdungsfaktor)


## 3. Ton-Regler

Ein Lautsprecher-Knopf oben rechts, immer sichtbar: an/aus mit einem Tap, langes Menü nicht nötig. Musik und Effekte haben je einen Regler in den Einstellungen; Zustand wird gespeichert (Default: Musik ca. 35 %, Effekte ca. 60 %).

## 4. Charakter auf dem Board

Auf der Bestenliste steht heute nur Name, Flagge und Archetyp als Text. Neu:

- **Avatarbild** links neben Flagge und Name (rund, mit Rand, Platz 1–3 mit goldenem Ring).
- Der Archetyp bleibt als kurzer Text darunter, damit klar ist, mit welcher Rolle gespielt wurde.
- Läuft ohne Datenänderung: der Avatar wird beim Eintragen schon mitgesendet und von der Bestenliste zurückgegeben; er wird nur nicht angezeigt.
- Fallback: fehlt der Avatar bei alten Einträgen, erscheint ein neutrales Boss-Symbol statt eines leeren Kreises.

## 5. "Continue Run" nach beendetem Run entfernen

Nach dem Ende eines Runs wird der Speicherstand zwar gelöscht, der Knopf bleibt aber stehen und führt ins Leere. Neu: sobald ein Run zu Ende ist (oder abgebrochen wird), verschwindet CONTINUE RUN vom Startbild — er erscheint nur, wenn wirklich ein laufender Run zum Weiterspielen existiert.

## 6. Live-Ticker oben auf dem Startbild

Eine schmale, laufende Zeile mit echten aktuellen Kursen (BTC, ETH, SOL, DOGE, AVAX, LINK, ADA, DOT) inklusive 24-h-Veränderung in Grün/Rot. Die Kurs-Schnittstelle dafür gibt es schon; sie wird nur wieder angezeigt, aktualisiert sich jede Minute und blendet sich bei Ausfall einfach aus (kein Fehler, keine Platzhalterzahlen). Hinweis: das Spiel selbst läuft weiter auf den historischen Kursen 2020–2026 — der Ticker ist Atmosphäre.

## Technische Notizen

- Musik: zwei Hip-Hop-Loops via ElevenLabs Music erzeugt (44.1 kHz MP3, sauberer Loop-Punkt); Effekte einmalig via ElevenLabs Sound Effects generiert. Alle Audiodateien als `lovable-assets`-Pointer eingebunden (nicht im Repo), kein Laufzeit-API-Call und keine Kosten pro Spieler.
- Neue Datei `src/game/audio.ts`: `initAudio()` (mit `ctx.resume()` beim ersten `pointerdown`), `setTrack("menu"|"run")` mit Crossfade über GainNodes, `playSfx(name)` aus vorgeladenen AudioBuffern, Lautstärken in `localStorage`. Effekte werden erst geladen, wenn Ton aktiv ist.
- `src/game/CryptoJourney.tsx`: `setTrack` bei Screen-Wechsel, `playSfx` an bestehenden Stellen (Trade, Level-Up, Crash, Liquidation, Minigame, Auswahl), Sound-Toggle im Header; `setResume(false)` beim Runde-Ende und in `begin()`.
- Bestenliste: in `BoardScreen` (~Zeile 1158) `AVATARS`-Lookup über `r.avatar`, `<img>` in der `board-row`; `.board-row` in `src/styles.css` um Avatar-Spalte erweitern.
- Neue Komponente `PriceTape` im `StartScreen`, liest `/api/public/prices` (bereits vorhanden, 60 s Cache) über `useQuery`, CSS-Marquee in `src/styles.css`; bei Fehler wird nichts gerendert.
- Keine Änderung an Spiel-Logik, Preisen, XP, Boss-Score oder Board-API.

