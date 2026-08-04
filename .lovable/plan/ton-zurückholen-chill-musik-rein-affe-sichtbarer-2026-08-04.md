# Ton zurückholen, Chill-Musik rein, Affe sichtbarer

## 1. Warum aktuell gar kein Ton kommt

Zwei bestätigte Ursachen im Spielcode:

1. Der Audio-Kontext wird erzeugt, aber nie „geweckt". Browser starten ihn seit Jahren im Zustand *suspended*; ohne ein `resume()` nach dem ersten Klick bleibt jeder Ton stumm. Im ganzen File existiert kein einziges `resume()`.
2. Beim Spielstart wird auf Mobilgeräten **dauerhaft** stummgeschaltet — es wird ein Mute-Flag im Browser-Speicher gesetzt. Wer das Spiel einmal auf dem Handy (oder in einem schmalen Fenster) gestartet hat, hat danach in diesem Browser für immer Ruhe, auch am Desktop.

Fix:
- `resume()` beim ersten Klick/Tap und beim Spielstart, plus erneut wenn der Tab zurückkommt.
- Das Zwangs-Mute auf Mobile entfällt. Stattdessen: Ton ist überall an, aber jederzeit über den Mute-Schalter aus. Alt-Nutzer mit gesetztem Mute-Flag werden einmalig zurückgesetzt.
- Sichtbarer Ton-Button (🔊/🔇) oben im Terminal-Header, damit man den Zustand sofort sieht und nicht in den Settings suchen muss.
- Danach jeden Sound-Auslöser durchtesten: Kauf, Verkauf, Moon, Rug, Level-Up, Liquidation, Klick, Monatswechsel, Endscreen.

## 2. Chillige Hintergrundmusik

Ein langsamer, dunkler Ambient-Loop im CI-Gefühl: tiefer Pad-Teppich, weiches Sub, sparsame Töne, kein Beat-Nervfaktor — bewusst so gebaut, dass er 15+ Minuten läuft ohne aufzufallen.

- Umsetzung als generierter Loop (ca. 90–120 s, sauber schleifend) als CDN-Asset, damit die Datei selbst leicht bleibt.
- Eigener Musik-Regler (der Slider existiert schon, hat aber bisher keine Funktion), Default eher leise (~30 %).
- Musik startet erst mit „START SURVIVAL", pausiert wenn der Tab inaktiv ist, blendet im Endscreen weich aus.
- Leichtes Ducking: während Ereignis-Sounds sinkt die Musik kurz ab, damit Feedback klar bleibt.
- Optional-Marker: Musik-aus wird separat vom SFX-Mute gespeichert.

## 3. Affe auf dem Startscreen sichtbarer

Aktuell liegt der Affe bei ~60–80 % Deckkraft hinter einer stark abdunkelnden Glas-Karte und verschwindet fast.

- Affe eine Ebene nach vorne holen und aufhellen: höhere Deckkraft, kräftigerer Glow in Gold/Violett.
- Statt der flächigen Abdunklung eine Lesbarkeits-Maske nur hinter Textblöcken (Titel, How-to, Formular, Leaderboard) — der Affe bleibt in den freien Zonen kräftig, der Text sitzt auf lokalem Kontrast.
- Karte etwas transparenter, dafür weiche Vignette an den Rändern, damit der Affe „im" Screen steht und nicht dahinter.
- Kontrolle per Screenshot (Desktop + Mobile), Ziel: Affe klar erkennbar, Text weiterhin voll lesbar.

## Technische Notizen
Alles in `public/game.html`:
- `initAudio()` mit `ctx.resume()`, Aufruf auch in einem einmaligen `pointerdown`-Handler und in `actuallyStartGame()`; Mobile-Mute-Block entfernen, Legacy-Flag einmalig migrieren.
- Neuer Musik-Layer: `<audio loop>` + GainNode-Bus, `setMusicVol()` wirkt jetzt real, `visibilitychange` pausiert/startet.
- Startscreen: `.start-card::before` (Opacity/Filter/Maske) und `.start-card`-Hintergrund anpassen, Textblöcke bekommen eigenen Backdrop.
