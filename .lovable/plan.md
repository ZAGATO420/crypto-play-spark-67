# Sofort spielen: das Game packt in 5 Sekunden

Die Zahlen sind eindeutig: 1.019 Besucher in 14 Tagen, 92 % Handy, Traffic aus X (Nigeria, Türkei, Indien, Pakistan), Bounce 89–94 %, mittlere Sitzung an Traffic-Tagen ~20 Sekunden. Fast niemand kommt bis zum ersten Trade. Der Grund ist der Weg dorthin: Startbild → Formular mit Handle, Avatar, 24 Ländern, Archetyp, Twist, Schwierigkeit, Modus, Ironman → Briefing-Text → erst dann Markt. Das sind zwei Lesewände vor der ersten Spielhandlung. Feed-Publikum hält das nicht durch.

## 1. Ein Tipp, und du handelst (das Wichtigste)

- Der große Knopf startet **direkt Q1 2020**: Bargeld sichtbar, BTC bei ~$7.200, ein fetter KAUFEN-Knopf. Kein Formular, kein Briefing dazwischen.
- Identität (Name, Land, Avatar) wird **nicht mehr vorher** gefragt: Start mit `anon` + zufälligem Avatar; gefragt wird erst, wenn es zählt — beim Eintrag ins Leaderboard am Ende oder über ein kleines Profil-Chip im Spiel.
- Turnier bleibt: der Hauptknopf startet den Turnierlauf mit den festen Bedingungen (gleiches Startgeld, gleicher Seed). Free Run mit allen Einstellungen bleibt als Nebenweg erreichbar.
- Das Briefing des Bosses wird zu einer Zeile über dem Markt statt zu einer eigenen Phase; wer will, tippt sie auf.

## 2. Die ersten 60 Sekunden sind geführt und belohnend

- Immer genau **eine große Aufgabe** sichtbar: „KAUF BTC FÜR $3.000“ → „HALTE DURCH DEN CRASH“ → „NIMM GEWINN MIT“. Alles Übrige ist ruhig, nicht versteckt.
- Nach dem ersten Kauf sofort körperliche Reaktion: Kurs zieht an, Zahl zählt hoch, Boss spottet in einem Satz, Münzton.
- Erste drei Kapitel sind bewusst gewinnbar: wer in Sekunde 30 grün ist, bleibt.
- Mini-Feier bei Q3 2020 mit Fortschritt „3 / 84“ — sichtbares Ziel gegen das Weglegen.

## 3. Das Startbild verspricht in einer Sekunde

- Über dem Knopf drei harte Fakten statt Stimmung: `$10,000 · 2020 → 2026 · 84 MONTHS` und `0 haben den Thron genommen`.
- Der Boss bleibt Hauptmotiv, aber der Kopf wird nie beschnitten; Ticker schmal oben.
- Eine kurze Boss-Ansprache, die pro Aufruf wechselt („last one lasted 19 months.“).
- Genau **ein** großer Knopf über der Falz: `START — Q1 2020`. Leaderboard, Rules, Free Run, Endings werden eine feine Zeile darunter.
- Rückkehrer sehen statt Formular `WEITER — Q3 2021` als ersten Knopf.

## 4. Tempo: das Spiel muss auf dem Handy sofort da sein

- Startbild-Grundgerüst (Boss, Wortmarke, Knopf) zuerst; Chart-Setup, Coin-Logos, Audio, Live-Ticker und Leaderboard erst nach dem Start bzw. nach dem ersten Frame.
- Boss-Bild in Handygröße vorgeladen, damit nie eine schwarze Fläche steht.
- Ziel: Bild unter 1,5 s, tippbar unter 2,5 s, erster Trade möglich unter 8 s ab Antippen.

## 5. Warum man ein zweites Mal startet

- Am Ende zuerst **eine** Zeile Chronik plus `NOCHMAL — GLEICHER SEED` als größter Knopf; Leaderboard-Eintrag direkt darunter, Wallet weiter optional.
- Sichtbarer Vorlauf beim Rematch: „an dieser Stelle hattest du $41.200“.
- Teilbares Ergebnisbild bleibt, Text kürzer und schärfer für X.

## 6. Messen statt raten

Kleine Zählpunkte in die bestehende Statistik: Seite geladen → Start getippt → erster Trade → Kapitel 3 → Kapitel 12 → Endscreen → Board-Eintrag. Danach sehen wir schwarz auf weiß, wo abgesprungen wird.

## Abnahme

Playwright bei 393×852, 430×932 und 1440×900: genau ein Hauptknopf über der Falz, erster Trade ohne Formular erreichbar, keine abgeschnittenen Elemente, kein horizontales Scrollen, keine Konsolenfehler. Turnierläufe bleiben deterministisch und identisch für alle.

## Technische Notizen

- `src/game/CryptoJourney.tsx`: `SetupScreen` wird vom Pflichtschritt zum optionalen Screen; neuer Direktstart über `freshRun({...defaultConfig, tournament:true, season, modifier: tournamentModifier(season)})` mit `anon` + zufälligem Avatar. Identität wird im Endscreen und über ein Profil-Chip gesetzt (`config.name/country/avatar` bleiben unverändert im Datenmodell).
- Phase `brief` entfällt als eigener Screen: Warnung/Boss-Zeile wandert in den `act`-Kopf; `openChapterCards`/`nextInQueue`-Logik bleibt unangetastet.
- Geführte Aufgaben als Datenliste (Kapitel, Zielprüfung, Text) statt Sonderfälle, einmalig per `localStorage`-Flag; nutzt den bestehenden `feel()`-Reaktionslayer.
- Startscreen-Umbau in `StartScreen` + `.journey-start` in `src/styles.css`; `PriceTape`, `SeasonBanner`, `RecordStrip` bleiben, werden aber sekundär und nach dem ersten Frame gemountet.
- Zählpunkte über das vorhandene Analytics-Skript, keine neue Tabelle.
- Unberührt: historische Preise 2020–2026, P&L-/Steuer-/Score-Formeln, Turnier-Determinismus (`rng.ts`, `season.ts`), Leaderboard-API und Wallet-Datenschutz.
