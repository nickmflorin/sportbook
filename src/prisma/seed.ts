/* eslint-disable no-console -- This script runs outside of the logger context. */
import { createRequire as _createRequire } from "module";

import clerk from "@clerk/clerk-sdk-node";
import { type User, LeagueCompetitionLevel, LeagueType } from "@prisma/client";
import { DateTime } from "luxon";

import type { Organization as ClerkOrg } from "@clerk/nextjs/api";

import { type ClientType, prisma } from "~/server/db";

import { data } from "./fixtures";

/* -------------------------------------------------- Constants ---------------------------------------------- */

/* -------------------------------------------------- Types ---------------------------------------------- */
type GetUser = () => User;

/* --------------------------------------------------- Utils ------------------------------------------------- */
function isRandomlyNull(nullChance = 0): boolean {
  if (nullChance > 100 || nullChance < 0) {
    throw new TypeError("Null frequency must be between 0 and 100.");
  }
  return randomInt(0, 100) <= nullChance;
}

function randomlyNull<T>(func: () => T, nullChance: number): () => T | null {
  return (): T | null => (isRandomlyNull(nullChance) ? null : func());
}

function infiniteLoop<T>(data: T[], step = 1): () => T {
  let cur = -1;
  const len = data.length;

  return (): T => {
    cur += step;
    cur = cur >= len ? 0 : cur;
    if (data[cur] === undefined) {
      throw new Error("No data exists at the first index because the provided data is empty.");
    }
    return data[cur] as T;
  };
}

function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

type RandomDateParams = { min?: Date | DateTime; max?: Date | DateTime; nullFrequency?: number };

const _toDateTime = (value: Date | DateTime) => (value instanceof Date ? DateTime.fromJSDate(value) : value);

type RandomDateRT<P extends RandomDateParams> = P extends { nullFrequency: number } ? Date | null : Date;

function randomDate<P extends RandomDateParams>(params?: P): RandomDateRT<P> {
  if (isRandomlyNull(params?.nullFrequency)) {
    return null as RandomDateRT<P>;
  }
  const max: DateTime = params?.max === undefined ? DateTime.now() : _toDateTime(params.max);
  const min: DateTime = params?.min === undefined ? max.minus({ months: 36 }) : _toDateTime(params.min);
  if (max <= min) {
    throw new TypeError("The max date must be after the min date.");
  }
  const diff = max.diff(min, ["seconds"]).seconds * (randomInt(0, 100) / 100.0);
  return min.plus({ seconds: Math.floor(diff) }).toJSDate();
}

function randomSelection<T>(data: T[]): T {
  const ind = randomInt(0, data.length - 1);
  const datum = data[ind];
  if (!datum) {
    throw new Error(`Data unexpectedly returned undefined value at index ${ind}!`);
  }
  return datum;
}

function randomSelectionWithoutDuplication<T, V extends string | number>(
  data: T[],
  prev: T[],
  duplicationKey: (v: T) => V,
): T | null {
  let population = [...data];

  const isDuplicate = (d: T) => prev.some(p => duplicationKey(p) === duplicationKey(d));

  while (population.length > 0) {
    const ind = randomInt(0, population.length - 1);
    const datum = population[ind];
    if (!datum) {
      throw new Error(`Data unexpectedly returned undefined value at index ${ind}!`);
    } else if (isDuplicate(datum)) {
      population = [...population.slice(0, ind), ...population.slice(ind + 1)];
    } else {
      return datum;
    }
  }
  return null;
}

type RandomSelectionArrayOpts<T, V extends string | number> = {
  /**
   * Either the length that the randomly selected array should be or a minimum, maximum length range that the resulting
   * array should lie in.  The returned array will meet this length criteria as long as there are sufficient elements in
   * the array to select from.
   */
  length: [number, number] | number;
  /**
   * If provided, elements will be randomly selected and added to the array as long as they do not represent duplicates
   * of elements already in the array, where a duplicate is determined based on an equality check of this function's
   * return value.
   *
   * Elements will continue to be selected until the array reaches the desired length or until there are no more
   * elements to select that ensure uniqueness in the array.
   */
  duplicationKey?: (v: T) => V;
};

