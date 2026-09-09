# Monatlicher TCFB-Wettbewerb

Jeden Monat läuft eine große Wettbewerbs-Saison. Alle Teilnehmer einer Saison spielen exakt denselben Markt-Zufall (gleiche Crashs, Launches, Rugs, Minispiele), damit nur Können zählt. Am Monatsende gewinnen die drei besten Boss Scores TCFB-Token nach dem Launch: Platz 1 = 20 $, Platz 2 = 10 $, Platz 3 = 5 $.

## Was der Spieler sieht

1. **Startscreen: Wettbewerbs-Banner**
   - Laut und groß über dem Setup: „SEASON SEPTEMBER — 20 $ / 10 $ / 5 $ IN $TCFB“, Countdown bis Monatsende, Anzahl Einträge.
   - Zwei klar getrennte Startarten:
     - **TOURNAMENT RUN** — feste Saison-Bedingungen, zählt für die Preise.
     - **FREE RUN** — freies Spiel wie bisher, zählt nicht für Preise.

2. **Wettbewerbs-Run**
   - Gleicher Seed für alle: identische Ereignisse, identische Reihenfolge, identische Launch-Ergebnisse und Minispiel-Muster.
   - Ein Wettbewerbs-Eintrag pro Saison und Spieler: der beste Einzel-Run zählt, ein besserer Score ersetzt den alten.
   - Sichtbarer Hinweis im Terminal, dass ein Wettbewerbs-Run läuft.

3. **Eintrag mit Wallet**
   - Beim Eintragen zusätzlich ein Wallet-Feld (EVM- oder Solana-Adresse), Pflicht für Wettbewerbs-Runs, optional für freie Runs.
   - Format wird geprüft; die Adresse wird auf dem Board nie voll angezeigt, nur verkürzt (`0x12…9f4`).

4. **Leaderboard**
   - Umschalter: **SEASON** (aktueller Monat, Preisränge 1–3 mit Gold/Silber/Bronze und Preisbetrag) und **ALL TIME**.
   - Archiv vergangener Saisons mit den drei Gewinnern.
   - Klarer Preis- und Regeltext: Auszahlung in TCFB nach Token-Launch, Wallet-Angabe nötig, ein Eintrag pro Spieler und Saison.

## Technische Umsetzung

- **Saison-Bestimmung ohne Cron:** Saison-ID = `YYYY-MM` aus UTC-Zeit, Ende = letzter Tag des Monats 23:59:59 UTC. Gewinner werden beim Lesen aus den Daten abgeleitet; keine geplanten Jobs nötig.
- **Seeded RNG:** neues Modul `src/game/rng.ts` (mulberry32 + String-Hash). Saison-Seed = Hash(`tcfb-<saison>`). Alle `Math.random()`-Aufrufe in `CryptoJourney.tsx` und `minigames.tsx` werden durch einen Run-RNG ersetzt, der im Wettbewerbsmodus vom Saison-Seed und ansonsten von einem Zufallsseed startet. Minispiele erhalten den RNG per Prop.
- **Datenbank (`leaderboard_runs`):** neue Spalten `season text`, `wallet text`, `is_tournament boolean default false`, `player_key text` (stabile lokale Spieler-ID). Unique-Index auf `(season, player_key)` für Wettbewerbs-Runs; bestehender `client_hash`-Index bleibt für Idempotenz. GRANTs unverändert erweitern; `wallet` wird nicht an anonyme Leser ausgeliefert (Projektion ohne Wallet in der öffentlichen Auswahl).
- **API `src/routes/api/public/leaderboard.ts`:**
  - `GET ?season=current|YYYY-MM|all` filtert entsprechend, sortiert nach Boss Score, liefert Preisrang für die Top 3.
  - `POST` validiert Saison, Wallet-Format, `is_tournament`; bei besserem Score desselben `player_key` in derselben Saison wird der alte Eintrag ersetzt statt abgelehnt.
  - Bestehende Plausibilitätsprüfungen und Score-Clamping bleiben.
- **Client (`src/game/leaderboard.ts`, `CryptoJourney.tsx`):** Submission-Typ um `season`, `wallet`, `isTournament`, `playerKey`; Offline-Puffer bleibt und trägt die neuen Felder mit.

## Verifikation

- Zwei Wettbewerbs-Runs mit identischer Saison zeigen dieselbe Ereignisfolge; ein freier Run zeigt eine andere.
- Eintrag mit gültiger und ungültiger Wallet; zweiter besserer Run desselben Spielers ersetzt den Eintrag, schwächerer nicht.
- Saison- und All-Time-Ansicht, Preisränge korrekt markiert; keine Wallet-Anzeige in Klartext.
- Mobil (393 px) und Desktop ohne Überlauf, ohne Konsolen- oder Laufzeitfehler; Build und Typecheck grün.

## Hinweis

Der Preistext nennt nur Beträge in Dollar und die Auszahlung „nach dem $TCFB-Launch“. Verbindliche Teilnahmebedingungen (Ausschluss von Mehrfachkonten, Auszahlungsfrist, Rechtsweg) solltest du mir noch als Text liefern oder freigeben — ich schreibe sonst eine kurze Standardfassung, die du prüfen musst.
