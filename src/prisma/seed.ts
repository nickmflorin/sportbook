/* eslint-disable no-console -- This script runs outside of the logger context. */
import clerk from "@clerk/clerk-sdk-node";
import chunk from "lodash.chunk";
import { v4 as uuid } from "uuid";
import {
  type User,
  Sport,
  type League,
  type Location,
  LeagueType,
  LeagueCompetitionLevel,
  Gender,
  Color,
} from "@prisma/client";

import type { Organization as ClerkOrg } from "@clerk/nextjs/api";

import { ensuresDefinedValue } from "~/lib/util";
import {
  infiniteLoop,
  infiniteLoopSelection,
  mapOverLength,
  selectAtRandom,
  generateRandomDate,
  selectSequentially,
  selectArrayAtRandom,
} from "~/lib/util/random";

import { prisma, xprisma } from "./client";
import { safeEnumValue, getModelMeta } from "./model";
import { fixtures, generateLeagueGames, type SeedContext, type GetUser } from "./seeding";

const MIN_PARTICIPANTS_PER_LEAGUE = 50;
const MAX_PARTICIPANTS_PER_LEAGUE = 100;
const MIN_LOCATIONS_PER_LEAGUE = 0;
const MAX_LOCATIONS_PER_LEAGUE = 3;
const MIN_LEAGUES_PER_SPORT = 3;
const MAX_LEAGUES_PER_SPORT = 12;

// The number of non-Clerk users that should be generated in the database.
const NUM_FAKE_USERS = 100;

/* The number of teams per league depends on the number of participants available for that league and the number of
   players per team.  The more participants in a league, and the fewer players per team, the more teams that can be
   created.  So, we try to optimize the number of teams per league first based on lowering the number of players per
   team until we have the desired number of teams per league.  If that does not work, we then try lowering the number
   of teams per league. */
const MIN_USERS_PER_TEAM = 4;
const MAX_USERS_PER_TEAM = 10;

const MAX_TEAMS_PER_LEAGUE = 6;
const MIN_TEAMS_PER_LEAGUE = 4;

const chunkPlayersPerTeam = (league: League, participants: User[]): User[][] => {
  if (participants.length === 0) {
    console.warn(`Cannot bucket players for team in league '${league.name}' because there are no league participants.`);
    return [];
  }
  const chunkPlayers = (minTeamsPerLeague: number): User[][] | null => {
    for (let i = MAX_USERS_PER_TEAM; i >= MIN_USERS_PER_TEAM; i--) {
      const chunked = chunk(participants, i);
      const nTeams = chunked.length;
      if (nTeams >= minTeamsPerLeague) {
        return chunked;
      }
    }
    return null;
  };
  for (let i = MAX_TEAMS_PER_LEAGUE; i >= MIN_TEAMS_PER_LEAGUE; i--) {
    const c = chunkPlayers(i);
    if (c) {
      if (i !== MAX_TEAMS_PER_LEAGUE) {
        console.warn(
          `There were not enough participants for league '${league.name}' to create the desired number of teams, ` +
            `'${MAX_TEAMS_PER_LEAGUE}'.  Instead, '${c.length}' teams were created.`,
        );
      }
      return c;
    }
  }
  console.warn(
    `There were not enough participants for league '${league.name}' to create the minimum number of teams, ` +
      `'${MIN_TEAMS_PER_LEAGUE}'. No teams were created.`,
  );
  return [];
};

async function collectClerkPages<T>(fetch: (params: { limit: number; offset: number }) => Promise<T[]>): Promise<T[]> {
  const results: T[] = [];
  const limit = 100;
  let offset = 0;
  let nResultsAdded = 0;
  do {
    const res = await fetch({ limit, offset });
    nResultsAdded = res.length;
    results.push(...res);
    offset += limit;
  } while (nResultsAdded > 0);
  return results;
}

/* -------------------------------------------------- Seeding ------------------------------------------------ */
async function generateLocations(ctx: Omit<SeedContext, "getLocation">) {
  return await Promise.all(
    fixtures.json.locations.map(locData => {
      const user = ctx.getUser();
      return prisma.location.create({
        data: {
          ...locData,
          createdById: user.id,
          updatedById: user.id,
        },
      });
    }),
  );
}

async function generateLeagueParticipants(league: League, ctx: SeedContext) {
  const users = infiniteLoopSelection<User, string>(ctx.getUser, {
    duplicationKey: (u: User) => u.id,
    length: { min: MIN_PARTICIPANTS_PER_LEAGUE, max: MAX_PARTICIPANTS_PER_LEAGUE },
  });
  const result = await prisma.leagueOnParticipants.createMany({
    data: users.map(u => ({ leagueId: league.id, participantId: u.id, assignedById: u.id })),
  });
  /* The users in the randomly iterated loop array will be the same as the participants for the league.  These users
     will then be used to create the teams in the league. */
  console.log(`Generated ${result.count} participants for league '${league.name}' in the database.`);
  return users;
}

async function generateLeagueTeam(
  name: string,
  players: User[],
  league: League,
  ctx: SeedContext & { readonly getParticipant: GetUser },
) {
  const team = await prisma.team.create({
    data: {
      ...getModelMeta("Team", { getUser: ctx.getParticipant }),
      name,
      leagueId: league.id,
      color: selectAtRandom(Object.values(Color)),
    },
  });
  await prisma.teamOnPlayers.createMany({
    data: players.map(p => ({ teamId: team.id, userId: p.id, assignedById: p.id, leagueId: league.id })),
  });
  return team;
}

