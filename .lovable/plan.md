# Warum die Coins verschwinden — und wie wir das fair lösen

Du hast nichts übersehen. Es ist auch kein Rechenfehler, aber es ist unfair gebaut: Wenn du zu Monatsbeginn dein ganzes Geld in Coins steckst, kommen beim Monatswechsel Miete und Lebenskosten. Ist dann kein Bargeld mehr da, verkauft das Spiel **automatisch deine Coins**, um die Rechnung zu zahlen — und in genau diesem Fall **ohne jede Meldung**. Deshalb sind die Bags plötzlich weg und es sieht nach einem Bug aus.

Zusätzlich gibt es einen Abschlag (Gebühr + 3 % Notverkaufs-Verlust), du verlierst also auch noch Geld dabei.

## Was ich ändere

**1. Vorwarnung statt Überraschung**
Über dem NEXT-MONTH-Button steht künftig immer, was der nächste Monat kostet und ob dein Bargeld dafür reicht. Reicht es nicht, wird der Hinweis rot: "Nächster Monat: 1.240 $ — dein Cash reicht nicht, Coins werden verkauft."

**2. Nachfrage vor dem Zwangsverkauf**
Klickst du trotzdem auf NEXT MONTH, kommt eine kurze Rückfrage: Coins verkaufen lassen (mit Angabe, wie viel), oder abbrechen und selbst verkaufen. Kein stiller Griff mehr in deine Bags.

**3. Klare Meldung im Nachhinein**
Jeder automatische Verkauf erzeugt eine sichtbare Meldung und einen Eintrag im Verlauf, mit Coin, Betrag und Verlust durch den Notverkauf — genau wie es die späteren Zwangsliquidationen schon machen.

**4. Puffer beim Kaufen**
Beim Kauf-Regler ist die Maximalsumme künftig nicht mehr das ganze Bargeld, sondern lässt die Lebenskosten des kommenden Monats stehen. Über den Puffer hinausgehen kannst du weiter — nur nicht mehr versehentlich.

## Was gleich bleibt

Kosten, Miete, Steuern, Schwierigkeitsgrade, Preise, Perps, XP und Score bleiben unverändert. Es geht nur um Transparenz und den Schutz vor dem versehentlichen Total-Einsatz.

## Technische Notizen

Alles in `public/game.html`:
- `nextMonth()`: der erste `emergencyRaise(short+50)`-Zweig (ohne Toast) bekommt Meldung + `addNews()`.
- Neuer Vorab-Check vor `state.month++`: berechnet die Monatskosten wie `monthlyCost` und zeigt Warnung/Bestätigung; Ironman umgeht die Bestätigung nicht, wird aber vorgewarnt.
- Kostenanzeige über dem NEXT-MONTH-Button (`state._monthlyCost` wird bereits gesetzt, wird künftig vorab berechnet).
- `renderMarket()`: `maxBuy` berücksichtigt einen Reserve-Betrag; Reserve als eigener Chip sichtbar.
- QA: Playwright-Run bei 390×844 und 1280×800 — sofort alles in Coins stecken, NEXT MONTH drücken, prüfen dass Warnung, Rückfrage und Meldung erscheinen und Zahlen zusammenpassen.
