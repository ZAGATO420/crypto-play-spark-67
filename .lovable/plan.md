## Ursache
Die veröffentlichte Domain liefert bereits das neue eigene `tcfb-og.jpg` aus. Im Root-Layout stehen aber zusätzlich noch die alten globalen `og:image`- und `twitter:image`-Tags mit dem früheren automatisch erzeugten Lovable-Screenshot. Dadurch erhält X zwei Vorschaubilder und kann weiterhin das alte Bild mit „Lovable App“ auswählen.

## Fix
1. Die beiden alten globalen Bild-Tags aus `src/routes/__root.tsx` entfernen.
2. Das neue gebrandete Vorschaubild ausschließlich im `head()` der Startseite behalten, sodass im finalen HTML nur noch ein `og:image` und ein `twitter:image` vorhanden ist.
3. Die veröffentlichte HTML-Ausgabe danach prüfen und sicherstellen, dass keine alte Google-Storage-/Lovable-Bild-URL mehr enthalten ist.
4. Anschließend neu veröffentlichen. X cached Linkkarten; bei einem ganz neuen Post beziehungsweise nach erneutem Einlesen der URL zeigt X dann die neue TCFB-Vorschau ohne „Lovable App“.