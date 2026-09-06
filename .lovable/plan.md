# Kompletter Neuaufbau: Crypto Card Journey 2020–2026

## Ziel
Das bestehende Terminal wird nicht weiter repariert. Es wird durch **eine einzige neue Spieloberfläche** im gewählten **Card Journey View** ersetzt: Smartphone zuerst, große Karten, klare Entscheidungen, sofortiges Feedback und ein verständlicher Weg von Januar 2020 bis Dezember 2026.

Festgelegt:
- Farbwelt: **Retro 2020** — `#111018`, Cyan, Pink und Gelb
- Schrift: **Archivo Black + Hind**
- Aufbau: **vertikale Karten-Reise**
- Pro Moment eine Hauptkarte und höchstens drei klare Aktionen
- Keine kleinen Tabellen, verschachtelten Frames oder mehrfachen Terminal-Reiter

## 1. Altes UI vollständig entfernen
- Die sichtbaren V4–V46-Terminal-, Mobile-, Dock-, Karten- und Feedback-Schichten werden entfernt statt erneut überschrieben.
- Die parallel laufenden alten und neuen Ansichten, doppelten Renderer, Observer, Intervalle und Overlay-Systeme entfallen.
- Es bleibt genau eine Oberfläche, ein Render-Takt, ein Dialogsystem und ein Satz Regeln für alle Bildschirmgrößen.
- Die Startseite kann ihren erfolgreichen Charakter behalten; der laufende Run und der Endscreen werden aus derselben neuen Designsprache gebaut.

## 2. Spiel als verständliche Reise neu ordnen
Jeder Monat wird zu einer kurzen, klaren Runde:

```text
MONAT STARTET
  → Boss-Auftrag / Markt-Ereignis
  → eine große Entscheidungskarte
  → sofort sichtbares Ergebnis
  → Fortschritt, XP und Überleben aktualisieren
  → nächster Monat
```

- Die aktive Karte zeigt Coin/Event, Preisbewegung, Risiko und mögliche Belohnung in Klartext.
- Primäraktionen sind kontextabhängig, z. B. `BUY · HOLD · PASS`, `LONG · SHORT · PASS` oder `EAT · CALM · CONTINUE`.
- Ein Zug endet immer mit einer sichtbaren Ergebnis-Karte: Gewinn, Verlust, Rug, Liquidation, Quest-Erfolg oder blockierter Versuch samt Grund.
- Der Gorilla-Boss reagiert auf große Gewinne, Verluste, Hunger, Level-Ups, Streaks und historische Crash-/Bullrun-Momente.

## 3. Funktionen vereinfachen, ohne den Spielkern zu verlieren
Erhalten bleiben:
- historische Monate, Kurse und Events 2020–2026
- Spot-Trading und Perps samt bestehender Mathematik
- Survival mit Hunger, Stress und Health
- XP, Level, Streak, Quests und Achievements
- Launchpads/Presales, Airdrops, Business und Shop
- Save/Resume, Schwierigkeitsgrade, Audio, Leaderboard und Endwertung

Neu geordnet:
- Offene Spot- und Perp-Positionen erscheinen als große, durchblätterbare Karten mit vollständigen Daten und direkter Aktion.
- Komplexere Systeme werden im passenden Monat als Karten angeboten, nicht gleichzeitig in einem Menü ausgestellt.
- Essen und Beruhigen erscheinen automatisch, bevor Werte kritisch werden, bleiben aber über einen einzigen Statusbereich erreichbar.
- Details zu Portfolio, Verlauf und Regeln liegen in einem gemeinsamen Sheet und unterbrechen den Hauptloop nicht.

## 4. Eine Oberfläche für Smartphone und Desktop
- Smartphone ist die Referenz: Status oben, aktive Karte in der Mitte, große Aktionen unten.
- Desktop verbreitert dieselbe Karten-Reise und ergänzt nur den sichtbaren Reiseverlauf; es entsteht kein zweites Terminal-Layout.
- Sichere Unterkante, 44-px-Tippflächen, kein horizontales Scrollen und nur eine definierte vertikale Scrollzone.
- Offene Trades wachsen nicht in kleine Frames, sondern bleiben als vollständige Karten lesbar.
- Kurze, gezielte Kartenwechsel, Trefferreaktionen und Sounds; keine flackernden Blurs oder dauernden Neonanimationen.

## 5. Technischer Neubau
- Die stabile Spiellogik wird aus `public/game.html` herausgelöst und von der Darstellung getrennt.
- Daten, State und reine Berechnungen werden übernommen; direkte DOM-Manipulationen aus den alten UI-Versionen werden nicht übernommen.
- Die neue Oberfläche wird als klar getrennte Game-Bausteine in der bestehenden App aufgebaut; die bisherige `/game.html`-Einbettung wird anschließend auf den neuen Einstieg umgestellt.
- Ein zentraler Zustandsfluss rendert Status, aktuelle Karte, Ergebnis und Reiseverlauf. Modale Fenster laufen über einen gemeinsamen Dialog.
- Autosaves bleiben kompatibel, soweit ihr Datenformat gültig ist; beschädigte oder unvollständige alte Saves werden verständlich abgefangen.

## 6. Funktionstest statt Sichtprüfung allein
Automatisierte vollständige Runs für Classic, Historical, Chaos und Ironman prüfen:
- Kaufen, Verkaufen, Hold und mehrere gleichzeitige Positionen
- Long, Short, Teil-/Komplettschließung, Funding und Liquidation
- Hunger, Stress, EAT, CALM und Game Over
- XP, Level-Up, Streak, Quest und Achievement
- Launchpad/Presale-Erfolg, Rug und blockierte Käufe mit sichtbarem Grund
- Business, Shop, Airdrops, Entscheidungen, Pause, Save und Resume
- Monatswechsel von Januar 2020 bis Dezember 2026
- Endscreen, Score und Leaderboard

Geräteprüfung bei 375×677, 390×844, 430×932, 768×1024 und 1280×800: keine abgeschnittenen Inhalte, keine überlagerten Aktionen, keine leeren Ansichten, keine Konsolenfehler und dieselbe Spielregel auf jedem Gerät.

## Technische Leitplanken
- Die kanonischen Preis-, PnL-, Liquidations-, Kosten-, XP- und Survival-Formeln werden zuerst durch Tests gesichert und anschließend unverändert angeschlossen.
- Keine weitere Versionsschicht und keine neuen `!important`-Kaskaden.
- Die Umstellung erfolgt in überprüfbaren Etappen: Logik sichern → neue Card Journey → Aktionen verbinden → Alt-UI löschen → kompletter 2020–2026-Test.
