# V42 — Überleben immer sichtbar: Hunger, Stress, EAT und CALM

## Was ich nachgestellt habe

Im laufenden Spiel bei 390×844 ist auf der Hauptansicht **kein Hunger, kein Stress und kein EAT/CALM zu sehen**. Die Survival-Anzeige liegt versteckt unter `POSITIONS`, auf dem Handy also zwei Klicks entfernt. Genau deshalb verhungern Spieler, ohne zu merken, dass sie etwas hätten tun können. Auf dem Desktop steht sie ganz unten in der rechten Spalte, außerhalb des sichtbaren Bereichs.

## 1. Permanenter Survival-Streifen

- Direkt unter dem Level-/XP-Band kommt eine schmale, immer sichtbare Zeile: **HUNGER** und **STRESS** als kompakte Balken, daneben **EAT** und **CALM** mit aktuellem Preis auf dem Knopf.
- Sichtbar in jeder Ansicht (Markt, Chart, Positionen, Ops) und auf jeder Größe — nie ausgeblendet, nie ausgeklappt.
- Tippflächen mindestens 44 px, Preis direkt am Knopf, damit klar ist, was es kostet.
- Reicht das Geld nicht, bleibt der Knopf sichtbar, ist aber klar gesperrt mit kurzem Grund.

## 2. Warnung, bevor es zu spät ist

- Ab kritischem Hunger oder Stress färbt sich der Balken, pulsiert ruhig und der Boss reagiert sichtbar („Du isst seit drei Monaten nichts").
- Eine einzige, nicht blockierende Warnzeile pro Monat statt Popup-Flut.
- Nach EAT oder CALM gibt es sofortiges Feedback an genau der Stelle: Balken springt sichtbar zurück, kurzer Treffer-Effekt, Eintrag im Run-Log.

## 3. Doppelungen aufräumen

- Die alte Survival-Kachel unter `POSITIONS` und die versteckte Desktop-Variante entfallen, damit es nur noch eine Stelle gibt.
- Der Platz auf der Positions-Ansicht geht an die offenen Trades.

## Abnahme

- 375×677, 390×844, 430×932, 768×1024 und 1280×800: Hunger, Stress, EAT und CALM sind auf dem ersten Bildschirm in allen vier Ansichten sichtbar.
- EAT und CALM funktionieren, Preis stimmt, Werte ändern sich sofort, Run-Log zeigt den Eintrag.
- Kein horizontales Scrollen, nichts abgeschnitten, keine Konsolenfehler; zwölf Monate am Stück laufen sauber durch.

## Technische Notizen

- Alles in `public/game.html`, Spiellogik unverändert: `buyItem('food')` / `buyItem('therapy')`, `itemPrice()`, Hunger-/Stress-Formeln und Kosten bleiben wie sie sind.
- Neuer Streifen `#v42-surv` im V41-Block, gerendert im bestehenden `sync()`-Takt; Aktionen laufen über die vorhandene `data-v40-act`-Delegation (`eat`, `calm`).
- `vitals()` in der V40-Shell rendert künftig nur noch den neuen Streifen; `#v40-vitals` und `#v40-mobile-vitals` werden entfernt statt zusätzlich überschrieben.
- Warnzustand nutzt vorhandene Schwellen und `prefers-reduced-motion`.
