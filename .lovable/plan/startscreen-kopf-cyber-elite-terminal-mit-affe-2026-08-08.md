# Startscreen-Kopf: Cyber-Elite Terminal (mit Affe)

Ziel: Der obere Bereich auf Laptop/PC wirkt nicht mehr leer und billig, sondern wie das Login-Terminal einer Premium-Crypto-Börse. Der gekrönte Affe bleibt und wird fest in die Komposition eingebaut.

## 1. Obere linke Ecke füllen — Terminal-HUD
Statt leerer Fläche kommt links oben ein kleiner Status-Block:

- Grüner Puls-Punkt + `LIVE CONNECTION`
- Darunter eine Karte mit goldener Kante links: `ID: BOSS_PROT_03` und `TERMINAL: STABLE`
- Dezent, monospaced, klein — liest sich wie echte Systemtelemetrie, nicht wie Deko.

Rechts oben als Gegengewicht ein kleines `LIVE`-Badge in Gold.

## 2. Titel mit Wiedererkennungswert
Der Titel wird zur echten Wortmarke statt einer Zeile Gradient-Text:

- Zweizeilig gestapelt: **THE CRYPTO** in Weiß, darunter größer **FINAL BOSS** im Gold→Violett-Verlauf.
- Kursiv, sehr enge Laufweite, breite Display-Schrift (Russo One) — dieselbe Schrift wird später auch für Panel-Titel im Game nutzbar.
- Links am Titel eine vertikale Goldlinie, die nach unten ausläuft — verankert den Block optisch.
- Leichter Licht-Schimmer über dem Verlauf, kein Blinken.

## 3. Affe bleibt — jetzt Teil der Komposition
- Der gekrönte Boss steht weiter rechts, aber überlappt bewusst leicht die Kartenkante und den Titelblock, damit er "im" Screen steht und nicht daneben.
- Kronen-Glow und Bodenschein bleiben, werden aber etwas enger gefasst, damit sie den Titel nicht überstrahlen.
- Sanftes Floaten bleibt.

## 4. XP-Banner und Meta-Zeile aufräumen
- Der breite Gold→Violett-Balken wird eine dunkle Karte mit leuchtender Verlaufskante: Zeile 1 `XP MISSION` + `ACTIVE NOW`, Zeile 2 die Airdrop-Botschaft. Wirkt hochwertiger als der volle Farbbalken.
- Darunter eine feine Trennlinie und eine Meta-Zeile in zwei Spalten: `TIMELINE — JAN 2020 → DEC 2026` links, `STATUS — BALANCED` rechts.
- Feine Ecken-Akzente (Gold oben links, Violett unten rechts) rahmen die Karte.

## 5. Responsive
- Desktop/Laptop: HUD links, Titel links, Affe rechts in einer Zeile.
- Unter 820 px: HUD schrumpft in eine Zeile, Titel und Affe stapeln wie bisher, Affe kleiner. Kein Scroll-Zwang, keine Überläufe.
- Geprüft per Screenshot in Laptop-, Tablet- und Handybreite.

## Technische Notizen
Alles in `public/game.html`:
- Neue Display-Schrift `Russo One` per `<link>` im `<head>` mit `Inter 900 italic` als Fallback (die eingebetteten Inter/JetBrains-Fonts bleiben unverändert).
- `.logo-hero` wird zu einem Grid-Header: `hud` (links oben), `hero-text` (Titel), `ape-stage` (rechts, `grid-row: span 2`).
- Neues `.logo-title`-Markup mit zwei `<span>`-Zeilen plus `::before`-Goldleiste; `.logo-sub` wird zur zweispaltigen Meta-Zeile.
- `#airdrop-start-banner` bekommt Karten-Styling (dunkler Grund, Verlaufsrand über `padding`+`background`), Text bleibt inhaltlich gleich.
- `.ape-stage::before/::after` Radien leicht reduziert; `.title-ape` `margin-left` negativ für die Überlappung.
- Neue Media-Query bei 820 px und 560 px für den Header-Grid.
- Keine Änderungen an Spiellogik, Preisen, XP oder Leaderboard.
