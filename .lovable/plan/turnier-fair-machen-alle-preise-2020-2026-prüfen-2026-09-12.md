# Turnier-fair machen + alle Preise 2020–2026 prüfen

Zwei Dinge: die Kursreihen aller 22 Märkte werden Monat für Monat gegen echte Kurse geprüft und korrigiert, und ein Turnierlauf läuft künftig für alle unter exakt denselben Bedingungen.

## 1. Turnierlauf wird komplett fixiert

Heute ist der Zufall im Turnier für alle gleich (gleiche Crashs, Rugs, Launches, Minispiele, gleicher Twist), aber jeder darf noch Schwierigkeit, Spielmodus, Charakter und Ironman frei wählen. Weil der Charakter unterschiedlich viel Startgeld gibt und der Chaos-Modus ganz andere Kursschwankungen erzeugt, sind die Ergebnisse nicht vergleichbar.

Neu im Turnier:
- Schwierigkeit, Spielmodus, Ironman und Twist sind fest und werden nur angezeigt, nicht gewählt.
- Startgeld ist für alle identisch; der Charakter bleibt nur als Aussehen/Rolle sichtbar, ohne Vorteil.
- Frei bleiben nur Name, Land, Avatar und die Wallet.
- Im Setup steht sichtbar: „Turnierbedingungen — für alle gleich“ mit der Liste der festen Werte.
- Der freie Run bleibt genau wie heute vollständig einstellbar.

Zusätzlich prüft der Server beim Eintrag, dass ein Turnierlauf wirklich die Saisonbedingungen hatte. Läufe mit abweichender Schwierigkeit oder abweichendem Modus landen nur im ALL-TIME-Board, nicht in der Turnierwertung.

## 2. Alle 22 Märkte: Preise 2020–2026 nachprüfen

- Für jeden Markt wird die Monatsreihe (84 Monate, Januar 2020 bis Dezember 2026) gegen echte Monatsschlusskurse abgeglichen und korrigiert.
- Bisher haben nur BTC, ETH, SOL und DOGE echte Monatswerte; die anderen 18 laufen über gröbere Quartalswerte, die zu Monatswerten gestreckt werden. Diese bekommen echte Monatsreihen.
- Geprüft werden besonders: korrekter Listing-Monat (kein Kurs vor der Existenz eines Coins), die echten Einbrüche (März 2020, Mai 2021, Luna, 3AC, FTX, der Flush 2025) und die echten Hochs.
- Für 2026 gibt es naturgemäß keine vollständige Historie: bis zum heutigen Monat werden echte Kurse eingesetzt, danach läuft die bisherige erfundene Fortsetzung weiter — ohne Sprung an der Naht.
- Der Live-Ticker auf der Startseite bleibt unverändert und zeigt weiter echte Tageskurse.

## Technische Notizen

- `src/game/journey-data.ts`: `COINS` erhält für alle Symbole vollständige 84-Monatsreihen; der Quartals-Interpolator `fromQuarters` entfällt bzw. bleibt nur als Notfall. Recherche der Monatsschlusskurse pro Coin über parallele Recherche-Subagents.
- `src/game/CryptoJourney.tsx`: `SetupScreen` blendet im Turnier die Regler für Schwierigkeit, Modus, Ironman und Twist aus und setzt sie auf die Saisonwerte (`NORMAL`, `classic`, kein Ironman, `tournamentModifier(season)`); `freshRun` nutzt im Turnier ein festes Startkapital statt `archOf(...).cash`; Anzeige der festen Bedingungen im Setup und im Run-Kopf.
- `src/routes/api/public/leaderboard.ts`: bei `is_tournament` werden `difficulty`/`mode` gegen die Saisonvorgabe geprüft; Abweichung wird gespeichert, aber als freier Lauf gewertet.
- Verifikation: zwei Turnierläufe derselben Saison zeigen identische Ereignisfolge und identisches Startgeld; ein freier Lauf bleibt frei konfigurierbar; Stichproben der Kursreihen (Peaks/Crashs/Listings) gegen echte Werte; Typecheck, Build, Mobil 393 px und Desktop ohne Overflow oder Fehler.

## Hinweis

Ein Punkt bleibt offen und ist ohne größeren Umbau nicht lösbar: das Ergebnis wird im Browser berechnet und dann gemeldet. Der Server begrenzt unplausible Werte, kann aber einen manipulierten Lauf nicht sicher ausschließen. Für ein Preisgeld-Turnier ist das vertretbar, solange du Top-Ergebnisse vor der Auszahlung kurz prüfst; echte Manipulationssicherheit bräuchte eine serverseitige Nachrechnung des ganzen Laufs.
