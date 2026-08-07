# Rang-Anzeige verständlich machen

## Was aktuell passiert
Das Feld "RANK #15" in der SEASON STATUS-Karte ist keine Startstufe, sondern deine **live geschätzte Position im globalen Leaderboard**. Der Score ist Net Worth + XP x 10 + Monate x 500 + Achievements x 250. Beim Start hast du fast keinen Score, deshalb stehen alle bereits eingetragenen Runs über dir — bei 14 besseren Einträgen ergibt das #15.

Das ist kein Fehler, aber es liest sich wie ein zufälliger Startwert.

## Änderung
- Frühphase (Monat 0-2): statt einer Zahl steht dort **"RANK — PLAY TO QUALIFY"**. Kein irritierender Startrang.
- Ab Monat 3: **"LIVE RANK #15 / 40"** — Position plus Feldgrösse, damit die Zahl Kontext hat.
- Kleiner Hinweis (Tooltip / Untertitel): "Live-Schätzung gegen alle Runs im globalen Leaderboard".
- Bewegt sich der Rang nach oben, blinkt die Zahl kurz gold auf — so wird sichtbar, dass sie sich durch Spielen verbessert.
- Kein Leaderboard-Cache vorhanden: weiterhin "UNRANKED".

## Technische Notizen
Alles in `public/game.html`:
- `renderSeason()`: Textaufbau für `#v4-rank` um Feldgrösse (`globalLeaderboardCache.length`) und die Monat-3-Schwelle erweitern.
- Letzten Rang in `state._lastRank` merken, um die Aufwärts-Animation zu triggern (CSS-Klasse `.rank-up`).
- Berechnung in `projectedRank()` / `myScore()` bleibt unverändert.
