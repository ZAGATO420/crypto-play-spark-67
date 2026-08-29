# Perp-Desk-Fenster reparieren + optischer Feinschliff

## 1. Der Bug (im Code bestätigt)

Der Button "OPEN PERP DESK" / "MANAGE PERP DESK" im P&L-Bereich ruft noch den **alten** Popup-Weg `v7PerpDesk()` auf. Der baut das alte Fenster `#v7m` und füllt es mit Markup, das es unter dem neuen V17-Layout in dieser Form nicht mehr gibt — deshalb steht ein leeres, dunkles Fenster da, das man nur über ✕ wieder loswird. Das neue Perp-Fenster (`v17Open('perp')`, Section-Tile bzw. PERPS im Dock) wird von diesem Button gar nicht angesprochen.

Fix:

- Beide CTA-Buttons (und der "⚡ OPEN PERP DESK"-Eintrag in Degen Ops) gehen künftig auf das **eine** neue Perp-Fenster.
- `v7PerpDesk()` bleibt als Name erhalten, leitet aber auf das V17-Fenster um, damit auch ältere Aufrufe (z. B. "+N MORE · OPEN PERP DESK" im Markt-Grid) korrekt landen.
- Das alte `#v7m`-Fenster wird zusätzlich abgesichert: schließt per ESC und per Klick auf den Hintergrund, und der 0,9-s-Timer aktualisiert kein "PERP DESK"-Legacy-Fenster mehr.
- Prüfung per Playwright bei 390×844, 1030×695, 1440×900: Klick auf jeden dieser Buttons öffnet das echte Perp-Fenster mit Leverage-Chips, Margin/Size und LONG/SHORT, ESC und Backdrop schließen, keine Konsolenfehler.

## 2. Was optisch noch machbar ist (Vorschläge)

Umsetzbar ohne Eingriff in Spiel-, Preis- oder Perp-Logik:

1. **Section-Tiles mit echten Grafiken** statt Emoji — die vorhandenen HD-Icons (Airdrop, Launchpad, Perps, Shop, Quest, Trophy) werden eingesetzt; auf allen Geräten scharf, kein Emoji-Kasten mehr.
2. **Chart im Börsen-Look**: klare Achsen, dezentes Raster, Einstiegs-Referenzlinie, weicher Verlauf unter der Kurve, tabellarische Ziffern (nichts flackert mehr beim Ticken).
3. **Markt-Kacheln aufwerten**: Coin-Logo größer, Preis in Mono, Monatsänderung als farbiger Chip, ruhiger Hover ohne Layoutsprung, gleiche Kachelhöhe in allen Reihen.
4. **Ein einheitliches Fenster-Design** für alle Popups (Trade, Perp, Position, Ledger, Ops) — gleiche Kopfzeile, gleiche Fußleiste mit Hauptaktion, weiche Abblende unten.
5. **Zahlen animieren** sanft beim Wechsel (Net Worth, PnL), Gewinn/Verlust pulsiert kurz farbig statt hart zu springen.
6. **Leere Zustände** bekommen Icon + einen Satz ("noch keine Position — Leverage 2x–50x") statt einer leeren Fläche.
7. **Kopfbereich beruhigen**: Net Worth als klare Gold-Zahl, Kennzahlen in gleicher Breite, Vitalbalken einheitlich dünn, Zeitsteuerung als Segment-Schalter.
8. **Handy-Politur**: Dock-Icons einheitlich, 44-px-Trefferflächen überall, aktive Ansicht deutlicher markiert, Rest-Overflow (aktuell ~19 px) auf 0 bringen.

Sag mir, welche Punkte rein sollen — ich kann auch alle 8 in einem Durchgang machen. Der Bugfix aus Teil 1 kommt in jedem Fall zuerst.

## Technische Notizen

Alles in `public/game.html`:
- `window.v7PerpDesk` → `if(window.v17Open){v17Open('perp');return}` (Fallback auf das alte Verhalten nur, wenn V17 nicht aktiv ist).
- Zeilen 6191 / 6225 / 4410 / 6346 auf denselben Aufruf ziehen.
- `#v7m`: ESC-Listener, Backdrop-Klick bleibt, `tick()`-Zweig für `v7m-title === 'PERP DESK'` entfernen.
- Nicht angetastet: Preise, historische Kurven, XP, Perp-Mathematik, Leaderboard, Story/Pacing.
