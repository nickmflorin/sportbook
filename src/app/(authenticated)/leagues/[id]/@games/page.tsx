import dynamic from "next/dynamic";

import uniq from "lodash.uniq";

import { prisma } from "~/prisma/client";
import { type Team, FileUploadEntity } from "~/prisma/model";
import { Loading } from "~/components/loading";

const GameTilesView = dynamic(() => import("~/components/views/GameTilesView"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeagueGamesProps {
  readonly params: { id: string };
}

export default async function LeagueGames({ params: { id } }: LeagueGamesProps) {
  const games = await prisma.game.findMany({
    where: { leagueId: id },
    include: { homeTeam: true, awayTeam: true },
  });
  const teams: Team[] = uniq(games.reduce((prev, g) => [...prev, g.awayTeam, g.homeTeam], [] as Team[]));

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: teams.map(t => t.id) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  const gamesWithTeamImages = games.map(g => ({
    ...g,
    homeTeam: { ...g.homeTeam, fileUrl: imageUploads.find(i => i.entityId === g.homeTeamId)?.fileUrl || null },
    awayTeam: { ...g.awayTeam, fileUrl: imageUploads.find(i => i.entityId === g.awayTeamId)?.fileUrl || null },
  }));
  return (
    <GameTilesView
      contentScrollable={true}
      data={gamesWithTeamImages}
      title={`Games (${gamesWithTeamImages.length})`}
    />
  );
}
