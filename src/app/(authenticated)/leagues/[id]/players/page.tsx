import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League, FileUploadEntity, type Team } from "~/prisma/model";
import { constructOrSearch } from "~/prisma/util";
import { Loading } from "~/components/loading";
import { getAuthUser } from "~/server/auth";

const PlayersTable = dynamic(() => import("~/components/tables/PlayersTable"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeaguePlayersProps {
  readonly params: { id: string };
  readonly searchParams: { search?: string; teams?: string };
}

export default async function LeaguePlayers({
  params: { id },
  searchParams: { search: _search, teams },
}: LeaguePlayersProps) {
  const teamArray: string[] = teams !== undefined ? decodeURIComponent(teams).split(",") : [];
  const search: string = _search !== undefined ? decodeURIComponent(_search) : "";

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

  const players = await prisma.player.findMany({
    include: { user: true, team: true },
    where: {
      ...(teamArray.length > 0 && search.length !== 0
        ? {
            team: { id: { in: teamArray }, leagueId: league.id },
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
        : teamArray.length > 0
        ? { team: { id: { in: teamArray }, leagueId: league.id } }
        : { team: { leagueId: league.id } }),
    },
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

  return <PlayersTable data={playersWithTeamImage} />;
}
