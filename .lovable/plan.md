# V4 Optik: Bright Retro-Revival statt Unterwelt

## 1. Kunstrichtung neu: "Crypto Revival 2020–26"
Weg von Totenkopf/Wappen-Look (zu düster, erinnert an andere Spiele), hin zu einem hellen, humorvollen Retro-Arcade-Stil:

- Grundstimmung: Gold + Violett bleiben CI, dazu wärmere Akzente (Sand, Türkis, Coral) und mehr Licht in den Panels
- Bildsprache: Sticker-/Cartoon-Illustrationen mit dicker Kontur und Glanzlicht (wie die Airdrop/Launchpad/Perps-Icons rechts im Mockup, die dir gefallen) — dieser Stil wird zum Standard für **alle** Grafiken
- Motive statt Schädel: Trophäen-Coin, Rakete, Diamanthand, Papierhand, Wal, Affe mit Krone, Gold-Pokal, Boss-Krone
- Der BTC-Sensemann kommt rein, aber als **einzelnes humorvolles Motiv** (Archetyp-Avatar "Reaper" bzw. Liquidations-Maskottchen), nicht als Grundton des Spiels

## 2. Season Status ohne Totenköpfe
- Tier-Badges als bunte Sticker-Medaillen: Exit Liquidity (Papierhand) → Paper Hands → Degen (Affe) → Whale (Wal) → Legend (Diamant-Krone) → Final Boss (goldene Boss-Krone)
- Rahmen heller, Glas statt Grabstein, XP-Leiste in Violett mit Gold-Glanzkante
- Rank-Zeile bleibt, Look wird freundlich statt heraldisch

## 3. Neue Avatare & Archetypen
- Die 6 Emoji-Avatare werden zu 6 gezeichneten Portraits im gleichen Sticker-Stil (Coder, Affe, Astronautin, Frosch, Bot, Diamant) + ein 7. Motiv: **BTC Reaper** (augenzwinkernd, Sense mit BTC-Symbol)
- Archetyp-Karten bekommen je ein kleines Illustrations-Icon statt reinem Text

## 4. Zeitsteuerung sichtbar machen
Die 1x / 2x / 3x-Buttons, "▶▶ WEEK" und der Tages-Fortschrittsbalken existieren, gehen aber optisch unter bzw. fehlen im V4-Entwurf.

- Eigene **Time Control**-Leiste in der Action-Bar unten: Pause · WEEK · MONTH · Speed-Chips 1x/2x/3x
- Speed-Chips als klar erkennbare Segment-Umschalter mit Gold-Aktivzustand
- Fortschrittsbalken wird eine sichtbare, beschriftete Leiste ("Day 12 / 30") direkt unter der Datumsanzeige, plus dünner Monatsring im HUD
- Ironman: Week/Month/Pause deaktiviert und sichtbar als "IRONMAN — no skip" gekennzeichnet

## 5. Alles andere angleichen
Damit nicht Startscreen und Spiel wie zwei Spiele wirken:

- **Startscreen**: gleiche Panel-Sprache, gleiche Radien/Hairlines, illustrierte Archetyp- und Avatar-Karten, hellerer Hintergrund mit Aura-Verlauf
- **How-to / Tutorial (3 Schritte)**: als illustrierte Karten mit je einem Sticker-Motiv, kurzer Text, Fortschrittspunkte
- **Leaderboard** (Start + Global): Podium-Optik für Top 3 mit Medaillen-Stickern, kompakte Tabellenzeilen darunter, Tier-Badge pro Eintrag
- **Endscreen**: gleiche Badge-Familie, Boss-Karte mit goldener Krone statt Totenkopf
- **Toasts, Overlays, Popups**: einheitliche Radien, Farben, Icon-Set
- Emoji-Rauschen reduzieren: Icons nur wo sie Bedeutung tragen, Zahlen in Tabular-Ziffern

## 6. Layout bleibt Single-Screen
Struktur wie im genehmigten V4-Konzept (HUD oben, Season/Player/Missions links, Chart + Markt/Perps Mitte, Ops/Shop/Quests/Stats als Tabs rechts, Action-Bar unten), nur eben in der neuen, helleren Bildsprache — und mit der Time-Control-Leiste unten.

## Technische Notizen
Alles in `public/game.html`:
- Neue Grafiken via `imagegen` (transparente PNGs, Sticker-Stil, ein Prompt-Rezept für Konsistenz), eingebunden als `lovable-assets`-Pointer; alte Wappen/Skull-Assets entfallen
- CSS-Tokens aufhellen (`--panel`, `--border`, neue Akzent-Variablen); eine Badge-Klasse `.tcfb-badge` für Season/Leaderboard/Endscreen/Achievements
- Startscreen-Markup: `#archetypes`, `#avatars` bekommen `<img>`-Icons; `.avatar-btn` auf Bild-Layout umgestellt
- Neue `.timebar` in der Action-Bar; bestehende `setSpeed()`, `advanceWeek()`, `advanceMonth()`, `#day-progress` unverändert weiterverwendet, nur neu gerendert (`renderTimeBar()`)
- Leaderboard-Renderer (`start-leaderboard` + globale Liste) auf Podium-Markup umgestellt
- Keine Änderungen an Preisdaten, Kosten, Difficulty, Perp-Formeln, XP- oder Scoring-Logik
