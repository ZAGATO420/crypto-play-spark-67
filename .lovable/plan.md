# Endscreen im Look des neuen Startscreens

## Ziel
Der Endscreen bekommt dieselbe filmische Handschrift wie der neue Startscreen: großes Boss-Motiv, ruhige dunkle Petrol/Gold-Bühne, eine klare Hauptaktion — statt der aktuellen langen Kartenliste mit vielen konkurrierenden Blöcken.

## 1. Gleiche Bühne wie der Startscreen
- Vollflächiges Boss-Motiv als Hintergrund (dasselbe Bild wie am Start), abgedunkelt unter Text und Buttons.
- Gleiche Farbwelt: tiefes Nachtblau/Petrol, Gold für Werte, Acid-Grün nur für die Hauptaktion.
- Gleiche Typografie und Buchstabenabstände wie Wortmarke und Arena-Zeile am Start.
- Bei einem verlorenen Run wird die Bühne rötlich-kalt getönt, bei einem überlebten Run golden — gleiche Bildsprache, andere Stimmung.

## 2. Klare Hierarchie statt Blockwand
Von oben nach unten genau eine Leseachse:
1. Ergebniszeile (`SURVIVED` / `REKT`) klein und ruhig
2. Net Worth groß und golden als Hauptzahl
3. Eine kompakte Zeile mit Monaten, Rang und XP
4. Ein Feld: Name eintragen + `CLAIM YOUR RANK`
5. Darunter `PLAY AGAIN` und `SHARE`

Alles Weitere (Achievements, Top 20, eigene Runs, Verlauf, Chronik) bleibt erhalten, wandert aber in aufklappbare Abschnitte bzw. hinter einen dezenten Knopf — analog zum `MORE`-Menü am Startscreen.

## 3. Eintragen bleibt unübersehbar
- Das Namensfeld bleibt das visuell hellste Element nach der Net-Worth-Zahl.
- Nach dem Eintragen ersetzt eine kurze Bestätigung mit Platzierung das Formular.
- Die bestehende Absende-Logik, Warteschlange und Fehlerbehandlung bleiben unverändert.

## 4. Share-Karte
- Die bestehende Share-Karte (Boss, Net Worth, Titel) wird farblich an die neue Bühne angeglichen, bleibt aber in Aufbau und Funktion gleich.

## 5. Abnahme
- Prüfung bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Hauptzahl, Ergebnis und Namensfeld ohne Scrollen sichtbar.
- Scrollen bis zum Ende weiterhin möglich (kein erneuter Scroll-Bug).
- Alle bisherigen Endscreen-Funktionen erreichbar, kein Querscrollen, keine Konsolenfehler.

## Technische Umsetzung
- Neuer, abschließender Endscreen-Block in `public/game.html` (Stil + kleine DOM-Umsortierung), der die V25/V26-Regeln konsolidiert, statt weitere Ebenen darüberzulegen.
- Wiederverwendung der Startscreen-Tokens (Gradient, Vignette, Acid-CTA, Mono-Labels) und des Boss-WebP.
- Keine Änderung an Spiellogik, Score-Berechnung, Leaderboard-API oder Preisdaten.
