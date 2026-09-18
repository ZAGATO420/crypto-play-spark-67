CREATE TABLE public.game_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  chapter integer,
  is_tournament boolean NOT NULL DEFAULT false,
  viewport text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.game_analytics TO service_role;
ALTER TABLE public.game_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages game analytics" ON public.game_analytics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE INDEX game_analytics_event_created_idx ON public.game_analytics (event_name, created_at DESC);