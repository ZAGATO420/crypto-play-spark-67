# "ANON" am Ende: Name editierbar machen + Land/Setup transparent

## Was tatsächlich passiert (geprüft im Code)

Nein, das ist nicht absichtlich so gebaut — es sind zwei getrennte Effekte:

1. **Name lässt sich nicht tippen.** Im Endscreen wird der Submit-Block alle 600 ms neu sortiert und dabei werden Namensfeld und Submit-Button jedes Mal erneut ins DOM verschoben (`insertBefore` ohne Prüfung, ob die Reihenfolge schon stimmt). Jede Verschiebung reißt den Fokus aus dem Feld — Tippen bricht ab, der voreingestellte Wert bleibt stehen.
2. **"ANON" ist der Schnellstart-Default.** PLAY NOW füllt fehlende Angaben automatisch: Name `ANON`, Land Deutschland, erste Schwierigkeit, zufälliger Avatar. Land und Schwierigkeit sind danach nur über CUSTOMIZE RUN wählbar, weil sie Miete, Steuern und Kosten des laufenden Runs bestimmen — nachträglich änderbar wäre das ein Score-Exploit.

## Umsetzung

### 1. Namensfeld wirklich bedienbar
- Sortierung des Submit-Blocks nur noch ausführen, wenn die Reihenfolge tatsächlich abweicht; keine DOM-Verschiebung mehr im Intervall.
- Während das Feld den Fokus hat, wird gar nicht umsortiert.
- Beim ersten Antippen/Fokussieren wird der vorbelegte Text komplett markiert, damit er direkt überschrieben werden kann.

### 2. Bessere Voreinstellung statt "ANON"
- Vorbelegung: zuletzt genutzter Name → sonst Name des Runs → sonst leeres Feld mit Platzhalter "Your name", damit klar ist, dass hier etwas eingetragen werden soll.
- Kleiner Hinweis unter dem Feld: "Dieser Name erscheint im globalen Leaderboard."

### 3. Land/Schwierigkeit sichtbar und vorab wählbar
- Im Schnellstart-Chip auf der Startseite werden Land und Schwierigkeit mit angezeigt, EDIT führt weiterhin in die Auswahl.
- Im Profil-Sheet kommen Land und Schwierigkeit als Auswahl dazu — gültig **vor** dem Start; nach Monat 1 gesperrt mit klarer Begründung.
- Im Endscreen wird das Setup des Runs (Land, Schwierigkeit, Archetyp) als reine Info angezeigt, damit klar ist, warum dort z. B. 🇩🇪 steht.

## Technische Grenze

Keine Änderung an Gameplay-Mathematik, Preisen, XP, Score-Formel oder Leaderboard-Ranking. Land und Schwierigkeit bleiben während eines laufenden Runs unveränderlich.
