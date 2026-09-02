# Auswahl am Handy sichtbar machen (Archetyp, Schwierigkeit, Avatar)

Die Auswahl ist nicht verschwunden: unter PLAY NOW liegt bereits ein Knopf CUSTOMIZE RUN, der den alten 3-Schritt-Flow mit Archetyp, Schwierigkeit, Land, Presale-Modus und Avatar öffnet. Das Problem ist die Sichtbarkeit und dass man nach dem Schnellstart nichts mehr ändern kann.

## Was geändert wird

1. **CUSTOMIZE RUN deutlicher** — als klar erkennbarer Zweit-Button direkt unter PLAY NOW, mit Untertext "Archetyp · Schwierigkeit · Avatar wählen", 44 px hoch, gleiche Breite wie der Hauptknopf. Kein versteckter Text-Link mehr.

2. **Wahl-Chip im Thronsaal** — eine Zeile zeigt, womit PLAY NOW startet (z. B. "ANON · DEGEN · NORMAL · zufälliger Avatar"). Antippen öffnet dieselbe Auswahl. So sieht der Nutzer, dass es Optionen gibt, ohne lesen zu müssen.

3. **Nachträglich änderbar** — solange noch kein Trade gemacht wurde (Monat 1), bleibt im Header ein kleines PROFIL-Chip: Name, Avatar und Archetyp lassen sich dort ohne Neustart setzen. Schwierigkeit bleibt nach Runstart fix, weil sie die XP-Wertung bestimmt.

4. **Leaderboard-Eintrag** — beim Eintragen am Ende sind Name und Avatar dort direkt editierbar, damit ein Schnellstart-Run nicht als "ANON" mit Zufallsbild festgeschrieben ist.

Der Schnellstart bleibt Standard: 90 % kommen mobil aus X, und jedes Formular vor dem ersten Tap kostet Spieler. Die Auswahl wird also nicht wieder zur Pflicht, nur sichtbar und nachholbar.

## Technische Notizen

Alles in `public/game.html`, im `v23-mobile`-Layer:
- `rewireGate()` (~10111): `#v23-gate-extra` um Chip mit den aktiven Defaults erweitern, `.v23-cust` als vollwertigen Button stylen.
- `ensureDefaults()` (~10090) liefert die Werte für die Chip-Anzeige.
- Profil-Sheet nutzt die bestehenden `#archetypes`, `#avatars`, Namensfeld — kein neues Auswahl-UI, nur in einem Bottom-Sheet gerendert; Änderungen schreiben in `state` und werden nur bis Monat 1 erlaubt.
- Unangetastet: Schwierigkeitslogik, XP-Formeln, historische Preise, Leaderboard-API.
