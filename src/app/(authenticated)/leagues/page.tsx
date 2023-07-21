import dynamicImport from "next/dynamic";

import { logger } from "~/application/logger";
import { getAuthUser } from "~/lib/auth";
import { prisma } from "~/prisma/client";
import { type LeagueWithParticipation } from "~/prisma/model";
import { Page } from "~/components/layout";
import { Loading } from "~/components/loading";
import { DataTableSizes } from "~/components/tables/types";

const LeaguesTableView = dynamicImport(() => import("~/components/tables/LeaguesTableView"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

interface LeaguesProps {
  readonly searchParams: { query?: string };
}

export const dynamic = "force-dynamic";

export default async function Leagues({ searchParams: { query } }: LeaguesProps) {
  const user = await getAuthUser({ strict: true });

  const leagues = await prisma.league.findMany({
    include: { teams: { select: { id: true } } },
    orderBy: { createdAt: "desc" }, // Might want to order by the most recent game in the future.
    where: {
      participants: { some: { participant: { id: user.id } } },
      OR:
        query !== undefined && query.length !== 0
          ? [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ]
          : undefined,
    },
  });
  const numParticipantsPerLeague = await prisma.leagueOnParticipants.groupBy({
    by: ["leagueId"],
    _count: {
      participantId: true,
    },
    where: {
      leagueId: {
        in: leagues.map(l => l.id),
      },
    },
  });
  const leaguesWithParticipantCount: LeagueWithParticipation[] = leagues.map(l => {
    const g = numParticipantsPerLeague.find(n => n.leagueId === l.id);
    if (!g) {
      logger.error(
        { name: l.name, id: l.id },
        `The league '${l.name}' with ID '${l.id}' was not found in the groupBy results for the participation count.`,
      );
      return { ...l, numParticipants: 0, teams: l.teams.map(t => t.id) };
    }
    return { ...l, numParticipants: g._count.participantId, teams: l.teams.map(t => t.id) };
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
