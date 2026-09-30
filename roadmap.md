# THE CYCLE (2020–2026) rebuild

- [x] 28 quarter chapters, 2 moves each, boss briefing + market answer
- [x] Spot, perps (2x/5x/10x), presales/fairlaunch, survival (EAT/CALM)
- [x] Always-visible position book with P&L and liquidation bar
- [x] Self-closing popups for market, trade, position, presale, survival, decisions
- [x] Historical decision cards with lasting statuses and multiple endings
- [x] Boss Score replaces XP in the leaderboard (fresh season, cheat gate)
- [x] Clean retro visual system, tested 390px and 1280px, no overflow/errors
- [x] Default menu audio starts above zero and persists explicit sound settings
- [x] Sarcastic death-screen punchlines for every failed ending
- [x] Run badges shown on the end screen and leaderboard
- [x] Competition audit: mobile values, exact trade cash flows, country validation, queued/idempotent score submits
- [x] Harder survival: care costs a move, is capped and gets pricier; NIGHTMARE mode; private life events; critical states cost a move; CASH OUT ends a run as SELLOUT
- [x] Monthly $TCFB tournament: shared season seed, wallet entry, one best run per player/season, season + all-time board with $20/$10/$5 prize ranks
- [x] Cyber-Jungle Premium redesign: cleaner asymmetric start screen and one-width detailed leaderboard

- V51 replayability: local profile records, endings gallery, run modifiers, boss personas, three acts, near-miss line, share result, same-seed rematch

- [x] Turnier: gleiche Bedingungen (NORMAL, CLASSIC, $10k, kein Ironman, Saison-Twist) + Server-Prüfung
- [x] Preisreihen aller 14 Märkte auf echte Monats-Closes 2020–2026 umgestellt (Okt–Dez 2026 fiktiv)
- [x] Launch-Rebuild: one-tap tournament start, living market arena, 84-month journey, contextual actions, act scenes and emotional feedback
- [x] Launch finale: six rotating chapter modes, active missions, order-book/rug-check skill games, visible act scenes, wallet-gated prizes and shared payout ranking
- [x] Anonymous gameplay beats persist for launch retention analysis
- [x] Cyber-Survival HUD: integrated reactive Boss, animated live chart, compact survival status, tactile actions and layered mood audio
- [x] Clarity rebuild: playable first-run guidance, paused opening tape, explicit chart language, clear duel stakes and simplified mobile controls
- [ ] Final 28-quarter regression run and two-device tournament reproducibility check
- [x] Chart audit: selected coin/logo, P&L animation for every market, and exact historical-mode prices
- [x] Live chart rendering: continuous blue line with frame-synced reveal and no dashed gaps
- [x] Compact mobile run view with large fixed Portfolio, Survive, More and End Quarter controls
- [x] Arcade hype pass with God Candle wins, liquidation shock, exclusive headline audio and instant feedback
- [x] Remove unintended transparency across the complete game UI and verify on phone

## Masterplan (TCFB launch)
- [x] Custom run: 3 one-tap presets + compact fine-tune, identity row scrolls instead of stacking
- [x] Sticky phone HUD: net worth, cash, open P&L, stress, hunger always visible
- [x] Popup trading terminal: spot + perp (long/short, 2/5/10x, liquidation preview), close from same sheet
- [x] Quarter loot drop: three blind cards, one pick, deterministic per seed
- [x] Leaderboard shows top 50
- [x] Boss trash talk on big P&L swings (bossReaction wired through feel())
- [x] $TCFB presence in the run: loot allocation card + live tournament prize ticker
- [x] Phone cockpit: one quarter fits one screen, briefing collapses behind a single visible toggle
- [x] Dock gets the skill test; near-liquidation heartbeat alert on the arena
- [x] End screen leads with REVENGE RUN (same seed, one tap)

- [x] Desktop command deck: two-column cockpit, no scrolling on 720p/900p, large lit control buttons
- [x] Near-liquidation warning cue plus Boss taunt when a leveraged trade enters the danger zone
- [x] Strategy layer: quarterly plan (SURVIVE / BALANCED / FULL DEGEN) scales win/loss, stress and XP; HEAT streak pays a rising bonus for reading the tape right

