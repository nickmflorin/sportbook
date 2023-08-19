import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { prisma } from "~/prisma/client";
import { FileUploadEntity } from "~/prisma/model";
import { parseQueryTeamIds } from "~/prisma/urls";
import { constructOrSearch } from "~/prisma/util";
import { Loading } from "~/components/loading/Loading";
import { getAuthUser } from "~/server/auth";

import { getLeague } from "../getLeague";

const PlayersTable = dynamic(() => import("~/components/tables/PlayersTable"), {
  loading: () => <Loading loading={true} />,
  ssr: false, // Avoids hydration mismatch with the icons... might need to be revisited in the future.
});

interface LeaguePlayersProps {
  readonly params: { id: string };
  readonly searchParams: { search?: string; teams?: string };
}

export default async function LeaguePlayers({
  params: { id },
  searchParams: { search: _search, teams },
}: LeaguePlayersProps) {
  const search: string = _search !== undefined ? decodeURIComponent(_search) : "";
  const teamIds = await parseQueryTeamIds({ value: teams });

  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const league = await getLeague(id, user);

  const players = await prisma.leaguePlayer.findMany({
    include: { user: true, team: true },
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
