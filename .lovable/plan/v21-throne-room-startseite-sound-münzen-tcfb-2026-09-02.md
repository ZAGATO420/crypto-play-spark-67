# V21 — THRONE ROOM: Startseite, Sound, Münzen, $TCFB

Vier Baustellen, in dieser Reihenfolge umgesetzt: Startseite (Sofort-Spiel-Reiz), Soundtrack (Trap/Drill), echte Coin-Logos in Boss-Münzen, $TCFB als roter Faden über den ganzen Run.

## 1. Startseite: eine Bühne, ein Button

Aktuell stehen Titel, Boss, Zitat, Live-Zeile, Leaderboard, How-To, Settings, Sound und Modi-Infos gleichzeitig above the fold — deshalb wirkt sie voll. Neu: **Boss + Titel + ein Button**, alles andere rutscht in Nebenziele.

```text
oben        winzige Zeile: 412 runs today · top $1.2M · $TCFB Okt 2026
Mitte       Thron-Boss großflächig, Krone leuchtend, Wortmarke darüber
darunter    EIN Acid-Button: ENTER THE ARENA
Fuß         4 kleine Text-Links: BOARD · HOW · SOUND · SETTINGS
```

Der Klick auf ENTER THE ARENA führt direkt in einen **Kurz-Flow als Vollbild-Schritte** (Name → Archetyp → Modus → Start), statt in eine Formularseite. Jeder Schritt: eine Frage, große Karten, Boss kommentiert die Wahl mit einem Satz.

Drei Varianten für die Bühne — du wählst nach dem Sehen; ich baue Variante A, wenn du nichts anderes sagst:

- **A · Thronsaal:** Boss zentral frontal, Vignette, langsam wandernder Lichtkegel, Titel als schwere Wortmarke über dem Kopf. Ruhig, teuer, Poster-Charakter.
- **B · Splitscreen:** links Boss halbformatig im Anschnitt, rechts Titel + Button + Live-Zahlen als schmale Säule. Moderner Game-Store-Look.
- **C · Cold Open:** 2 Sekunden nur Schwarz + Kurs-Ticker, dann fährt der Boss aus dem Dunkel hoch und der Button erscheint. Höchster Wow-Effekt, minimal längerer Einstieg.

Mobile in allen Varianten: Boss oben halbformatig, Titel, ein Button — nichts sonst sichtbar.

## 2. Soundtrack: Trap / Drill Boss Anthem

Der aktuelle 76-BPM-Synthwave-Bed wird ersetzt. Neu: produzierte Loops (ElevenLabs Music, nahtlos, als CDN-Assets — kein Laufzeit-Call, keine Kosten pro Spieler), darüber die bestehende reaktive Schicht.

| Track | Einsatz | Charakter |
|---|---|---|
| `menu` | Startseite / How-To / Board | 140 BPM, dunkles Klavier-Motiv, Sub-Bass, Trap-Hats, wenig Bewegung |
| `run` | normales Spielen | volle Drill-Percussion, sliding 808, kalte Stabs |
| `heat` | Survival kritisch / hoher Leverage / Crash | gleiches Tempo, halbierte Harmonie, verzerrter Sub, Alarm-Layer |
| `boss` | Endkapitel / Final Boss Fight | Chor-Stab, Doppel-Zeit-Hats, maximaler Druck |
| `end` | Endscreen | Motiv solo, verhallt, ausklingend |

Wechsel immer per Crossfade (2 s). Alle SFX werden auf 808/FM-Basis neu gebaut: Buy/Sell = knappe tonale Blips, Liquidation = Sub-Drop mit Downsweep, Airdrop = Riser + Shimmer, Achievement = Chor-Hit. Slider, Mute und gespeicherte Einstellungen bleiben. Fällt ein Loop aus, läuft die bestehende WebAudio-Engine als Fallback weiter.

## 3. Coins: echte Logos in Boss-Münzen

Alle 22 Coins (BTC, ETH, SOL, DOGE, ADA, DOT, LINK, AVAX, MATIC, SHIB, PEPE, WIF, BONK, UNI, AAVE, TAO, ARB, OP, SUI, APT, SEI, TIA) bekommen das **originale Logo mittig in einem einheitlichen Münzrahmen** im Acid-Throne-Stil: dunkler Ring, feine Hairline, Rand leuchtet acid bei Gewinn / magenta bei Verlust, Gold-Ring wenn du hältst.

