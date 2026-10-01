# Turnier-Absicherung: Serverseitige Nachprüfung der Runs

## Ziel

Turnier-Einträge (preisgeldberechtigt) dürfen nicht mehr nur „plausibel" sein, sondern müssen vom Server nachgerechnet werden. Wer die Zahlen fälscht, fliegt raus — ehrliche Spieler behalten ihren Platz.

## Ausgangslage

- Turnier-Runs sind deterministisch: gleiche Season + gleicher Seed = gleiche Crashes, Rugs und Boss-Angriffe für alle.
- Heute schickt der Client nur das Endergebnis (Vermögen, XP, Score). Der Server prüft grobe Obergrenzen und kappt den Score, rechnet aber nicht nach.
- Lücke: Ein gefälschtes Ergebnis innerhalb der Obergrenzen landet ungeprüft im Preisgeld-Ranking.

## Umsetzung

### 1. Run-Protokoll im Client

- Während eines Turnier-Runs schreibt das Spiel ein kompaktes Protokoll mit: je Quartal die Aktionen (Trade eröffnet/geschlossen mit Symbol, Hebel, Größe; Minigame-Ergebnis; Relikt-Wahl; Presale-Teilnahme).
- Das Protokoll ist klein (ein Run = ~28 Quartale, wenige Einträge pro Quartal) und wird beim Einreichen mitgeschickt.

### 2. Server-Replay

- Neue Prüf-Logik auf dem Server (in der Leaderboard-API): Der Server nimmt Season-Seed + Protokoll und spielt den Run mit denselben historischen Kursen und derselben deterministischen Zufallslogik nach.
- Ergebnis-Vergleich mit Toleranz (Rundung): Stimmen Endvermögen, XP und Score mit dem gemeldeten Ergebnis überein, wird der Eintrag als Turnier-Run akzeptiert.
- Abweichung → der Run wird nur als freier Run (ohne Preisgeld, ohne Season-Ranking) gespeichert oder abgelehnt.

### 3. Freie Runs bleiben unverändert

- Normale Runs ohne Turnier-Flag laufen weiter wie bisher (Plausibilitätsgrenzen genügen, kein Preisgeld im Spiel).

### 4. Bestehende Einträge

- Alte Turnier-Einträge ohne Protokoll bleiben sichtbar, werden aber für künftige Preisgeld-Monate nicht mehr als verifiziert markiert. Neue Season, neue Regeln.

## Technische Details

- Dateien: `src/game/CryptoJourney.tsx` (Protokoll mitschreiben), `src/game/leaderboard.ts` (Payload erweitern), `src/routes/api/public/leaderboard.ts` (Replay + Vergleich), Replay-Logik nutzt vorhandene Module `src/game/rng.ts`, `src/game/journey-data.ts` (Kurse, Seed).
- Kein Datenbank-Schema-Umbau nötig: Protokoll kommt als JSONB-Spalte `run_log` in `leaderboard_runs` (eine kleine Migration mit GRANTs).
- Verifizierungs-Status als boolesche Spalte `verified`; Preisgeld-Ranking (Season-Ansicht) zeigt nur verifizierte Runs.
- Keine Änderung an Spielbalancierung, Kursen, Seeds oder Score-Formel.

## Prüfung

- Echten Turnier-Run durchspielen → Eintrag wird verifiziert akzeptiert.
- Manipuliertes Ergebnis (Vermögen händisch erhöht) → wird erkannt und nicht ins Preisgeld-Ranking übernommen.
- `bunx tsgo --noEmit` fehlerfrei, Playwright-Flusstest auf Handy-Größe.
