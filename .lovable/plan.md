## Ziel

Eine Reply-Bibliothek, aus der du in 5 Sekunden eine passende Antwort kopierst — kurz, menschlich, mit klarem Hook, der Leute auf dein Profil zieht. Keine KI-Floskeln ("Absolutely!", "This is huge", Em-Dashes, Emoji-Ketten, Hashtags).

## Was gebaut wird

Eine neue Datei `x-assets/x-reply-library.md` mit 300+ Replies, gruppiert nach den Themen, unter denen Crypto-X wirklich postet:

1. **Loss / Rekt Posts** (liquidiert, Rug erwischt, "down 90%")
2. **Gains / Flex Posts** (100x, PnL-Screenshots)
3. **Memecoins & Pump.fun** (Launches, Snipes, Dev sold)
4. **Airdrops & Farming** (Sybil, Claims, "war es das wert?")
5. **Scams, Hacks, Drainer, Wallet-Security**
6. **Market Calls & Predictions** (Bull/Bear, "Top ist drin")
7. **Nostalgie / Zyklen** (2021, LUNA, FTX, "wo warst du 2020")
8. **Trading-Psychologie & Burnout** (Stress, Schlaf, Beziehung)
9. **CT-Drama & Influencer-Calls**
10. **Gaming / Crypto-Games / Web3-Gaming**
11. **Builder- & Dev-Posts** (Shipping, Solo-Builder)
12. **Fragen-Posts von großen Accounts** ("What's your biggest L?" — die stärkste Follower-Quelle)
13. **Meme / Humor-Posts** (Pure Punchline, kein Pitch)
14. **Newbie-Fragen** (Hilfe geben = Autorität aufbauen)

Pro Thema ca. 20–25 Replies, aufgeteilt in drei Typen:
- **Pure Value/Witz** (~60%) — kein Link, kein Spielname. Baut Reputation, bekommt Likes.
- **Soft Hook** (~30%) — erwähnt beiläufig, dass du ein Game gebaut hast, ohne Link. Neugierige klicken aufs Profil.
- **Direkter Pitch** (~10%) — nur für Threads, in denen aktiv nach Games/Tools gefragt wird.

## Zusätzlich in der Datei

- **Reply-Regeln:** wann welcher Typ, max. 1 Pitch pro 10 Replies, Timing (erste 10 Min nach Post), Ziel-Accountgrößen, kein Link in Replies bei kleinen Accounts (Reach-Nachteil).
- **Anti-KI-Checkliste:** verbotene Wörter/Zeichen, Kleinschreibung wo passend, Tippfehler-Toleranz, max. Länge (unter 120 Zeichen performt am besten).
- **Variablen-Platzhalter** wie `[coin]`, `[jahr]`, `[zahl]`, damit jede Reply an den konkreten Post angepasst wird und nichts als Copy-Paste-Spam auffällt.
- **20 Quote-Tweet-Vorlagen** für fremde Posts, die du auf deine Timeline holst.

## Technische Details

- Reine Markdown-Datei unter `x-assets/`, kein Code-Impact, kein Deploy nötig.
- Sprache der Replies: Englisch (dein Account postet englisch), Regeln und Erklärungen auf Deutsch.
- Bei Bedarf danach als Aufteilung in mehrere Dateien pro Thema oder als CSV für schnelles Filtern.
