import dynamic from "next/dynamic";

import { Loading } from "~/components/loading/Loading";
import { prisma } from "~/prisma/client";
import { type League } from "~/prisma/model";

const InvitePlayersDrawer = dynamic(() => import("~/components/drawers/InvitePlayersDrawer"), {
  loading: () => <Loading loading={true} />,
});

export interface ServerInvitePlayersDrawerProps {
  readonly league: League;
}

export const ServerInvitePlayersDrawer = async ({ league }: ServerInvitePlayersDrawerProps) => {
  const teams = await prisma.team.findMany({ where: { leagueId: league.id } });
  return <InvitePlayersDrawer leagueId={league.id} teams={teams} />;
};

export default ServerInvitePlayersDrawer;
