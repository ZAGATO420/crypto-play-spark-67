# Cyber-Survival HUD: Grafik, Sound und Spielgefühl

## Ziel
Das bestehende Spiel wird zu einer dichten, mobilen Crypto-Survival-Arena. Spieler sollen innerhalb weniger Sekunden erkennen, was gerade passiert, wie gefährlich die Lage ist und welche Aktion jetzt zählt. Historische Preise, P&L-, Steuer- und Boss-Score-Formeln sowie Turnier-Seed, Bedingungen und Ranglistenlogik bleiben unverändert.

## Umsetzung

### 1. Spielfeld neu ordnen
- Die 84-Monats-Reise als feste, gut lesbare Spannungsachse oben behalten und Marktphasen deutlicher markieren.
- Net Worth, Boss-Abstand, Cash, Stress und Hunger zu einem kompakten HUD zusammenführen.
- Marktchart, offene Position und wichtigste Entscheidung in den visuellen Mittelpunkt stellen.
- Boss aus der kleinen Seitenkarte lösen und als reaktive Präsenz in die Arena integrieren.
- Nebenaktionen in eine kompakte Werkzeugleiste verschieben; die wichtigste Aktion bleibt groß und eindeutig.
- Desktop nutzt denselben Fokus mit mehr Breite, Mobilgeräte erhalten eine dichte Ein-Spalten-Kommandofläche ohne horizontales Scrollen.

### 2. Animierte Marktgrafik und Ereignisreaktionen
- Den Chart mit laufendem Kurszeiger, Marktimpulsen, Entry-Linie, P&L-Zone und klaren Crash-/Pump-Zuständen ausbauen.
- Gewinne mit kurzem Einschlag, aufsteigenden Zahlen und positiver Lichtreaktion darstellen.
- Verluste, Liquidationsgefahr und Crashs mit kurzem kontrolliertem Shake, rotem Impuls und Boss-Reaktion inszenieren.
- Stress, Hunger, Risiko und Boss-Vorsprung sichtbar auf kritische Schwellen reagieren lassen.
- Aktwechsel und historische Schlüsselereignisse mit den vorhandenen 2020–2026-Szenen als kurze Full-Bleed-Sequenzen zeigen.
- Keine dauernden Flacker- oder Scanline-Effekte; Animationen bleiben kurz, performant und respektieren „Bewegung reduzieren“.

### 3. Sound als spielerisches Feedback
- Die vorhandenen Hip-Hop-Loops zu drei hörbar unterschiedlichen Marktstimmungen erweitern: Aufbau, Euphorie und Gefahr/Crash.
- Saubere Übergänge zwischen den Stimmungen statt Neustarts oder abruptem Abbruch.
- Präzise SFX-Zuordnung für Kauf, Verkauf, Boss-Angriff, Treffer, Gewinn, Verlust, kritischen Status, Quartalswechsel und Level-up.
- Wichtige Ereignisse erhalten kurze Audio-Layer aus Impact und UI-Bestätigung, ohne Lärm oder verzerrte Geräusche.
- Sound startet weiterhin erst nach der ersten erlaubten Berührung, bleibt danach stabil und verwendet die gespeicherten Lautstärken.

### 4. Mehr Spannung ohne neue Zahlenlogik
- Vor jeder Hauptentscheidung eine kurze visuelle Gefahr-/Chance-Lage zeigen.
- Boss-Kommentare und Bildzustand direkt auf Risiko, Vorsprung, Streak und kritische Überlebenswerte reagieren lassen.
- Die letzten Sekunden eines Quartals, bevorstehende Krisen und knappe Boss-Duelle klar eskalieren.
- Ergebniswechsel sofort verständlich machen: Was kam herein, was ging hinaus, warum änderte sich der Run?
- Erfolgsserien, Near Misses und Rettungen emotional belohnen, ohne Belohnungen oder Score zu verändern.

### 5. Technische und visuelle Abnahme
- Start, erste Minute, alle sechs Spielphasen, Aktwechsel, Crash, Bosskampf, Minigame und Endscreen prüfen.
- Sound-Unlock, Mute, Lautstärken, Tab-Wechsel und Wiederaufnahme testen.
- Sichtprüfung auf 393×852, 430×932 und 1440×900: keine Überlagerung, kein abgeschnittener Text, kein seitliches Scrollen.
- Performance prüfen: keine wiederkehrenden Voll-Render-Schleifen und kein Kartenflackern.
- Browser-Konsole, Laufzeitfehler und Build prüfen.

## Technische Leitplanken
- Schwerpunkt der Änderungen: `src/game/CryptoJourney.tsx`, `src/game/audio.ts` und `src/styles.css`.
- Bestehende Bilder und Audio-Dateien werden weiterverwendet; neue Medien nur, wenn eine klar fehlende Spielsituation sie benötigt.
- Keine Änderungen an historischen Marktdaten, Cashflows, P&L, Steuern, Boss-Score, Turnierbedingungen, Seed, Wallet-Datenschutz oder Gewinnerermittlung.