async function generateLeagueTeams(
  league: League,
  { participants, ...ctx }: SeedContext & { participants: User[]; readonly getParticipant: GetUser },
) {
  const chunks = chunkPlayersPerTeam(league, participants);
  if (chunks.length === 0) {
    console.error(`There were not enough players to create any teams for league '${league.name}'.`);
    return [];
  }
  // If there are not enough team names to generate a unique name for each team in the league, an error will be thrown.
  const teamNames = selectArrayAtRandom(fixtures.json.teamNames, {
    length: chunks.length,
    duplicationKey: v => v.trim(),
  });
  const result = await Promise.all(
    chunks.map((players, i) => generateLeagueTeam(ensuresDefinedValue(teamNames[i]), players, league, ctx)),
  );
  console.info(`Generated ${result.length} teams for league '${league.name}' in the database.`);
  return result;
}

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

async function generateSportLeague(sport: Sport, ctx: SeedContext) {
  const league = await prisma.league.create({
    data: {
      ...getModelMeta("League", { getUser: ctx.getUser }),
      name: fixtures.randomLeagueName(),
      sport,
      description: fixtures.randomSentence(),
      leagueStart: generateRandomDate(),
      leagueEnd: generateRandomDate(),
      competitionLevel: selectAtRandom(Object.values(LeagueCompetitionLevel)),
      leagueType: selectAtRandom(Object.values(LeagueType)),
      isPublic: true,
    },
  });
  await generateLeagueLocations(league, ctx);
  const participants = await generateLeagueParticipants(league, ctx);
  const getParticipant = infiniteLoop<User>(participants);
  const teams = await generateLeagueTeams(league, { ...ctx, participants, getParticipant });
  await generateLeagueGames(league, teams, { ...ctx, getParticipant });
}

async function generateSportLeagues(sport: Sport, ctx: SeedContext) {
  const leagues = await Promise.all(
    mapOverLength({ min: MIN_LEAGUES_PER_SPORT, max: MAX_LEAGUES_PER_SPORT }, () => generateSportLeague(sport, ctx)),
  );
  console.info(`Generated ${leagues.length} leagues for sport '${sport}' in the database.`);
  return leagues;
}

async function generateSports(ctx: SeedContext) {
  await Promise.all(Object.values(Sport).map(sport => generateSportLeagues(sport, ctx)));
}

async function generateOrganization(clerkOrg: ClerkOrg, clerkUserIds: string[]) {
  console.log(`Inserting Organization "${clerkOrg.slug || clerkOrg.name}".`);
  return await prisma.org.create({
    data: {
      clerkId: clerkOrg.id,
      timezone: "America/New_York",
      name: clerkOrg.name,
      street1: "123 Main St",
      street2: "Suite 100",
      city: "Baltimore",
      state: "MD",
      zip: "21201",
      users: {
        connect: clerkUserIds.map(clerkId => ({ clerkId })),
      },
    },
  });
}

async function main() {
  const clerkUsers = await collectClerkPages(p => clerk.users.getUserList(p));
  console.info(`Found ${clerkUsers.length} users in Clerk.`);

  /* TODO: We need to figure out how to sync user data with clerk data at certain times.  We cannot do this from the
     middleware script because we cannot run Prisma in the browser. */
  const users = await Promise.all(clerkUsers.map(u => xprisma.user.createFromClerk(u)));
  console.info(`Generated ${users.length} clerk users in the database.`);

  const organizations = await collectClerkPages(p => clerk.organizations.getOrganizationList(p));
  console.info(`Found ${organizations.length} organizations in Clerk.`);

  for (const org of organizations) {
    console.info(`\nGenerating organization data for "${org.slug || org.name}".`);
    const members = await collectClerkPages(p =>
      clerk.organizations.getOrganizationMembershipList({ ...p, organizationId: org.id }),
    );
    console.info(`Found ${members.length} users in organization  "${org.slug || org.name}".`);
    const clerkUserIds = members.map(u => u.publicUserData?.userId).filter((uId): uId is string => !!uId);
    await generateOrganization(org, clerkUserIds);
  }
  console.info(`\nSuccessfully generated ${organizations.length} organizations with associated data in database.`);

  let fakeUsers: User[] = [];
  /* At least right now, we cannot generate enough User models from Clerk for development purposes.  So, we generate
     a series of fake User(s) to fill in the gaps.  In development, these User(s) cannot be used to login, but are only
     there to reference models that would be viewed when logged into a real User's account.

     Note: The clerkId for the fake users is set to a dummy string value - this ID will not correspond to an actual
     User in Clerk (which is why these fake User(s) cannot be used to login to the app). */
  if (fixtures.json.users.length !== 0) {
    fakeUsers = await Promise.all(
      mapOverLength(NUM_FAKE_USERS, i => {
        const userData = selectSequentially(fixtures.json.users, i);
        return prisma.user.create({
          data: { ...userData, clerkId: uuid(), gender: safeEnumValue(userData.gender, Gender) },
        });
      }),
    );
    console.info(`Generated ${fakeUsers.length} fake users in the database.`);
  } else {
    console.warn("Cannot generate fake users as there is no user data to generate them from.");
  }

  const getUser = infiniteLoop<User>([...users, ...fakeUsers]);
  const locations = await generateLocations({ getUser });
  console.info(`\nSuccessfully generated ${locations.length} locations with associated data in database.`);

  const getLocation = infiniteLoop<Location>(locations);
  await generateSports({ getUser, getLocation });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
