# Decision-Karten neu + Story-Gefühl + ruhigeres Pacing

Drei Baustellen: die Karten sehen alt aus, die Story ist zu kühl, und manchmal prasseln Popups gleichzeitig rein. Alles in `public/game.html`.

## 1. Decision-Karten komplett neu (Dossier-Look)

Weg mit dem alten kleinen Logo oben auf Event-, Presale- und Decision-Karten. Stattdessen ein Karten-Look im Stil des restlichen Terminals:

- Dunkler Glas-Body, feines Grid im Hintergrund, goldene Kante links als Akzent — dieselbe Sprache wie Endscreen und HUD.
- Kopfzeile als echte Telemetrie: links Kategorie-Chip (`AIRDROP`, `PERPS`, `RUG`, `REAL HISTORY`), rechts Datum + Monat des Runs.
- Titel groß in der Display-Schrift, Text darunter ruhiger und mit mehr Zeilenhöhe.
- Options-Buttons werden Zeilen mit Struktur: Label, darunter eine kleine Konsequenz-Vorschau (`Kosten $39 · Risiko mittel · XP +40`), rechts ein Pfeil. Hover schiebt nicht mehr ruckartig, sondern hebt die Kante gold an.
- Nicht bezahlbare Optionen bleiben sichtbar, aber klar gesperrt mit Grund.
- Statt eines Deko-Affen ein kleiner gekrönter Boss-Sigil-Watermark rechts unten in HD, sehr dezent — nur bei „REAL HISTORY“-Karten in Gold hervorgehoben.
- Event- und Presale-Popups bekommen den gleichen Rahmen, damit alles wie eine Serie wirkt.

## 2. Story-Gefühl

- **Kapitel/Akte:** Der Run wird in Ären erzählt (z. B. `AKT I — 2020: NOBODY`, `AKT II — 2021: EUPHORIE`, `AKT III — 2022: WINTER` …). Beim Übergang eine ruhige Kapitel-Karte mit einem Satz Zeitgeist und dem Ziel des Akts. Ersetzt keine Mechanik, rahmt sie nur.
- **Absender statt Systemtext:** Decisions kommen von wiederkehrenden Figuren — der Telegram-Alpha-Caller, der Ex-Kollege, der anonyme Dev, der Steuerberater. Jede Figur hat Tonfall und Zuverlässigkeit; wer dir zweimal Mist verkauft hat, ist wiedererkennbar.
- **Konsequenzen kommen zurück:** Getroffene Entscheidungen setzen Marker; 2–6 Monate später erscheint eine Folge-Karte, die direkt auf die frühere Wahl verweist. Aus Einzelklicks wird ein Faden.
- **Persönliche Zwischenzeilen:** Nach Meilensteinen (erste $100k, erste Liquidation, Steuerbescheid) eine kurze Ich-Perspektive-Zeile statt nur Toast — das macht den Überlebensdruck fühlbar.
- **Endscreen-Rückblick:** Der Run wird als 5–7 Zeilen Chronik zusammengefasst („Du hast im Mai 2021 verkauft. Du hast im Winter durchgehalten.“) — teilbar und emotional.

## 3. Pacing: nichts überschlägt sich mehr

- **Popup-Budget:** Pro Monat maximal eine feste Zahl unterbrechender Karten (Standard 2). Alles darüber wird nicht verschluckt, sondern gesammelt.
- **Mindestabstand:** Zwischen zwei Karten immer eine spürbare Pause, damit nie zwei Fenster hintereinander aufblitzen.
- **Monats-Briefing:** Nachrichten, neue Coins und kleine Ereignisse landen in einem kompakten Briefing am Monatsanfang (eine Karte, Liste, ein Klick) statt in fünf einzelnen Popups. Wichtige Entscheidungen bleiben eigenständig.
- **Ruhig-Modus:** Umschalter in den Settings — `STORY` (Kapitel + Briefings, wenige Unterbrechungen) vs. `DEGEN` (aktuelle Dichte). Standard ist STORY.
- **Kein Zeitdruck-Zwang:** Decisions haben keinen versteckten Timer; das Spiel bleibt pausiert, bis entschieden ist.

## 4. Was dem Game als Game noch fehlt (Empfehlung, in diesem Schritt umgesetzt)

- **Kapitelziel pro Akt** („überlebe 2022 mit über $50k“) — gibt jedem Abschnitt einen Zweck statt nur Monatsklicken.
- **Rivale:** ein NPC-Degen mit eigenem Depot, dessen Net Worth im HUD mitläuft. Sofortiger Vergleichsdruck, der sich viral gut teilen lässt.
- **Streak/Momentum:** Belohnung für mehrere gute Entscheidungen in Folge, sichtbar als kleiner Momentum-Indikator.

Nicht angetastet: Preise, XP-Formeln, Perp-Mathematik, Leaderboard, Layout des Twin-Desk-Terminals.

## Technische Notizen
- Neue `<style>`-Sektion `v10-cards`: gemeinsame `.pcard`-Basis für `.event-card`, `.presale-result`, `.decision-card`; `.popup-logo` wird ersetzt durch `.pcard-sigil`.
- `_showDecisionNow()` baut das neue Markup (Chip, Datum, Absender, Optionszeilen mit Meta-Chips aus `opt.cash`/`opt.risk`/`opt.xp`).
- Neuer `STORY`-Layer: `ACTS`-Tabelle (Monatsbereich, Titel, Zeitgeist, Ziel), `SENDERS`-Tabelle, `state.flags` für Konsequenz-Marker, `state.chronicle[]` für den Endscreen-Rückblick.
- Pacing im `PQ`: `PQ.monthBudget`, `PQ.lastShown`, Mindestabstand im `pqPump()`; überzählige Items fließen in `state.briefing[]` und werden über eine Briefing-Karte in `nextMonth()` ausgegeben.
- Rivale + Momentum als reine Anzeige-Werte im HUD, ohne Eingriff in die Preislogik.
- Prüfung per Playwright-Screenshots: Decision-, Event-, Presale-, Kapitel- und Briefing-Karte in Laptop-, Tablet- und Handybreite; scrollfrei, kein Überlauf.