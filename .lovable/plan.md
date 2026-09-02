# V20 — ACID THRONE: Aus der Website wird ein Game

Ziel: In einem Durchlauf so weit kommen, dass ein Fremder auf der Startseite sofort spielen *will*, sich der Boss durch das ganze Spiel zieht und der Endscreen ein Poster ist, das man teilt.

Ausgangslage in `public/game.html` (8.898 Zeilen): 17 übereinanderliegende Style-Schichten (`v4-skin` … `v18-polish`), 277 `!important`-Regeln, der gekrönte Gorilla existiert in genau **einer** Pose an drei Stellen, der How-To-Block ist ein Textblock, der Endscreen ist eine Karte mit Gold-Rahmen. Das ist der Grund für den "Website statt Game"-Eindruck: kein einheitliches Farbsystem, keine Figur, keine Dramatik.

## 1. Farbsystem: ACID THRONE

Ein einziger neuer Block `v20-core` wird die alleinige Farb-, Typo- und Abstands-Quelle. Alle 17 alten Schichten werden auf Funktionsreste reduziert, nicht überschrieben (Ziel: `!important` unter 20).

```text
GRUND      reines Schwarz -> sehr dunkles Anthrazit (4 Ebenen)
TEXT       Weiß trägt alles: Zahlen, Labels, Rahmen  (3 Helligkeitsstufen)
ACID       #c8ff2e  Hauptaktion, Gewinn, Long, Fortschritt
MAGENTA    #ff2d9b  Gefahr, Short, Liquidation, Rug, Rekt
GOLD       #f5c451  nur Besitz, Rang, Krone, Net Worth, Sieg
```

Weiß ist bewusst dominant — das hält es teuer statt Neon-überladen. Acid und Magenta leuchten nur als Signal, nie als Fläche. Violett verschwindet vollständig aus dem Spiel. Hintergrund bekommt feines Grid + Vignette, damit Karten sich abheben. Zahlen laufen in Mono mit tabellarischen Ziffern, damit nichts flackert.

## 2. Der Gorilla wird die Hauptfigur (alle 4 Ebenen)

Neue Boss-Bildserie, 8 Posen, gleiche Figur, gleiches Licht:

```text
throne     Startseite, auf dem Thron sitzend
roar       Pump / großer Gewinn
smug       ruhige Monate, Standard-Mood
stressed   Stress/Hunger hoch
enraged    Rug / Scam / Verlust
broken     Liquidation / Rekt
crowned    Sieg, volle Krone
tiny-hud   kleiner Kopf-Ausschnitt für das HUD
```

- **Reaktion:** Bei Pump, Rug, Airdrop, Liquidation, Quest blendet der Boss kurz groß ein, mit passender Pose und einer Zeile Taunt.
- **Immer sichtbar:** Boss-Avatar fest im HUD; Mood wechselt live nach Stress/Risk/Gewinn. Antippen zeigt Boss-Kommentar zur Lage.
- **Gegner/Progression:** Sieben Boss-Kapitel (ein Jahr = ein Kapitel). Zu Kapitelbeginn stellt der Boss ein Net-Worth-Ziel und taunt; am Kapitelende Boss-Karte "BEATEN" (Acid) oder "SURVIVED" (Weiß) mit XP-Bonus. Endet im **Final Boss Fight** in den letzten drei Monaten: Ziel, Countdown, eigene Musikszene. Reine Ziel-/Bonus-Ebene — Preise, Perp-Mathematik, XP-Formeln und Leaderboard bleiben unberührt.
- **Share:** Endcard wird ein Boss-Poster (siehe 5).

## 3. Startseite: Arena statt Landingpage