/**
 * Creates an array of randomly selected elements, {@link T[]}, by making random selections from the provided array,
 * {@link T[]}.
 *
 * Options: @see {RandomSelectionArrayOpts}
 *
 * @template T The type of the elements in the array.
 *
 * @param {T[]} data The array to select from.
 * @param {RandomSelectionArrayOpts<T>} options Options that define the random selection.
 * @returns {T[]} A new array formed from random selections from the provided array.
 *
 * @example
 * const data = [1, 2, 3, 4, 5];
 * randomSelectionArray(data, { length: 3 }); // [1, 3, 5]
 */
function randomSelectionArray<T, V extends string | number>(data: T[], options: RandomSelectionArrayOpts<T, V>): T[] {
  const count = Array.isArray(options.length) ? randomInt(...options.length) : options.length;
  let arr: T[] = [];
  for (let i = 0; i < count; i++) {
    if (options.duplicationKey) {
      const selection = randomSelectionWithoutDuplication(data, arr, options.duplicationKey);
      if (!selection) {
        return arr;
      }
      arr = [...arr, selection];
    } else {
      arr = [...arr, randomSelection(data)];
    }
  }
  return arr;
}

async function collectPages<T>(fetch: (params: { limit: number; offset: number }) => Promise<T[]>): Promise<T[]> {
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
async function generateSports(getUser: GetUser) {
  const sports = await Promise.all(
    data.sports.map(sportData => {
      const user = getUser();
      return prisma.sport.create({
        data: {
          ...sportData,
          createdAt: new Date(sportData.createdAt),
          updatedAt: new Date(sportData.updatedAt),
          createdById: user.id,
          updatedById: user.id,
          leagues: {
            create: data.leagues.map(leagueData => {
              const user = getUser();
              return {
                ...leagueData,
                leagueType: safeEnumValue(leagueData.leagueType, LeagueType),
                leagueStart: leagueData.leagueStart ? new Date(leagueData.leagueStart) : null,
                leagueEnd: leagueData.leagueEnd ? new Date(leagueData.leagueEnd) : null,
                competitionLevel: safeEnumValue(leagueData.competitionLevel, LeagueCompetitionLevel),
                createdAt: new Date(leagueData.createdAt),
                updatedAt: new Date(leagueData.updatedAt),
                createdById: user.id,
                updatedById: user.id,
              };
            }),
          },
        },
      });
    }),
  );
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
  const clerkUsers = await collectPages(p => clerk.users.getUserList(p));
  console.info(`Found ${clerkUsers.length} users in Clerk.`);

  /* TODO: We need to figure out how to sync user data with clerk data at certain times.  We cannot do this from the
     middleware script because we cannot run Prisma in the browser. */
  const users = await Promise.all(clerkUsers.map(u => prisma.user.createFromClerk(u)));
  console.info(`Generated ${users.length} users in the database.`);

  const organizations = await collectPages(p => clerk.organizations.getOrganizationList(p));
  console.info(`Found ${organizations.length} organizations in Clerk.`);

  for (const org of organizations) {
    console.info(`\nGenerating organization data for "${org.slug || org.name}".`);
    const members = await collectPages(p =>
      clerk.organizations.getOrganizationMembershipList({ ...p, organizationId: org.id }),
    );
    console.info(`Found ${members.length} users in organization  "${org.slug || org.name}".`);
    const clerkUserIds = members.map(u => u.publicUserData?.userId).filter((uId): uId is string => !!uId);
    await generateOrganization(org, clerkUserIds);
  }
  console.info(`\nSuccessfully generated ${organizations.length} organizations with associated data in database.`);

  const getUser = infiniteLoop<User>(users);
  await generateSports(getUser);
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
