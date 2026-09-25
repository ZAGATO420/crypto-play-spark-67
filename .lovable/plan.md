# Arcade-Hype-Pass: God Candle, Liquidation Shock und Instant Feedback

## Ziel
Jeder entscheidende Gewinn oder Fehler soll sich sofort wie ein hochwertiger Arcade-Moment anfühlen. Historische Preise, P&L-, Steuer-, Boss-Score-, Turnier- und Leaderboard-Logik bleiben unverändert.

## Umsetzung

### 1. God-Candle-Moment
- Bei einem perfekten Minigame oder einer echten Auszahlung ab 10× startet eine kurze Full-Screen-Sequenz.
- Goldene Laser, fallende Candlesticks, ein aufsteigender Multiplikator und ein klarer Gewinnbetrag zeigen sofort, warum der Moment besonders ist.
- Eine kurze Sieges-Fanfare und ein sauberer Kassen-/Coin-Akzent ersetzen überlagerte Einzelsounds.
- Der Effekt verschwindet automatisch und blockiert die nächste Aktion nicht unnötig.

### 2. Liquidation Shock
- Jede echte Liquidation erhält roten Sirenen-Blitz, Glasbruch-Overlay, kurzen kontrollierten Screen-Impact und einen Boss-Spott.
- Die Szene nennt Coin, Hebel und verlorene Margin in Klartext.
- Der bestehende Crash-/Bass-Sound wird als einzelner dominanter Cue gespielt, ohne Tonstapel.
- Der Effekt verändert weder Liquidationsberechnung noch Ergebnis.

### 3. Instant Pacing und Game Juice
- Gewinn-/Verlustwerte rollen flüssig hoch und pulsen kurz in der passenden Farbe.
- Hauptaktionen erhalten schnellere Druck-/Trefferreaktionen und klarere Neon-Akzente in Cyber-Cyan, Hot Pink, Toxic Green und Gold.
- Sehr dezente animierte CRT-Scanlines bleiben hinter den Inhalten und respektieren „Bewegung reduzieren“.
- Feedback-Zeiten werden so abgestimmt, dass keine Wartezeit zwischen Entscheidung und Ergebnis entsteht.

### 4. Abnahme
- God Candle über perfekten Skill-Treffer und 10×-Auszahlung prüfen.
- Liquidation Shock über eine reale gehebelte Liquidation prüfen.
- Smartphone und Desktop auf Überlagerungen, Lesbarkeit, Scrollen, Sound-Dopplung und Laufzeitfehler prüfen.
- Abschließend je einen Screenshot der God-Candle-Explosion und der Liquidations-Schock-Szene erstellen.

## Technische Leitplanken
- Schwerpunkt: `src/game/CryptoJourney.tsx`, `src/game/audio.ts`, `src/styles.css`.
- Effekte sind rein präsentational; historische Marktdaten, Geldflüsse, P&L, Steuern, Boss-Score, Turnierbedingungen, Seed und Gewinnerermittlung bleiben unverändert.
- Bestehende Audio-Dateien werden als priorisierte Einzel-Cues verwendet; keine gleichzeitig konkurrierenden Effektstapel.
