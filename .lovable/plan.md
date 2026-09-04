# Das Terminal aufräumen: alles drin, endlich verständlich

Ich habe das Spiel am Handy (390×844) durchgeklickt. Der erste Bildschirm nach dem Start zeigt gleichzeitig: eine Erklär-Karte (1/3), zwei schwebende Sprechblasen, einen Boss-Auftrag-Chip, eine Reiterleiste, winzige Coin-Kacheln und die untere Leiste. Fünf Ebenen auf einmal, keine sagt, was man tun soll. Genau das ist die Katastrophe, die du beschreibst — nicht zu wenig Inhalt, sondern kein Vordergrund.

Alle Funktionen bleiben. Nichts wird gelöscht. Sie bekommen einen festen Platz, große Beschriftungen und eine Reihenfolge.

## 1. Eine feste Ordnung am Handy

Immer derselbe Aufbau, egal in welchem Monat:

```text
KOPF        Net Worth (groß)  ·  Monat 7 / 84  ·  Ton  ·  Beenden
POSITION    ETH 2x LONG   +$412 (+8,2%)   Liq in 14%   [ CLOSE ]
BÜHNE       genau eine Zone: MARKT | CHART | POSITIONEN
AUFTRAG     eine Zeile: was der Boss diesen Monat will
LEISTE      MARKT · CHART · POSITIONEN · MEHR · NEXT MONTH
```

- **Die Positionszeile ist immer da**, direkt unter dem Net Worth: offene Position, Gewinn/Verlust live, Abstand zur Liquidation, ein Knopf zum Schließen. Mehrere Positionen → durchwischbar mit Punkten, Zähler „1/3". Kein Suchen mehr.
- Nur **eine** Bühne gleichzeitig. Kein Stapeln, kein Nebeneinander von Chart und Markt auf 390 px.
- Nichts überlagert die Bühne dauerhaft: der Boss-Auftrag wird eine ruhige Zeile im Fuß statt ein schwebender Chip.

## 2. Nur eine Sache spricht dich gleichzeitig an

- **Eine Warteschlange für alles**, was Aufmerksamkeit will: Erklär-Karte, Story-Karte, Toast, Boss-Kommentar. Es erscheint immer nur eines. Ist ein Fenster offen, wartet der Rest.
- Die drei Einstiegs-Erklär-Karten fallen weg. Stattdessen wird beim ersten Run **direkt am Element** gezeigt, was zu tun ist: ein Pfeil an einer Coin-Kachel („tippen = kaufen"), danach einer auf NEXT MONTH. Zwei Hinweise, je ein Satz, danach nie wieder.
- Toasts sammeln sich am unteren Rand über der Leiste, maximal einer sichtbar, verschwinden von selbst.

## 3. Alles größer und benannt

- Coin-Kacheln: großes Logo, Name, Preis in klarer Mono-Schrift, Monatsänderung als farbiger Chip, **zwei pro Reihe** statt vier winziger. Besitz wird direkt auf der Kachel angezeigt („du hast 0,4 ETH").
- Mindestens 44 px für jede Tippfläche, Schriftgrößen mindestens 15 px, keine Grau-auf-Grau-Beschriftungen mehr.
- Jeder Fachbegriff bekommt eine Klartextzeile darunter: „Leverage 10× = zehnfacher Einsatz, zehnfaches Risiko", „Liquidation = Position wird zwangsverkauft".
- Alle Fenster im gleichen Rahmen: Titel oben, Inhalt scrollt innen, **Hauptknopf immer sichtbar unten**. Wischen nach unten schließt.

## 4. Perps so einfach wie Kaufen

Heute der schlimmste Weg. Neu:

- Vom Chart und von jeder Coin-Kachel führt ein Knopf **LONG / SHORT** direkt ins Perp-Fenster für genau diesen Coin — kein Umweg über Degen Ops.
- Im Fenster nur vier Dinge: Richtung, Hebel als Chips (2×/5×/10×/25×/50×), Einsatz als Chips (25 %/50 %/MAX), und eine große Vorschau: „Liquidation bei $2.840 — das sind −18 % von hier".
- Bestätigen → die Position steht sofort in der immer sichtbaren Zeile oben. Der Weg von „ich will traden" bis „ich sehe mein Ergebnis" ist damit zwei Tipps lang.

## 5. MEHR: alles an einem Ort

Launchpad, Airdrops, Degen Ops, Business, Shop, Trophies, Quests und Ledger kommen in **ein** Fenster „MEHR" als großes Kachelraster — jede Kachel mit Symbol, Name, einer Erklärzeile und einem Zähler, wenn dort etwas zu tun ist. Nichts verschwindet, nichts liegt mehr in einer versteckten Reiterleiste.

Die untere Leiste trägt einen Punkt, wenn in MEHR etwas Neues wartet.

## 6. Desktop

Gleiche Ordnung, nur breiter: links Markt, Mitte Chart mit Einstiegs- und Liquidationslinie, rechts Positionen und Auftrag, unten NEXT MONTH. Ein Bildschirm, kein Scrollen, dieselben Fenster wie am Handy.

## 7. Trotzdem wie ein virales Game

- Schwarz, Acid-Grün, Gold bleiben; große schwere Schrift, klare Kanten.
- Gewinn/Verlust wird groß quittiert: Zahlen zählen hoch, Grün pulst, Liquidation schüttelt den Bildschirm einmal, Boss kommentiert mit einem Satz.
- Bei starken Momenten (Liquidation, 10×, Monat 12/36/84) eine Boss-Karte mit „SAVE IMAGE" zum Teilen.

## Abnahme

Playwright bei 390×844, 414×896, 430×932, 768×1024 und 1280×800:
nie mehr als ein Overlay gleichzeitig, Positionszeile in jeder Ansicht sichtbar, Perp in zwei Tipps eröffnet und danach ohne Suchen sichtbar, jede Tippfläche ≥ 44 px, kein horizontales Scrollen, NEXT MONTH immer erreichbar, keine Konsolenfehler. Dazu ein Durchlauf über 12 Monate ohne Klemmer.

## Technische Notizen

Alles in `public/game.html`:
- Neuer Layer `<style id="v29-shell">` als **einzige** Layout-Quelle für Handy und Desktop; die Layout-Teile aus `v17`/`v22`/`v23`/`v28` werden entfernt statt überschrieben (Ziel: unter 30 `!important` statt der heutigen Sammlung).
- Neue Positionsleiste `#v29-pos` direkt unter dem HUD, gespeist aus dem bestehenden Positions-/Perp-State, Aktualisierung im vorhandenen `tick()`.
- Ein `attention()`-Manager ersetzt das parallele Anzeigen von Coach-Marks, `pqEnqueue`-Karten, Toasts und Boss-Chip; Boss-Order wird zur Fußzeile.
- Dock auf fünf Einträge (`market`, `chart`, `positions`, `more`, `month`); `v17Open('perp')` bekommt einen Coin-Parameter für den Direkteinstieg von Kachel und Chart.
- „MEHR"-Sheet bündelt die bestehenden Section-Aufrufe, keine neue Logik.
- Coach-Marks als zwei Element-Bubbles mit `localStorage`-Flag.
- Unberührt: historische Preise 2020–2026, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Story-Kapitel, Startscreen (V27), Endkarte (V26).
