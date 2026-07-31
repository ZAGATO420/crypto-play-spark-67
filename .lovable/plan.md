## Was ich im Spiel gefunden habe

**Popups überlagern sich, weil es keine Warteschlange gibt.** Es existieren sechs voneinander unabhängige Anzeige-Ebenen: das Event-Fenster, das Presale-Fenster, das Decision-Fenster, das Minigame-Fenster, der Level-Up-Blitz und die Toast-Leiste. Jede wird direkt eingeblendet, sobald ihr Auslöser feuert — keine prüft, ob gerade schon etwas anderes sichtbar ist. Besonders auffällig:

- Die Toast-Leiste ist ein einziges Element. Kommen zwei Meldungen kurz nacheinander (z. B. „Quest complete" und „Level Up"), überschreibt die zweite die erste sofort, und der alte Timer blendet sie zu früh aus. Genau das ist der Fall, in dem eine Meldung „untergeht".
- Beim Monatswechsel laufen Quest-Prüfung, XP-Vergabe, Achievement, Level-Up, Monats-Event und Minigame in derselben Sekunde ab.
- Die Decision-Prüfung schaut nur auf Event-, Decision- und Presale-Fenster — Minigame und Level-Up-Blitz werden nicht berücksichtigt.

**Der Quest-Pool ist klein und zeitlos.** Aktuell rund 20 Quests, alle datumsunabhängig („Kaufe BTC", „Halte 3 Coins"), plus 6 Zufalls-Entscheidungen und 14 historische Monats-Events (Black Thursday, China-Mining-Ban, LUNA, FTX, PEPE, Halvings usw.). Die Zeitachse läuft über 84 Monate von Januar 2020 bis Dezember 2026 — die Grundlage für datumsgenaue Inhalte ist also schon da, wird aber kaum genutzt.

## Plan

### 1. Zentrale Popup-Warteschlange

Ein Warteschlangen-Manager, durch den **jede** Vollbild-Meldung läuft: Event, Presale-Ergebnis, Decision, Minigame, Level-Up, historische Quest.

- Immer nur ein Fenster gleichzeitig sichtbar. Alles Weitere wartet in der Reihenfolge, in der es ausgelöst wurde.
- Erst wenn der Spieler schließt bzw. antwortet, öffnet sich mit kurzer Pause (~350 ms) das nächste.
- Priorität: existenzielle Ereignisse (Hack, Crash, Game-Over-Warnung) vor Level-Ups und optionalen Minispielen.
- Kleiner Zähler am Rand („2 weitere Meldungen"), damit klar ist, dass noch etwas kommt.
- Das Spiel bleibt pausiert, solange die Warteschlange läuft — kein Preis-Tick im Hintergrund.

### 2. Toast-Meldungen stapeln statt überschreiben

Statt eines einzelnen Elements eine Toast-Spalte: bis zu drei Meldungen gleichzeitig, jede mit eigenem Timer, neue schieben sich darunter ein. Nichts wird mehr überschrieben.

### 3. XP-Anzeigen entzerren

XP-Zahlen fliegen weiter direkt am Klickpunkt hoch (das ist gut und soll schnell bleiben), aber:
- Mehrere XP-Gewinne innerhalb von ~600 ms werden zu einer Zahl zusammengefasst („+340 XP · MONAT ÜBERLEBT").
- Level-Up-Blitz und XP-Flug kollidieren nicht mehr: Der Blitz geht in die Warteschlange, die XP-Zahl bleibt sofort sichtbar.

### 4. Historischer Quest- und Event-Pool 2020–2026

Ein neuer, an das Spieldatum gebundener Pool mit echten Ereignissen. Jede Quest hat ein Zeitfenster und erscheint nur dann. Geplant sind ca. 55–70 Einträge, unter anderem:

**2020** — COVID-Crash im März, DeFi-Summer und Yield-Farming, das UNI-Airdrop im September, Sushi-Vampir-Angriff, PayPal öffnet für Krypto, BTC durchbricht das alte Hoch im Dezember.

**2021** — Tesla kauft BTC, GameStop-Wahnsinn, DOGE-Mania rund um Musk, der Mai-Crash und Chinas Mining-Verbot, El Salvador macht BTC zum gesetzlichen Zahlungsmittel, Axie/Play-to-Earn, das ATH bei 69k im November, NFT-Blase.

**2022** — LUNA/UST-Kollaps, Celsius friert Auszahlungen ein, 3AC geht pleite, das Ethereum-Merge, FTX-Kollaps im November und die Frage, ob du deine Coins von der Börse holst.

**2023** — Banken-Krise und USDC-Depeg, Ordinals/BRC-20, PEPE-Launch, SEC verklagt Börsen, Grayscale gewinnt vor Gericht, Binance-Settlement.

**2024** — Spot-ETF-Zulassung im Januar, Halving im April, Solana-Meme-Season, Politik wird pro-Krypto, Trump-Wahl und die Rallye danach.

**2025–2026** — BTC über 100k, Regulierungsschübe, Airdrop-Müdigkeit, KI-Coin-Narrativ, und im Finale das $TCFB-Kapitel als Höhepunkt der Zeitachse.

Jede Quest ist eine echte Entscheidung mit Gewinn- und Verlustrisiko, nicht bloß eine Nachricht. Beispiel-Muster:
- „Deine Coins liegen auf einer Börse, die gerade Auszahlungen stoppt" — sofort abziehen (Gebühr) oder abwarten (Chance auf Totalverlust).
- „Ein Airdrop-Claim-Link taucht in deiner DM auf" — Seed eingeben, Wallet verbinden oder ignorieren. Ledger schützt teilweise.

### 5. Nicht auswendig lernbar

- Aus dem passenden Zeitfenster wird jeweils nur eine Teilmenge gezogen, nicht immer alles.
- Beträge, Prozente und Textvarianten werden pro Run gewürfelt.
- Bei manchen Quests wechselt der Ausgang: dasselbe Ereignis kann in einem Run gutgehen und im nächsten schmerzen — die historische Tendenz bleibt aber erhalten (z. B. FTX ist grundsätzlich gefährlich).

## Technische Details

- Alles bleibt in der einen Datei `public/game.html` — keine externen Dateien, kein Asset-Nachladen.
- Neuer Warteschlangen-Manager wickelt die bestehenden Funktionen `showEvent`, `showDecision`, `showPresaleResult`, `miniCard` und `levelUp` ein; die bisherigen `busy`-Prüfungen entfallen, weil die Warteschlange das übernimmt.
- Toast wird von einem Element auf eine Container-Liste umgestellt (`#toast` → Stack), `toast()` behält seine Signatur, damit alle ~40 bestehenden Aufrufe unverändert funktionieren.
- Der historische Pool kommt als neue Datenstruktur mit Monatsfenster, Gewichtung und Varianten-Feldern; die bestehenden 14 `EVENTS` bleiben als Ankerpunkte erhalten und werden nicht doppelt ausgespielt.
- Leaderboard, XP-Kurve und die Plausibilitätsprüfung im Backend bleiben unangetastet.

## Nach der Umsetzung

Ich spiele mehrere komplette Runs automatisiert durch (verschiedene Schwierigkeiten und Modi), prüfe per Screenshot, dass nie zwei Fenster gleichzeitig offen sind, dass keine Toast-Meldung verschluckt wird, und dass in jedem Jahr die passenden historischen Quests auftauchen.
