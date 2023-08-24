import dynamic from "next/dynamic";

import { Loading } from "~/components/loading/Loading";
import { prisma } from "~/prisma/client";
import { type User } from "~/prisma/model";

const CreateLeagueDrawer = dynamic(() => import("~/components/drawers/CreateLeagueDrawer"), {
  loading: () => <Loading loading={true} />,
});

export interface ServerCreateLeagueDrawerProps {
  readonly user: User;
}

export const ServerCreateLeagueDrawer = async ({ user }: ServerCreateLeagueDrawerProps) => {
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return <CreateLeagueDrawer locations={locations} />;
};

export default ServerCreateLeagueDrawer;
