/* eslint-disable no-console -- This script runs outside of the logger context. */
import clerk from "@clerk/clerk-sdk-node";
import { type User, Sport, LeagueCompetitionLevel, LeagueType, type League, type Location } from "@prisma/client";

import type { Organization as ClerkOrg } from "@clerk/nextjs/api";

import { infiniteLoop, infiniteLoopSelection } from "~/lib/util/random";

import { prisma } from "./client";
import { data } from "./fixtures";

const MIN_PARTICIPANTS_PER_LEAGUE = 3;
const MAX_PARTICIPANTS_PER_LEAGUE = 5;
const MIN_LOCATIONS_PER_LEAGUE = 0;
const MAX_LOCATIONS_PER_LEAGUE = 3;

type GetUser = () => User;

type GetLocation = () => Location;

type SeedContext = {
  readonly getUser: GetUser;
  readonly getLocation: GetLocation;
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

const safeEnumValue = <E extends Record<string, string>>(value: string, prismaEnum: E): E[keyof E] => {
  const v = value.toUpperCase();
  if (prismaEnum[v] === undefined) {
    throw new TypeError(
      `Invalid enum value '${value}' detected for enum, must be one of ${Object.values(prismaEnum).join(", ")}'`,
    );
  }
  return v as E[keyof E];
};

/* -------------------------------------------------- Seeding ------------------------------------------------ */
async function generateLocations(ctx: Omit<SeedContext, "getLocation">) {
  return await Promise.all(
    data.locations.map(locData => {
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
  return await prisma.leagueOnParticipants.createMany({
    data: users.map(u => ({ leagueId: league.id, participantId: u.id, assignedById: u.id })),
  });
}

async function generateLeagueLocations(league: League, ctx: SeedContext) {
  const locations = infiniteLoopSelection<Location, string>(ctx.getLocation, {
    duplicationKey: (loc: Location) => loc.id,
    length: { min: MIN_LOCATIONS_PER_LEAGUE, max: MAX_LOCATIONS_PER_LEAGUE },
  });
  return await prisma.leagueOnLocations.createMany({
    data: locations.map(loc => {
      const u = ctx.getUser();
      return { leagueId: league.id, locationId: loc.id, assignedById: u.id };
    }),
  });
}

async function generateSportLeague(sport: Sport, leagueData: (typeof data.leagues)[number], ctx: SeedContext) {
  const user = ctx.getUser();
  const league = await prisma.league.create({
    data: {
      ...leagueData,
      leagueType: safeEnumValue(leagueData.leagueType, LeagueType),
      leagueStart: leagueData.leagueStart ? new Date(leagueData.leagueStart) : null,
      leagueEnd: leagueData.leagueEnd ? new Date(leagueData.leagueEnd) : null,
      competitionLevel: safeEnumValue(leagueData.competitionLevel, LeagueCompetitionLevel),
      createdAt: new Date(leagueData.createdAt),
      updatedAt: new Date(leagueData.updatedAt),
      createdById: user.id,
      updatedById: user.id,
      sport,
    },
  });
  await generateLeagueParticipants(league, ctx);
  await generateLeagueLocations(league, ctx);
}

async function generateSportLeagues(sport: Sport, ctx: SeedContext) {
  return Promise.all(data.leagues.map(leagueData => generateSportLeague(sport, leagueData, ctx)));
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
  const users = await Promise.all(clerkUsers.map(u => prisma.user.createFromClerk(u)));
  console.info(`Generated ${users.length} users in the database.`);

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

  const getUser = infiniteLoop<User>(users);
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
