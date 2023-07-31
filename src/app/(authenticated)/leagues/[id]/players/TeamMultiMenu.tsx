import { Suspense } from "react";

import { prisma } from "~/prisma/client";
import { type League, type Team } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { DropdownMenu } from "~/components/menus/DropdownMenu";

import { TeamClientMultiMenu } from "./TeamClientMultiMenu";

export type TeamMenuProps = {
  readonly league: League;
  readonly playersTeam: Team | null;
};

export const TeamMultiMenu = async ({ league, playersTeam }: TeamMenuProps) => {
  const teams = await prisma.team.findMany({
    include: { players: { select: { id: true } } },
    where: {
      leagueId: league.id,
    },
  });

  return (
    <DropdownMenu
      buttonText="Teams"
      buttonStyle={{ width: 200 }}
      menu={
        <Suspense fallback={<Loading loading={true} />}>
          <TeamClientMultiMenu teams={teams} playersTeam={playersTeam} />
        </Suspense>
      }
    />
  );
};
