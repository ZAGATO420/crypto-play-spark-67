# Endscreen komplett neu designen (inkl. Namenseintrag)

## Antwort auf die Frage

Nein, "ANON" ist nicht absichtlich fix. Zwei Ursachen, beide im Code geprüft:

1. **Name lässt sich nicht tippen:** Der Submit-Block wird alle 600 ms neu sortiert und Namensfeld/Button dabei jedes Mal erneut ins DOM verschoben. Das reißt den Fokus aus dem Feld, der voreingestellte Wert bleibt stehen.
2. **"ANON" / 🇩🇪 sind Schnellstart-Defaults:** PLAY NOW füllt Name, Land, Schwierigkeit und Avatar automatisch. Land und Schwierigkeit bestimmen Miete, Steuern und Kosten des Runs, sind also während des Runs bewusst gesperrt — nachträglich änderbar wäre ein Score-Exploit. Nur die Anzeige und die Auswahl vorab müssen klarer werden.

## Neuer Endscreen (ein klarer Ablauf statt Wand aus Blöcken)

Aufbau von oben nach unten, ein Fokuspunkt pro Abschnitt:

```text
1  RESULT      Rang + Net Worth + Monate, Gorilla-Boss, Run-Setup als Info-Zeile
2  CLAIM       "Trag deinen Run ins globale Board ein" - Name, Avatar, ein großer Button
3  STATS       aufklappbare Detailkarte (Trades, Airdrops, Liquidationen, XP)
4  SHARE       Bild speichern / X / $TCFB-Oktober-Hinweis
5  NEXT        NEW RUN + globales Leaderboard (aufklappbar)
```

### 1. Result-Karte
Große Ergebniszahl, Rangtitel, Boss-Bild, darunter eine ruhige Info-Zeile mit Land, Schwierigkeit, Archetyp und Modus. Keine konkurrierenden Buttons in diesem Bereich.

### 2. Claim-Karte — der Eintrag wird unmissverständlich
- Eigene, deutlich abgesetzte Karte in Acid-Grün/Gold direkt unter dem Ergebnis, mit Überschrift "CLAIM YOUR RANK" und einer Zeile "Dein Run erscheint sonst nicht im globalen Leaderboard".
- Reihenfolge: Namensfeld → Avatarauswahl (kompakt, eine Reihe, horizontal scrollbar) → ein breiter Primärbutton "SUBMIT TO GLOBAL BOARD".
- Namensfeld groß, mit Label, Platzhalter "Your name" und Zeichenzähler; Vorbelegung nur mit dem letzten selbst gewählten Namen, sonst leer statt "ANON".
- Beim Fokus wird der vorbelegte Text markiert, damit er sofort überschreibbar ist.
- Statuszeile direkt unter dem Button: sendet / erfolgreich / erneut versuchen, plus vorhandene Retry- und Nachsende-Logik.
- Nach Erfolg wechselt die Karte in einen "Eingetragen"-Zustand mit dem erreichten Rang und dem Platz im Board.
- Auf kleinen Screens bleibt der Sprungbutton, der genau in diese Karte scrollt und das Namensfeld fokussiert.

### 3-5. Rest entzerren
- Alle Detailstatistiken in eine zusammenklappbare Karte, standardmäßig geschlossen — sie sind Beiwerk, nicht Hauptaktion.
- Share/$TCFB als eine ruhige Karte, nicht mehrere konkurrierende Farbflächen.
- Lokale Historie und globales Board zusammen in eine aufklappbare Karte am Ende.
- Konsistente Typografie, Abstände und Kartenradien wie im Terminal (Schwarz, Acid-Grün, Gold); keine Doppel-Header und keine überlappenden Badges.

### Technische Korrekturen
- Sortierung des Submit-Bereichs idempotent machen und nie ausführen, während das Feld Fokus hat.
- Endscreen bleibt eigener Scroll-Container (bereits umgesetzt), neue Struktur wird darin getestet.
- Startseite: Schnellstart-Chip zeigt zusätzlich Land und Schwierigkeit; im Profil-Sheet werden Land und Schwierigkeit vor dem Start wählbar, nach Monat 1 gesperrt mit Begründung.

## Prüfung
Chrome, Firefox und WebKit; Desktop, Mobile Portrait und Landscape; Tippen im Namensfeld ohne Fokusverlust, Avatarwahl, erfolgreicher POST, Retry-Fall, keine abgeschnittenen Bereiche.

## Grenze
Keine Änderung an Gameplay-Mathematik, Preisen, XP, Score-Formel oder Leaderboard-Ranking.
