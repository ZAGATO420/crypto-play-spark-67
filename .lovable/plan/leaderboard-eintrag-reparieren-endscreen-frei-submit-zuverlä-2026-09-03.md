# Leaderboard-Eintrag reparieren: Endscreen frei, Submit zuverlässig

Ich habe das nachgestellt (echter Tod-Ablauf, 1440x900 / 1280x800 / 768x1024 / 390x844) und zwei bestätigte Ursachen gefunden — plus einen Datenbefund, der zu deiner Beobachtung passt.

## Befunde (verifiziert, nicht geraten)

1. **Tutorial-Overlay blockiert den Endscreen (Handy/schmales Fenster).**
   Beim ersten Run wird das Coach-Overlay `#v23-coach` eingeblendet (Vollbild-Dim, z-index 210). Es wird beim Spielende nicht geschlossen. Im Test bei 390x844 lag beim Klick auf SUBMIT SCORE das Element `c-dim` obenauf — Klicks und Wischen gehen also ins Overlay, nicht in die Karte. Genau das Bild: Karte sichtbar, aber „Scrollen tot", kein Eintrag möglich.

2. **Der Leaderboard-Server fällt zeitweise komplett aus.**
   Serverlog: `leaderboard read failed {"code":"PGRST303","message":"JWT issued at future"}`, 7x über ~15 Stunden. Bei diesem Fehler antwortet die Route mit `503 {"error":"unavailable"}` — Lesen zeigt „LOCAL LEADERBOARD (OFFLINE)", und ein Submit im selben Zeitfenster endet in einem Alert. Der aktuelle Retry (2 Versuche) deckt längere Aussetzer nicht ab.

3. **Datenbild passt dazu:** Die Tabelle enthält insgesamt nur 11 Runs, der letzte von heute 10:28 UTC. Schreiben funktioniert also grundsätzlich (mein Testlauf ergab `POST 201`), aber es gehen offenbar Einträge in den Ausfallfenstern verloren.

## Was ich ändere

**A. Endscreen immer bedienbar (`public/game.html`)**
- Beim Spielende alle Run-Overlays hart schließen: Coach-Overlay, Rotate-Hinweis, offene Bottom-Sheets/Modals, Toast-Queue.
- Scroll-Sperren beim Endscreen zuverlässig lösen (`v4-live`, `v21-gate`, `v23-ingame`-Sperren) und ein „End-State"-Body-Flag setzen, das jedes Overlay auf `display:none` zwingt.
- Der Submit-Block wandert nach oben direkt unter die Karte, mit eigenem sticky Button am unteren Rand auf Handys — kein langes Scrollen, um sich einzutragen.
- Coach-Tutorial nur noch während eines laufenden Runs, nie nach Game Over.

**B. Submit robust machen**
- Fehlermeldungen in Klartext (Englisch, zum Spiel passend) statt Roh-Fehlertext.
- Automatische Wiederholung mit Wartezeit bei 503/Netzwerkfehler, danach ein sichtbarer „TRY AGAIN"-Button; Name bleibt erhalten, Button wird wieder aktiv.
- Fällt der Server ganz aus: Score wird lokal gepuffert und beim nächsten Öffnen automatisch nachgesendet — niemand verliert seinen Eintrag mehr.

**C. Serverseite (`src/routes/api/public/leaderboard.ts`)**
- PGRST303 gezielt behandeln: Leseanfragen fallen auf einen zweiten Client mit dem öffentlichen Key zurück (nur Lesen), damit die Rangliste bei Uhr-Drift nicht mehr leer bleibt.
- Mehr Retry-Versuche mit steigender Wartezeit für GET und POST.
- Plausibilitätsgrenze für kurze Runs mit Presale-/Airdrop-Glück etwas weiten und Ablehnungen protokollieren, damit „score rejected" nachvollziehbar ist.

**D. Testdurchlauf danach**
Automatisiert je Größe (Desktop groß/klein, Tablet, Handy hoch/quer) und je Ende-Art (Liquidation, Verhungern, Bankrott, Monat 84, Quit): Endscreen sichtbar, scrollbar, Submit klickbar, POST erfolgreich, Zeile in der Tabelle. Zusätzlich in mehreren Engines (Chromium, sowie Firefox/WebKit soweit im Sandbox verfügbar; fehlt eine Engine, sage ich das offen statt es zu behaupten).

## Technische Notiz

Keine Änderung an Spiel-Mathematik, Preisen, XP oder Score-Formel. Nur Overlay-/Scroll-Handling und Endscreen-Layout im Frontend sowie Fehlertoleranz der Leaderboard-Route. Für den Live-Effekt muss danach veröffentlicht werden.
