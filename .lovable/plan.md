# Phase 1: Die Quartalsentscheidung als Bühne

Nur die Hauptentscheidung pro Quartal (TAKE THE RISK / PLAY IT SAFE) bekommt die neue Bühne. Missionen, Ereignisse, Presale, ICO und Bosskampf bleiben in dieser Phase genau wie jetzt.

## Skizze (Handy, Hochformat)

```text
+-----------------------------------+
| Q3 2021   $54.200   Stress Hunger |  Kopfzeile bleibt wie sie ist
+-----------------------------------+
|                                   |
|   [ grosses Boss-Portraet,        |
|     Stimmung je nach Lage:        |
|     ruhig / spoettisch /          |
|     unter Druck / wuetend ]       |
|                                   |
|  ~~~~ Live-Chart laeuft halb-  ~~ |  Chart liegt halbtransparent
|  ~~~~ transparent ueber dem   ~~  |  im unteren Drittel der Buehne,
|  ~~~~ Boss weiter          o  ~~  |  gelber Punkt = jetzt
|                                   |
+-----------------------------------+

Schritt A (ca. 2,5 s)  Ereignistext erscheint gross auf der Buehne:
        "ALTCOINS SIND UEBERHITZT."
        "Der Boss wartet, dass du gierig wirst."
        -> verblasst

Schritt B  Zwei grosse Karten fahren von unten herein:
+----------------+  +----------------+
|  [Flammen-     |  |  [Schild-      |
|   Illustration]|  |   Illustration]|
| TAKE THE RISK  |  | PLAY IT SAFE   |
| ORDER | $1.600 |  | Gewinne sichern|
| Du setzt ...   |  | Du setzt ...   |
| Gewinn bis ... |  |                |
| Risiko ...     |  |                |
+----------------+  +----------------+
     [ MEHR ]  (Trading Desk als eigenes Popup)

Schritt C  Antippen einer Karte = Stopp-Moment
        Auf dem Chart pulst ein Ring genau an der Stelle,
        an der getippt wurde, mit Kurzlabel:
        "GUTER EINSTIEG" / "MITTE" / "SPAETER EINSTIEG"
        Danach oeffnet sich wie bisher das Minigame.
```

Desktop ab 1024px: gleiche Bühne in der linken Spalte, Boss größer, Karten nebeneinander unter dem Ereignistext. Rechte Spalte bleibt wie jetzt.

## Was der Spieler sieht

1. **Boss als Bühnenbild:** Das Porträt füllt die Arena. Die Stimmung folgt der Lage, die das Spiel schon kennt (hoher Stress/Hunger = wütend, Siegesserie = spöttisch, sonst ruhig). Es werden nur vorhandene Bilder verwendet: ruhig, spöttisch, unter Druck, wütend und geschlagen. Bessere Auflösung kommt erst, wenn du nach Phase 1 noch mehr Schärfe willst.
2. **Ereignistext:** Die Quartalssituation (Text, der jetzt schon im Spiel steht) erscheint kurz groß auf der Bühne und verblasst. Antippen überspringt ihn. Beim Neuladen wird er nicht wiederholt, wenn schon gehandelt wurde.
3. **Zwei Karten statt zwei Knöpfe:** Gleiche Beschriftung und Zahlen wie heute (Einsatz, mögliche Belohnung, Risiko), dazu eine große Illustration. Gesperrte oder schon gespielte Karten werden grau mit „GESPIELT | NOTE 82 %“.
4. **Tippen ist der Stopp:** Der Moment, in dem man tippt, gilt schon heute als Timing (MOMENTUM). Neu ist nur: Ein Ring pulst an genau dieser Stelle auf der Kurve, damit man sieht, wo man gelandet ist.
5. **Geld zählt sichtbar:** Vermögen und Cash in der Kopfzeile laufen bei jeder Änderung hoch oder runter, statt zu springen. Kurz blitzt die Differenz auf (+$420 / −$180).
6. **Trading nur als Popup:** Über MEHR öffnet sich der Trading Desk als zentriertes Fenster mit eigener Animation. Solange es offen ist, wird die Bühne ausgeblendet statt dahinter sichtbar.

Die Einführung für neue Spieler (Schritt 1 „BTC kaufen“, Schritt 2 „Quartal beenden“) bleibt erhalten und wird in Kartenform gezeigt.

## Grenzen (fest)

- Keine Änderung an Berechnung, Formeln, Seed, `verify.ts`, `runlog.ts` oder Datenbank.
- Die Karten rufen exakt dieselben Funktionen auf wie die heutigen Knöpfe (`riskMove`, `safeMove`, `openSpot`, `endChapter`). Keine neue Bedingung, kein neuer Spielwert.
- Der Ring zeigt nur die Position, die das Spiel ohnehin schon für das Timing liest. Er beeinflusst nichts.
- Ereignistext und Kartenanimation verzögern das Spiel nicht: Die Quartalsuhr läuft wie jetzt. Die bestehende Pause vor dem ersten Zug bleibt.

## Technische Details

- Neue reine Darstellungskomponente `src/game/Stage.tsx` (`StageBoss`, `StageHeadline`, `StageCards`, `TapPulse`), eingebunden im `phase === "act"`-Block von `CryptoJourney.tsx` anstelle von `.cy-moves`. `cy-market-visual` bleibt bestehen und wird per CSS als Bühnenhintergrund positioniert.
- Boss-Bild-Auswahl als reine Ableitung aus vorhandenem State (`run.stress`, `run.hunger`, `run.streak`) und vorhandenen Assets (`crowned`, `smug`, `stressed`, `enraged`, `broken`).
- Ring: liest `currentChartX/currentChartY` im Klick-Moment (lokaler UI-State, verfällt nach 900 ms). Das Label wird aus dem schon berechneten `timing.z` gebildet, wenn es vorhanden ist.
- Zählende Zahlen: die vorhandene `Count`-Komponente wird für Vermögen und Cash in der Kopfzeile verwendet, plus eine kurze Differenz-Einblendung. Bei Reduced Motion springen die Werte sofort.
- Trading-Popup: `.cy-scrim`/`.cy-sheet` bekommen eine Öffnen-Animation. Bei offenem Markt-Dialog bekommt die Arena eine Klasse, die sie ausblendet.
- CSS in `src/styles.css` unter eigenem `cy-stage-*`-Präfix. Mobile zuerst, Desktop additiv ab 1024px.

## Prüfung vor dem OK

- Playwright auf 393×852, 430×932 und 1440×900: Ereignistext → Karten → Tippen → Ring → Minigame → Geld zählt.
- Ein echter Turnier-Run wird eingereicht und muss vom Server weiterhin als **verifiziert** angenommen werden. Danach wird der Testeintrag gelöscht.
- Neue Spieler, Neuladen mitten im Quartal und die Karte „QUARTER CLOSED“ funktionieren weiter.
- Danach stoppe ich und warte auf dein OK für Phase 2.
