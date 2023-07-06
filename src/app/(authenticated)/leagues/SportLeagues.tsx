import { type Sport } from "@prisma/client";

import { prisma } from "~/server/db";

import { SportLeaguesView } from "./SportLeaguesView";

export interface LeagueSportsProps {
  readonly sport: Sport;
  readonly userId: string;
}

export const SportLeagues = async ({ userId, sport }: LeagueSportsProps) => {
  const leagues = await prisma.league.findMany({
    where: { sportId: sport.id, participants: { some: { user: { clerkId: userId } } } },
  });
  return <SportLeaguesView leagues={leagues} sport={sport} />;
};
