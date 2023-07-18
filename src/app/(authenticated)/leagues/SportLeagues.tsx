import { type Sport } from "~/prisma";
import { prisma } from "~/prisma/client";
import { LeaguesTableView } from "~/components/tables/LeaguesTableView";
import { DataTableSizes } from "~/components/tables/types";

export interface LeagueSportsProps {
  readonly sport: Sport;
  readonly userId: string;
  readonly query?: string;
}

const SportLeagues = async ({ userId, sport, query }: LeagueSportsProps) => {
  const leagues = await prisma.league.findMany({
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
  return (
    <LeaguesTableView
      title="Your Leagues"
      description="Leagues you are participating in."
      data={leagues}
      size={DataTableSizes.SM}
    />
  );
};

export default SportLeagues;
