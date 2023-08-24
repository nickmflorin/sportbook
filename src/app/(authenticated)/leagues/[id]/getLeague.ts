import { notFound } from "next/navigation";
import { cache } from "react";

import uniq from "lodash.uniq";
import "server-only";

import { logger } from "~/application/logger";
import { xprisma, prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import {
  type LeagueWithConfig,
  type LeagueStaff,
  type User,
  type FileUpload,
  type Team,
  FileUploadEntity,
  type GameWithResult,
  type WithFileUrl,
  type TeamWithNumPlayers,
  type TeamWithStats,
} from "~/prisma/model";
import { getLeagueStandings as _getLeagueStandings } from "~/server/leagues";

export const revalidate = 3600; // Revalidate the data at most every hour

type RT = LeagueWithConfig & { readonly staff: LeagueStaff[]; readonly teams: { readonly id: string }[] } & {
  readonly getImage: () => Promise<FileUpload | null>;
};

export const preloadLeague = (id: string, user: User) => {
  void getLeague(id, user);
  void getLeagueScores(id);
  void getLeagueStandings(id, user);
};

export const getLeague = cache(async (id: string, user: User): Promise<RT> => {
  let league: RT;
  try {
    league = await xprisma.league.findFirstOrThrow({
      include: { staff: true, config: true, teams: { select: { id: true } } },
      where: {
        id,
        OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      },
    });
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      notFound();
    } else {
      throw e;
    }
  }
  return league;
});

export const getLeagueScores = cache(async (id: string) => {
  const games = await prisma.game.findMany({
    where: { leagueId: id, result: { isNot: null } },
    include: { homeTeam: true, awayTeam: true, result: true },
  });
  const teams: Team[] = uniq(games.reduce((prev, g) => [...prev, g.awayTeam, g.homeTeam], [] as Team[]));

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: teams.map(t => t.id) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return (
    games
      .map(g => ({
        ...g,
        homeTeam: { ...g.homeTeam, fileUrl: imageUploads.find(i => i.entityId === g.homeTeamId)?.fileUrl || null },
        awayTeam: { ...g.awayTeam, fileUrl: imageUploads.find(i => i.entityId === g.awayTeamId)?.fileUrl || null },
      }))
      /* We already filter in the query for only games that have a result - but Prisma's typings do not seem to respect
       that.  We add an additional filter here as a typeguard, and log warnings if we encounter result-less games. */
      .filter((g): g is GameWithResult => {
        if (g.result === null) {
          logger.warn(
            "Encountered a game with a null-valued result after the prisma query was performed to avoid them.",
          );
        }
        return g.result !== null;
      })
  );
});

export const getLeagueStandings = cache(async (id: string, user: User) => {
  const league = await getLeague(id, user);

  const teams = (
    await prisma.team.findMany({
      where: { leagueId: league.id },
      include: { _count: { select: { players: true } } },
    })
  ).map(({ _count, ...team }) => ({ ...team, numPlayers: _count.players }));

  const standings = await _getLeagueStandings(league, teams);

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: teams.map(t => t.id) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const standingsWithImages: WithFileUrl<TeamWithStats<TeamWithNumPlayers<Team>>>[] = standings.map(
    (standing): WithFileUrl<TeamWithStats<TeamWithNumPlayers<Team>>> => ({
      ...standing,
      fileUrl: imageUploads.find(i => i.entityId === standing.id)?.fileUrl || null,
    }),
  );
  return standingsWithImages;
});
