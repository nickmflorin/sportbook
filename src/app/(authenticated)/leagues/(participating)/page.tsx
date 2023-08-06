import dynamicImport from "next/dynamic";
import { redirect } from "next/navigation";

import { prisma } from "~/prisma/client";
import { type LeagueWithParticipation } from "~/prisma/model";
import { constructOrSearch } from "~/prisma/util";
import { DrawerIds } from "~/components/drawers";
import { Loading } from "~/components/loading";
import { DataTableSizes } from "~/components/tables/types";
import { getAuthUser } from "~/server/auth";

const LeaguesTable = dynamicImport(() => import("~/components/tables/LeaguesTable"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

interface LeaguesProps {
  readonly searchParams: { search?: string; drawerId?: string };
}

export default async function Leagues({ searchParams: { search, drawerId } }: LeaguesProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  const _drawerId = DrawerIds.contains(drawerId) ? drawerId : undefined;

  const leagues = await prisma.league.findMany({
    include: { teams: { select: { id: true } }, config: true },
    orderBy: { createdAt: "desc" }, // Might want to order by the most recent game in the future.
    where: {
      OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      AND: constructOrSearch(search, ["name", "description"]),
    },
  });
  const numPlayersPerLeague = await prisma.player.groupBy({
    by: ["teamId"],
    _count: {
      userId: true,
    },
    where: {
      teamId: {
        in: leagues.map(l => l.teams.map(t => t.id)).flat(),
      },
    },
  });
  const leaguesWithParticipantCount: LeagueWithParticipation[] = leagues.map(l => {
    const g = numPlayersPerLeague.find(n => l.teams.map(t => t.id).includes(n.teamId));
    if (g === undefined) {
      return { ...l, numParticipants: 0, teams: l.teams.map(t => t.id) };
    }
    return { ...l, numParticipants: g._count.userId, teams: l.teams.map(t => t.id) };
  });

  return <LeaguesTable data={leaguesWithParticipantCount} size={DataTableSizes.SM} />;
}