- Einheitliche Größen: 40 px in Markt-Kacheln, 28 px in Listen/Ledger, 56 px im Trade-Popup, 20 px in Positionen.
- Als ein Sprite-Set über CDN, `2×` für Retina, lazy geladen — kein Ladezuwachs auf dem Startscreen.
- Noch nicht gestartete Coins zeigen die Münze gesperrt (grau, Schloss, „launches 2023") statt zu fehlen — macht die Zeitreise sichtbar.

## 4. $TCFB als roter Faden (Shards + Final Boss Trade)

Bleibt vollständig innerhalb der Story 2020–2026:

- **Shards:** Über den Run verteilt gibt es 7 `BOSS SHARDS` — je einer pro Jahr, aus Quests, Airdrops, überlebten Rugs und Kapitel-Siegen. Fortschritt als kleine Krone im HUD (3/7). Reine Bonus-Ebene, keine Änderung an Preisen oder Formeln.
- **Final Boss Trade:** In den letzten drei Monaten (Okt–Dez 2026) erscheint `$TCFB` als handelbarer Presale mit Countdown, eigener Musikszene und Boss-Taunts. Wie viele Shards du hast, bestimmt deine Allocation-Größe — nicht den Preis. Die letzte Entscheidung des Runs: All-in, Teilposition oder aussteigen.
- **Endcard:** Shard-Zahl + TCFB-Ergebnis als eigene Zeile und Badge auf dem Poster („CROWNED · 7/7 SHARDS").

## 5. Viral & verständlich — ohne Story-Drift

- **Aufgeräumt statt vereinfacht** (deine Wahl): keine Freischaltstufen, aber klare Sprache statt Jargon (Untertitel wie „Liquidation = Position wird zwangsverkauft"), Panels in gleicher Hierarchie, jede Kachel mit einer Zeile Klartext, keine Textwände.
- **Ein Boss-Auftrag pro Monat**, groß und prominent — wer nichts weiß, macht genau das. Alles andere bleibt optional daneben.
- **Shareable Momente:** Bei Liquidation, 10×-Gewinn und Kapitel-Sieg erscheint eine kleine Boss-Karte mit „SAVE IMAGE / POST" — genau die Bilder, die auf X funktionieren.
- **Rang-Vorschau vor dem Eintrag** („du wärst #12 von 340") direkt im Endscreen — der wahrscheinlichste Grund, warum sich bisher niemand einträgt.
- **Wiederspielreiz:** Nach dem Run zeigt der Boss deine größte Fehlentscheidung und fordert Revanche mit demselben Startkapital.

## Offene Punkte für dich

1. Welche Startseiten-Variante (A Thronsaal / B Splitscreen / C Cold Open)?
2. Soll ich zusätzlich einen `QUICK RUN` (24 Monate) einbauen, um mehr Board-Einträge zu bekommen — oder bleibt es strikt bei 84 Monaten?

## Technische Notizen

Alles in `public/game.html`:
- Neuer Block `v21-core` als einzige Quelle für Startseite, Münzen und Sound-Verdrahtung; alte Startseiten-Regeln aus `v20-core` werden entfernt statt überschrieben.
- Startscreen als Schritt-Maschine (`v21Step`), kein Formular; bestehende Charakter-/Modus-Daten bleiben unverändert.
- Coin-Icons als `COIN_ICON`-Map plus `coinBadge(sym,size)`-Helfer; alle Render-Stellen (Market, Trade-Popup, Ledger, Positionen, Endcard) ziehen darauf.
- Audio: `MUSIC_LOOPS` wird mit den fünf produzierten Tracks befüllt, `musicScene()` erhält `boss`; `playSound()` behält seine Signatur.
- ElevenLabs-Connector wird für die Erzeugung verbunden; die fertigen Dateien liegen als statische Assets.
- Shards als `state.shards[]`, TCFB als regulärer Coin-Eintrag mit `launch: 81` — Perp-Mathematik, XP-Formeln, historische Preise, Schwierigkeitsgrade und Leaderboard-API bleiben unberührt.
- Abnahme per Playwright bei 390×844, 414×896, 768×1024, 1030×695, 1280×720, 1440×900, 1728×1117: nichts abgeschnitten, jeder Button klickbar, Musikwechsel Menü → Run → Heat → Boss → End, keine Konsolenfehler.
