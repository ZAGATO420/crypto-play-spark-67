# Neues Gameplay: THE CYCLE — 2020 bis 2026 als Entscheidungs-Run

Die cleane Optik, die Farben und der Startscreen bleiben. Was sich ändert: das Spiel selbst. Weg vom Durchklicken, hin zu einem Run, den man beeinflusst, der sich verzweigt und mehrere Enden hat.

## Der Spielkern, den ich empfehle

**Cycle Run mit Kapiteln, Druck und Verzweigung.** Statt 84 gleich aussehender Monate hat der Run 24 Kapitel (je ein Quartal, ca. 10 Minuten). Jedes Kapitel läuft immer gleich, in drei kurzen Schlägen:

1. **Der Boss spricht** — eine Zeile Kontext, frech und hart, plus eine sichtbare Warnung, was kommen könnte ("Leverage ist überhitzt", "Alle sind Genies").
2. **Dein Zug** — du hast 2 Aktionspunkte und wählst frei: Spot kaufen/verkaufen, Perp öffnen/schließen, Presale/Fairlaunch zeichnen, essen/runterkommen, oder passen und einen Punkt in den nächsten Zug retten.
3. **Der Markt antwortet** — echte Kursbewegung des Quartals, dann eine Konsequenz-Karte mit sichtbarem Ergebnis: was hat dein Zug gekostet oder gebracht.

Warum das trägt, wo das Kartenspiel langweilt:

- **Echte Wahl statt Reihenfolge.** Aktionspunkte sind knapp. Wer alles in einen Perp steckt, hat kein Geld für den Presale. Jede Runde tut eine Entscheidung weh.
- **Verzweigung mit Folgen.** Wichtige Momente (Black Thursday, China-Ban, Luna, FTX, ETF, 100k, Leverage-Flush) setzen einen dauerhaften Status: `PANIC SELLER`, `DIAMOND HANDS`, `CASINO DEGEN`, `EXCHANGE VICTIM`. Der Status verändert danach Preise, Risiko und Bosstexte — zwei Spieler erleben nicht denselben Run.
- **Mehrere Enden.** Nicht nur reich/rekt: `LEGEND` (Ziel geschlagen, alle Krisen überlebt), `SURVIVOR`, `CASINO CASUALTY` (durch Liquidation raus), `STARVED` (Survival ignoriert), `SELLOUT` (früh alles verkauft und ausgestiegen — man kann den Run bewusst beenden und den Score einloggen). Das Ende steht am Schluss groß auf einer Karte, mit dem Satz, wie es dazu kam.
- **Druck ohne Chaos.** Ein Streak-Zähler (richtige Züge in Folge) gibt Multiplikator auf den Score; ein Risiko-Meter füllt sich bei Hebel und Degen-Plays und löst bei Überhitzung eine echte Liquidation aus. Zwei Zahlen, immer sichtbar, keine versteckten Systeme.

## Wie Trading und Perp dieses Mal gelöst werden

Ein **Trading Desk** statt zwei getrennter Welten — eine Fläche, kein Scrollen, auch mit vielen Positionen:

- **Eine Positionsleiste, immer sichtbar**, direkt unter dem Kopf. Jede Position ist ein kleiner Chip: Logo, `SPOT` oder `5x` als Badge, P&L in Farbe. Chips liegen in einer Reihe; wenn es mehr als vier sind, wird die Reihe zu einem 2-reihigen Raster mit kleineren Chips — nie eine Scrollliste.
- **Tippen auf einen Chip öffnet ein Popup** mit allem zu dieser Position: Einstand, aktueller Kurs, P&L, bei Perp der Liquidationsabstand als Balken. Aktionen: 25% / 50% / ALLES schließen. Nach der Auswahl schließt das Popup automatisch und die Änderung blitzt am Chip auf.
- **Kaufen ist ein Popup, kein Formular.** Markt wählen, dann eine Karte: links Spot mit 25/50/100% des Cash, rechts Perp mit Hebel 2x/5x/10x und Long/Short. Ein Tipp = Order erteilt, Popup schließt sich sofort, Bestätigung erscheint als kurzer Streifen.
- **Keine doppelten Ansichten.** Der Markt-Screen ist die Börse (Kurs, Trend, Kaufen). Der Chart lebt im Popup der jeweiligen Position bzw. des Marktes. Positionen leben nur in der Leiste. Jede Information hat exakt einen Ort.
- **Survival bleibt als schmale Leiste am Fuß** — Hunger, Stress, monatliche Kosten, plus `EAT` und `CALM` als direkte Knöpfe. Nie eingeklappt, nie versteckt.