## Session: sound + compact mobile + new skill games
- [x] Sound unlock retries on every gesture; visible "TAP FOR SOUND" prompt on the start screen.
- [x] Mobile cockpit compacted: duplicate standing block, tournament line and risk notes fold into SHOW BRIEFING; one big action plus the fixed dock.
- [x] Three new skill games: CATCH THE GREEN (whale candles), CLAIM THE REAL ONE (airdrop phishing), HOLD THE LINE (margin defence). All grant XP via the existing skill reward.
- [x] Sheets close with Escape or a tap on the backdrop.

## Strategie-Umbau (erledigt)
- Zwei sichtbare Züge pro Quartal: TAKE THE RISK / PLAY IT SAFE, pro Phase eigener Text + Begründung (MODE_MOVES).
- Phasen-Branding: Farbwelt + Banner pro Phase (MODE_THEME), PANIC pulsiert.
- Boss spricht wieder auf dem Handy (CSS-Ausblendung entfernt).
- Toter Code entfernt (details-State, Meter, cy-meters/cy-versus).

## Kernbildschirm-Diät (erledigt 27.09.)
- Hauptebene: Stand, Chart, 2 Züge, SKILL TEST, RUN TAPE/MORE/END QUARTER (Handy 7 Elemente, kein Scrollen)
- SURVIVE springt bei Hunger/Stress >= 70% auf die Hauptebene (rot pulsierend)
- Presale/Boss-Duell: Einsatz, Rug-Risiko, Upside-Range stehen im Klartext auf der Risiko-Karte
- Alles andere (Stance, Terminal, Storage, History, Verify, Guide, End Run) hinter MORE

## Visual identity: THE PIT 2021 (erledigt)
- [x] Pit-Palette (Bunker Slate, Terminal Steel, Gorilla Amber, God Candle Mint, Margin Shock, Tape Grey) als Tokens.
- [x] Space Grotesk (Display) + JetBrains Mono (Daten) statt system-ui; auch im Canvas-Export.
- [x] KI-Tells weg: ALL-CAPS-Eyebrows -> [TERMINAL TAGS], Mittelpunkt-Ketten -> Mono-Pipes, weiche Glows -> 2px Hardware-Kanten + Scanlines.
- [x] EIN Signature Moment: Boss Interruption (SYSTEM OVERRIDE, Stempel REJECTED / LIQUIDATED / THRONE THREATENED).
- [x] Trophy-Karte als Terminal-Audit-Report.

- [x] Sichtbare Zielmarke: Platz-1-Netto wird einmal pro Seite geladen und eingefroren; Startscreen-Banner, HUD-Zeile "VS RANK 1" unter der Boss-Anzeige (auch mobil), Endscreen-Urteil und Share-Zeile.

## Big upgrade pass (requested 2026-09-30)
- [x] 1. Real boss duel: liquidity bar with SMUG / PRESSED / ENRAGED / BROKEN phases in the live HUD
- [x] 2. Roguelike relics & synergies (12 relics, 5 synergies, draft every 4th quarter); relics cut rent/food/hunger/stress noise
- [x] 3. Mobile no-scroll layout: 100dvh cockpit, 104px move cards, centered self-scrolling modals (verified 390x844)
- [x] 4. October tournament: season rolls over on the clock, live countdown strip inside the run
- [x] 5. Arcade juice: candle chart, neon boss bar, relic strip (flex card + trophy already live)

- [x] MOMENTUM timing pilot verified in-game (entry verdict shown after skill moment)
- [x] Mobile three zones: duel frame (rank 1 + boss bar + relics), money HUD (animated net worth/cash/PnL, stress + hunger bars), arena; every block one shared full width
- [x] No-scroll verified over 12 quarters at 375x677, 390x844 and 360x640, footer clear of the Safari bar
- [x] Rolling money counters with green/red flash on every material change
