"use server";
import intersection from "lodash.intersection";
import { type z } from "zod";

import { ServerResponse } from "~/application/response";
import { getAuthUser } from "~/server/auth";
import { getUserLeagueStaffPermissionCodes } from "~/server/leagues/permissions";
import { prisma } from "~/prisma/client";
import { LeagueStaffPermissionCode, type InvitePlayersSchema } from "~/prisma/model";

/* Note: This is a temporary method of "inviting" players that does not include email invites or invites for individuals
   that do not yet have an account.  For now, we simply create the players for the given league using the existing user
   models. */
export const invitePlayersToTeam = async (leagueId: string, data: z.output<typeof InvitePlayersSchema>) => {
  const user = await getAuthUser();
  if (!user) {
    return ServerResponse.NotAuthenticated("You must be authenticated to invite players to a league.").toJson();
  }
  const league = await prisma.league.findUnique({
    where: { id: leagueId },
    include: {
      config: { include: { staffPermissionSets: true } },
      teams: { include: { players: { include: { user: { select: { id: true } } } } } },
    },
  });
  if (!league) {
    return ServerResponse.BadRequest("The league does not exist.").toJson();
  }
  /* TODO: Eventually, we will also have to account for cases where a non-staff team member wants to invite other
     players to the team that he belongs to. */
  const permissions = await getUserLeagueStaffPermissionCodes({ league, user });

  if (!permissions.includes(LeagueStaffPermissionCode.INVITE_PLAYERS)) {
    return ServerResponse.Forbidden("You do not have permission to invite players to this league.").toJson();
  }
  const team = await prisma.team.findUnique({ where: { id: data.teamId } });
  if (!team) {
    return ServerResponse.BadRequest("The team does not exist.").toJson();
  } else if (team.leagueId !== league.id) {
    return ServerResponse.BadRequest("The team does not belong to the league.").toJson();
  }
  const usersToInvite = await prisma.user.findMany({ where: { id: { in: data.userIds } } });
  if (usersToInvite.length !== data.userIds.length) {
    return ServerResponse.BadRequest("Not all of the users to invite exist.").toJson();
  }
  const existingPlayers = league.teams.flatMap(tm => tm.players.map(p => p.userId));
  if (
    intersection(
      existingPlayers,
      usersToInvite.map(u => u.id),
    ).length !== 0
  ) {
    return ServerResponse.BadRequest("At least 1 of the users belongs to a tem in the league already.").toJson();
  }

  return await prisma.leaguePlayer.createMany({
    data: usersToInvite.map(user => ({ userId: user.id, teamId: team.id })),
  });
};