## Optik, Feedback, Animation

Gleiche Farben, gleiche Ruhe, aber das Spiel fühlt sich an:

- Jeder Tap gibt sofort Antwort: kurzes Aufleuchten des Knopfs, Zahl zählt hoch statt zu springen, P&L-Chip pulst grün oder rot.
- Kapitelwechsel als kurzer Wisch: das alte Kapitel fährt raus, das neue rein, Jahreszahl blitzt groß auf.
- Boss-Stimmung reagiert (ruhig, spöttisch, wütend) und kommentiert deinen Status.
- Liquidation und Krisen bekommen einen kurzen roten Ruck plus Ton; Gewinnmomente einen goldenen Blitz.
- Alle Overlays sind echte Dialoge über allem, mit einem klaren Schließen, und schließen sich nach jeder Auswahl selbst. Nichts verdeckt dauerhaft etwas anderes.

## Rangliste: Boss-Score

Neuer, nachvollziehbarer Wert, im Spiel offen ausgeschrieben:

```text
BOSS SCORE = Endvermögen
           x Kapitel-Faktor (überlebte Kapitel / 24)
           x Schwierigkeit (EASY 0.8 · NORMAL 1.0 · BOSS 1.4)
           + Krisen-Bonus (500 pro überlebter Krise)
           x Streak-Multiplikator (1.0 bis 1.5)
```

Die alten XP-Einträge verschwinden aus der Hauptliste; die Liste startet mit dem neuen Score frisch. Auf der Endkarte steht die Rechnung Zeile für Zeile, damit jeder Platz erklärt ist.

## Technische Umsetzung

- Kein neuer Layer über Altem: `src/game/CryptoJourney.tsx` wird in eine kleine Struktur zerlegt (`useRun` für State und Reducer, `Desk`, `PositionBar`, `ChapterStage`, `Dialog`), alle in `src/game/`. Das alte `public/game.html` bleibt unangetastet und ungenutzt.
- Datenmodell: 24 Kapitel, aus den vorhandenen 84 Monatspreisen in `journey-data.ts` aggregiert (Quartalsschritt), Decisions von Monat auf Kapitel gemappt, plus neue Status-Flags und Enden.
- Ein einziges Dialogsystem (`<Dialog>` mit `open`/`onSelect`), das nach jeder Auswahl selbst schließt — keine parallelen Overlays, kein Queue-Problem.
- Positionen: ein Array mit `kind: "spot" | "perp"`, `lev`, `entry`, `size`; P&L und Liquidationsabstand aus einer einzigen Formelstelle, damit Chip, Popup und Endscreen identisch rechnen.
- Score/Leaderboard: `src/game/leaderboard.ts` sendet `score` statt XP-Level; `src/routes/api/public/leaderboard.ts` bekommt Feld und Plausibilitätsprüfung für den neuen Score, Sortierung nach `score`. Migration setzt die Tabelle für die neue Saison zurück.
- Animationen mit CSS-Transitions und `@keyframes` in `src/styles.css`; keine neuen Abhängigkeiten.
- Test: Playwright-Durchlauf über einen kompletten Run bei 375x677, 390x844, 430x932, 768x1024 und 1280x800 — kein horizontales Scrollen, keine abgeschnittenen Karten, keine Konsolenfehler.
