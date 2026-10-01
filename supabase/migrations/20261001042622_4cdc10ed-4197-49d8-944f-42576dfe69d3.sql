ALTER TABLE public.leaderboard_runs
  ADD COLUMN IF NOT EXISTS run_log jsonb,
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS leaderboard_runs_verified_season_idx
  ON public.leaderboard_runs (season, verified)
  WHERE is_tournament = true;