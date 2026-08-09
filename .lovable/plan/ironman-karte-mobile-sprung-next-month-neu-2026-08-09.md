# Ironman-Karte, Mobile-Sprung, NEXT MONTH neu

## 1. Ironman-Modus richtig erklärt und bewertet

Die Ironman-Zeile ist heute nur eine Checkbox mit "No skip / pause • harder" — ohne Info, was der Run wert ist. Intern zählt Ironman schon doppelt (`getXPMultiplier`: `×2` obendrauf), das wird aber nirgends gezeigt.

- Ironman wird eine echte Auswahlkarte im gleichen Look wie Difficulty und Run Mode: Titel, ein Satz Regeln (kein Pause, kein Skip, keine zweite Chance), plus deutlicher Badge **XP ×2 · höchster Multiplikator**.
- Darunter eine **Live-XP-Vorschau**, die sich beim Umschalten sofort aktualisiert, z. B. „Dieser Run: BOSS ×2.5 · Chaos ×1.25 · Ironman ×2 = **XP ×6.25**". Damit sieht man sofort, dass Ironman + BOSS + Chaos das Maximum ist.
- Der Satz unter den Modi wird angepasst: er nennt Ironman explizit als stärksten Hebel.
- Zusatz-Hinweis auf der Karte: in Ironman läuft die Zeit weiter, Woche/Monat/Pause sind gesperrt (das ist bereits so implementiert, wird nur sichtbar gemacht).

Die XP-Formeln selbst bleiben unverändert — nur Darstellung.

## 2. Mobile: kein Sprung mehr nach oben

Beim Tippen auf MARKT / PORTFOLIO / OPS / SHOP / STATS springt die Seite aktuell hart nach oben (`window.scrollTo(top:0)` in `setPane`), obwohl der gewählte Bereich weiter unten liegt.

- Der Sprung nach oben fällt weg. Stattdessen wird der erste Panel des gewählten Bereichs zentriert in den Blick geholt — direkt unter dem klebenden HUD, oberhalb der fixen Leiste, ohne Ruck.
- Wenn der Bereich schon sichtbar ist, wird gar nicht gescrollt.
- Der aktive Reiter bleibt farblich markiert, Wechsel ohne Layout-Sprung.

## 3. NEXT MONTH: der wichtigste Button wird ordentlich

Der Balken ist heute violett-cyan mit ⏩-Emoji und passt nicht mehr zur warmen Schwarz/Gold/Neon-Optik.

- Dunkle Metallplatte als Grund (wie die Panels), Gold-Hairline, Neon-Grün als Aktionsfarbe, sanfter Glow beim Drücken statt Farbverlauf.
- Statt des ⏩-Emojis ein saubere, klare Pfeil-/Kalender-Grafik im CI (als Vektor gezeichnet, scharf auf jedem Display) — passend zum Stil der Archetyp-Grafiken am Start.
- Zweizeilig: groß **NEXT MONTH**, klein darunter der Kontext („Monat 4 / 84 · Kosten fällig"), damit klar ist, was der Klick auslöst.
- Trefferfläche mindestens 52 px hoch, sicher über der Tab-Leiste und der iPhone-Home-Leiste.
- In Ironman wird der Button als gesperrt dargestellt (Zeit läuft selbst) statt einfach tot zu wirken.
- Der gleiche Stil greift auch für den Desktop-Balken, damit es überall gleich aussieht.

## Technische Notizen

Alles in `public/game.html`:
- Ironman: `.ironman-row` wird zu `.choice`-Karte in einem eigenen Block; neue kleine Funktion rendert die XP-Vorschau aus `DIFF`-Multiplikator, `pmode`-Faktor und Ironman `×2` (liest dieselben Werte wie `getXPMultiplier`, ohne sie zu ändern). Klick-Handler auf Karte togglet die bestehende `#ironman`-Checkbox, damit `actuallyStartGame()` unverändert bleibt.
- `setPane()`: `window.scrollTo({top:0})` entfernt; stattdessen `scrollIntoView({block:'center'})` auf `main [data-pane=…]` mit Sichtbarkeits-Check und Offset für Sticky-Header.
- `#mobile-next` und `.v4-next`: neue Regeln in einer `v15`-Style-Sektion, die den Gradient aus Zeile ~4585 und ~7095 überschreibt; Inline-SVG-Icon plus `<span>`-Untertitel, Text aus `state.month` beim `updateHeader()`-Durchlauf gesetzt.
- Nicht angetastet: XP-Formeln, Preise, Difficulty-Werte, Spiellogik.
