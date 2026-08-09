# Masterplan: Terminal 100 % responsive, freundlicher, aufgeräumt

Das Kernproblem ist nicht ein einzelner Button, sondern die Historie: über der Basis liegen inzwischen neun Style-Schichten (`v4-skin`, `v5-skin`, `v5-skin-tail`, `v6-skin`, `v7-skin`, `v8-polish`, `v9-endcard`, `v10-story`, `v11-noclip`), die sich bei jeder Breite gegenseitig mit `overflow:hidden`, festen Höhen und `!important` überschreiben. Deshalb wird an einer Stelle repariert und an der nächsten Breite etwas anderes abgeschnitten. Der Plan räumt das auf, statt weiter zu flicken.

## 1. Ein einziges Layout-System statt neun Schichten

- Alle Layout-Regeln (Höhen, Spalten, `overflow`) werden aus den alten Blöcken herausgezogen und in **einem** neuen Block `terminal-layout` gebündelt. Die alten Blöcke behalten nur noch Farben, Typografie und Kartenoptik.
- Vier klar definierte Stufen, keine Zwischenzonen mehr:

```text
PHONE      < 700px   eine Spalte, Seite scrollt, feste Bottom-Bar
TABLET   700–1099px  zwei Spalten, Seite scrollt sanft
LAPTOP  1100–1499px  drei Spalten, Panels scrollen intern
BIG        ≥ 1500px  drei Spalten, mehr Luft, größere Schrift
```

- Grundregel überall: **kein Element bekommt eine feste Höhe, die den Inhalt kappt.** Panels dürfen intern scrollen; abgeschnittene Inhalte gibt es nicht mehr.
- Auf Laptop/Big bleibt der Ein-Screen-Charakter erhalten — aber über innere Scrollbereiche pro Panel, nicht über hartes Beschneiden.

## 2. Der konkrete Fehler aus dem Screenshot

- Die Ops-Reiter (LAUNCHPAD, DEGEN OPS, BUSINESS, SHOP, TROPHIES, LEDGER) werden zu einer echten scrollbaren Reiter-Leiste mit Snap; bei Platzmangel rutscht sie horizontal statt Buttons abzuschneiden. Auf breiten Schirmen bleibt sie zweizeilig-kompakt sichtbar.
- Die Presale-/Launchpad-Liste bekommt eine sichtbare Scroll-Zone mit weicher Abblende unten plus eine sticky Fußzeile, damit man sofort erkennt: hier geht es weiter. Der letzte „Invest"-Button ist immer vollständig erreichbar.
- Gleiche Behandlung für Perp-Desk-CTA, Business-, Shop- und Trophies-Listen.

## 3. Terminal einfacher für neue Spieler

- **Fokus-Modus als Standard beim ersten Run:** Sichtbar sind nur Markt, Chart und die Monats-Aktion. Airdrops, Launchpad, Perps, Business bleiben in der Ops-Leiste, aber ruhig und mit Hinweis „ab hier wird es riskant".
- **Onboarding in 4 Schritten** beim ersten Start des Terminals: „Das ist dein Cash" → „Hier kaufst du" → „Hier siehst du Gewinn/Verlust" → „Hier geht der Monat weiter". Überspringbar, einmalig, gespeichert.
- **Klarere Sprache statt Jargon** in Beschriftungen: Untertitel wie „Positionsgröße = wie viel du wirklich bewegst", „Liquidation = Position wird zwangsverkauft".
- **Wichtigste Aktion immer sichtbar:** NEXT MONTH bleibt auf jeder Größe als ruhiger, fixer Balken unten, mit einem Satz Kontext („Monat 4 · Kosten fällig").
- Ein Restbestand Deutsch in den Daten (z. B. „DeFi Summer Vorspiel") wird auf Englisch gezogen, damit die Sprache konsistent ist.

## 4. Optischer Politur-Pass (freundlicher, weniger kalt)

- Hintergrund von fast-schwarz auf ein etwas hellere, wärmere Nachtblau-Fläche mit sehr feinem Grid; Karten heben sich klarer ab.
- Einheitliche Abstände (8/12/16/20), einheitliche Radien, einheitliche Hairlines — heute variiert das pro Schicht.
- Gold nur noch als Akzent (aktiver Reiter, Net Worth, Bestätigen). Grün/Rot ausschließlich für Gewinn/Verlust. Violett bleibt der Haupt-Aktion vorbehalten.
- Icons in einer Größe und optisch gleich ausgerichtet, Panel-Titel in einer Hierarchie, ruhigere Hover-Zustände ohne Ruckeln.
- Leere Zustände bekommen einen freundlichen Satz statt einer leeren Fläche.

## 5. Abnahme-Test

Jede Ansicht wird per Playwright bei diesen Breiten geprüft — Phone 390×844, 414×896; Tablet 768×1024, 820×1180; Laptop 1060×682 (genau dein Fall), 1280×720, 1440×900; Big 1728×1117, 2560×1440. Geprüft wird pro Breite:

- kein Element horizontal oder vertikal abgeschnitten,
- jeder Button vollständig klickbar (auch der letzte in jeder Liste),
- NEXT MONTH immer erreichbar,
- alle Ops-Reiter erreichbar,
- keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`:
- Neuer Block `<style id="terminal-layout">` als einzige Layout-Quelle; `v11-noclip` wird gelöscht, die Layout-Teile aus `v4-skin`/`v6-skin`/`v7-skin` werden entfernt statt überschrieben.
- Breakpoints auf 700/1100/1500 normiert; `overflow:hidden` nur noch auf `main`, innere Scrollbereiche über `.scrollzone` mit Maskenabblende.
- Ops-Reiter: `#v4-side-tabs` wird zu horizontal scrollbarer Leiste (`scroll-snap`), Aktiv-Zustand ohne Layoutsprung.
- Die `fold()`-Logik im V7-Layer bleibt, arbeitet aber gegen gemessene Restflächen; keine festen `clamp()`-Höhen mehr für `#v7-top`.
- Onboarding als `state.seenTour` in `localStorage`, Fokus-Modus als `state.uiMode` (`SIMPLE`/`FULL`), Umschalter in den Settings.
- Nicht angetastet: Preise, XP-Formeln, Perp-Mathematik, Leaderboard, Story/Pacing-Layer.
