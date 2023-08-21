import dynamic from "next/dynamic";

import { prisma } from "~/prisma/client";
import { type League } from "~/prisma/model";
import { Loading } from "~/components/loading/Loading";

const InvitePlayersDrawer = dynamic(() => import("~/components/drawers/InvitePlayersDrawer"), {
  loading: () => <Loading loading={true} />,
});

export interface ServerInvitePlayersDrawerProps {
  readonly league: League;
}

export const ServerInvitePlayersDrawer = async ({ league }: ServerInvitePlayersDrawerProps) => {
  const teams = await prisma.team.findMany({ where: { leagueId: league.id } });

  /* Eventually, we will have to slim the users list down a fair amount and come up with a better way for inviting the
     users. */
  const usersInLeague = await prisma.leaguePlayer.findMany({
    select: { userId: true },
    where: { team: { leagueId: league.id } },
  });
  const users = await prisma.user.findMany({ where: { id: { notIn: usersInLeague.map(v => v.userId) } } });
  return <InvitePlayersDrawer leagueId={league.id} teams={teams} users={users} />;
};

export default ServerInvitePlayersDrawer;
