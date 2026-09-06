# V40 — Echter Terminal-Neubau statt weiterer Designschicht

## Ausgangslage

Die Kritik ist berechtigt und technisch bestätigt: `game.html` enthält inzwischen **45 Style-Blöcke und 1.049 `!important`-Regeln**. V39 hat überwiegend vorhandene Kästen umgefärbt und die alte V17-Dock-Struktur weiterverwendet. Dadurch wurden weder die versprochene Markt-Bühne noch das Gameplay-Gefühl der ausgewählten blauen Tactical-Command-Deck-Karten erreicht.

## Zielbild

Das laufende Spiel bekommt eine **neu gebaute, blaue Tactical-Command-Deck-Oberfläche**. Keine weitere Schicht über dem alten Terminal: Die bestehenden Berechnungen, historischen Kurse, Trades, Perps, XP, Survival, Story und Leaderboard bleiben als Spielmotor erhalten, aber die sichtbare Spieloberfläche wird ersetzt.

```text
PHONE
┌ Boss / Kapitel ───────── Monat ┐
├ NET WORTH ───── Streak / XP ───┤
├ Monatsauftrag + Belohnung ─────┤
│                                │
│ AKTIVE SPIELBÜHNE              │
│ großer Coin / Chart / Position │
│ direkte Buy · Sell · Long      │
│ sichtbare Kursreaktion         │
│                                │
├ Survival + Monatsresultat ─────┤
└ Market · Chart · MONTH · Pos · Ops ┘
```

## 1. Alte Terminal-Hülle wirklich ablösen

- Die alten sichtbaren V17/V23/V29/V30/V31/V39-Terminalaufbauten werden nicht weiter übersteuert, sondern für den aktiven Run aus dem Darstellungsfluss entfernt.
- Eine neue V40-Hülle erhält eigene eindeutige Bereiche für Kopf, Mission, Bühne, Aktionen, Resultat und Navigation.
- Vorhandene Spielaktionen werden an die neue Hülle angeschlossen; es entstehen keine doppelten Listen, Buttons oder versteckten Altflächen.
- Alte Regeln, die nur das laufende Terminal betreffen, werden konsolidiert oder deaktiviert. Ziel ist eine kontrollierbare Terminal-Darstellung statt weiterer `!important`-Kaskaden.

## 2. Die ausgewählte blaue Designkarte exakt übersetzen

- Marineblaue, physisch wirkende Command-Deck-Flächen mit Cyan-Lichtkanten; Gold nur für Boss, Net Worth und Belohnungen.
- Archivo Black für starke Spielbegriffe, Hind für Bedienung, tabellarische Ziffern für Kurse und P&L.
- Asymmetrische Komposition statt gleichförmiger Kartenliste: eine dominante Bühne, kleinere taktische Instrumente und klare Tiefe.
- Neue, einheitliche SVG-Symbole, stärkere aktive Zustände und moderne Buttons wie in der Vorschau — nicht nur andere Farben auf den alten Elementen.
- Gorilla-Boss als sichtbarer Missionsgeber mit wechselnder Reaktion, nicht als kleines dekoratives Avatarbild.

## 3. Gameplay im Terminal neu inszenieren

- Jeder Monat beginnt mit einem klaren **Boss-Auftrag** samt Einsatz und Belohnung.
- Der gewählte Markt wird zur Hauptfigur: großer Coin, Bewegung, Bestand, P&L und direkte Aktionen stehen gemeinsam auf der Bühne.
- Kaufen, Verkaufen, Long und Short geben unmittelbar sichtbares Feedback auf derselben Bühne; wichtige Folgen verschwinden nicht in kleinen Meldungen.
- Der 30-Tage-/Timing-Ablauf, Streak, Kapitel-Fortschritt und Monatsresultat werden als zusammenhängender Spiel-Loop sichtbar.
- Markt, Chart und Positionen sind unterschiedliche Zustände derselben Bühne, nicht drei alte Panels, zwischen denen die Seite springt.
- Sekundärsysteme wie Launchpad, Airdrops, Business, Shop und Trophäen liegen gebündelt unter `OPS`, ohne die Hauptaktion zu verdrängen.

## 4. Handy zuerst, Desktop aus derselben Struktur

- Die Handyansicht bei 375×677 ist die primäre Spielfläche: entscheidende Aktion, Auftrag, Survival und Navigation bleiben ohne Suche erreichbar.
- Die feste Leiste wird als neuer Bestandteil der V40-Hülle gebaut, nicht nachträglich über den alten Inhalt gelegt; kein Blur, Transform oder Neuberechnen beim Scrollen.
- Desktop nutzt dieselben Bausteine als breiteres Command Deck: große zentrale Bühne, Markt-Tape links, Positionen/Ops rechts — ohne wieder in viele gleichwertige Kästen zu zerfallen.
- Popups für Trade, Perps und OPS übernehmen dieselbe Designsprache und besitzen einen klaren festen Abschlussbereich.

## 5. Schutz der laufenden Spielversion

- Vor dem Umbau werden alle bestehenden Aktionswege inventarisiert und als Funktions-Check festgehalten.
- Unverändert bleiben: historische Preisreihen 2020–2026, XP- und Modusmultiplikatoren, Kosten/Emissionen, Perp- und Liquidationsmathematik, Save-State, Leaderboard und Endscreen.
- Der Neubau erfolgt in klar getrennten Schritten: neue Hülle, Datenbindung, Aktionen, Altflächen entfernen, visuelle Abnahme.

## Abnahme

- Direkter Vorher/Nachher-Vergleich mit der ausgewählten blauen Tactical-Command-Deck-Vorschau; keine Freigabe nur aufgrund einer Farbänderung.
- Aufnahmen bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Tests für Buy, Sell, acht Perp-Märkte, Long, Short, Position schließen, EAT, CALM, Timing-Moment, Monatswechsel, OPS und zwölf schnelle Monate.
- Keine doppelten Terminalelemente, kein horizontales Scrollen, kein Flackern, keine abgeschnittenen Texte und keine Konsolenfehler.
- Auf dem ersten Handybildschirm sind Boss-Auftrag, Hauptmarkt, mindestens eine echte Spielaktion und die Command Rail gleichzeitig erkennbar.
