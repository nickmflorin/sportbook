import dynamic from "next/dynamic";

import { type Sport } from "@prisma/client";

import { prisma } from "~/lib/db";

const SportLeaguesView = dynamic(() => import("./SportLeaguesView"));

export interface LeagueSportsProps {
  readonly sport: Sport;
  readonly userId: string;
}

const SportLeagues = async ({ userId, sport }: LeagueSportsProps) => {
  const leagues = await prisma.league.findMany({
    where: { sport, participants: { some: { participant: { id: userId } } } },
  });
  return <SportLeaguesView leagues={leagues} sport={sport} />;
};

export default SportLeagues;
