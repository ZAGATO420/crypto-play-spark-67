# Affe randlos, HUD immer sichtbar, Mobile-Feinschliff

## 1. Affe ohne sichtbaren Bildrand (Desktop)
Aktuell liegt der Affe als Ebene **innerhalb** der Startkarte (`.start-card::before`, 124 % breit, Karte mit `overflow:hidden`). Deshalb schneidet die Karte das Bild ab und man sieht auf dem Laptop eine harte Kante quer durchs Menü.

- Der Affe wandert aus der Karte heraus in eine eigene, bildschirmweite Ebene hinter der Karte.
- Weiche Feder-Maske an allen vier Rändern (nicht nur unten), damit das Bild nirgends abrupt endet.
- Karte bleibt Glas, aber es wird nichts mehr abgeschnitten — kein Rechteck, keine Kante.

## 2. Kräftigere Farben, wo kein Text steht
- Affe deutlich präsenter: mehr Sättigung und Kontrast, stärkerer Gold/Violett-Glow — bewusst kräftig in den freien Zonen links, rechts und oben.
- Lesbarkeit über lokale Masken: der abdunkelnde Backdrop sitzt nur direkt hinter Titel, How-to, Formularspalten und Leaderboard, nicht flächig über dem ganzen Screen.
- Ergebnis: Farben knallen dort, wo Fläche frei ist; Text bleibt auf dunklem Sockel voll lesbar. Kontrolle per Screenshot in Desktop- und Mobilbreite.

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
Alles in `public/game.html`:
- `.start-card::before` entfällt; neue Ebene auf `#start-screen` mit `position:fixed`, radialer Rand-Feder-Maske und höherer Saturation; Karte ohne Clip.
- `header` behält `position:sticky`; neue Kompakt-Klasse über einen Scroll-Listener plus HUD-Schnellbuttons, die die bestehenden Essen/Therapy-Funktionen aufrufen.
- Neue Media-Query bei 820 px: `main` einspaltig, Spalten als Panes mit `data-pane`, fixe `#mobile-tabs` schalten über eine kleine `setPane()`-Funktion; zusätzliches `padding-bottom` an `main`.
- Keine Änderungen an Spiellogik, Kosten, Difficulty oder XP.