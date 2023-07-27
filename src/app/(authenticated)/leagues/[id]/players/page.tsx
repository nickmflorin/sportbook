import dynamic from "next/dynamic";
import { notFound, redirect } from "next/navigation";

import { prisma, isPrismaInvalidIdError, isPrismaDoesNotExistError } from "~/prisma/client";
import { type League } from "~/prisma/model";
import { Loading } from "~/components/loading";
import { getAuthUser } from "~/server/auth";

const PlayersTableView = dynamic(() => import("~/components/tables/PlayersTableView"), {
  ssr: true,
  loading: () => <Loading loading={true} />,
});

interface LeagueStandingsProps {
  readonly params: { id: string };
}

export default async function LeagueStandings({ params: { id } }: LeagueStandingsProps) {
  const user = await getAuthUser({ whenNotAuthenticated: () => redirect("/sign-in") });
  let league: League;
  try {
    league = await prisma.league.findFirstOrThrow({
      where: {
        id,
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
  const players = await prisma.player.findMany({
    where: { team: { leagueId: league.id } },
    include: { user: true },
  });

  return <PlayersTableView data={players} title="Players" />;
}
