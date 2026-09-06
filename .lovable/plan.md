# Wettbewerbssicher: Score, Trading und Leaderboard

## Bestätigte Fehler
- Die mobile Kopfzeile hat keine feste Breitenaufteilung. Ab siebenstelligen Beträgen kann Net Worth in den Boss Score laufen.
- Der Server akzeptiert nur 6 Länder, die Spielauswahl aber 24. Runs aus z. B. Österreich, UK, Kanada oder Australien werden deshalb als „invalid payload“ abgewiesen. Das erklärt den wiederkehrenden Eintragsfehler.
- Ein Spot-„ALL IN“ investiert aktuell 100 % Cash und zieht die Gebühr zusätzlich ab. Dadurch wird Cash kurz negativ; das ist rechnerisch falsch.
- Ein fehlgeschlagener Eintrag bleibt nur auf dem offenen Endscreen erhalten. Nach Neuladen ist er verloren.
- Server-Wiederholungen können denselben Run doppelt schreiben, wenn die erste Antwort verloren geht, obwohl der Eintrag bereits gespeichert wurde.

## Umsetzung
1. **Mobile Anzeige trennen**
   - Net Worth bekommt eine begrenzte, umbrechende Zahlenzeile.
   - Boss Score, Aktionspunkte und Sound kommen auf kleinen Geräten in eine eigene zweite Zeile; keine Überlagerung bei Millionen-/Milliardenwerten.

2. **Boss Score verständlich machen**
   - Formel im vorhandenen Infofenster klar benennen: Net Worth × überlebter Anteil × Schwierigkeitsfaktor, plus Krisenbonus, danach Streak-Multiplikator.
   - Der Score bleibt die gemeinsame Ranglistenwährung; Net Worth, Monate, Schwierigkeit, XP und Badge bleiben sichtbar.

3. **Finanzrechnung korrigieren und prüfen**
   - Spot-Kaufbudget inklusive Verwahrungs-/Handelsgebühr berechnen, sodass „ALL IN“ Cash nie unter null drückt.
   - Spot-Teilverkauf, Perp-PnL, Teil-Close, Liquidation, Funding, Verwahrungsgebühren, Lebenshaltung und Jahressteuer mit festen Rechenfällen testen.
   - Gefundene Abweichungen direkt korrigieren; Geldflussanzeige muss exakt dieselben Beträge zeigen wie die Zustandsrechnung.

4. **Leaderboard zuverlässig machen**
   - Länder-Validierung zwischen Spiel und Server vollständig angleichen.
   - Jedem Endergebnis eine feste Run-ID geben; wiederholtes Senden wird idempotent statt zu einem Duplikat.
   - Fehlgeschlagene Einträge lokal puffern und beim nächsten Start bzw. Öffnen des Leaderboards erneut senden.
   - Konkrete Fehlermeldungen unterscheiden: ungültiger Run versus vorübergehend nicht erreichbar.

5. **Verifikation**
   - Mobile Test mit sieben- bis zehnstelligem Net Worth: keine Überlagerung.
   - API-Tests für alle 24 Länder, hohen legitimen Score, Wiederholung desselben Runs und temporären Fehler.
   - Deterministische Rechentests für Spot und Perps sowie Browser-Test bis zum Endscreen und erfolgreichen Board-Eintrag.

## Wettbewerbs-Hinweis
Die Buchhaltung kann konsistent und der Submit zuverlässig gemacht werden. Classic/Chaos, Launches, Wallet-Drainer und Minispiele enthalten aber Zufall. Für einen absolut fairen Wettbewerb braucht jeder Teilnehmer zusätzlich denselben serverseitig festgelegten Seed; ohne das bleiben Runs technisch korrekt, aber nicht identisch vergleichbar. Diese größere Daily-/Tournament-Seed-Erweiterung ist nicht Teil dieses Fehlerfixes.
