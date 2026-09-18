# Kompletter Spieltest: alle 84 Monate, alle Entscheidungen, Turnier-Tauglichkeit

Ziel: nachweisen, dass ein Run von Monat 1 bis 84 ohne Hänger, Absturz oder weißen Bildschirm durchläuft, jede Entscheidung sauber auflöst und das Turnier fair und wiederholbar ist. Es wird nichts an Preisen, Gewinnformeln, Steuern, Boss-Score oder Turnierbedingungen verändert — nur getestet und, wo etwas kaputt ist, reparaturvorbereitet.

## Was getestet wird

1. **Voller Durchlauf** — ein automatisierter Run über alle 28 Quartale / 84 Monate am Handy-Format und am Desktop. Nach jedem Quartal wird geprüft: Monatszähler steigt, Werte ändern sich sichtbar, keine Fehlermeldung, kein leerer Bildschirm, kein hängender Ladezustand.
2. **Jede Entscheidung mindestens einmal** — alle historischen Ereignisse (Luna, FTX, Exchange-Ausfall, Crash-Warnung, Presale, Boss-Angebot, private Ereignisse) werden gezielt angesteuert und alle Antwortmöglichkeiten geklickt. Kontrolle: Popup schließt sich, Geld/Bestand/Stress/Hunger ändern sich nachvollziehbar, keine Karte verschwindet fälschlich, keine alte Karte taucht später wieder auf.
3. **Alle Spielphasen** — Ansparen, Momentum, Panik, Jagd, Verteidigen, Boss-Duell: jede Phase wird durchlaufen und die jeweilige Hauptaktion ausgeführt.
4. **Alle Geschicklichkeitsspiele** — Timing-Balken, Panik-Tap, Gas-War, Seed-Check, Orderbuch, Rug-Check: Gewinn- und Verlustfall, Abbruch, mehrfaches Öffnen.
5. **Alle Endungen** — Sieg (Thron), Überleben, Pleite, vorzeitiger Ausstieg, Liquidation. Endscreen muss immer lesbar erscheinen, mit Rang, Werten und Eintragsmöglichkeit.
6. **Turnier-Tauglichkeit** — zwei getrennte Browser mit demselben Monatsstart spielen dieselbe Reihenfolge an Ereignissen und Zufallswerten; gleiche Startbedingungen; Eintrag mit gültiger Wallet, Ablehnung ohne Wallet und bei abgelaufener Saison; ein Spieler kann keine zwei Preisplätze belegen; Ranglisten-Ansicht und die geschützte Gewinnerseite zeigen identische Reihenfolge.
7. **Eintrag ins Board** — Eintrag mit Wallet, Eintrag doppelt abgeschickt, Eintrag bei kurzer Netzunterbrechung (Nachsenden), sehr hoher Wert (Plausibilitätsgrenze).
8. **Robustheit** — Seite neu laden mitten im Run, Zurück-Taste, schneller Doppelklick auf Aktionen, Ton an/aus, reduzierte Bewegung, Hochformat/Querformat, kein seitliches Verschieben des Bildschirms.

## Bildschirmgrößen

393×852 und 430×932 (Handy), 1440×900 (Desktop).

## Ergebnis, das du bekommst

- Eine Liste aller gefundenen Probleme, nach Schwere sortiert: Absturz / hängt / falsche Zahl / Darstellung.
- Für jedes Problem: wo es passiert, was zu sehen ist, und ob es Turnierfairness betrifft.
- Klare Aussage am Ende: turnierbereit ja/nein, und was vorher noch behoben werden muss.

Gefundene Fehler behebe ich direkt im selben Zug und teste danach erneut, sofern die Korrektur die Spielökonomie nicht verändert. Änderungen, die Zahlenlogik oder Turnierbedingungen berühren würden, lege ich dir vorher zur Entscheidung vor.

## Technische Details

- Playwright-Skripte unter `/tmp/browser/full-audit/`: ein Skript für den Vollrun mit Protokoll pro Quartal, eines für Entscheidungs-/Minigame-Abdeckung mit erzwungenen Ereignissen, eines für Zwei-Browser-Determinismus, eines für Eintrags- und Ablehnungsfälle.
- Deterministik-Prüfung über den Saison-Seed in `src/game/rng.ts` / `season.ts`; verglichen werden Ereignisreihenfolge, Minigame-Rollwerte und Endwerte.
- Abdeckungskontrolle gegen `journey-data.ts` (Decisions, Situations, Crashs, Exchange-Ausfälle, Bossfights, `chapterPlayFor`, `MISSIONS`) und `minigames.tsx` (`MiniKind`).
- Eintragspfad: `src/routes/api/public/leaderboard.ts` (Validierung, Idempotenz, Saison-Ablehnung) gegen `src/game/ranking.ts` (`bertPerPlayer`-Union-Find) und `src/lib/prizepool.functions.ts` — beide müssen dieselbe Reihenfolge liefern.
- Überwachung während der Tests: Browser-Konsole, Netzwerkfehler, `/tmp/observability/runtime-errors.log`, Dev-Server-Log; danach `tsgo --noEmit` und Build.
