import { Suspense } from "react";

import { prisma } from "~/prisma/client";
import { type League, type Team } from "~/prisma/model";
import { TeamFilterMenu } from "~/components/filters/TeamFilterMenu";
import { Loading } from "~/components/loading/Loading";
import { DropdownMenu } from "~/components/menus/DropdownMenu";

export type TeamWithPlayers = Team & { readonly players: { userId: string }[] };

export type LeagueWithTeams<T extends Team = Team> = League & { readonly teams: T[] };
export type LeagueWithTeamAndPlayers = LeagueWithTeams<TeamWithPlayers>;

export type TeamFilterProps<L extends League | LeagueWithTeams | LeagueWithTeamAndPlayers> = {
  readonly league: L;
  readonly teams?: Team[] | TeamWithPlayers[];
  readonly playersTeam: Team | null;
};

export const TeamFilter = async <L extends League | LeagueWithTeams | LeagueWithTeamAndPlayers>({
  league,
  playersTeam,
  teams: _teams,
}: TeamFilterProps<L>) => {
  let teams: Team[] | TeamWithPlayers[];
  if (_teams) {
    teams = _teams;
  } else {
    teams = await prisma.team.findMany({
      where: {
        leagueId: league.id,
      },
    });
  }

  return (
    <DropdownMenu
      buttonContent="Teams"
      buttonWidth={200}
      /* TODO: We may not need a Suspense here - the thinking was that it would reduce the client side bundle because
         with NextJS, when useSearchParams is invoked, it will cause the tree up to the closest Suspense boundary to
         be client-side rendered.  Wrapping the component in a Suspense will prevent the client side rendering from
         moving further up this tree.  However, that only applies to static rendering - and the routes that use this
         component are dynamically rendered (due to the ID path parameter). */
      menu={
        <Suspense fallback={<Loading loading={true} />}>
          <TeamFilterMenu teams={teams} playersTeam={playersTeam} />
        </Suspense>
      }
    />
  );
};
