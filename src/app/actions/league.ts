"use server";
import { type z } from "zod";

import { prisma } from "~/prisma/client";
import { Prisma, type LeagueSchema, LeagueStaffRole } from "~/prisma/model";
import { getAuthUser } from "~/server/auth";

import { ActionError, ActionErrorCodes } from "./errors";

export const createLeague = async ({ locations, ...data }: z.output<typeof LeagueSchema>) => {
  const user = await getAuthUser();
  return await prisma.$transaction(
    async tx => {
      if (user) {
        const league = await tx.league.create({
          data: { createdById: user.id, updatedById: user.id, ...data },
        });
        // By default, make the user who created the League an Admin.  We will need to revisit this later.
        await tx.leagueStaff.create({
          data: {
            userId: user.id,
            leagueId: league.id,
            roles: [LeagueStaffRole.ADMIN],
          },
        });
        // If the new League is associated with locations, some may already exist in the database and some may not.
        const newLocations = await Promise.all(
          locations
            .filter(
              (loc): loc is Exclude<z.output<typeof LeagueSchema>["locations"][number], string> =>
                typeof loc !== "string",
            )
            .map(
              async loc => await tx.location.create({ data: { ...loc, createdById: user.id, updatedById: user.id } }),
            ),
        );
        // Associate the newly created League with the locations, either existing or new.
        await tx.leagueOnLocations.createMany({
          data: [
            ...locations.filter(
              (loc): loc is Extract<z.output<typeof LeagueSchema>["locations"][number], string> =>
                typeof loc === "string",
            ),
            ...newLocations.map(loc => loc.id),
          ].map(locationId => ({ leagueId: league.id, locationId, assignedById: user.id })),
        });
        return league;
      }
      throw new ActionError({
        message: "You must be authenticated to create a League.",
        code: ActionErrorCodes.NOT_AUTHENTICATED,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted },
  );
};
