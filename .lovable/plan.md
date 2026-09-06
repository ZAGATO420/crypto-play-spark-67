# V40.1 — Knöpfe reparieren, Karten vereinheitlichen, Boss-Gefühl

## Was ich gefunden habe (im Browser nachgestellt)

Ich habe das Spiel im laufenden Zustand getestet: Coin-Auswahl und die untere Navigation reagieren, aber **BUY, SELL, PERP, MONTH und OPS reagieren nachweisbar nicht** — `state.month` bleibt 0, das Handelsfenster wird gar nicht erst erzeugt.

Ursache: Beim Wechsel der Ansicht wird eine Markierung auf dem Seitenkörper gesetzt. Die Klick-Auswertung sucht nach dieser Markierung "irgendwo oberhalb" des geklickten Knopfs — und findet sie deshalb bei **jedem** Klick. Jeder Aktionsknopf wird dadurch als reiner Ansichtswechsel behandelt und die eigentliche Aktion nie ausgelöst. Direkt aufgerufen funktionieren Kaufen, Verkaufen, Perp und Monatswechsel einwandfrei — es ist reine Verdrahtung, keine Spiellogik.

## 1. Alle Aktionen wieder scharf schalten

- Die Klick-Auswertung wird eindeutig gemacht, damit Ansichtswechsel und Aktion sich nicht mehr überlagern.
- BUY und SELL öffnen das Handelsfenster im richtigen Modus für den gerade gewählten Coin.
- PERP öffnet den Perp-Desk mit genau diesem Coin, nicht mit einer festen Vorauswahl.
- MONTH löst den Monatswechsel aus, OPS öffnet die Nebensysteme.
- EAT und CALM, Positionen schließen und die Coin-Auswahl bleiben ebenfalls geprüft.
- Fehler werden nicht länger stillschweigend verschluckt: schlägt eine Aktion fehl, ist das im Test sichtbar.

## 2. Coin-Logos statt Buchstaben

- Die Markt-Liste, die Coin-Bühne und die Positionen erhalten die echten Coin-Logos (bereits im Projekt vorhanden); Buchstabenkreise bleiben nur als Rückfall für Coins ohne Logo.
- Logo, Symbol, Preis und Monatsbewegung stehen in einer sauberen Zeile, auch bei 375 px Breite.

## 3. Alle Karten in einer Sprache

- Entscheidungskarten, Ereigniskarten, Story-Karten, Handelsfenster, Perp-Desk, OPS, Shop und Monatsresultat bekommen dieselbe Command-Deck-Optik wie die neue Oberfläche: Marineblau, präzise Kanten, klare Kopf-/Fußzone, ein fest sichtbarer Bestätigen-Bereich.
- Die alten violett/grauen Kartenstile werden dabei ersetzt, nicht überlagert.
- Karten sind auf dem Handy immer vollständig lesbar und bis zum letzten Knopf scrollbar.

## 4. Neon-Akzent wie auf dem Startbild

- Das Acid-/Neongelb vom Startbild kommt als Aktionsfarbe zurück: Hauptaktion, MONTH, Belohnungen und Bestätigungen.
- Cyan bleibt für Navigation und Auswahl, Gold für Kontostand und Boss, Grün/Rot ausschließlich für Gewinn/Verlust.
- Sichtbares Trefferfeedback: Kauf, Verkauf, Liquidation und Monatswechsel lösen kurze, ruhige Reaktionen an genau der Stelle aus, an der die Zahl sich ändert.

## 5. Boss-Gefühl

- Der Boss wird groß und reaktiv: Ausdruck wechselt je nach Lage (Gewinn, Verlust, Liquidation, Streak) über die vorhandenen Boss-Bilder.
- Jeder Monat startet mit einem klar formulierten Boss-Auftrag samt Belohnung; am Monatsende sagt der Boss sichtbar, ob du bestanden hast.
- Streak, Kapitel und Rang werden als Boss-Fortschritt erzählt statt als kleine Randnotiz.

## Abnahme

- Klicktest bei 375×677, 390×844, 430×932, 768×1024 und 1280×800 für: Coin wählen, BUY, SELL, PERP (Long und Short), Position schließen, EAT, CALM, MONTH, OPS.
- Zwölf Monate am Stück: Zahlen laufen, Karten erscheinen einzeln, kein Klick bleibt ohne Reaktion.
- Alle Coin-Logos sichtbar, keine abgeschnittenen Karten, kein horizontales Scrollen, keine Konsolenfehler.

## Technische Notizen

Alles in `public/game.html`, Spielmotor unverändert:
- Klick-Delegation in `v40-terminal-rebuild-js`: `closest('[data-v40-view]')` trifft wegen `document.body.setAttribute('data-v40-view',…)` immer zu — Reihenfolge und Selektoren werden eindeutig (Aktion zuerst, Ansicht nur auf `.v40-nav`), Body-Attribut umbenannt.
- Aktionen: `window.v6Trade(sym)` + `window.v6Mode(mode)`, `window.v6Perp(sym)` statt nicht passender Perp-Einstieg, `advanceMonth()`, `v17Sections()`, `buyItem()`.
- Logos aus `window.COIN_ICON` (`/coin-icons.js`) mit Buchstaben-Fallback.
- Karten: `.decision-card` / `.event-card` / `.story-card` / `#v6m` / `.v6c` / Perp-Desk auf V40-Tokens umstellen, widersprechende Altregeln aus den früheren Layern entfernen statt weiter überschreiben.
- Boss-Bilder aus `src/assets/boss/*` bzw. den bestehenden öffentlichen Motiven.
- Unberührt: historische Preise, Perp-/Liquidationsmathematik, XP, Survival, Save-State, Leaderboard, Endscreen.