- Vollflächige Boss-Arena: Thron-Boss groß, Krone leuchtend, Titel als echte Wortmarke, dahinter dunkler Nebel und feines Grid. Kein Website-Kastenraster mehr.
- **Ein** dominanter Einstieg: großer Acid-Button `ENTER THE ARENA`. Alles andere (Leaderboard, How-To, Settings, Sound) wird zu kleinen ruhigen Nebenzielen.
- Live-Zeile unter dem Titel: laufende Runs, aktueller Top-Score, Countdown auf den Oktober-Launch — beweist, dass hier etwas passiert.
- Der Boss atmet/blickt leicht (dezent, keine Dauer-Animation), Krone pulsiert langsam.
- Mobile: Boss oben halbformatig, Titel, ein Button — nichts sonst above the fold.

## 4. Onboarding: 3 Karten, je ~15 Wörter

Der komplette `howto`-Textblock (Zeile ~1057) und der lange Survival-Text fliegen raus. Stattdessen drei Bildkarten mit Boss-Pose, durchklick- bzw. swipebar:

```text
1  ZIEL      84 Monate. Jan 2020 bis Dez 2026. Fast keiner schafft Jahr eins.
2  GEFAHR    Hunger, Stress, Rugs, Liquidation. Ein Fehler und du bist raus.
3  BELOHNUNG Top 3 im globalen Board holen im Oktober den $TCFB Airdrop.
```

Danach direkt in die Charakterauswahl. Details (Steuern, Custody, Leverage) erscheinen künftig kontextuell als kurzer Hinweis dort, wo sie zum ersten Mal auftreten — nicht mehr als Textwand vorab.

## 5. Endscreen: Boss-Poster

- 16:9-Poster im neuen Farbsystem: Boss-Pose nach Ergebnis (`crowned` / `broken` / `smug`), großer Titel (`BOSS DEFEATED` / `LIQUIDATED` / `SURVIVED`), Net Worth in Gold, darunter vier Kern-Stats plus Rang-Zeile.
- Verlauf des Runs als kleine Sparkline, größter Gewinn und größter Fehler als je eine Zeile — das erzeugt die Geschichte, die man teilen will.
- Prominenter Board-Eintrag mit Rang-Vorschau ("du wärst #12") direkt auf der Karte statt versteckt — das ist der wahrscheinlichste Grund, warum sich bisher niemand einträgt.
- Ein Klick: Bild speichern / auf X teilen, mit Handle und $TCFB-Zeile eingebrannt.

## 6. Terminal: gleiche Sprache, mehr Spielgefühl

- Alle Panels, Popups und Buttons auf das neue System gezogen: gleiche Rahmen, gleiche Radien, gleiche Kopfzeilen, gleiche Fußleisten.
- Boss-HUD-Avatar, Kapitel-Fortschrittsbalken ("Boss-Ziel: $42.000") und Monatszähler bilden einen ruhigen fixen Kopf.
- Feedback, das Spaß macht: Zahlen zählen hoch statt zu springen, Gewinn pulsiert acid, Verlust magenta, Trades bekommen ein kurzes Bestätigungs-Feedback, Achievements fahren als Boss-Toast ein.
- Chart im Börsen-Look: klare Achsen, dezentes Raster, Einstiegs-Referenzlinie, weicher Verlauf.
- Leere Zustände bekommen Boss-Satz statt leerer Fläche.
- Desktop weiter ein Fenster, Mobile weiter fixes Dock — die bestehende V17-Struktur bleibt, sie wird nur neu eingekleidet.

## 7. Technisch

- Style-Schichten zusammenführen, toten CSS/JS-Code entfernen, `!important` massiv reduzieren.
- Neue Boss-Bilder als komprimierte WebP über CDN-Assets, mit `preload` nur für die Startpose; alle anderen lazy.
- Audio: die V19-Engine bleibt, bekommt eine Boss-Fight-Szene für die letzten drei Monate.
- Abnahme per Playwright bei 390×844, 414×896, 768×1024, 1030×695, 1280×720, 1440×900, 1728×1117: nichts abgeschnitten, jeder Button klickbar, alle Popups öffnen/schließen, keine Konsolenfehler.

## Nicht angetastet

Historische Preise, Perp-Mathematik, XP-Formeln, Schwierigkeitsgrade, Leaderboard-API, Story-/Pacing-Daten.
