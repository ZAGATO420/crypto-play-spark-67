# V3 Polish: Terminal-Farben, Degen Ops & echtes Perp-Trading

## 1. Die Farbe der Reiter-Karten beruhigen
Der Gold-zu-Violett-Verlauf auf dem aktiven Filter-Chip (ALL / TOP / MEME / HOLD) knallt allein im Terminal und passt nicht zum restlichen Karten-Look.

Neuer aktiver Zustand statt Volltonverlauf:
- dunkle Glas-Fläche wie die Coin-Karten, dünne Gold-Hairline, Gold-Text
- ein 2px Gold-Balken unter dem aktiven Chip plus dezenter Glow
- Verlauf bleibt nur dort, wo er wirkt: Start-CTA und Level-Up

Gleiche Logik für die Degen-Ops-Reiter, damit Terminal und Sidebar eine Sprache sprechen.

## 2. Degen Ops (Airdrops / Launchpad / Perps) polieren
- Reiter werden zu kleinen Karten mit Icon, Titel und Live-Badge (z. B. Anzahl offener Farms / Bags / Positionen)
- Zeilen werden zu Mini-Karten im Archetype-Stil: Hover-Lift, Hairline-Top, klare Hierarchie (Name gross, Meta klein, Aktion rechts)
- Airdrops: Fortschrittsbalken bis zum Claim statt "claim in X mo" als Text
- Launchpad: Audit-Ergebnis als farbiges Chip (CLEAN / MID / MINT OPEN / NO SELL), Hype als kleine Balkenanzeige
- Side-Quest-Ticketbutton wird eine eigene Karte mit Ticket-Punkten (1/2) statt eines breiten Buttons

## 3. Perp-Trading richtig ins Terminal
Heute kann man nur Leverage schieben und LONG/SHORT drücken, die Margin (12 % Cash) wird automatisch gesetzt. Das wird ein echter Trading-Desk im Terminal:

- Neuer Terminal-Modus **⚡ PERPS** neben ALL / TOP / MEME / HOLD. Das Grid zeigt dann Perp-Karten im gleichen Look wie die Coin-Karten.
- Pro Karte einstellbar:
  - **Margin-Betrag**: Slider + Eingabefeld + Schnell-Chips 10 % / 25 % / 50 % / MAX
  - **Leverage pro Position**: 2x – 50x (nicht mehr global)
  - Live-Vorschau: Positionsgrösse, Entry, geschätzter Liquidationspreis, Fee
  - LONG (grün) und SHORT (rot) bleiben farblich wie gewünscht, alles andere im CI
- **Offene Positionen** als eigene Karten: Live-PnL in $ und %, Balken "Abstand zur Liquidation", Buttons CLOSE 50 % und CLOSE ALL
- Degen Ops behält nur eine kompakte Perp-Übersicht mit Link "im Terminal öffnen"

Spielbalance bleibt unangetastet: Risiko-, Stress- und Liquidations-Formeln wie jetzt, Standard-Margin bleibt 12 % wenn nichts eingestellt wird, max. 3 offene Positionen.

## Technische Notizen
Alles in `public/game.html`:
- CSS: `.tc-btn.active`, `.dg-tab`, `.dg-tab.active`, `.dg-row` -> neue Karten-Klassen; neue `.perp-card`, `.liq-bar`
- `setFilter()` erweitern um Modus `PERPS`; `renderMarket()` verzweigt in `renderPerpDesk()`
- `openPerp(sym, dir)` bekommt Parameter für Margin und Leverage; State pro Symbol in `state._perpDraft`
- `closePerp(i, silent, fraction)` für Teil-Schliessung; Liquidationspreis als reine Anzeigefunktion aus vorhandener `perpPnl`-Logik abgeleitet
- `renderDegenOps()` Perp-Tab auf Übersicht reduzieren
