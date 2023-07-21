import dynamic from "next/dynamic";

import { logger } from "~/application/logger";
import { prisma } from "~/prisma/client";
import { type Sport, type LeagueWithParticipation } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { DataTableSizes } from "~/components/tables/types";

const LeaguesTableView = dynamic(() => import("~/components/tables/LeaguesTableView"), {
  ssr: false,
  loading: () => <Loading loading={true} />,
});

export interface LeagueSportsProps {
  readonly sport: Sport;
  readonly userId: string;
  readonly query?: string;
}

const SportLeagues = async ({ userId, sport, query }: LeagueSportsProps) => {
  const leagues = await prisma.league.findMany({
    include: { teams: { select: { id: true } } },
    where: {
      sport,
      participants: { some: { participant: { id: userId } } },
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
        { name: l.name, id: l.id, sport },
        `The league '${l.name}' with ID '${l.id}' was not found in the groupBy results for the participation count.`,
      );
      return { ...l, numParticipants: 0, teams: l.teams.map(t => t.id) };
    }
    return { ...l, numParticipants: g._count.participantId, teams: l.teams.map(t => t.id) };
  });
  return (
    <LeaguesTableView
      title="Your Leagues"
      description="Leagues you are participating in."
      data={leaguesWithParticipantCount}
      size={DataTableSizes.SM}
    />
  );
};

export default SportLeagues;
