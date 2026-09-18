import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  beat: z.string().trim().min(1).max(48),
  chapter: z.number().int().min(0).max(28).optional(),
  tournament: z.boolean().optional(),
  viewport: z.string().max(24).optional(),
  detail: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const Route = createFileRoute("/api/public/game-analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = schema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response(null, { status: 204 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("game_analytics").insert({
          event_name: parsed.data.beat,
          chapter: parsed.data.chapter ?? null,
          is_tournament: parsed.data.tournament ?? false,
          viewport: parsed.data.viewport ?? null,
          details: parsed.data.detail ?? {},
        });
        return new Response(null, { status: 204 });
      },
    },
  },
});