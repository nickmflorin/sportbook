import { type Sport } from "@prisma/client";

import { LeaguesTable } from "~/components/tables/LeaguesTable";
import { prisma } from "~/server/db";

import { SportLeaguesHeader } from "./SportLeaguesHeader";

export interface SportLeaguesProps {
  readonly sport: Sport;
  readonly userId: string;
}

export const SportLeagues = async ({ userId, sport }: SportLeaguesProps) => {
  const leagues = await prisma.league.findMany({
    where: { sportId: sport.id, participants: { some: { user: { clerkId: userId } } } },
  });
  return (
    <div className="sport-leagues">
      <SportLeaguesHeader sport={sport} />
      <LeaguesTable records={leagues} />
    </div>
  );
};
