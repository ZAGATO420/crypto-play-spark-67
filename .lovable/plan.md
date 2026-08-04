# Neuer HD-Affe am Titel, HUD immer sichtbar, Mobile-Feinschliff

## 1. Neuer Titel-Affe rechts neben "BOSS"
Der bisherige Hintergrund-Affe liegt als Ebene **innerhalb** der Startkarte und wird von ihr abgeschnitten — daher die harte Kante quer durchs Menü auf dem Laptop. Diese Ebene fällt weg.

- Neuer, scharf freigestellter Affe in HD (transparentes PNG), der **lässig am Schriftzug lehnt**: Arme verschränkt, Schulter am letzten Buchstaben von BOSS, Blick in die Kamera, kräftige Gold/Violett-Farbgebung im CI.
- Platzierung rechts neben dem Titel, Höhe an die Titelzeile gekoppelt, mit weichem Gold/Violett-Glow als Sockel — voll klar, kein Wasserzeichen, keine Kanten.
- Leichte Float-Animation (wie beim alten Logo), damit er lebt.
- Der Affe wird als CDN-Asset eingebunden, damit die Spieldatei leicht bleibt.

## 2. Ruhiger Hintergrund, klare Karte
- Kein flächiger Affe mehr im Hintergrund; stattdessen dunkler Verlauf plus dezente Gold/Violett-Auren — nirgends ein sichtbares Bildrechteck.
- Die lokalen Abdunkel-Masken hinter How-to und Leaderboard werden zurückgenommen, weil sie nicht mehr gebraucht werden: Text sitzt wieder auf ruhigem Grund, die Farbe kommt vom Affen und den Auren.
- Ergebnis wird per Screenshot in Desktop- und Mobilbreite geprüft (Affe scharf, Titel ungestört, kein Überlappen).

## 3. Anzeigen immer oben sichtbar (Sticky HUD)
Beim Scrollen soll man Hunger, Stress, Cash und Monat immer sehen.

- Der Kopfbereich (Cash/Networth-Pills, Hunger- und Stress-Balken, Monatsleiste) bleibt beim Scrollen fest oben kleben — auf Desktop und Mobile.
- Beim Scrollen schrumpft der Kopf in einen **Kompakt-Modus**: kleinere Pills, dünnere Balken, weniger Höhe, damit er nicht das halbe Display frisst.
- Neu im HUD: Schnellzugriff **ESSEN** und **THERAPY** direkt neben den Balken — man sieht den Mangel und kann sofort reagieren, ohne zum Survival-Shop zu scrollen (gleiche Kosten und Wirkung wie im Shop, keine Balanceänderung).
- Balken färben sich ab kritischem Wert rot und pulsieren leicht.

## 4. Mobile angenehmer und übersichtlicher
Ziel: weniger Scrollen, klare Bereiche, große Tap-Flächen.

- **Untere Tab-Leiste** (fix am Displayrand): MARKT · PORTFOLIO · OPS · SHOP · STATS. Statt einer endlosen Spalte wird jeweils nur der gewählte Bereich gezeigt.
- Die drei Desktop-Spalten werden auf Mobile zu diesen Tabs; nichts geht verloren, es wird nur nicht mehr alles untereinander gestapelt.
- Der große Monats-Weiter-Button liegt fest über der Tab-Leiste, immer erreichbar.
- Panels auf Mobile kompakter: kleinere Paddings, Chart etwas flacher, Coin-Karten einspaltig mit größeren Buttons (min. 44 px Tap-Ziel).
- News-Ticker und Sentiment auf Mobile in eine schlanke Zeile zusammengelegt.
- Popups und Events füllen auf Mobile die Breite und sitzen mittig ohne Scroll-Sprung.

## Technische Notizen

## 5. Neue Hintergrundmusik (kräftiger)
Die aktuelle generative Ambient-Fläche ist zu lasch. Neu: ein richtiger Track mit Puls.

- Dunkler Synthwave/Trading-Floor-Loop: tiefer Bass-Puls, dezente Kick, Arpeggio in Gold/Violett-Stimmung — treibend, aber nicht nervig über 15+ Minuten.
- Produziert als echter Audio-Loop (ca. 90–120 s, saubere Schleife) und als CDN-Asset eingebunden, damit die Spieldatei leicht bleibt.
- Der bestehende Musik-Regler steuert weiter Lautstärke (Default etwas höher, ~40 %), 0 % = aus; Ducking bei Event-Sounds und Pause bei inaktivem Tab bleiben.
- Fallback: wenn der Loop nicht lädt, greift die bisherige generative Fläche.

## Technische Notizen
Alles in `public/game.html`:
- `.start-card::before` (Ape-Wasserzeichen) entfällt; neuer freigestellter Affe wird per `imagegen` erzeugt, als `lovable-assets`-Pointer eingebunden und im `.logo-hero` als `<img class="title-ape">` rechts neben dem Titel positioniert (Flex-Zeile, `clamp()`-Höhe, Float-Keyframe, Glow via `drop-shadow`).
- `.logo-hero::after` / `.howto::before` / `.leaderboard::before`-Backdrops entfallen; `#start-screen` bekommt statt des Affen zwei radiale Auren.
- `header` behält `position:sticky`; neue Kompakt-Klasse über einen Scroll-Listener plus HUD-Schnellbuttons, die die bestehenden Essen/Therapy-Funktionen aufrufen.
- Neue Media-Query bei 820 px: `main` einspaltig, Spalten als Panes mit `data-pane`, fixe `#mobile-tabs` schalten über eine kleine `setPane()`-Funktion; zusätzliches `padding-bottom` an `main`.
- Musik: neuer Loop via ElevenLabs Music generiert, als `lovable-assets`-Pointer eingebunden, im bestehenden Musik-Bus als `<audio loop>` abgespielt; generative Fläche bleibt als Fallback.
- Keine Änderungen an Spiellogik, Kosten, Difficulty oder XP.