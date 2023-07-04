import { Prisma, type User, type PrismaClient, type LeagueOnUsers, type League } from "@prisma/client";

enum DataModelType {
  LEAGUE = "league",
  USER = "user",
}

const modelTypeResult = <T extends string>(name: T) => ({
  modelType: {
    needs: {},
    compute(): T {
      return name;
    },
  },
});

/**
 * An extension for the {@link PrismaClient} that attributes prisma models with a 'modelType' attribute that can be used
 * as a discriminator in type guards or other type checks.
 */
export const ModelTypeExtension = {
  name: "modelTypeExtension",
  result: {
    league: modelTypeResult(DataModelType.LEAGUE),
    user: modelTypeResult(DataModelType.USER),
  },
};

export const userModelExtension = (prisma: PrismaClient) => ({
  async addToLeague({
    user,
    league,
    assignedBy,
  }: {
    user: string | User;
    league: string | League;
    assignedBy: string | User;
  }) {
    const _leagueId = typeof league === "string" ? league : league.id;
    const _userId = typeof user === "string" ? user : user.id;
    const _assignedById = typeof assignedBy === "string" ? assignedBy : assignedBy.id;

    // TODO: Do we need to validate it is a valid League?  What about if it is a balid UUID?
    prisma.leagueOnUsers.create({ data: { leagueId: _leagueId, userId: _userId, assignedById: _assignedById } });
    return null;
  },
});
