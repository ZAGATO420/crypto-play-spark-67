# Preis-Neukalibrierung 2020–2026 + neue Presales & Launchpads

## 1. Alle Coins neu justieren (Monat 0 = Jan 2020, Monat 83 = Dez 2026)

Jede der 22 Coin-Kurven wird Monat für Monat gegen die echte Historie geprüft und korrigiert. Fokus:

- **SOL**: aktuell Aug 2026 = $48 im Spiel. Echtwert heute ca. **$73** → SOL-Reihe ab 2024 nach oben korrigiert, Aug 2026 auf ~73, davor konsistente Übergänge (kein Sprung).
- **BTC / ETH / DOGE / SHIB / PEPE / WIF / BONK**: Reihen in `HIST` gegen echte Monatsschlusskurse geprüft und angepasst.
- **ADA, DOT, LINK, AVAX, MATIC, UNI, AAVE, TAO, ARB, OP, SUI, APT, SEI, TIA**: Diese haben heute **keine** eigene Kurve, sondern werden aus einer Formel erfunden (`getHistPrice`-Fallback). Das ist der Hauptgrund für unrealistische Werte. Sie bekommen jeweils eine echte Monatsreihe mit korrektem Listing-Monat (ARB Mar 2023, SEI Aug 2023, TIA Okt 2023, MATIC-Bullrun 2021, AVAX-Peak 2021, LINK-Peak Mai 2021 usw.).
- Der Formel-Fallback bleibt nur noch als Notfall für Lücken.

## 2. Ab August 2026 in die Zukunft: bullisher

Ab Monat 79 (Aug 2026) gibt es keine echten Daten mehr. Diese Phase (Aug–Dez 2026) wird neu modelliert:

- Trend dreht von den heutigen fallenden Reihen auf **aufwärts** — leichter Q4-Bullrun statt Bärenmarkt.
- Grössenordnung: BTC/ETH klar über dem Aug-26-Stand ins Jahresende, Alts und Memes stärker (höheres Beta), aber mit Rücksetzern, damit es keine Einbahnstrasse wird.
- Der Übergang bleibt stufenlos (kein Preissprung an der Naht), Monatsvolatilität bleibt erhalten.

## 3. Presales & ICOs: mehr, echt datiert, ohne Wiederholung

Heute ziehen Presales aus einer flachen Namensliste ohne Zeitbezug — deshalb kann 2020 schon "Fartcoin" auftauchen und im Historical-Modus wirkt es beliebig.

Neu:
- Jeder Presale bekommt ein **Zeitfenster** (Start-/Endmonat). Angeboten wird nur, was in diesem Monat historisch real war.
- Jeder bekommt ein **echtes Ergebnis**: Win (z. B. YFI, Raydium, Jupiter, EigenLayer, Hyperliquid) oder Rug/Kollaps (z. B. Squid Game Token, AnubisDAO, Uranium Finance, Meerkat, Frosties, Evolved Apes, Thodex).
- **Pool wird stark erweitert** (Ziel ~140–150 Einträge über 2020–2026), damit in 84 Monaten nichts doppelt kommt: zusätzliche echte Sales/ICOs/IDOs/NFT-Mints und zusätzliche echte Rugs pro Jahr.
- Anti-Repeat wird hart: einmal angeboten = für den Rest des Runs verbraucht.
- Die Presale-Karte zeigt im Historical-Modus Jahr/Kontext, damit die Ära erkennbar ist.

## 4. Launchpad / Sniping: mehr Variation

Aktuell rotieren nur 20 Fantasienamen ($WIF, $PEPE2 …), deshalb wiederholt sich alles schnell.

Neu:
- Launchpad-Pool wird deutlich erweitert und in **Ären** aufgeteilt (2020/21 Uniswap-Fair-Launch, 2021 BSC/Pancake, 2022 Bärenmarkt, 2023 Base/Meme, 2024 Solana/pump.fun, 2025/26 KI-Agenten) — nur passende Namen erscheinen im jeweiligen Zeitraum.
- Kein Name wiederholt sich innerhalb eines Runs.
- Im Historical-Modus sind real existierende Namen echt hinterlegt (Rug bleibt Rug, Moon bleibt Moon); reine Fantasienamen behalten Zufall.
- Mcaps und Rug-Raten passen zur Ära (2021 grössere Mcaps, 2024 pump.fun-Mikro-Mcaps mit hoher Rug-Rate).

## Technische Notizen

Alles in `public/game.html`:
- `HIST` wird auf alle 22 Coins erweitert; `getHistPrice` behält den Fallback nur für Lücken.
- Monate 79–83 in allen Reihen bullisch nachgezogen.
- `PRESALE_NAMES` + `HISTORICAL_WINS` werden zu `PRESALES=[{name,from,to,real,mult,note}]`; `refreshPresales()` filtert nach `state.month` und `usedPresales`.
- `LAUNCH_NAMES` wird zu `LAUNCHES=[{n,from,to,type?}]`; `refreshLaunches()` filtert nach Ära und merkt verbrauchte Namen in `state.usedLaunches`.
- Bestehende Balance (Kosten, Hype/Scam-Werte, XP) bleibt unverändert.