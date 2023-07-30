import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League, FileUploadEntity, type Team } from "~/prisma/model";
import { parseQueryTeamIds } from "~/prisma/urls";
import { Loading } from "~/components/loading";
import { getAuthUser } from "~/server/auth";

const GameScheduleTable = dynamic(() => import("~/components/tables/GameScheduleTable"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeagueScheduleProps {
  readonly params: { id: string };
  readonly searchParams: { teams?: string };
}

export default async function LeagueSchedule({ params: { id }, searchParams: { teams } }: LeagueScheduleProps) {
  const teamIds = await parseQueryTeamIds({ value: teams });

  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: League & { readonly teams: Team[] };
  try {
    league = await prisma.league.findFirstOrThrow({
      include: { teams: true },
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

  const upcomingGames = await prisma.game.findMany({
    include: { homeTeam: true, awayTeam: true, location: true },
    orderBy: { dateTime: "asc" },
    where: {
      leagueId: league.id,
      result: { isNot: null },
      OR:
        teamIds.length !== 0
          ? [{ homeTeam: { id: { in: teamIds } } }, { awayTeam: { id: { in: teamIds } } }]
          : undefined,
    },
  });

  const upcomingGameTeamIds: string[] = uniq(
    upcomingGames.reduce((prev, g) => [...prev, g.awayTeamId, g.homeTeamId], [] as string[]),
  );

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: upcomingGameTeamIds } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const gamesWithTeamImages = upcomingGames.map(g => ({
    ...g,
    homeTeam: { ...g.homeTeam, fileUrl: imageUploads.find(i => i.entityId === g.homeTeamId)?.fileUrl || null },
    awayTeam: { ...g.awayTeam, fileUrl: imageUploads.find(i => i.entityId === g.awayTeamId)?.fileUrl || null },
  }));

  return <GameScheduleTable data={gamesWithTeamImages} />;
}
