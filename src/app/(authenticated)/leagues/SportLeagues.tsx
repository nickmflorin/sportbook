import { type Sport } from "~/prisma";
import { prisma } from "~/prisma/client";
import { LeaguesTableView } from "~/components/tables/LeaguesTableView";
import { DataTableSizes } from "~/components/tables/types";

export interface LeagueSportsProps {
  readonly sport: Sport;
  readonly userId: string;
}

const SportLeagues = async ({ userId, sport }: LeagueSportsProps) => {
  const leagues = await prisma.league.findMany({
    where: { sport, participants: { some: { participant: { id: userId } } } },
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
