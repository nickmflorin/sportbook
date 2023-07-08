import { LeagueSchema } from "~/prisma/schemas";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const leaguesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(LeagueSchema)
    .mutation(async ({ input: { locations, ...data }, ctx: { user, prisma } }) =>
      prisma.league.create({
        data: { ...data, createdById: user.id, updatedById: user.id },
      }),
    ),
});
