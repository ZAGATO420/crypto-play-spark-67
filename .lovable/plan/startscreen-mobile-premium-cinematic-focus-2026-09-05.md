# Startscreen Mobile: Premium Cinematic Focus

## Ziel
Der Startscreen wird auf dem Smartphone von einer überfüllten Bedienfläche zu einem klaren Game-Poster: **neuer Gorilla, starke Wortmarke, ein Spielknopf**. Das Boss-Motiv bleibt groß und weitgehend frei sichtbar.

## 1. Neues Boss-Motiv
- Ein neues hochformatiges Hauptmotiv mit einem gekrönten Gorilla-Boss wird erstellt: frontal, hochwertig, scharf, heller ausgeleuchtet und klar als „The Crypto Final Boss“ erkennbar.
- Farbwelt: tiefes Petrol/Nachtblau, beleuchtetes Gold und nur wenig Acid-Grün für wichtige Aktionen.
- Das Motiv wird speziell für den Handy-Ausschnitt komponiert; Gesicht, Krone und Oberkörper dürfen von keiner Bedienfläche verdeckt werden.
- Der bisherige Gorilla wird ersetzt, nicht zusätzlich überlagert.

## 2. Filmplakat-Aufbau statt Button-Wand
- Vollflächiger Boss als Bühne, mit kontrollierter Abdunklung nur hinter Text und Spielknopf.
- `THE CRYPTO FINAL BOSS` bleibt groß, sitzt aber in einer freien Bildzone und verdeckt weder Gesicht noch Krone.
- Der Profilstatus `ANON · DEGEN · NORMAL` wird zu einem kleinen, unaufdringlichen Steuerelement am oberen Rand.
- Die wechselnde Boss-Zeile bleibt kurz und wird so platziert, dass sie das Motiv nicht zerschneidet.
- Münzregen wird stark reduziert oder auf Mobile ganz entfernt; stattdessen nur ein dezenter Licht-/Partikeleffekt.

## 3. Nur eine sichtbare Hauptaktion
- `ENTER THE ARENA` bleibt der einzige große Knopf und sitzt gut erreichbar im unteren Bereich.
- Die vier Share-/Trailer-Knöpfe verschwinden vom Hauptbild.
- Ein kompakter `MORE`-Knopf öffnet ein sauberes Menü mit:
  - Watch Trailer
  - Share on X
  - Telegram
  - Copy Link
  - Leaderboard
  - How to Play
  - Sound
  - Settings
- Bestehende Funktionen und Links bleiben erhalten; nur ihre Darstellung wird neu geordnet.

## 4. Live-Daten ohne visuelle Unruhe
- Die echte Arena-Statistik bleibt sichtbar, wird aber auf eine einzige ruhige Zeile reduziert.
- Das Live-Kursband bleibt funktional, wird auf Mobile jedoch zu einer schmalen oberen Marktzeile mit wenigen gleichzeitig sichtbaren Kursen; es verdeckt den Boss nicht.
- Auf Desktop bleibt mehr Information sichtbar, ohne die neue klare Hierarchie zu verlieren.

## 5. Abnahme
- Visuelle Prüfung bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Gesicht, Krone und Oberkörper des Bosses sind klar sichtbar.
- Genau ein großer CTA ist ohne Scrollen erreichbar.
- Profil, Live-Kurse, Arena-Statistik und `MORE` überlappen nichts.
- Trailer-, Share-, Leaderboard-, How-to-, Sound- und Settings-Funktionen bleiben erreichbar.
- Kein horizontales Scrollen, keine Konsolenfehler und keine abgeschnittenen Texte.

## Technische Umsetzung
- Der bestehende Startscreen in `public/game.html` wird konsolidiert: V27/V33/V34-Regeln für Mobile werden nicht weiter übereinandergestapelt, sondern durch einen eindeutigen finalen Startscreen-Block ersetzt.
- Das neue Boss-Bild wird als optimiertes WebP eingebunden.
- Bestehende Klick-Handler und echte Live-/Leaderboard-Daten werden weiterverwendet; Gameplay, Terminal und Preislogik bleiben unverändert.
