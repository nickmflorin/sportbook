import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { prisma } from "~/prisma/client";
import {
  type Team,
  FileUploadEntity,
  type WithFileUrl,
  type TeamWithStats,
  type TeamWithNumPlayers,
} from "~/prisma/model";
import { getAuthUser } from "~/server/auth";
import { getLeagueStandings } from "~/server/leagues";
import { Loading } from "~/components/loading/Loading";

import { getLeague } from "../../getLeague";

const TeamStandingsTable = dynamic(() => import("~/components/tables/TeamStandingsTable"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

interface LeagueStandingsProps {
  readonly params: { id: string };
}

export default async function LeagueStandings({ params: { id } }: LeagueStandingsProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const league = await getLeague(id, user);

  const teams = (
    await prisma.team.findMany({
      where: { leagueId: league.id },
      include: { _count: { select: { players: true } } },
    })
  ).map(({ _count, ...team }) => ({ ...team, numPlayers: _count.players }));

  const standings = await getLeagueStandings(league, teams);

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
  return <TeamStandingsTable data={standingsWithImages} />;
}
