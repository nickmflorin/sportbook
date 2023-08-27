import { type NextRequest } from "next/server";

import { ServerResponse } from "~/application/response";
import { getAuthUserFromRequest } from "~/server/auth";
import { getUserLeagueStaffPermissionCodes } from "~/server/leagues";
import { prisma } from "~/prisma/client";
import { LeagueStaffPermissionCode } from "~/prisma/model";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUserFromRequest(request);
  if (!user) {
    return ServerResponse.NotAuthenticated().toResponse();
  }
  const { id } = params;
  const league = await prisma.league.findUnique({
    where: { id },
    include: {
      config: { include: { staffPermissionSets: true } },
      teams: { include: { players: { include: { user: { select: { id: true } } } } } },
    },
  });
  if (!league) {
    return ServerResponse.BadRequest("The league does not exist.").toResponse();
  }
  /* TODO: Eventually, we will also have to account for cases where a non-staff team member wants to invite other
     players to the team that he belongs to. */
  const permissions = await getUserLeagueStaffPermissionCodes({ league, user });

  if (!permissions.includes(LeagueStaffPermissionCode.INVITE_PLAYERS)) {
    return ServerResponse.Forbidden("You do not have permission to invite players to this league.").toJson();
  }
  const teams = await prisma.team.findMany({ where: { leagueId: league.id } });
  return ServerResponse.OK(teams).toResponse();
}
