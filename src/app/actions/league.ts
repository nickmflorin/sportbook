"use server";
import { type z } from "zod";

import { getAuthUser } from "~/lib/integrations/clerk";
import { prisma, Prisma, type LeagueSchema } from "~/prisma";

import { ActionError, ActionErrorCodes } from "./errors";

export const createLeague = async ({ locations, ...data }: z.output<typeof LeagueSchema>) => {
  const user = await getAuthUser();
  if (!user) {
    throw new ActionError({
      message: "You must be authenticated to create a League.",
      code: ActionErrorCodes.NOT_AUTHENTICATED,
    });
  }
  return await prisma.$transaction(
    async tx => {
      if (user) {
        const league = await tx.league.create({
          data: { createdById: user.id, updatedById: user.id, ...data },
        });
        // By default, add the user who created the League to the League.
        await tx.leagueOnParticipants.create({
          data: { leagueId: league.id, participantId: user.id, assignedById: user.id },
        });
      }
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted },
  );
};