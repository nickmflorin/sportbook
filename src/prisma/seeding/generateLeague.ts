/* eslint-disable no-console -- This script runs outside of the logger context. */
import {
  type User,
  type Sport,
  type League,
  type Location,
  LeagueStaffRole,
  LeagueType,
  LeagueCompetitionLevel,
  LeagueStaffPermissionCode,
} from "@prisma/client";

import {
  infiniteLoop,
  infiniteLoopSelection,
  selectAtRandom,
  selectArrayAtRandom,
  generateRandomDate,
} from "~/lib/util/random";

import { prisma } from "../client";
import { getModelMeta } from "../model";

import * as fixtures from "./fixtures";
import generateLeagueGames from "./generateLeagueGames";
import generateLeagueTeams from "./generateLeagueTeams";
import { type SeedContext } from "./types";

const MIN_LOCATIONS_PER_LEAGUE = 0;
const MAX_LOCATIONS_PER_LEAGUE = 3;
const MIN_STAFF_PER_LEAGUE = 4;
const MAX_STAFF_PER_LEAGUE = 10;

/* Whether or not real users in Clerk should be treated as admins for every league that is created in a development
   environment. */
const AUTO_CLERK_USER_LEAGUE_ADMIN = true;

async function generateLeagueLocations(league: League, ctx: SeedContext) {
  const locations = infiniteLoopSelection<Location, string>(ctx.getLocation, {
    duplicationKey: (loc: Location) => loc.id,
    length: { min: MIN_LOCATIONS_PER_LEAGUE, max: MAX_LOCATIONS_PER_LEAGUE },
  });
  await prisma.leagueOnLocations.createMany({
    data: locations.map(loc => {
      const u = ctx.getUser();
      return { leagueId: league.id, locationId: loc.id, assignedById: u.id };
    }),
  });
  console.info(`Generated ${locations.length} locations for league '${league.name}' in the database.`);
  return locations;
}

async function generateLeagueStaff(league: League, ctx: SeedContext) {
  /* Right now, for development purposes, when the AUTO_CLERK_USER_LEAGUE_ADMIN is 'true' we will automatically set all
     users that exist in the Clerk Database (which should only be developers at this point) as admins for every
     league.  The non-Clerk users (i.e. Fake Users) will be assigned staff roles randomly. */
  const leagueStaffUsers = infiniteLoopSelection<User, string>(
    AUTO_CLERK_USER_LEAGUE_ADMIN ? ctx.getFakeUser : ctx.getUser,
    {
      duplicationKey: (u: User) => u.id,
      length: { min: MIN_STAFF_PER_LEAGUE, max: MAX_STAFF_PER_LEAGUE },
    },
  );
  await prisma.leagueStaff.createMany({
    data: leagueStaffUsers.map(u => ({
      ...getModelMeta("LeagueStaff", ctx),
      leagueId: league.id,
      userId: u.id,
      roles: selectArrayAtRandom(Object.values(LeagueStaffRole), {
        duplicationKey: i => i,
        length: { min: 1, max: 2 },
      }),
    })),
  });
  if (AUTO_CLERK_USER_LEAGUE_ADMIN) {
    await prisma.leagueStaff.createMany({
      data: ctx.clerkUsers.map(u => ({
        ...getModelMeta("LeagueStaff", ctx),
        leagueId: league.id,
        userId: u.id,
        roles: [LeagueStaffRole.ADMIN],
      })),
    });
  }
}

export default async function generateLeague(sport: Sport, ctx: SeedContext) {
  const league = await prisma.league.create({
    data: {
      ...getModelMeta("League", { getUser: ctx.getUser }),
      name: fixtures.randomLeagueName(),
      sport,
      description: fixtures.randomSentence(),
      config: {
        create: {
          ...getModelMeta("LeagueConfig", { getUser: ctx.getUser }),
          leagueStart: generateRandomDate(),
          leagueEnd: generateRandomDate(),
          competitionLevel: selectAtRandom(Object.values(LeagueCompetitionLevel)),
          leagueType: selectAtRandom(Object.values(LeagueType)),
          isPublic: true,
        },
      },
    },
  });
  /* For now, we will default the permissions for leagues until we have a better way to configure them from the UI. */
  await prisma.leagueStaffPermissionSet.createMany({
    data: [
      {
        ...getModelMeta("LeagueStaffPermissionSet", { getUser: ctx.getUser }),
        leagueConfigId: league.configId,
        leagueStaffRole: LeagueStaffRole.ADMIN,
        permissionCodes: [LeagueStaffPermissionCode.CANCEL_GAME, LeagueStaffPermissionCode.POSTPONE_GAME],
      },
      {
        ...getModelMeta("LeagueStaffPermissionSet", { getUser: ctx.getUser }),
        leagueConfigId: league.configId,
        leagueStaffRole: LeagueStaffRole.COMISSIONER,
        permissionCodes: [LeagueStaffPermissionCode.CANCEL_GAME, LeagueStaffPermissionCode.POSTPONE_GAME],
      },
      {
        ...getModelMeta("LeagueStaffPermissionSet", { getUser: ctx.getUser }),
        leagueConfigId: league.configId,
        leagueStaffRole: LeagueStaffRole.REFEREE,
        permissionCodes: [],
      },
    ],
  });
  await generateLeagueLocations(league, ctx);
  await generateLeagueStaff(league, ctx);
  const [teams, leagueUsers] = await generateLeagueTeams(league, ctx);
  if (teams.length !== 0) {
    /* Right now, we only need the users in the league for purposes of the model meta fields on the games - that may
       change in the future. */
    const getParticipant = infiniteLoop<User>(leagueUsers);
    await generateLeagueGames(league, teams, { ...ctx, getParticipant });
  }
}
