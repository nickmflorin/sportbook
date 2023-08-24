"use server";
import { type z } from "zod";

import { ServerError } from "~/application/errors";
import { getAuthUser } from "~/server/auth";
import { prisma } from "~/prisma/client";
import { Prisma, type LeagueSchema, LeagueStaffRole } from "~/prisma/model";

export const createLeague = async ({
  locations,
  competitionLevel,
  leagueType,
  isPublic,
  leagueStart,
  leagueEnd,
  ...data
}: z.output<typeof LeagueSchema>) => {
  const user = await getAuthUser();
  return await prisma.$transaction(
    async tx => {
      if (user) {
        const league = await tx.league.create({
          data: {
            createdById: user.id,
            updatedById: user.id,
            ...data,
            config: {
              create: {
                competitionLevel,
                leagueType,
                isPublic,
                leagueStart,
                leagueEnd,
                createdById: user.id,
                updatedById: user.id,
              },
            },
          },
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
      // TODO: What does this cause to happen on the client?
      return ServerError.NotAuthenticated("You must be authenticated to create a League.").toResponse();
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted },
  );
};
