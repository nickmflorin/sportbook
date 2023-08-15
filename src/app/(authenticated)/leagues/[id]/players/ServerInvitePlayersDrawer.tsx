import dynamic from "next/dynamic";

import { prisma } from "~/prisma/client";
import { type League } from "~/prisma/model";
import { Loading } from "~/components/loading/Loading";

const InvitePlayersDrawer = dynamic(() => import("~/components/drawers/InvitePlayersDrawer"), {
  loading: () => <Loading loading={true} />,
  ssr: false,
});

export interface ServerInvitePlayersDrawerProps {
  readonly league: League;
}

export const ServerInvitePlayersDrawer = async ({ league }: ServerInvitePlayersDrawerProps) => {
  const teams = await prisma.team.findMany({ where: { leagueId: league.id } });
  /* Eventually, we will have to slim the users list down a fair amount and come up with a better way for inviting the
     users. */
  const users = await prisma.user.findMany();
  return <InvitePlayersDrawer teams={teams} users={users} />;
};

export default ServerInvitePlayersDrawer;
