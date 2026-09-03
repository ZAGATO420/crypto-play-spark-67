# Trailer fertigstellen — Re-Render + QA

Der vertikale Kino-Trailer (Komposition `ad`, 1080x1920, 30fps, 26,8s) ist gebaut und einmal gerendert. Danach wurden die Lesbarkeits-Scrims in `AShot` verstärkt — dieser Stand ist noch nicht gerendert. Fehlende Schritte:

## Schritte

1. Neu rendern mit `remotion/scripts/render-ad.mjs` (Komposition `ad`, Ton an) nach `/mnt/documents/x-assets/tcfb-ad-vertical.mp4`.
2. Dauer, Auflösung und Tonspur per ffprobe bestätigen (erwartet: H.264 1080x1920, ~26,8s, AAC).
3. QA-Kontaktbogen aus 12 Frames (1,5s bis 26s) erzeugen und prüfen: keine Text-über-Gameplay-Kollision mehr in Market-, Chart- und Perp-Szene, kein abgeschnittener Inhalt, keine überlaufenden Zeilen.
4. Falls noch Kollisionen sichtbar sind: gezielt Caption-Position (`top`), Schriftgröße oder Scrim-Stärke pro betroffener Szene in `AShot.tsx` / `AdVideo.tsx` nachziehen und erneut rendern.
5. X-Ad-Text (lowercase, degen, kein Hashtag) als `x-assets/x-ad-trailer-copy.md` anlegen: eine Hook-Variante fürs Ad-Set, eine für den Organic-Post, dazu die CTA-Zeile mit `$TCFB` im Oktober.

## Ergebnis

- `/mnt/documents/x-assets/tcfb-ad-vertical.mp4` — finaler 9:16-Trailer mit Musik und Impact-Hits
- `x-assets/x-ad-trailer-copy.md` — Ad- und Post-Text

Die Musik bleibt der prozedural erzeugte Trap/Drill-Score (`remotion/public/audio/ad_score.wav`), da kein ElevenLabs-Zugang vorliegt.
