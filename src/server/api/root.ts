import { leaguesRouter } from "~/server/api/routers/leagues";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  leagues: leaguesRouter,
});

export type AppRouter = typeof appRouter;
