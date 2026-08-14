GRANT SELECT ON public.leaderboard_runs TO anon, authenticated;
CREATE POLICY "Public can read leaderboard runs" ON public.leaderboard_runs FOR SELECT TO anon, authenticated USING (true);