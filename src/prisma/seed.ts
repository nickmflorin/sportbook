/* eslint-disable no-console -- This script runs outside of the logger context. */
import clerk from "@clerk/clerk-sdk-node";
import { v4 as uuid } from "uuid";
import { type User, Sport, type Location, Gender } from "@prisma/client";

import type { Organization as ClerkOrg } from "@clerk/nextjs/api";

import { infiniteLoop, mapOverLength, selectSequentially } from "~/lib/util/random";

import { prisma, xprisma } from "./client";
import { safeEnumValue } from "./model";
import { fixtures, type SeedContext, generateLeague } from "./seeding";

const MIN_LEAGUES_PER_SPORT = 3;
const MAX_LEAGUES_PER_SPORT = 12;

// The number of non-Clerk users that should be generated in the database.
const NUM_FAKE_USERS = 100;

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

async function generateSportLeagues(sport: Sport, ctx: SeedContext) {
  const leagues = await Promise.all(
    mapOverLength({ min: MIN_LEAGUES_PER_SPORT, max: MAX_LEAGUES_PER_SPORT }, () => generateLeague(sport, ctx)),
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
  const clerkUserList = await collectClerkPages(p => clerk.users.getUserList(p));
  console.info(`Found ${clerkUserList.length} users in Clerk.`);

  /* TODO: We need to figure out how to sync user data with clerk data at certain times.  We cannot do this from the
     middleware script because we cannot run Prisma in the browser. */
  const clerkUsers = await Promise.all(clerkUserList.map(u => xprisma.user.createFromClerk(u)));
  console.info(`Generated ${clerkUsers.length} users in the database using information from Clerk.`);

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

  const ctx: Omit<SeedContext, "getLocation"> = {
    fakeUsers,
    clerkUsers,
    getClerkUser: infiniteLoop<User>(clerkUsers),
    getFakeUser: infiniteLoop<User>(fakeUsers),
    getUser: infiniteLoop<User>([...clerkUsers, ...fakeUsers]),
  };

  const locations = await generateLocations(ctx);
  console.info(`\nSuccessfully generated ${locations.length} locations with associated data in database.`);

  const getLocation = infiniteLoop<Location>(locations);
  await generateSports({ ...ctx, getLocation });
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
