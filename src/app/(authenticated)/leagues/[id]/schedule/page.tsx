import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import uniq from "lodash.uniq";

import { getAuthUser } from "~/server/auth";
import { getUserLeagueStaffPermissionCodes } from "~/server/leagues";
import { parseQueryTeamIds } from "~/server/urls";
import { Loading } from "~/components/loading/Loading";
import { prisma } from "~/prisma/client";
import { FileUploadEntity } from "~/prisma/model";

import { getLeague } from "../getLeague";

const GameScheduleTable = dynamic(() => import("~/components/tables/GameScheduleTable"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeagueScheduleProps {
  readonly params: { id: string };
  readonly searchParams: { search?: string; teams?: string };
}

export default async function LeagueSchedule({
  params: { id },
  searchParams: { teams, search: _search },
}: LeagueScheduleProps) {
  const search: string = _search !== undefined ? decodeURIComponent(_search) : "";
  const teamIds = await parseQueryTeamIds({ value: teams });

  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const league = await getLeague(id, user);

  const upcomingGames = await prisma.game.findMany({
    include: { homeTeam: true, awayTeam: true, location: true },
    orderBy: { dateTime: "asc" },
    where: {
      ...(teamIds.length > 0 && search.length !== 0
        ? {
            leagueId: league.id,
            AND: [
              { OR: [{ homeTeam: { id: { in: teamIds } } }, { awayTeam: { id: { in: teamIds } } }] },
              {
                OR: [
                  { homeTeam: { name: { contains: search, mode: "insensitive" } } },
                  { awayTeam: { name: { contains: search, mode: "insensitive" } } },
                ],
              },
            ],
          }
        : search.length !== 0
        ? {
            leagueId: league.id,
            OR: [
              { homeTeam: { name: { contains: search, mode: "insensitive" } } },
              { awayTeam: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : teamIds.length > 0
        ? { leagueId: league.id, OR: [{ homeTeam: { id: { in: teamIds } } }, { awayTeam: { id: { in: teamIds } } }] }
        : { leagueId: league.id }),
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

  const permissionCodes = await getUserLeagueStaffPermissionCodes({ league, user });

  return <GameScheduleTable data={gamesWithTeamImages} permissionCodes={permissionCodes} />;
}
