import { Suspense } from "react";

import { prisma } from "~/prisma/client";
import { type League } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { DropdownMenu } from "~/components/menus/DropdownMenu";

import { TeamClientMultiMenu } from "./TeamClientMultiMenu";

export type TeamMenuProps = {
  readonly league: League;
};

export const TeamMultiMenu = async ({ league }: TeamMenuProps) => {
  const teams = await prisma.team.findMany({
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
          <TeamClientMultiMenu teams={teams} />
        </Suspense>
      }
    />
  );
};
