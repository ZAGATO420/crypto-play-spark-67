# Immer noch ein Run: das Spiel wird zum Wiederspiel-Sog

Ziel: nicht mehr Inhalt, sondern mehr Grund für den nächsten Versuch. Vier Hebel: sichtbarer Fortschritt über Runs hinweg, jeder Run anders, jeder Run erzählt etwas, jeder Run endet in einem Bild, das man zeigen will.

## 1. Fortschritt, der über den Run hinaus bleibt

- Ein dauerhaftes Profil neben dem Leaderboard: gespielte Runs, bester Netto-Wert, geschlagene Boss-Kämpfe, überlebte Krisen, erreichte Enden.
- Enden-Galerie: alle Enden als Karten, die gesperrten nur als Silhouette mit Hinweis ("überlebe bis 2026 ohne kritischen Stress"). Wer ein Ende sieht, will die fehlenden.
- Titel- und Abzeichen-Sammlung, die auf Startscreen und Board sichtbar ist. Kein Vorteil im Spiel, nur Status.
- Freischaltungen als Startvarianten, nicht als Stärke: neue Archetypen, ein Start mit Schulden, ein Start ohne Ledger, ein Start mitten im Bärenmarkt.

## 2. Jeder Run fühlt sich anders an

- Drei Startmodifikatoren, aus denen man vor dem Run einen wählt: z. B. "Alles auf Hebel erlaubt, Leben doppelt teuer", "Kein Cold Storage", "Halber Start, doppelter Score".
- Wechselnde Boss-Persönlichkeit pro Run: einer jagt Liquidationen, einer manipuliert Kurse, einer kauft dir Positionen ab. Andere Angriffe, andere Sprüche.
- Der Boss lernt sichtbar: wer immer nur hält, bekommt einen Boss, der Passivität bestraft; wer immer hebelt, bekommt Funding-Angriffe. Kurze Zeile am Anfang, damit man es merkt.
- Zufällige Reihenfolge kleiner Ereignisse und Signale bleibt deterministisch pro Seed, damit Turniere fair bleiben.

## 3. Spannungskurve statt gleichmäßiger Quartale

- Der Run bekommt drei Akte mit ansteigendem Druck: Aufbau (2020–21), Absturz (2022), Endspiel (2023–26). Jeder Akt endet mit einem Boss-Kampf, der Einsatz kostet.
- Ein sichtbarer Countdown auf das nächste Großereignis, ohne zu verraten was: "etwas kommt in 2 Quartalen".
- Letztes Kapitel als Finale: der Boss setzt sein ganzes Buch ein, ein Zug entscheidet über THRONE TAKEN oder SURVIVOR.
- Near-Miss sichtbar machen: nach dem Ende steht da, wie knapp das nächstbessere Ende war ("$18.400 vom LEGEND entfernt"). Das ist der stärkste Grund für den nächsten Run.

## 4. Der Endscreen wird das Werbematerial

- Teilbares Ergebnisbild: Rang, Ende, Netto, Boss-Score, Abzeichen, ein Satz vom Boss. Ein Knopf kopiert Bild und Text für X.
- Run-Verlauf als kleine Kurve mit markierten Wendepunkten: hier gekauft, hier liquidiert, hier den Boss geschlagen.
- Direkt darunter: "Nächster Versuch mit demselben Seed" und "Neuer Seed". Kein Umweg über das Menü.

## 5. Optik und Gefühl nachziehen

- Akt-Wechsel bekommt einen kurzen Bildmoment: Farbwelt kippt, Boss-Stimmung wechselt, ein Satz. Drei Sekunden, überspringbar.
- Treffer, Liquidation und Boss-Sieg bekommen je eine eigene, klar unterscheidbare Reaktion in Bild und Ton.
- Alles bleibt clean: keine neuen Ebenen über dem Inhalt, keine Dauer-Animationen, Popups schließen sich nach der Auswahl.

## Abnahme

- Nach dem ersten Run sieht man mindestens zwei gesperrte Enden und einen Near-Miss-Hinweis.
- Zwei Runs mit unterschiedlichem Modifikator und Boss fühlen sich messbar anders an.
- Ergebnisbild lässt sich auf Handy und Desktop erzeugen und kopieren.
- Test bei 393 und 1440 Pixel: kein Überlauf, keine Fehler, keine flackernden Karten.

## Technische Notizen

- Profil, Enden-Galerie und Abzeichen lokal im Browser speichern, zusätzlich beim Board-Eintrag mitschicken; kein neues Backend nötig.
- Modifikatoren und Boss-Persönlichkeiten als Daten in `src/game/journey-data.ts`, Auswahl im Setup, Score-Faktor pro Modifikator.
- Akte, Countdown und Finale über den bestehenden Kapitelzähler in `src/game/CryptoJourney.tsx`; keine zweite Zeitachse.
- Ergebnisbild per Canvas aus dem bestehenden Run-Zustand, kein zusätzliches Paket.
- Near-Miss aus denselben Ending-Schwellen wie `ENDINGS`, damit Text und Bewertung nie auseinanderlaufen.
- Turnier bleibt deterministisch: Modifikator ist im Turniermodus fest an den Saison-Seed gebunden.
