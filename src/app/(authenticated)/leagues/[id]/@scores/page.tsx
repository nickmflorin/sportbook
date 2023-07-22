import dynamic from "next/dynamic";

import uniq from "lodash.uniq";

import { logger } from "~/application/logger";
import { prisma } from "~/prisma/client";
import { type GameWithResult, type Team, FileUploadEntity } from "~/prisma/model";
import { Loading } from "~/components/loading";

const ScoresTileView = dynamic(() => import("~/components/views/ScoreTilesView"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeagueScoresProps {
  readonly params: { id: string };
}

export default async function LeagueScores({ params: { id } }: LeagueScoresProps) {
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

  const gamesWithResult = games
    .map(g => ({
      ...g,
      homeTeam: { ...g.homeTeam, fileUrl: imageUploads.find(i => i.entityId === g.homeTeamId)?.fileUrl || null },
      awayTeam: { ...g.awayTeam, fileUrl: imageUploads.find(i => i.entityId === g.awayTeamId)?.fileUrl || null },
    }))
    /* We already filter in the query for only games that have a result - but Prisma's typings do not seem to respect
       that.  We add an additional filter here as a typeguard, and log warnings if we encounter result-less games. */
    .filter((g): g is GameWithResult => {
      if (g.result === null) {
        logger.warn("Encountered a game with a null-valued result after the prisma query was performed to avoid them.");
      }
      return g.result !== null;
    });
  return (
    <ScoresTileView contentScrollable={true} data={gamesWithResult} title={`Scores (${gamesWithResult.length})`} />
  );
}
