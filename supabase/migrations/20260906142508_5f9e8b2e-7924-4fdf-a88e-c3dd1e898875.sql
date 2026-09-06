ALTER TABLE public.leaderboard_runs ADD COLUMN IF NOT EXISTS score numeric NOT NULL DEFAULT 0;
DELETE FROM public.leaderboard_runs;
CREATE INDEX IF NOT EXISTS leaderboard_runs_score_idx ON public.leaderboard_runs (score DESC);