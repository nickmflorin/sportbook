import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type Team, type League, FileUploadEntity, type WithFileUrl, type TeamWithStats } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { getAuthUser } from "~/server/auth";
import { getLeagueStandings } from "~/server/leagues";

const TeamStandingsTable = dynamic(() => import("~/components/tables/TeamStandingsTable"), {
  loading: () => <Loading loading={true} />,
});

interface LeagueStandingsProps {
  readonly params: { id: string };
}

export default async function LeagueStandings({ params: { id } }: LeagueStandingsProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: League;
  try {
    league = await prisma.league.findFirstOrThrow({
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
  const standings = await getLeagueStandings(league);

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

  const standingsWithImages: WithFileUrl<TeamWithStats>[] = standings.map(
    (standing): WithFileUrl<TeamWithStats> => ({
      ...standing,
      fileUrl: imageUploads.find(i => i.entityId === standing.id)?.fileUrl || null,
    }),
  );
  return <TeamStandingsTable data={standingsWithImages} />;
}
