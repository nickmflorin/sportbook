import dynamicImport from "next/dynamic";
import { redirect } from "next/navigation";

import { logger } from "~/application/logger";
import { prisma } from "~/prisma/client";
import { type LeagueWithParticipation } from "~/prisma/model";
import { Page } from "~/components/layout/Page";
import { Loading } from "~/components/loading";
import { DataTableSizes } from "~/components/tables/types";
import { getAuthUser } from "~/server/auth";

const LeaguesTableView = dynamicImport(() => import("~/components/tables/LeaguesTableView"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

interface LeaguesProps {
  readonly searchParams: { query?: string };
}

export const dynamic = "force-dynamic";

export default async function Leagues({ searchParams: { query } }: LeaguesProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });

  const leagues = await prisma.league.findMany({
    include: { teams: { select: { id: true } } },
    orderBy: { createdAt: "desc" }, // Might want to order by the most recent game in the future.
    where: {
      OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      AND: {
        OR:
          query !== undefined && query.length !== 0
            ? [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
              ]
            : undefined,
      },
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
    if (!g) {
      logger.error(
        { name: l.name, id: l.id },
        `The league '${l.name}' with ID '${l.id}' was not found in the groupBy results for the participation count.`,
      );
      return { ...l, numParticipants: 0, teams: l.teams.map(t => t.id) };
    }
    return { ...l, numParticipants: g._count.userId, teams: l.teams.map(t => t.id) };
  });

  return (
    <Page title="Leagues">
      <LeaguesTableView
        title="Your Leagues"
        description="Leagues you are participating in."
        data={leaguesWithParticipantCount}
        size={DataTableSizes.SM}
      />
    </Page>
  );
}
