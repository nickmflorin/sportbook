import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League, FileUploadEntity } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { getAuthUser } from "~/server/auth";

const PlayersTableView = dynamic(() => import("~/components/tables/PlayersTableView"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeaguePlayersProps {
  readonly params: { id: string };
  readonly searchParams: { query?: string };
}

export default async function LeaguePlayers({ params: { id }, searchParams: { query } }: LeaguePlayersProps) {
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

  const players = await prisma.player.findMany({
    where: {
      team: {
        leagueId: league.id,
        OR:
          query !== undefined && query.length !== 0
            ? [
                { name: { contains: query, mode: "insensitive" } },
                // { description: { contains: query, mode: "insensitive" } },
              ]
            : undefined,
      },
    },
    include: { user: true, team: true },
  });

  const imageUploads = await prisma.fileUpload.groupBy({
    by: ["entityId", "fileUrl", "createdAt"],
    where: { entityType: FileUploadEntity.TEAM, id: { in: uniq(players.map(t => t.teamId)) } },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  const playersWithTeamImage = players.map(p => ({
    ...p,
    team: {
      ...p.team,
      fileUrl: imageUploads.find(i => i.entityId === p.team.id)?.fileUrl || null,
    },
  }));

  return <PlayersTableView data={playersWithTeamImage} title="Players" league={league} />;
}
