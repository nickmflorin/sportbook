import dynamic from "next/dynamic";

import { prisma } from "~/prisma/client";
import { Loading } from "~/components/loading/Loading";
import { getAuthUser } from "~/server/auth";

const CreateLeagueDrawer = dynamic(() => import("~/components/drawers/CreateLeagueDrawer"), {
  loading: () => <Loading loading={true} />,
});

export const ServerCreateLeagueDrawer = async () => {
  const user = await getAuthUser({ strict: true });
  const locations = await prisma.location.findMany({ where: { createdById: user.id } });
  return <CreateLeagueDrawer locations={locations} />;
};

export default ServerCreateLeagueDrawer;
