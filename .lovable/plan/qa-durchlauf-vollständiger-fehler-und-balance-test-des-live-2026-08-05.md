# QA-Durchlauf: Vollständiger Fehler- und Balance-Test des Live-Games

Ziel: Jede benutzbare Option in jedem Modus automatisiert durchspielen, harte Fehler (NaN, negative Werte, kaputte Aktionen) finden und falsche Werte/Preise nachweisen — mit Beweis, nicht mit Vermutung.

## 1. Test-Harness (Playwright, headless, gegen die laufende App)

Ein Skript, das das Spiel viele Male vollständig durchspielt und nach jedem Monat den kompletten Spielzustand als JSON abzieht. Jeder Verstoß wird mit Monat, Modus und Aktion protokolliert.

Abgedeckte Matrix:
- Alle Archetypen (jeder Startzustand)
- Alle Schwierigkeitsstufen inkl. Ironman
- Beide Preis-Modi (historisch / simuliert)
- Mehrere Länder (unterschiedliche Steuersätze)
- Je Kombination mehrere Durchläufe bis Monat 84 (Spielende)

## 2. Invarianten, die in jedem Monat geprüft werden

- Keine NaN / undefined / Infinity in Cash, Holdings, Avg-Preisen, Net Worth, XP, Stress, Score
- Cash nie negativ, Holdings nie negativ, Net Worth = Cash + Positionswert + Perp-Equity (Abweichung > 1 $ = Bug)
- Fees und Steuern: Verkaufsbetrag, Fee und Steuer müssen exakt zur Cash-Änderung passen
- Durchschnittspreis (Avg) korrekt nach Teilkäufen und Teilverkäufen
- Preis nie 0 oder negativ für gelistete Coins; Coins vor ihrem Launch-Monat nirgends handelbar (auch nicht über Perps, Presales, Decisions)
- XP und Level monoton, kein Level-Sprung ohne XP, Level-Cap sauber
- Inflation, Lebenskosten und Jahresend-Steuer plausibel und nicht doppelt abgerechnet
- Keine Konsolen-Errors während des gesamten Durchlaufs

## 3. Preis-Wahrheitsprüfung (historische Kurse)

Die hinterlegten Monatspreise 2020–2026 werden gegen echte historische Referenzwerte (Monats-Close pro Coin) abgeglichen. Ausgabe: Tabelle mit Abweichung in Prozent; alles über einer Toleranzschwelle gilt als falscher Preis und wird gemeldet. Ebenfalls geprüft: Launch-Monate (kein Coin vor seiner echten Existenz), Bear-Phasen 2022/2025 und die großen Crash-Monate.

## 4. Feature-für-Feature-Funktionstest

Jede Interaktion gezielt ausgelöst und das Ergebnis verifiziert:
- Markt: Buy/Sell, Slider-Grenzen, ±25%-Buttons, Filter (TOP/MEME/HOLD/PERPS), Max-Buy/Max-Sell
- Perp Desk: alle Hebel 2x–50x, Long/Short, Margin/Size/Funding, Liquidationsdistanz-Balken (Startwert korrekt?), Live-Liquidation, Limit von 3 Positionen, Schließen mit Gewinn und mit Verlust
- Airdrop-Farms, Launchpad-Tiers und Presales (Win/Rug-Raten gegen erwartete Wahrscheinlichkeit gemessen)
- Decisions und Historical Quests: jede Option einmal, inkl. „broke"-Pfad und Notverkauf
- Shop, Businesses, Upgrades: Preis, Effekt tatsächlich wirksam, kein Doppelkauf
- Survival: Eat/Therapy, Stress-Grenzen, Game-Over-Bedingungen
- Minigames und Side-Quest-Tickets: Kontingent und Auszahlung
- Endscreen und Leaderboard-Submit: Score-Formel, Validierung, Sonderzeichen im Namen
- Mobile-Ansicht: alle Tabs erreichbar, Buttons klickbar, HUD sichtbar

## 5. Balance- und Spannungsmessung

Aus den Durchläufen: Überlebensrate pro Schwierigkeit, Median-Net-Worth-Kurve, Anteil der Runs mit Liquidation oder Game Over, Häufigkeit jedes Events. Ergebnis: belastbare Aussage mit Zahlen, ob eine Stufe zu leicht oder zu hart ist.

## 6. Ergebnis

Bug-Report nach Schweregrad (Blocker / falscher Wert / Balance / Kosmetik) mit Reproduktionsschritten. Danach fixe ich in derselben Runde alle Blocker und falschen Werte in `public/game.html` und lasse die Matrix zur Bestätigung erneut laufen. Balance-Änderungen zeige ich dir vorher als Zahlen, damit du entscheidest.

## Technische Notiz

Testskripte liegen unter `/tmp/browser/qa/` und verändern das Projekt nicht. Am Spiel selbst wird nur `public/game.html` angefasst — reine Logik- und Wertfixes, keine Neugestaltung.