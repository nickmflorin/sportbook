import { type User as ClerkUser } from "@clerk/clerk-sdk-node";
import { type User, type PrismaClient, type League } from "@prisma/client";
import { DateTime } from "luxon";

import { logger } from "~/internal/logger";
import { getClerkEmailAddress } from "~/lib/integrations/clerk";

import { isPrismaDoesNotExistError } from "./errors";

export const userModelExtension = (prisma: PrismaClient) => ({
  _getTransformedClerkData: (u: ClerkUser) => {
    const email = getClerkEmailAddress(u);
    return {
      profileImageUrl: u.profileImageUrl,
      emailAddress: email ? email.emailAddress : null,
      firstName: u.firstName,
      lastName: u.lastName,
      lastUpdatedFromClerk: new Date(),
    };
  },
  async upsertFromClerk(u: ClerkUser) {
    return prisma.user.upsert({
      where: { clerkId: u.id },
      update: {
        ...this._getTransformedClerkData(u),
        lastUpdatedFromClerk: new Date(),
      },
      create: {
        ...this._getTransformedClerkData(u),
        clerkId: u.id,
      },
    });
  },
  async createFromClerk(u: ClerkUser) {
    return prisma.user.create({
      data: {
        ...this._getTransformedClerkData(u),
        clerkId: u.id,
      },
    });
  },
  async syncWithClerk(u: ClerkUser) {
    let user: User | null = null;
    try {
      user = await prisma.user.findUniqueOrThrow({ where: { clerkId: u.id } });
    } catch (e) {
      if (isPrismaDoesNotExistError(e)) {
        logger.info({ clerkId: u.id }, `User does not exist for Clerk ID '${u.id}'... creating a new User.`);
        return this.upsertFromClerk(u);
      } else {
        throw e;
      }
    }
    // TODO: Time zone considerations?
    const lastUpdated = DateTime.fromJSDate(user.lastUpdatedFromClerk);
    const hoursSinceLastUpdate = DateTime.local().diff(lastUpdated).hours;
    // TODO: Make me an environment variable.
    if (hoursSinceLastUpdate > 2) {
      logger.info({ clerkId: u.id }, `User exists for Clerk ID '${u.id}' but requires update, updating the User.`);
      return this.upsertFromClerk(u);
    }
    return user;
  },
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
