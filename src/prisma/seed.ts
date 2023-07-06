/* eslint-disable no-console -- This script runs outside of the logger context. */
import clerk from "@clerk/clerk-sdk-node";
import { type User, LeagueCompetitionLevel, LeagueType, type League, type Sport } from "@prisma/client";

import type { Organization as ClerkOrg } from "@clerk/nextjs/api";

import { infiniteLoop, infiniteLoopSelection } from "~/lib/utils/random";
import { prisma } from "~/server/db";

import { data } from "./fixtures";

type GetUser = () => User;

type SeedContext = {
  readonly getUser: GetUser;
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
async function generateLeagueUsers(league: League, ctx: SeedContext) {
  const users = infiniteLoopSelection<User, string>(ctx.getUser, {
    duplicationKey: (u: User) => u.id,
    length: { min: 3, max: 10 },
  });
  return await prisma.leagueOnUsers.createMany({
    data: users.map(u => ({ leagueId: league.id, userId: u.id, assignedById: u.id })),
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
      sportId: sport.id,
    },
  });
  await generateLeagueUsers(league, ctx);
}

async function generateSportLeagues(sport: Sport, ctx: SeedContext) {
  return Promise.all(data.leagues.map(leagueData => generateSportLeague(sport, leagueData, ctx)));
}

async function generateSports(ctx: SeedContext) {
  const sports = await Promise.all(
    data.sports.map(sportData => {
      const user = ctx.getUser();
      return prisma.sport.create({
        data: {
          ...sportData,
          createdAt: new Date(sportData.createdAt),
          updatedAt: new Date(sportData.updatedAt),
          createdById: user.id,
          updatedById: user.id,
        },
      });
    }),
  );
  await Promise.all(sports.map(sport => generateSportLeagues(sport, ctx)));
  console.info(`Generated ${sports.length} sports in the database.`);
  return sports;
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
  await generateSports({ getUser });
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
