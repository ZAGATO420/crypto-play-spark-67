CREATE UNIQUE INDEX IF NOT EXISTS leaderboard_runs_client_hash_unique
ON public.leaderboard_runs (client_hash)
WHERE client_hash IS NOT NULL;