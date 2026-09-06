# V41 — Progression, Boss-Action und Gefühl im Terminal

## Was heute fehlt (im Code geprüft)

Die neue Spieloberfläche (`#v40-shell`) zeigt Konto, Coin, Chart, Aktionen, Positionen und Survival — aber **kein Level, keine XP-Leiste, keinen Fortschritt, keine Erfolgs-Momente und keine sichtbare Perp-Position**. Die XP-Anzeige existiert nur noch in der alten, ausgeblendeten Oberfläche (`.xp-wrap`, `#xp-badge`, `#xp-fill`, `#xp-num`), deshalb wirkt der Run kalt: es gibt nichts, worauf man hinarbeitet, und keine Belohnung, wenn etwas gelingt.

Positionen (Spot und Perp) sind rechts in einer Rail — auf dem Handy ist sie ausgeblendet, sichtbar nur über den Reiter. Ein laufender Perp-Trade ist damit während des Spielens unsichtbar.

## 1. Progressions-Band: immer sichtbar

Direkt unter dem Kontoband ein permanentes Fortschrittsband:

- Level-Abzeichen + Titel (z. B. `LVL 7 · SIZE LORD`), XP-Leiste mit Füllstand, `XP / nächstes Level`.
- Sichtbarer Sprung: Bei XP-Gewinn läuft die Leiste animiert weiter, die Zahl zählt hoch, `+40 XP` fliegt am Ort der Aktion auf.
- Level-Up ist ein Moment: kurzer Goldblitz über dem Band, Boss reagiert, Titel wechselt, ein Sound — nicht als wegklickbares Popup.
- Daneben: Streak, Kapitel/Akt und Monatsziel-Fortschritt als kleine Ringe, damit „es geht weiter“ auf jedem Bildschirm sichtbar ist.

## 2. Positionen und Perps ohne Umwege

- Offene Positionen erscheinen **auf der Hauptbühne** unter dem Chart: pro Zeile Coin, Größe, Einstieg, aktueller P&L in Grün/Rot und bei Perps Hebel + Abstand zur Liquidation als farbiger Balken.
- Der aktive Coin zeigt seine eigene Position direkt im Kopf der Bühne (Bestand, Einstieg, P&L) — kein Reiterwechsel nötig.
- Perp-Zeilen haben `CLOSE` direkt an der Zeile.
- Nähert sich eine Liquidation, pulsiert die Zeile ruhig und der Balken wird rot — Spannung, ohne Meldungsflut.
- Auf dem Handy bleibt eine kompakte Positions-Leiste sichtbar, wenn Positionen offen sind; ohne Positionen verschwindet sie.

## 3. Live-Verlauf: was passiert und was passiert ist

- Ein schmaler Aktivitäts-Stream auf der Bühne (Desktop rechts, Handy als eine Zeile mit Antippen zum Ausklappen): Käufe, Verkäufe, XP, Airdrops, Liquidationen, Quests, Ereignisse — mit Monat und Betrag.
- Jeder Monatswechsel erzeugt eine kurze Bilanzzeile („MONAT 14 · +$8.420 · XP +60 · Streak 3“) statt mehrerer Toasts.
- Am Monatsanfang eine klare Boss-Order mit Belohnung; am Monatsende sichtbar bestanden/nicht bestanden, mit XP-Gutschrift an derselben Stelle.

## 4. Erfolgsmomente und Boss-Action

- Belohnungen werden gefeiert: Treffer-Blitz an der Zahl, die sich ändert, kurzer Zahlen-Countup, Coin-/Funken-Partikel bei Gewinn, dumpfer Schlag bei Liquidation.
- Der Boss reagiert stärker: Bildwechsel je Lage, eine Zeile Klartext („Du hast den Winter überlebt. Weiter.“), Rahmen leuchtet bei Level-Up gold, bei Gefahr rot.
- Meilensteine (erste $100k, erstes Level 10, überlebtes Kapitel) bekommen einen kurzen, eleganten Vollbild-Moment (max. 1,5 s, kein Klick nötig).
- Musik reagiert: ruhiger Groove im Normalfall, dunklere Variante bei kritischem Survival oder hohem Hebel, Aufheller bei Level-Up — über die bestehenden Regler steuerbar.

## 5. Optik auf Pro-Level

- Das blaue Command Deck bleibt, bekommt aber Tiefe: klarere Hierarchie (Netto-Wert dominant, Rest ruhig), präzise Linien, echte Zustände für Hover/Aktiv/Gesperrt, weiche 150-ms-Übergänge statt harter Sprünge.
- Neongelb bleibt die Aktionsfarbe (Hauptaktion, MONTH, Belohnungen), Cyan Navigation, Gold Boss/Kontostand, Grün/Rot ausschließlich Gewinn/Verlust.
- Alle Fenster (Trade, Perp, OPS, Shop, Karten) behalten die eine Sprache; keine abgeschnittenen Inhalte, feste Bestätigungszone unten.
- `prefers-reduced-motion` schaltet alle Effekte auf ruhig.

## Abnahme

- Prüfung bei 375×677, 390×844, 430×932, 768×1024 und 1280×800.
- Level-Band, Boss-Order, Hauptmarkt, mindestens eine Aktion und die Navigation sind auf dem ersten Handybildschirm gleichzeitig sichtbar.
- Perp öffnen → Position sofort auf der Bühne sichtbar, mit P&L und Liquidationsabstand; schließen funktioniert von dort.
- Zwölf Monate am Stück: XP steigt sichtbar, Level-Up wird gefeiert, Verlauf stimmt, höchstens eine Vollbildkarte pro Monat, keine Fehler in der Konsole.
- Kein horizontales Scrollen, kein Flackern, keine verdeckten Zahlen, jede Tippfläche mindestens 44 px.

## Technische Notizen

Alles in `public/game.html`, Spielmotor unverändert:
- Neues `#v40-prog`-Band in der Shell, gespeist aus `calculateXP()`/`state.xp`/`levelFor()`; die alte `.xp-wrap` bleibt als versteckte Rechenquelle.
- Positions-Block in `.v40-stage` aus `state.holdings`/`state.avg`/`state.perps`; Liquidationsabstand aus der bestehenden Perp-Mathematik, kein Neuberechnen.
- Aktivitäts-Stream als Ringpuffer `state._feed` (max. 40), gefüllt an den bestehenden Stellen von `toast()`/`awardXP()` — ohne die Aufrufer zu ändern.
- Level-Up/Meilenstein-Effekte über `#xp-layer` und eine neue leichte Effektschicht; Sounds über bestehendes `playSound()`.
- Musik-Zustand über die vorhandenen Crossfade-Betten (`trade`/`heat`), nur Umschaltbedingungen ergänzen.
- Unberührt: historische Kurse 2020–2026, XP-Formeln und Multiplikatoren, Kosten/Emissionen, Perp-/Liquidationsmathematik, Save-State, Leaderboard, Endscreen-Bewertung.
