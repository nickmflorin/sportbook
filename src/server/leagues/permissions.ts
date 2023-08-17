import uniq from "lodash.uniq";

import { prisma } from "~/prisma/client";
import {
  type LeagueStaff,
  type League,
  type User,
  type LeagueWithConfig,
  type LeagueStaffPermissionCode,
  type LeagueWithConfigAndPermissionSets,
} from "~/prisma/model";

type L = League | LeagueWithConfig | LeagueWithConfigAndPermissionSets | string;

const isLeagueWithConfig = (league: L): league is LeagueWithConfig =>
  typeof league !== "string" && (league as LeagueWithConfig).config !== undefined;

const isLeagueWithConfigAndPermissionSets = (league: L): league is LeagueWithConfigAndPermissionSets =>
  typeof league !== "string" &&
  (league as LeagueWithConfig).config !== undefined &&
  (league as LeagueWithConfigAndPermissionSets).config.staffPermissionSets !== undefined &&
  (league as LeagueWithConfigAndPermissionSets).config.playerPermissionSets !== undefined;

export const getLeagueStaffPermissionCodes = async (
  league: L,
  staff: LeagueStaff,
): Promise<LeagueStaffPermissionCode[]> => {
  const leagueId = typeof league === "string" ? league : league.id;
  if (staff.leagueId !== leagueId) {
    throw new Error(`The staff member '${staff.id}' does not belong to the league '${leagueId}'!`);
  }
  if (isLeagueWithConfigAndPermissionSets(league)) {
    return uniq(
      league.config.staffPermissionSets
        .filter(pm => staff.roles.includes(pm.leagueStaffRole))
        .flatMap(pm => pm.permissionCodes),
    );
  } else if (isLeagueWithConfig(league)) {
    return uniq(
      (
        await prisma.leagueStaffPermissionSet.findMany({
          where: { leagueConfigId: league.config.id, leagueStaffRole: { in: staff.roles } },
        })
      ).flatMap(pm => pm.permissionCodes),
    );
  } else if (typeof league !== "string") {
    return uniq(
      (
        await prisma.leagueConfig.findUniqueOrThrow({
          where: { id: league.configId },
          include: { staffPermissionSets: { where: { leagueStaffRole: { in: staff.roles } } } },
        })
      ).staffPermissionSets.flatMap(pm => pm.permissionCodes),
    );
  } else {
    return uniq(
      (
        await prisma.league.findUniqueOrThrow({
          where: { id: league },
          include: {
            config: { include: { staffPermissionSets: { where: { leagueStaffRole: { in: staff.roles } } } } },
          },
        })
      ).config.staffPermissionSets.flatMap(pm => pm.permissionCodes),
    );
  }
};

type StaffOption = { staff: LeagueStaff };
type UserOption = { league: L; user: User };

type GetUserLeaguePermissionSetsOptions = UserOption | StaffOption;

const isStaffOption = (options: GetUserLeaguePermissionSetsOptions): options is StaffOption =>
  (options as StaffOption).staff !== undefined;

export const getUserLeagueStaffPermissionCodes = async (options: GetUserLeaguePermissionSetsOptions) => {
  if (isStaffOption(options)) {
    return await getLeagueStaffPermissionCodes(options.staff.leagueId, options.staff);
  }
  /* Here, we want to make sure that we perform the findMany operation on the staff lookup with a valid league ID.  If
     the leagueId is invalid, the result will be an empty array of permission codes - not a failure, so we would never
     be aware of the bug.  The 'getLeagueStaffPermissionCodes' function will not perform a double query if the league
     with the permission sets and config are provided as the argument. */
  let league: Exclude<L, string>;
  if (typeof options.league === "string") {
    league = await prisma.league.findUniqueOrThrow({
      where: { id: options.league },
      /* We cannot include the permission sets yet because we don't know what staff instance the user is associated
         with yet. */
      include: { config: true },
    });
  } else {
    league = options.league;
  }
  const staff = await prisma.leagueStaff.findMany({ where: { userId: options.user.id, leagueId: league.id } });
  if (staff.length > 1) {
    throw new Error(
      `Query unexpectedly returned ${staff.length} league staff users for user '${options.user.id}', league ` +
        `'${league.id}'!  There should only be at most one staff user per league per user.`,
    );
  } else if (staff.length === 0) {
    // The user not associated as a staff member for this league.  They do not have any permission codes.
    return [];
  }
  return await getLeagueStaffPermissionCodes(league, staff[0] as LeagueStaff);
};
