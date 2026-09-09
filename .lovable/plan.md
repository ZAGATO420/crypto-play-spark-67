# Cyber-Jungle Premium: Startseite und Leaderboard

## Ziel
Startseite und Rangliste erhalten eine gemeinsame, hochwertigere Spielsprache: bestehende Schwarz-, Gold- und Cyan-Farben bleiben, die Titel werden kräftiger und die Inhalte klarer geordnet. Alle Funktionen und echten Daten bleiben erhalten.

## Startseite
- Den Boss weiterhin groß und scharf als Hauptmotiv zeigen, aber die Inhalte auf Desktop asymmetrisch anordnen: Wortmarke und kurzer Satz auf einer Seite, kompakte Turnier- und Aktionszone als Gegengewicht.
- Auf dem Handy sauber untereinander stapeln, ohne Gesicht oder Krone zu verdecken.
- Turniermonat, Countdown und `$20 / $10 / $5` zu einem kompakten Premium-Band zusammenfassen.
- Die persönliche Statistik (`Runs`, `Best`, `Best Score`, `Endings`) ruhiger und platzsparender darstellen.
- `PLAY THE TOURNAMENT` bleibt die klare Hauptaktion. `FREE RUN`, `LEADERBOARD` und gegebenenfalls `CONTINUE RUN` werden kompakte Nebenaktionen.
- Live-Ticker, Sound, Rules und alle bestehenden Funktionen bleiben erreichbar.
- Ruhige Einblendungen und klare Zustandswechsel verwenden; kein Flackern, Dauerpulsieren oder unnötiger Glow.

## Leaderboard
- Überschrift, Turnierhinweis, Tabs und Ergebnisliste in einen gemeinsamen zentrierten Rahmen mit identischer Maximalbreite setzen.
- Den langen Regeltext im Kopf visuell reduzieren: wichtigste Turnierdaten prominent, Detailregeln kompakter darunter.
- Die Top 3 deutlicher als Siegerplätze behandeln, mit Gold-/Cyan-Akzenten und sichtbaren Preisangaben.
- Jede Zeile klar in Bereiche gliedern:
  - Platz, Avatar und Flagge
  - Spielername, Rang, Archetyp und Schwierigkeit
  - Level, XP und überlebte Monate
  - Net Worth und Boss Score als sauber getrennte Kennzahlen
- Auf Desktop echte Datenspalten ausrichten; auf Mobile zu einer kompakten Identitäts- und Ergebnisansicht stapeln.
- `TOURNAMENT` und `ALL TIME` bleiben als klarer Umschalter innerhalb derselben Breite.

## Gestaltung
- Gewählte Richtung: **Cyber-Jungle Premium** mit asymmetrischer Komposition.
- Bestehende Farbwelt bleibt; Gold markiert Wettbewerb und Gewinner, Cyan Live-Daten und aktive Zustände.
- Massive Arcade-Titel mit Archivo-Black-Charakter, gut lesbare kompakte Begleitschrift.
- Weniger einzelne Kästen, keine ineinander verschachtelten Karten, präzise Linien und kontrollierte Tiefenwirkung.

## Technische Umsetzung
- `StartScreen`, `SeasonBanner`, `RecordStrip` und `BoardScreen` strukturell neu ordnen, ohne Spiellogik, Wettbewerbsauswertung oder Datenabruf anzufassen.
- Vorhandene Bildquellen, Buttons, Dialoge und Leaderboard-Daten weiterverwenden.
- Die zugehörigen Styles konsolidieren, damit alte Startscreen-Regeln nicht gegen die neue Anordnung arbeiten.
- Schriften über die bestehende Dokument-Kopf-Konfiguration laden und als globale Design-Tokens verwenden.

## Prüfung
- Desktop bei 1440×900 und Mobile bei 393×844 visuell prüfen.
- Sicherstellen, dass Boss-Gesicht, Titel, Aktionen und Turnierdaten ohne Überlagerung sichtbar sind.
- Einheitliche Breite von Leaderboard-Kopf, Tabs und Ergebniszeilen prüfen.
- Lange Namen und große siebenstellige Werte testen.
- Start, Free Run, Continue, Leaderboard, Tab-Wechsel, Rules und Sound anklicken.
- Keine horizontale Scrollleiste, kein Flackern, keine Browserfehler und erfolgreicher Build.
