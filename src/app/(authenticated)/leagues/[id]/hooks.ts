import { notFound } from "next/navigation";

import { prisma, isPrismaDoesNotExistError, isPrismaInvalidIdError } from "~/prisma/client";
import { type League, type LeagueStaff, LeagueStaffRole, type User } from "~/prisma/model";

type UserLeagueStaffRolesRT = {
  readonly roles: LeagueStaffRole[];
  readonly isLeagueAdmin: boolean;
  readonly isLeagueCommissioner: boolean;
  readonly isLeagueReferee: boolean;
  readonly hasLeagueRole: (role: LeagueStaffRole | LeagueStaffRole[]) => boolean;
};

export const useUserLeagueStaffRoles = async (
  user: User,
  league: League | string | (League & { readonly staff: LeagueStaff[] }),
): Promise<UserLeagueStaffRolesRT> => {
  const isLeagueWithStaff = (
    l: League | string | (League & { readonly staff: LeagueStaff[] }),
  ): l is League & { readonly staff: LeagueStaff[] } =>
    typeof l !== "string" && Array.isArray((league as League & { readonly staff: LeagueStaff[] }).staff);

  let _league: League & { readonly staff: LeagueStaff[] };
  let roles: LeagueStaffRole[];
  if (typeof league === "string") {
    try {
      _league = await prisma.league.findFirstOrThrow({
        include: { staff: true },
        where: {
          id: league,
          OR: [
            { staff: { some: { userId: user.id } } },
            { teams: { some: { players: { some: { userId: user.id } } } } },
          ],
        },
      });
    } catch (e) {
      if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
        notFound();
      } else {
        throw e;
      }
    }
    roles = _league.staff.find(s => s.userId === user.id)?.roles ?? [];
  } else if (isLeagueWithStaff(league)) {
    roles = league.staff.find(s => s.userId === user.id)?.roles ?? [];
  } else {
    const _staff = await prisma.leagueStaff.findFirst({ where: { leagueId: league.id, userId: user.id } });
    roles = _staff === null ? [] : _staff.roles;
  }

  return {
    roles,
    hasLeagueRole: (role: LeagueStaffRole | LeagueStaffRole[]) =>
      Array.isArray(role) ? role.every(r => roles.includes(r)) : roles.includes(role),
    isLeagueAdmin: roles.includes(LeagueStaffRole.ADMIN),
    isLeagueCommissioner: roles.includes(LeagueStaffRole.COMISSIONER),
    isLeagueReferee: roles.includes(LeagueStaffRole.REFEREE),
  };
};
