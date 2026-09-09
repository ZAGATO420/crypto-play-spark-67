ALTER TABLE public.leaderboard_runs
  ADD COLUMN IF NOT EXISTS season text,
  ADD COLUMN IF NOT EXISTS wallet text,
  ADD COLUMN IF NOT EXISTS is_tournament boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS player_key text;

CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_runs_season_player_key
  ON public.leaderboard_runs (season, player_key)
  WHERE is_tournament AND season IS NOT NULL AND player_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS leaderboard_runs_season_idx
  ON public.leaderboard_runs (season);

REVOKE SELECT ON public.leaderboard_runs FROM anon;
GRANT SELECT (id, player_name, archetype, country, difficulty, mode, net_worth, xp, level, rank_title, months_survived, achievements, trades, survived, created_at, avatar, score, season, is_tournament)
  ON public.leaderboard_runs TO anon;
GRANT SELECT (id, player_name, archetype, country, difficulty, mode, net_worth, xp, level, rank_title, months_survived, achievements, trades, survived, created_at, avatar, score, season, is_tournament)
  ON public.leaderboard_runs TO authenticated;
GRANT ALL ON public.leaderboard_runs TO service_role;