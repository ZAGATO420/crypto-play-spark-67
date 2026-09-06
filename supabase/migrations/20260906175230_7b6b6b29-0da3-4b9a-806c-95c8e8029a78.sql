DROP INDEX IF EXISTS public.leaderboard_runs_client_hash_unique;
CREATE UNIQUE INDEX leaderboard_runs_client_hash_unique
ON public.leaderboard_runs (client_hash);