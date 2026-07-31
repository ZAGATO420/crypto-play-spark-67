CREATE TABLE public.leaderboard_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name text NOT NULL,
  archetype text NOT NULL,
  country text NOT NULL,
  difficulty text NOT NULL,
  mode text NOT NULL,
  net_worth numeric NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  rank_title text NOT NULL DEFAULT '',
  months_survived integer NOT NULL DEFAULT 0,
  achievements integer NOT NULL DEFAULT 0,
  trades integer NOT NULL DEFAULT 0,
  survived boolean NOT NULL DEFAULT false,
  client_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX leaderboard_runs_net_worth_idx ON public.leaderboard_runs (net_worth DESC);
CREATE INDEX leaderboard_runs_created_at_idx ON public.leaderboard_runs (created_at DESC);

GRANT ALL ON public.leaderboard_runs TO service_role;
ALTER TABLE public.leaderboard_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages leaderboard runs" ON public.leaderboard_runs FOR ALL TO service_role USING (true) WITH CHECK (true);