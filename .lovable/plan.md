# V4 Visueller Sprung: Single-Screen Layout, Season Status & Daily Missions

## 1. Season Status Karte (wie im Screenshot)
Neue Karte oben links im Interface, genau im Stil des hochgeladenen Bildes:

- Gold-gerahmte Karte, Titel "SEASON STATUS" in Gold, dunkler Grund
- Links ein **Wappen-Badge** (Schild mit Totenkopf, Lorbeerkranz, Violett/Gold) — je Tier eine andere Farbgebung
- Rechts: "DEGEN TIER" klein, darunter der Tier-Name groß in Violett (z. B. LEGEND), darunter "RANK #42"
- Darunter violette XP-Leiste mit "8,450 / 10,000 XP"
- Tier leitet sich aus dem bestehenden Level ab (keine neue Balance): Exit Liquidity → Paper Hands → Degen → Whale → Legend → Final Boss. Rank kommt aus dem globalen Leaderboard-Score (Live-Abfrage), solange kein Rang bekannt ist steht "UNRANKED".
- Badges werden als saubere PNG-Grafiken erzeugt (Gold/Violett CI) und als CDN-Assets eingebunden.

## 2. Spieler-Identität sichtbar
Aktuell steht der Name nur klein im Header.

- Neue **Player-Karte**: Avatar groß im Ring, Spielername fett, darunter Archetyp · Land · Difficulty als kleine Chips
- Ironman und Presale-Modus als eigene Mini-Badges
- Sitzt direkt über/neben dem Season Status, damit "wer bin ich" sofort klar ist

## 3. Daily Missions
Neues Panel "DAILY MISSIONS" mit 3 rotierenden Aufgaben pro Spielmonat:

- Beispiele: "Kauf 2 verschiedene Coins", "Realisiere +5 % Gewinn", "Überlebe den Monat ohne Stress > 70", "Öffne eine Perp-Position und schließe sie im Plus", "Claim einen Airdrop", "Halte Hunger unter 30 %"
- Jede Mission: Icon, Text, Fortschrittsbalken, XP-Belohnung
- Erfüllt = Häkchen, grüner Glow, XP-Popup wie bisher
- Belohnung nur XP (kein Cash), damit die Wirtschaft unangetastet bleibt
- Nicht erfüllte Missionen verfallen beim Monatswechsel und werden neu gezogen; abgeschlossene Missionen zählen in eine "Mission Streak" Anzeige

## 4. Single-Screen Layout ohne Scrollen (Desktop)
Das Spiel füllt exakt den Viewport, nichts scrollt mehr weg:

```text
┌──────────────────────────────────────────────────────────────┐
│ HUD: Avatar+Name · Cash/Net/Portfolio · Hunger/Stress/HP · ⚙ │
├───────────────┬──────────────────────────┬───────────────────┤
│ SEASON STATUS │  CHART + P&L             │ Tabs:             │
│ PLAYER CARD   │  ─────────────────────── │ OPS · SHOP ·      │
│ DAILY MISSIONS│  MARKET / PERPS Grid     │ QUESTS · STATS    │
│ (Spalte 1)    │  (Hauptbühne, scrollbar) │ (Spalte 3)        │
├───────────────┴──────────────────────────┴───────────────────┤
│ News-Ticker · Sentiment · [⏩ NEXT MONTH]                     │
└──────────────────────────────────────────────────────────────┘
```

- `body` bekommt feste Höhe (`100dvh`, kein Body-Scroll); nur die Mittelbühne und die Tab-Inhalte scrollen intern mit dünnen, dezenten Scrollbars
- Rechte Spalte wird zu Tabs, damit Ops/Shop/Quests/Achievements nicht mehr untereinander stapeln
- Der Chart wird flacher, das Coin-Grid dichter (kompakte Zeilen statt großer Karten), Portfolio als Sub-Tab
- Fallback: unter 1100 px Breite bzw. unter 720 px Höhe greift wieder das heutige scrollbare Layout; Mobile bleibt unverändert bei den unteren Tabs

## 5. Optisch aufräumen (ruhiger, professioneller)
Damit es nicht "erschlägt":

- Einheitliche Panel-Sprache: gleiche Radien, gleiche Hairline, gleiche Titelzeile (Icon + Text in Gold, Zähler rechts) für alle Panels
- Nur **eine** Akzentfarbe pro Zustand: Gold = Navigation/Titel, Violett = XP/Season, Grün/Rot ausschließlich für Kurse und Long/Short
- Zahlen in Tabular-Ziffern, konsistente Ausrichtung, weniger Emoji-Rauschen: Icons nur noch dort wo sie Bedeutung tragen
- Coin-Zeilen kompakt: Symbol · Preis · 1M-Änderung · Sparkline · Buy/Sell — statt aktuell großer Kacheln
- Etwas mehr Grafik-Wärme: dezente Verlaufskanten an Panels, Badge-Grafiken (Season, Tier, Achievements), sanfte Hover-Lifts

## Technische Notizen
Alles in `public/game.html`:
- Neue CSS-Grid-Shell `#game-screen.single-screen` mit `grid-template-rows: auto 1fr auto`, `min-height:0` auf allen Scroll-Containern; Media-Query-Guard `@media (min-width:1101px) and (min-height:721px)`
- Neue Panels `#season-status`, `#player-card`, `#daily-missions` in Spalte 1; `renderSeason()`, `renderPlayerCard()`, `renderMissions()` in den bestehenden `renderAll()`-Zyklus
- Missionen: `MISSION_POOL` mit `check(state)`-Prädikaten, `state.missions` (3 Einträge + `done`-Flag + Streak), Ziehung in `advanceMonth()`, XP über bestehende `addXP()`
- Rang: bestehende Leaderboard-API (`/api/public/leaderboard`) für Rangposition; Ergebnis gecacht, Fehler = "UNRANKED"
- Tier-Badges via `imagegen` erzeugt und als `lovable-assets`-Pointer eingebunden
- Rechte Spalte: `setSidebarTab()` analog zur bestehenden Mobile-`setPane()`-Logik
- Keine Änderungen an Preisdaten, Kosten, Difficulty, Perp-Formeln oder Scoring
