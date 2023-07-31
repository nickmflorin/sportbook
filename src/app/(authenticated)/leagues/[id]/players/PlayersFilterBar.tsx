import { notFound, redirect } from "next/navigation";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League, type Team } from "~/prisma/model";
import { SearchBar } from "~/components/input/SearchBar";
import { FilterBar } from "~/components/structural/FilterBar";
import { getAuthUser } from "~/server/auth";

import { TeamMultiMenu } from "./TeamMultiMenu";

interface PlayersFilterBarProps {
  readonly leagueId: string;
}

// TODO: Should we dynamically load the search bar?  Or use suspense around it?
export const PlayersFilterBar = async ({ leagueId }: PlayersFilterBarProps) => {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: League & { readonly teams: (Team & { readonly players: { userId: string }[] })[] };
  try {
    league = await prisma.league.findFirstOrThrow({
      include: { teams: { include: { players: { select: { userId: true } } } } },
      where: {
        id: leagueId,
        OR: [{ staff: { some: { userId: user.id } } }, { teams: { some: { players: { some: { userId: user.id } } } } }],
      },
    });
  } catch (e) {
    if (isPrismaInvalidIdError(e) || isPrismaDoesNotExistError(e)) {
      notFound();
    } else {
      throw e;
    }
  }
  // The team may be null if the user is a staff member of the league but not a player on any team.
  const playersTeam = league.teams.find(team => team.players.some(player => player.userId === user.id));
  return (
    <FilterBar
      filters={[<SearchBar key="0" />, <TeamMultiMenu key="1" league={league} playersTeam={playersTeam || null} />]}
    />
  );
};
