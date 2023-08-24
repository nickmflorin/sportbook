import { cache } from "react";

import uniq from "lodash.uniq";
import "server-only";

import { prisma } from "~/prisma/client";
import { type User, FileUploadEntity } from "~/prisma/model";
import { constructOrSearch } from "~/prisma/util";
import { getTeamStats } from "~/server/leagues";

import { getLeague } from "../getLeague";

export const revalidate = 3600; // Revalidate the data at most every hour

type PreloadPlayersParams = {
  readonly leagueId: string;
  readonly user: User;
};

export const preloadPlayers = (params: PreloadPlayersParams) => {
  void getPlayers(params);
};

type GetPlayersParams = PreloadPlayersParams & {
  readonly teamIds?: string[];
  readonly search?: string;
};

export const getPlayers = cache(async ({ leagueId, user, teamIds = [], search = "" }: GetPlayersParams) => {
  const league = await getLeague(leagueId, user);

  const rawPlayers = await prisma.leaguePlayer.findMany({
    include: { user: true, team: { include: { _count: { select: { players: true } } } } },
    where: {
      ...(teamIds.length > 0 && search.length !== 0
        ? {
            team: { id: { in: teamIds }, leagueId: league.id },
            OR: [
              { user: constructOrSearch(search, ["firstName", "lastName"]) },
              { team: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : search.length !== 0
        ? {
            team: { leagueId: league.id },
            OR: [
              { user: constructOrSearch(search, ["firstName", "lastName"]) },
              { team: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : teamIds.length > 0
        ? { team: { id: { in: teamIds }, leagueId: league.id } }
        : { team: { leagueId: league.id } }),
    },
  });

  const promises = rawPlayers.map(async ({ team: { _count, ...team }, ...player }) => {
    /* Since we are providing the team and the league, no database query will be made - so the looped await is not a
       performance issue. */
    const stats = await getTeamStats(team, league);
    return {
      ...player,
      team: { ...team, numPlayers: _count.players, stats },
    };
  });
  /* Since we are providing the team and the league, no database query will be made - so the looped await is not a
     performance issue. */
  const players = await Promise.all(promises);

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: uniq(players.map(t => t.teamId)) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return players.map(p => ({
    ...p,
    team: {
      ...p.team,
      fileUrl: imageUploads.find(i => i.entityId === p.team.id)?.fileUrl || null,
    },
  }));
});
