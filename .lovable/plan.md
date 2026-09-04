# 18 Sekunden: warum die Leute gehen — und was wir dagegen tun

Gemessen heute am Handy (390×844, gedrosseltes Mobilfunknetz), plus die Zahlen aus den Analytics: 347 Aufrufe, 324 davon Handy, Bounce 89 %, mittlere Sitzung 18 s. Traffic kommt aus X (Nigeria, Türkei, Pakistan, Indien) — also Feed-Publikum mit sehr kurzer Geduld.

## Was ich gemessen habe

1. **4,9 Sekunden bis der Knopf überhaupt da ist.** Die Spielseite ist eine einzige 716-KB-Datei, dazu Coin-Logos und ein 793-KB-Icon. Bis dahin sieht der Nutzer Schwarz. Ein guter Teil der 18 Sekunden ist reine Wartezeit.
2. **Nach dem Antippen kommt keine Action, sondern eine Frage mit Lesetext:** "Wo bewahrst du deine Coins auf?" mit drei Textzeilen und drei Textknöpfen. Kein Kurs, keine Zahl, kein Geld, kein Chart. Das ist die klassische Abbruchstelle: der Spieler kam für Trading und bekommt einen Fragebogen.
3. **Der Startbildschirm verspricht nichts Konkretes.** Man sieht Boss, Wortmarke, einen Knopf — aber nicht, was das Spiel *ist*. Bei 89 % Bounce tippen die meisten nicht einmal.

Kurz: langsam rein, dann Lesearbeit statt Spiel. Deshalb 18 Sekunden.

## Der Plan

### 1. Sofort etwas zu sehen (Ziel: unter 1,5 s Bild, unter 2,5 s tippbar)
- Startbildschirm-Grundgerüst (Boss-Bild, Wortmarke, CTA) wird sofort ausgeliefert; Chart-Bibliothek, Coin-Logos, Audio und Spieldaten erst beim Antippen geladen.
- Boss-Bild in Handy-Größe vorgeladen, damit nie eine schwarze Fläche steht.
- Das 793-KB-App-Icon fliegt aus dem Startpfad.
- Der Cold-Open-Schwarzmoment wird auf Wiederkehrer beschränkt bzw. gekürzt.

### 2. Die ersten 10 Sekunden sind Spiel, kein Text
- Monat 1 startet direkt im **Markt**: Cash sichtbar, BTC bei $7.200, ein großer Kaufknopf. Der erste Klick ist ein Trade, nicht eine Meinung.
- Die Wallet-/Ledger-Frage wandert nach hinten (etwa Monat 3), wo sie als Story funktioniert statt als Türsteher.
- Nach dem ersten Kauf sofort sichtbare Reaktion: Kurs springt, Boss kommentiert in einem Satz, Net Worth zählt hoch.
- Erste Karte bekommt maximal eine Zeile Text; alles Erklärende in kleine Bubbles am Element.

### 3. Ein Versprechen über der Falz
Auf dem Startbildschirm über dem CTA drei kurze harte Fakten statt Stimmung, z. B.:
```text
$5,000  ·  84 MONTHS  ·  REAL 2020-2026 PRICES
0 of 13 survived
```
Dazu ein 3-Sekunden-Loop im Hintergrund oder hinter dem Boss, der echtes Traden zeigt — der Feed-Nutzer muss in einer Sekunde begreifen, dass hier gehandelt wird.

### 4. Erster Erfolg innerhalb der ersten Minute
- Monat 1–3 sind bewusst freundlich: ein sichtbarer Gewinn, XP-Aufblitzen, Boss-Spott. Wer in Sekunde 30 grün ist, bleibt.
- "MONTH 3 SURVIVED"-Mini-Feier mit Fortschrittsanzeige "3 / 84" — sichtbares Ziel gegen das Weglegen.
- Wer wegwischt, kommt zurück auf "CONTINUE — MONTH X" (Snapshot ist vorhanden).

### 5. Messen statt raten
Kleine Zählpunkte in die bestehende Statistik: Tippt auf CTA / erster Trade / Monat 3 / Monat 12 / Endkarte. Danach sehen wir schwarz auf weiß, wo die Leute wirklich abspringen, statt zu vermuten.

## Abnahme
Playwright bei 390×844, 414×896, 430×932 mit gedrosseltem Netz: Bild unter 1,5 s, tippbar unter 2,5 s, erster Trade möglich unter 8 s ab Antippen, keine abgeschnittenen Elemente, keine Konsolenfehler. Danach Analytics nach 48 h erneut lesen: Zielwerte Sitzung > 60 s, Bounce < 70 %.

## Technische Notizen
Alles in `public/game.html` plus `src/routes/index.tsx`:
- Kritischer Pfad: Gate-Markup und Boss-Bild inline/preload; `coin-icons.js`, Chart-Setup und Audio-Init in den Start-Handler (`instantStart`, ~10105) verschieben.
- `tcfb-icon-512.png` neu komprimiert, nur noch aus dem Manifest referenziert.
- Monatsablauf: erste Decision-Karte (Wallet-Choice) an Monat 3 hängen, Monat 1 öffnet die Markt-Bühne mit vorausgewähltem BTC.
- Onboarding als drei Element-Bubbles (Cash → Kaufen → NEXT MONTH), einmalig, überspringbar, `localStorage`-Flag.
- Ereigniszähler über das vorhandene Analytics-Skript, keine neue Tabelle nötig.
- Unberührt: historische Preise 2020–2026, XP-Formeln, Perp-Mathematik, Schwierigkeitsgrade, Leaderboard-API, Endkarte (V26), Startscreen-Optik (V27).
